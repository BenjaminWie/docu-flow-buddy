
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
    const { message, repositoryId, conversationId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get repository information for context
    const { data: repository } = await supabase
      .from('repositories')
      .select('name, owner, description, language')
      .eq('id', repositoryId)
      .single()

    const repoContext = repository 
      ? `Repository: ${repository.owner}/${repository.name} (${repository.language})\nDescription: ${repository.description}`
      : 'Repository information not available'

    // For now, we'll use a contextual AI response
    // In a real implementation, you'd integrate with web search APIs like Perplexity or search engines
    const aiResponse = `Based on your question about: "${message}"

**Repository Context:** ${repoContext}

I'd be happy to help you understand this aspect of the codebase. Here are some insights relevant to your question:

## Key Points

• **Architecture**: The codebase follows established patterns and best practices for ${repository?.language || 'the programming language'}
• **Implementation**: The code structure suggests a well-organized approach to ${repository?.name || 'the project'} functionality
• **Best Practices**: The implementation appears to follow industry standards and conventions

## Recommendations

For more specific information about your question, I'd recommend:

1. **Documentation**: Check the project's README and documentation files
2. **Code Structure**: Look at the main entry points and module organization
3. **Dependencies**: Review the package.json or similar dependency files for insights into the tech stack
4. **Community**: Check if there are community discussions or issues related to your question

## Additional Context

${repository?.description ? `This repository focuses on: ${repository.description}` : 'Consider exploring the codebase structure to better understand the implementation patterns.'}

Would you like me to elaborate on any specific aspect of your question?`

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        sources: [
          {
            title: `${repository?.owner}/${repository?.name} Repository`,
            url: `https://github.com/${repository?.owner}/${repository?.name}`,
            snippet: repository?.description || "Repository documentation and source code"
          }
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
