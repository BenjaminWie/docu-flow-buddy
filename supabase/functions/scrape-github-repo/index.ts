
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
    const { githubUrl } = await req.json()
    
    // Extract owner and repo from GitHub URL
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      throw new Error('Invalid GitHub URL format')
    }
    
    const owner = match[1]
    const repo = match[2]
    
    // Fetch repository metadata from GitHub API
    const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Repository-Analyzer/1.0'
      }
    })
    
    if (!githubResponse.ok) {
      if (githubResponse.status === 404) {
        throw new Error('Repository not found')
      } else if (githubResponse.status === 403) {
        throw new Error('Repository is private or rate limit exceeded')
      } else {
        throw new Error(`GitHub API error: ${githubResponse.statusText}`)
      }
    }
    
    const repoData = await githubResponse.json()
    
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
    
    // For large repositories, we might want to fetch additional info like:
    // - README content
    // - Repository structure
    // - Main programming languages distribution
    
    return new Response(JSON.stringify({
      success: true,
      metadata,
      github_url: githubUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error scraping GitHub repository:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
