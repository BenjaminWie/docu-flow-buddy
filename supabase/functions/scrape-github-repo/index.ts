
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

  try {
    const { githubUrl, repositoryId } = await req.json();
    
    if (!githubUrl || !repositoryId) {
      throw new Error('Missing githubUrl or repositoryId');
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

    // Fetch GitHub repository metadata
    const githubApiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`;
    const headers = {};

    // Use GitHub token if available for higher rate limits
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const response = await fetch(githubApiUrl, { headers });
    const repoData = await response.json();

    if (repoData.message === 'Not Found' || response.status === 404) {
      throw new Error(`Repository not found: ${githubUrl}`);
    }

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
    
    // Simulate a complete analysis by adding sample function analyses
    const sampleFunctions = [
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
    const sampleArchDocs = [
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
    const sampleBusinessExplanations = [
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
    
    // Generate developer questions using the new edge function
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
    
    console.log('Developer questions generation initiated');
    
    // Generate business questions using the new edge function
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
    
    console.log('Business questions generation initiated');

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
    
    // If repositoryId was provided, update status to failed
    const { repositoryId } = await req.json().catch(() => ({}));
    if (repositoryId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase
        .from('repositories')
        .update({ status: 'failed' })
        .eq('id', repositoryId);
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
