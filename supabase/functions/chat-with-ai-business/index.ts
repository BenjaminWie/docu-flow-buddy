
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
    
    console.log('Business AI Chat - Processing message:', message)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Business-focused system prompt
    const systemPrompt = `You are Docu Buddy's Business Intelligence Assistant. Your role is to translate technical concepts into business language that executives, product managers, and stakeholders can understand and act upon.

    CORE PRINCIPLES:
    - Always explain the BUSINESS IMPACT first, then the technical details
    - Use analogies and real-world examples that non-technical people understand
    - Focus on ROI, timelines, risks, and strategic implications
    - Quantify everything possible (time savings, cost impacts, risk levels)
    - Provide actionable recommendations for business decisions

    RESPONSE STRUCTURE:
    1. **Business Impact Summary** (2-3 sentences on what this means for the business)
    2. **What This Really Means** (plain English explanation with analogies)
    3. **Key Metrics** (time, cost, risk level, complexity score 1-10)
    4. **Strategic Implications** (how this affects roadmaps, resources, decisions)
    5. **Recommended Actions** (specific next steps for stakeholders)

    TONE: Professional but accessible, confident, solution-oriented
    AVOID: Technical jargon, implementation details, code examples
    INCLUDE: Cost estimates, timeline projections, risk assessments, competitive advantages

    When discussing code complexity, frame it as:
    - "Technical Debt Level" instead of "Complexity Score"
    - "Maintenance Cost" instead of "Refactoring Effort" 
    - "Risk to Business Continuity" instead of "Code Quality Issues"
    - "Time to Market Impact" instead of "Development Velocity"`

    // Get conversation history
    const { data: messages } = await supabaseClient
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at')

    // Get repository context for business insights
    const { data: repository } = await supabaseClient
      .from('repositories')
      .select('name, description, language, stars, forks')
      .eq('id', repositoryId)
      .single()

    // Get function analyses for business context
    const { data: functions } = await supabaseClient
      .from('function_analyses')
      .select('function_name, complexity_level, description')
      .eq('repository_id', repositoryId)
      .limit(5)

    const businessContext = `
    Repository: ${repository?.name || 'Unknown'} (${repository?.language || 'Mixed'})
    Business Value Indicators: ${repository?.stars || 0} community endorsements, ${repository?.forks || 0} derivative projects
    Codebase Overview: ${functions?.length || 0} analyzed functions
    Complexity Distribution: ${functions?.map(f => f.complexity_level).join(', ') || 'Not analyzed'}
    `

    const conversationHistory = messages?.map(msg => ({
      role: msg.role,
      content: msg.content
    })) || []

    const openAIPayload = {
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt + "\n\nBusiness Context:\n" + businessContext },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }

    console.log('Calling OpenAI API for business response...')
    
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

    // Store messages with business context
    await supabaseClient.from('chat_messages').insert([
      { conversation_id: conversationId, role: 'user', content: message },
      { conversation_id: conversationId, role: 'assistant', content: aiResponse }
    ])

    console.log('Business AI response generated successfully')

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        responseStyle: 'business',
        businessMetrics: {
          estimatedReadingTime: Math.ceil(aiResponse.length / 200),
          complexityLevel: 'Business Friendly',
          actionableInsights: aiResponse.split('**Recommended Actions**').length > 1 ? 'Yes' : 'Suggested'
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
    console.error('Business AI Chat error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process business request',
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
