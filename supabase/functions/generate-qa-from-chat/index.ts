
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, repositoryId, functionId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get repository context
    const { data: repository } = await supabase
      .from('repositories')
      .select('*')
      .eq('id', repositoryId)
      .single();

    if (!repository) {
      throw new Error('Repository not found');
    }

    // Extract context from messages
    const messageContent = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');

    // Determine if the conversation is more technical or business focused
    const prompt = `Based on the following conversation, determine if the questions are more technical (dev) or business-focused.
    Then extract or create a clear, concise question that summarizes what the user is asking.
    
    Conversation:
    ${messageContent}
    
    Repository Context:
    - Name: ${repository.name}
    - Owner: ${repository.owner}
    - Description: ${repository.description || 'No description available'}
    - Language: ${repository.language || 'Not specified'}
    
    Return your answer as JSON:
    {
      "question": "The extracted or improved question",
      "questionType": "Either 'development', 'architecture', 'setup', 'business', 'benefits', 'workflow', or another appropriate category",
      "viewMode": "Either 'dev' or 'business'"
    }`;

    const responseFormatting = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const formattingData = await responseFormatting.json();
    const formattingContent = formattingData.choices[0].message.content;
    
    let questionData;
    try {
      questionData = JSON.parse(formattingContent);
    } catch (e) {
      console.error('Failed to parse AI response:', formattingContent);
      // Set default values
      questionData = {
        question: messages[messages.length - 2].content, // Get the last user message
        questionType: functionId ? 'development' : 'general',
        viewMode: 'dev'
      };
    }

    // Now use the enhanced-qa-responder to generate a proper answer
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/enhanced-qa-responder`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionData.question,
          repositoryId,
          questionType: questionData.questionType,
          viewMode: questionData.viewMode,
        }),
      }
    );

    const data = await response.json();
    
    // If there was an error with the enhanced responder, generate a simpler response
    if (!data.success) {
      // Generate a simpler response
      const prompt = `Based on the conversation below, provide a concise answer to the user's questions about the repository.

      Conversation:
      ${messageContent}
      
      Repository:
      - Name: ${repository.name}
      - Owner: ${repository.owner}
      - Description: ${repository.description || 'No description available'}
      - Language: ${repository.language || 'Not specified'}
      
      Provide a useful, technical response with markdown formatting.`;

      const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 1000,
        }),
      });

      const fallbackData = await fallbackResponse.json();
      const answer = fallbackData.choices[0].message.content;

      return new Response(JSON.stringify({
        question: questionData.question,
        answer: answer,
        questionType: questionData.questionType,
        viewMode: questionData.viewMode
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the enhanced QA
    return new Response(JSON.stringify({
      question: data.qa.question,
      answer: data.qa.answer,
      questionType: data.qa.question_type,
      viewMode: data.qa.view_mode
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating Q&A from chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
