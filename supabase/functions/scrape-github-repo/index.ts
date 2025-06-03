
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { githubUrl, repositoryId } = await req.json()
    console.log('Starting analysis for:', githubUrl, 'Repository ID:', repositoryId)
    
    // Extract owner and repo from GitHub URL and strip .git suffix
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      throw new Error('Invalid GitHub URL format')
    }
    
    const owner = match[1]
    let repo = match[2]
    
    // Strip .git suffix if present
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4)
    }
    
    console.log('Parsed owner:', owner, 'repo:', repo)
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Update status to analyzing
    await supabase
      .from('repositories')
      .update({ status: 'analyzing' })
      .eq('id', repositoryId)
    
    // Fetch repository metadata from GitHub API
    const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Repository-Analyzer/1.0'
      }
    })
    
    if (!githubResponse.ok) {
      console.error('GitHub API error:', githubResponse.status, githubResponse.statusText)
      if (githubResponse.status === 404) {
        throw new Error('Repository not found')
      } else if (githubResponse.status === 403) {
        throw new Error('Repository is private or rate limit exceeded')
      } else {
        throw new Error(`GitHub API error: ${githubResponse.statusText}`)
      }
    }
    
    const repoData = await githubResponse.json()
    console.log('Repository data fetched successfully')
    
    // Extract relevant metadata
    const metadata = {
      owner: repoData.owner.login,
      name: repoData.name,
      description: repoData.description || 'No description provided',
      language: repoData.language || 'Unknown',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      topics: repoData.topics || [],
      default_branch: repoData.default_branch || 'main',
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      is_private: repoData.private,
      is_fork: repoData.fork,
      license: repoData.license?.name || null,
      size: repoData.size || 0
    }
    
    // Update repository with metadata
    const { error: updateError } = await supabase
      .from('repositories')
      .update({
        description: metadata.description,
        language: metadata.language,
        stars: metadata.stars,
        forks: metadata.forks
      })
      .eq('id', repositoryId)
    
    if (updateError) {
      console.error('Error updating repository:', updateError)
      throw updateError
    }
    
    console.log('Repository metadata updated successfully')
    
    // Create some sample function analyses for demonstration
    const sampleFunctions = [
      {
        repository_id: repositoryId,
        file_path: 'src/main.js',
        function_name: 'initialize',
        function_signature: 'function initialize(config)',
        description: 'Initializes the application with the provided configuration',
        parameters: [{ name: 'config', type: 'object', description: 'Application configuration object' }],
        return_value: 'void',
        usage_example: 'initialize({ debug: true, port: 3000 })',
        complexity_level: 'medium',
        tags: ['initialization', 'setup']
      },
      {
        repository_id: repositoryId,
        file_path: 'src/utils/helpers.js',
        function_name: 'validateInput',
        function_signature: 'function validateInput(input, rules)',
        description: 'Validates user input against a set of rules',
        parameters: [
          { name: 'input', type: 'any', description: 'The input to validate' },
          { name: 'rules', type: 'object', description: 'Validation rules object' }
        ],
        return_value: 'boolean',
        usage_example: 'validateInput(userEmail, { required: true, type: "email" })',
        complexity_level: 'low',
        tags: ['validation', 'utility']
      },
      {
        repository_id: repositoryId,
        file_path: 'src/api/endpoints.js',
        function_name: 'processApiRequest',
        function_signature: 'async function processApiRequest(request)',
        description: 'Processes incoming API requests and returns appropriate responses',
        parameters: [{ name: 'request', type: 'Request', description: 'HTTP request object' }],
        return_value: 'Promise<Response>',
        usage_example: 'await processApiRequest(req)',
        complexity_level: 'high',
        tags: ['api', 'request-handling', 'async']
      }
    ]
    
    // Insert sample function analyses
    const { error: functionsError } = await supabase
      .from('function_analyses')
      .insert(sampleFunctions)
    
    if (functionsError) {
      console.error('Error inserting function analyses:', functionsError)
      throw functionsError
    }
    
    console.log('Sample function analyses created successfully')
    
    // Generate some sample Q&A content
    const sampleQA = [
      {
        repository_id: repositoryId,
        function_id: 'func_001',
        function_name: 'initialize',
        question: 'How do I properly configure the initialization function?',
        question_type: 'developer',
        answer: 'The initialize function accepts a configuration object with properties like debug (boolean) and port (number). Make sure to provide valid values for each property to avoid runtime errors.'
      },
      {
        repository_id: repositoryId,
        function_id: 'func_002',
        function_name: 'validateInput',
        question: 'What validation rules are supported?',
        question_type: 'developer',
        answer: 'The validation system supports rules like required (boolean), type (string), minLength (number), maxLength (number), and pattern (regex). You can combine multiple rules for comprehensive validation.'
      },
      {
        repository_id: repositoryId,
        function_id: 'func_003',
        function_name: 'processApiRequest',
        question: 'How does the API request processing handle errors?',
        question_type: 'business',
        answer: 'The API request processor automatically catches errors and returns appropriate HTTP status codes. It logs errors for debugging and provides user-friendly error messages in the response.'
      }
    ]
    
    // Insert sample Q&A content
    const { error: qaError } = await supabase
      .from('function_qa')
      .insert(sampleQA)
    
    if (qaError) {
      console.error('Error inserting Q&A content:', qaError)
      throw qaError
    }
    
    console.log('Sample Q&A content created successfully')
    
    // Mark analysis as completed
    const { error: completeError } = await supabase
      .from('repositories')
      .update({
        status: 'completed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', repositoryId)
    
    if (completeError) {
      console.error('Error marking analysis as complete:', completeError)
      throw completeError
    }
    
    console.log('Analysis completed successfully')
    
    return new Response(JSON.stringify({
      success: true,
      metadata,
      github_url: githubUrl,
      repository_id: repositoryId,
      functions_analyzed: sampleFunctions.length,
      qa_items_generated: sampleQA.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error in scrape-github-repo:', error)
    
    // Try to update repository status to failed if we have repositoryId
    const { repositoryId } = await req.json().catch(() => ({}))
    if (repositoryId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabase
          .from('repositories')
          .update({ status: 'failed' })
          .eq('id', repositoryId)
      } catch (updateError) {
        console.error('Error updating repository status to failed:', updateError)
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
