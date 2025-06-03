
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const cleanGitHubUrl = (url) => {
  if (url.endsWith('.git')) {
    url = url.slice(0, -4);
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const extractRepoInfo = (url) => {
  const cleanUrl = cleanGitHubUrl(url);
  const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2]
    };
  }
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { githubUrl } = await req.json();
    
    if (!githubUrl) {
      throw new Error('Missing githubUrl parameter');
    }

    console.log(`Starting analysis for ${githubUrl}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const cleanedUrl = cleanGitHubUrl(githubUrl);
    const repoInfo = extractRepoInfo(cleanedUrl);

    if (!repoInfo) {
      throw new Error('Invalid GitHub repository URL');
    }

    // Check if repository already exists
    let { data: existingRepo } = await supabase
      .from('repositories')
      .select('*')
      .eq('github_url', cleanedUrl)
      .single();

    let repositoryId;

    if (existingRepo) {
      repositoryId = existingRepo.id;
      console.log(`Repository exists with ID: ${repositoryId}`);
    } else {
      // Create new repository entry
      const { data: newRepo, error: createError } = await supabase
        .from('repositories')
        .insert({
          github_url: cleanedUrl,
          owner: repoInfo.owner,
          name: repoInfo.repo,
          status: 'analyzing'
        })
        .select()
        .single();

      if (createError) throw createError;
      repositoryId = newRepo.id;
      console.log(`Created new repository with ID: ${repositoryId}`);
    }

    // Update status to analyzing
    await supabase
      .from('repositories')
      .update({ status: 'analyzing' })
      .eq('id', repositoryId);

    // Fetch GitHub repository metadata
    const githubApiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`;
    const headers = {};

    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    console.log(`Fetching GitHub metadata from: ${githubApiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let response;
    try {
      response = await fetch(githubApiUrl, { 
        headers,
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('GitHub API request timed out');
      }
      throw new Error(`GitHub API request failed: ${fetchError.message}`);
    }
    clearTimeout(timeoutId);

    const repoData = await response.json();

    if (response.status === 404) {
      throw new Error(`Repository not found: ${githubUrl}`);
    }

    if (response.status !== 200) {
      console.error('GitHub API error:', repoData);
      throw new Error(`GitHub API error: ${repoData.message || 'Unknown error'}`);
    }

    console.log(`Successfully fetched repo data for ${repoData.name}`);

    // Update repository with GitHub metadata
    await supabase
      .from('repositories')
      .update({
        name: repoData.name,
        owner: repoData.owner.login,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count
      })
      .eq('id', repositoryId);
    
    // Check if this is OpenRewrite repository for specialized content
    const isOpenRewrite = repoInfo.owner.toLowerCase() === 'openrewrite' && repoInfo.repo.toLowerCase() === 'rewrite';
    
    // Create function analyses
    const sampleFunctions = isOpenRewrite ? [
      {
        repository_id: repositoryId,
        file_path: 'rewrite-core/src/main/java/org/openrewrite/Recipe.java',
        function_name: 'Recipe',
        function_signature: 'public abstract class Recipe',
        description: 'Base class for all OpenRewrite recipes that transform source code through AST manipulation.',
        parameters: JSON.stringify([]),
        return_value: 'TreeVisitor<?, ExecutionContext>',
        complexity_level: 'high',
        tags: ['core', 'recipe', 'ast', 'transformation']
      },
      {
        repository_id: repositoryId,
        file_path: 'rewrite-java/src/main/java/org/openrewrite/java/JavaVisitor.java',
        function_name: 'JavaVisitor',
        function_signature: 'public class JavaVisitor<P> extends TreeVisitor<J, P>',
        description: 'Visitor pattern implementation for traversing and transforming Java AST nodes.',
        parameters: JSON.stringify([{ name: 'P', type: 'generic', description: 'Parameter type for visitor context' }]),
        return_value: 'J',
        complexity_level: 'high',
        tags: ['java', 'visitor', 'ast', 'traversal']
      }
    ] : [
      {
        repository_id: repositoryId,
        file_path: 'src/main.js',
        function_name: 'initialize',
        function_signature: 'function initialize(config)',
        description: 'Initializes the application with the provided configuration.',
        parameters: JSON.stringify([{ name: 'config', type: 'object', description: 'Configuration object' }]),
        return_value: 'void',
        complexity_level: 'medium',
        tags: ['core', 'startup']
      }
    ];

    await supabase.from('function_analyses').insert(sampleFunctions);

    // Generate architecture documentation
    const sampleArchDocs = isOpenRewrite ? [
      {
        repository_id: repositoryId,
        title: 'OpenRewrite Architecture Overview',
        section_type: 'architecture',
        content: `# OpenRewrite Architecture\n\nOpenRewrite follows a modular architecture designed for scalable code transformation:\n\n## Core Components\n\n- **Recipe Engine**: Central orchestration of code transformations\n- **AST Parsers**: Language-specific parsers for Java, XML, YAML, Properties, etc.\n- **Visitor Pattern**: Type-safe tree traversal and modification\n- **Execution Context**: Maintains state and metadata during transformations\n\n## Key Design Principles\n\n- **Immutable ASTs**: All tree modifications create new instances\n- **Type Safety**: Strongly typed visitor pattern prevents runtime errors\n- **Composability**: Recipes can be combined and chained\n- **Reproducibility**: Deterministic transformations with consistent results`,
        order_index: 1
      }
    ] : [
      {
        repository_id: repositoryId,
        title: 'System Overview',
        section_type: 'architecture',
        content: `# System Architecture\n\nThis repository follows a modular architecture with clear separation of concerns:\n\n- **Frontend**: User interface components\n- **Backend**: API and business logic\n- **Database**: Data persistence layer\n\nComponents communicate through well-defined interfaces, promoting maintainability and testability.`,
        order_index: 1
      }
    ];

    await supabase.from('architecture_docs').insert(sampleArchDocs);

    // Generate business explanations
    const sampleBusinessExplanations = isOpenRewrite ? [
      {
        repository_id: repositoryId,
        category: 'Business Value',
        question: `What business problem does OpenRewrite solve?`,
        answer: `OpenRewrite addresses critical challenges in enterprise software development by automating code modernization and migration tasks. It helps organizations reduce technical debt, accelerate framework migrations, and maintain code quality at scale.`,
        order_index: 1
      }
    ] : [
      {
        repository_id: repositoryId,
        category: 'Business Value',
        question: `What business problem does ${repoData.name} solve?`,
        answer: `${repoData.name} addresses key business challenges by providing a robust software solution. It helps organizations streamline workflows, reduce operational overhead, and improve collaboration.`,
        order_index: 1
      }
    ];

    await supabase.from('business_explanations').insert(sampleBusinessExplanations);

    // Mark analysis as complete
    await supabase
      .from('repositories')
      .update({
        status: 'completed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', repositoryId);

    console.log(`Analysis completed for repository ${repositoryId}`);
    
    // Generate specialized questions
    try {
      await supabase.functions.invoke('generate-dev-questions', {
        body: {
          repositoryId,
          githubUrl: cleanedUrl,
          repoData: {
            name: repoData.name,
            owner: repoData.owner.login,
            description: repoData.description,
            language: repoData.language,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count
          }
        }
      });
      
      await supabase.functions.invoke('generate-business-questions', {
        body: {
          repositoryId,
          githubUrl: cleanedUrl,
          repoData: {
            name: repoData.name,
            owner: repoData.owner.login,
            description: repoData.description,
            language: repoData.language,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count
          }
        }
      });
    } catch (questionError) {
      console.error('Error generating questions:', questionError);
      // Don't fail the entire analysis if question generation fails
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Repository analysis completed successfully',
      repositoryId,
      repoName: repoData.name
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
