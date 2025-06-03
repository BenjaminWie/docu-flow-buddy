
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
    const { functionData, proposalType, repositoryId } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let prompt = ''
    if (proposalType === 'documentation') {
      prompt = `Generate comprehensive JSDoc documentation for this function:

Function Name: ${functionData.function_name}
Function Signature: ${functionData.function_signature}
Description: ${functionData.description}
Parameters: ${JSON.stringify(functionData.parameters, null, 2)}
Return Value: ${functionData.return_value}
Complexity: ${functionData.complexity_level}

Please provide:
1. Complete JSDoc comment block
2. Clear parameter descriptions
3. Return value description
4. Usage examples
5. Any important notes or warnings

Format as JSDoc comments that can be directly inserted into code.`
    } else if (proposalType === 'test') {
      prompt = `Generate comprehensive unit tests for this function:

Function Name: ${functionData.function_name}
Function Signature: ${functionData.function_signature}
Description: ${functionData.description}
Parameters: ${JSON.stringify(functionData.parameters, null, 2)}
Return Value: ${functionData.return_value}
Usage Example: ${functionData.usage_example}

Please provide:
1. Jest/Vitest test cases covering normal scenarios
2. Edge cases and error conditions
3. Mock data setup if needed
4. Clear test descriptions

Format as ready-to-use test code.`
    } else if (proposalType === 'business_logic') {
      prompt = `Explain the business logic and purpose of this function in simple terms:

Function Name: ${functionData.function_name}
Description: ${functionData.description}
Parameters: ${JSON.stringify(functionData.parameters, null, 2)}
Return Value: ${functionData.return_value}
Usage Example: ${functionData.usage_example}

Please provide:
1. What business problem this function solves
2. When and why it would be used
3. What inputs it expects and what outputs it provides
4. Any business rules or constraints
5. How it fits into the larger application workflow

Write in plain language that non-technical stakeholders can understand.`
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software developer and technical writer. Provide high-quality, accurate documentation and explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedContent = data.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI')
    }

    // Store the proposal in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: proposal, error } = await supabase
      .from('documentation_proposals')
      .insert({
        repository_id: repositoryId,
        function_id: functionData.id,
        function_name: functionData.function_name,
        proposal_type: proposalType,
        ai_generated_content: generatedContent,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(JSON.stringify({ proposal, generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
