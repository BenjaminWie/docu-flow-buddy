
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
    const { functionData, repositoryId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate different types of questions
    const questions = [
      {
        question: `How would you test the edge cases for ${functionData.function_name}?`,
        question_type: 'developer'
      },
      {
        question: `What business scenarios would require calling ${functionData.function_name}?`,
        question_type: 'business'
      },
      {
        question: `Are there any performance considerations when using ${functionData.function_name}?`,
        question_type: 'developer'
      },
      {
        question: `How does ${functionData.function_name} handle error conditions?`,
        question_type: 'developer'
      },
      {
        question: `What user actions trigger the ${functionData.function_name} function?`,
        question_type: 'business'
      }
    ]

    // Insert questions into database
    const { data, error } = await supabase
      .from('function_qa')
      .insert(
        questions.map(q => ({
          repository_id: repositoryId,
          function_id: functionData.id,
          function_name: functionData.function_name,
          question: q.question,
          question_type: q.question_type
        }))
      )
      .select()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(JSON.stringify({ questions: data }), {
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
