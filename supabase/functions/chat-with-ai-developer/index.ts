
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, repositoryId } = await req.json()
    
    console.log('Developer AI Chat - Processing message:', message)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Developer-focused system prompt
    const systemPrompt = `You are Docu Buddy's Technical Implementation Assistant. Your role is to provide actionable, implementation-focused guidance that helps developers understand, modify, and improve code efficiently.

    CORE PRINCIPLES:
    - Lead with IMPLEMENTATION STRATEGY and architectural context
    - Provide concrete code examples and patterns when relevant
    - Focus on best practices, performance implications, and maintainability
    - Highlight potential pitfalls and common mistakes to avoid
    - Suggest specific tools, libraries, and methodologies

    RESPONSE STRUCTURE:
    1. **Implementation Overview** (what needs to be done technically)
    2. **Architecture Impact** (how this affects the overall system design)
    3. **Code Examples** (when applicable, show specific patterns or snippets)
    4. **Performance & Scalability** (implications for system performance)
    5. **Quick Wins** (immediate improvements that can be made)
    6. **Next Steps** (specific technical actions to take)

    TONE: Technical but clear, practical, solution-oriented
    INCLUDE: Code patterns, architectural decisions, performance metrics, testing strategies
    FOCUS ON: Implementation details, technical trade-offs, code quality improvements

    When discussing code complexity, frame it as:
    - "Refactoring Priority" with specific complexity scores
    - "Performance Impact" with measurable metrics
    - "Maintainability Score" with concrete improvement suggestions
    - "Technical Debt Assessment" with remediation strategies`

    // Get conversation history
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at')

    // Get repository context for technical insights
    const { data: repository } = await supabaseClient
      .from('repositories')
      .select('name, description, language, github_url')
      .eq('id', repositoryId)
      .single()

    // Get detailed function analyses for technical context
    const { data: functions } = await supabaseClient
      .from('function_analyses')
      .select('function_name, complexity_level, description, function_signature, parameters, file_path')
      .eq('repository_id', repositoryId)
      .limit(10)

    const technicalContext = `
    Repository: ${repository?.name || 'Unknown'} (${repository?.language || 'Mixed'})
    GitHub URL: ${repository?.github_url || 'Not provided'}
    
    Technical Analysis Summary:
    - ${functions?.length || 0} functions analyzed
    - File Structure: ${functions?.map(f => f.file_path.split('/').slice(-1)[0]).join(', ') || 'Not analyzed'}
    - Complexity Levels: ${functions?.map(f => `${f.function_name}: ${f.complexity_level}`).join(', ') || 'Not analyzed'}
    `

    const conversationHistory = messages?.map(msg => ({
      role: msg.role,
      content: msg.content
    })) || []

    const openAIPayload = {
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt + "\n\nTechnical Context:\n" + technicalContext },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 1200
    }

    console.log('Calling OpenAI API for developer response...')
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openAIPayload),
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`)
    }

    const openAIData = await openAIResponse.json()
    const aiResponse = openAIData.choices[0].message.content

    // Store messages with technical context
    await supabaseClient.from('chat_messages').insert([
      { conversation_id: conversationId, role: 'user', content: message },
      { conversation_id: conversationId, role: 'assistant', content: aiResponse }
    ])

    console.log('Developer AI response generated successfully')

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        responseStyle: 'developer',
        technicalMetrics: {
          implementationTime: 'Estimated in response',
          complexityLevel: 'Technical Detail',
          codeExamples: aiResponse.includes('```') ? 'Yes' : 'Patterns Included'
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Developer AI Chat error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process developer request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
