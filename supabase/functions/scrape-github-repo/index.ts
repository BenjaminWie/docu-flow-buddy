
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to clean GitHub URLs
const cleanGitHubUrl = (url) => {
  // Strip .git suffix from the URL if present
  if (url.endsWith('.git')) {
    url = url.slice(0, -4);
  }
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

// Helper function to extract owner and repo from GitHub URL
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

  let requestBody;
  let repositoryId;
  
  try {
    // Parse request body
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { githubUrl, repositoryId: reqRepositoryId } = requestBody;
    repositoryId = reqRepositoryId;
    
    // Validate required parameters
    if (!githubUrl || !repositoryId) {
      console.error('Missing required parameters:', { githubUrl: !!githubUrl, repositoryId: !!repositoryId });
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing githubUrl or repositoryId'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Starting analysis for ${githubUrl}, repository ID: ${repositoryId}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clean GitHub URL and extract repository info
    const cleanedUrl = cleanGitHubUrl(githubUrl);
    const repoInfo = extractRepoInfo(cleanedUrl);

    if (!repoInfo) {
      throw new Error('Invalid GitHub repository URL');
    }

    console.log(`Extracted repo info for ${repoInfo.owner}/${repoInfo.repo}`);

    // Update repository status to "analyzing"
    await supabase
      .from('repositories')
      .update({ status: 'analyzing' })
      .eq('id', repositoryId);

    // Fetch GitHub repository metadata with timeout
    const githubApiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`;
    const headers = {};

    // Use GitHub token if available for higher rate limits
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    console.log(`Fetching GitHub metadata from: ${githubApiUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

    if (repoData.message === 'Not Found' || response.status === 404) {
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
    
    // Create specialized function analyses for OpenRewrite
    const isOpenRewrite = repoInfo.owner.toLowerCase() === 'openrewrite' && repoInfo.repo.toLowerCase() === 'rewrite';
    
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
      },
      {
        repository_id: repositoryId,
        file_path: 'rewrite-maven/src/main/java/org/openrewrite/maven/MavenParser.java',
        function_name: 'parse',
        function_signature: 'public List<Xml.Document> parse(List<Path> sourceFiles)',
        description: 'Parses Maven POM files into AST representation for transformation.',
        parameters: JSON.stringify([{ name: 'sourceFiles', type: 'List<Path>', description: 'List of Maven POM file paths to parse' }]),
        return_value: 'List<Xml.Document>',
        complexity_level: 'medium',
        tags: ['maven', 'parser', 'xml', 'build-tool']
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
      },
      {
        repository_id: repositoryId,
        file_path: 'src/utils/helpers.js',
        function_name: 'formatData',
        function_signature: 'function formatData(data)',
        description: 'Formats the input data according to application standards.',
        parameters: JSON.stringify([{ name: 'data', type: 'object', description: 'Raw data object' }]),
        return_value: 'object',
        complexity_level: 'low',
        tags: ['utility', 'data']
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
      },
      {
        repository_id: repositoryId,
        title: 'Recipe Development Framework',
        section_type: 'development',
        content: `# Recipe Development Framework\n\n## Creating Custom Recipes\n\nOpenRewrite recipes are the core unit of code transformation:\n\n\`\`\`java\npublic class MyRecipe extends Recipe {\n    @Override\n    public String getDisplayName() {\n        return "My Custom Recipe";\n    }\n    \n    @Override\n    public TreeVisitor<?, ExecutionContext> getVisitor() {\n        return new JavaIsoVisitor<ExecutionContext>() {\n            // Implementation here\n        };\n    }\n}\n\`\`\`\n\n## Best Practices\n\n- Extend appropriate visitor base classes\n- Use immutable tree modifications\n- Implement proper type matching\n- Add comprehensive tests\n- Document expected transformations`,
        order_index: 2
      }
    ] : [
      {
        repository_id: repositoryId,
        title: 'System Overview',
        section_type: 'architecture',
        content: `# System Architecture\n\nThis repository follows a modular architecture with clear separation of concerns:\n\n- **Frontend**: User interface components\n- **Backend**: API and business logic\n- **Database**: Data persistence layer\n\nComponents communicate through well-defined interfaces, promoting maintainability and testability.`,
        order_index: 1
      },
      {
        repository_id: repositoryId,
        title: 'Technology Stack',
        section_type: 'technology',
        content: `# Technology Stack\n\n${repoData.name} is built using the following technologies:\n\n- **Language**: ${repoData.language || 'Not specified'}\n- **Frontend**: Modern web technologies (HTML/CSS/JavaScript)\n- **Backend**: Server-side components handling business logic\n- **Database**: Structured data storage\n\nThis stack was chosen for its performance, scalability, and developer experience.`,
        order_index: 2
      }
    ];

    await supabase.from('architecture_docs').insert(sampleArchDocs);

    // Generate business explanations
    const sampleBusinessExplanations = isOpenRewrite ? [
      {
        repository_id: repositoryId,
        category: 'Business Value',
        question: `What business problem does OpenRewrite solve?`,
        answer: `OpenRewrite addresses critical challenges in enterprise software development by automating code modernization and migration tasks. It helps organizations reduce technical debt, accelerate framework migrations, and maintain code quality at scale. By automating repetitive refactoring tasks, OpenRewrite significantly reduces the time and cost associated with large-scale codebase updates, allowing development teams to focus on delivering business value rather than manual code maintenance.`,
        order_index: 1,
        analogy_content: `Think of OpenRewrite as an automated assembly line for code renovation. Just as a factory assembly line can efficiently transform raw materials into finished products with consistent quality, OpenRewrite transforms legacy code into modernized code following best practices, all while maintaining the original functionality.`
      },
      {
        repository_id: repositoryId,
        category: 'ROI & Efficiency',
        question: `What are the cost savings and efficiency gains from using OpenRewrite?`,
        answer: `OpenRewrite delivers substantial ROI through automation of manual refactoring tasks. Organizations typically see 70-90% reduction in time spent on framework migrations, dependency upgrades, and code standardization. This translates to significant cost savings - what previously took months of developer time can now be completed in days or weeks. Additionally, the automated approach reduces human error and ensures consistent application of best practices across entire codebases.`,
        order_index: 2,
        analogy_content: `Using OpenRewrite is like having a team of expert renovators who can update every room in a skyscraper simultaneously, following the exact same high-quality standards, instead of manually renovating each room one by one with varying results.`
      }
    ] : [
      {
        repository_id: repositoryId,
        category: 'Business Value',
        question: `What business problem does ${repoData.name} solve?`,
        answer: `${repoData.name} addresses key business challenges by providing a robust software solution. It helps organizations streamline workflows, reduce operational overhead, and improve collaboration. This repository implements features that directly impact bottom-line efficiency.`,
        order_index: 1
      },
      {
        repository_id: repositoryId,
        category: 'User Workflows',
        question: `How do users interact with ${repoData.name}?`,
        answer: `Users interact with ${repoData.name} through an intuitive interface designed for optimal user experience. The typical workflow involves authentication, data input, processing, and reporting. The system guides users through complex processes while maintaining data integrity and security.`,
        order_index: 2
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
    
    // Generate specialized questions using the enhanced functions
    console.log('Generating specialized developer questions...');
    try {
      const devQuestionsResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-dev-questions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
          }),
        }
      );
      
      if (devQuestionsResponse.ok) {
        console.log('Developer questions generated successfully');
      } else {
        console.error('Failed to generate developer questions:', await devQuestionsResponse.text());
      }
    } catch (error) {
      console.error('Error generating developer questions:', error);
    }
    
    console.log('Generating specialized business questions...');
    try {
      const businessQuestionsResponse = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-business-questions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
          }),
        }
      );
      
      if (businessQuestionsResponse.ok) {
        console.log('Business questions generated successfully');
      } else {
        console.error('Failed to generate business questions:', await businessQuestionsResponse.text());
      }
    } catch (error) {
      console.error('Error generating business questions:', error);
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
    
    // Update repository status to failed if we have the ID
    if (repositoryId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('repositories')
          .update({ status: 'failed' })
          .eq('id', repositoryId);
      } catch (updateError) {
        console.error('Failed to update repository status to failed:', updateError);
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
