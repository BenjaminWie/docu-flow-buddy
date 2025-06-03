
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
    const { question, repositoryId, questionType, viewMode } = await req.json();
    
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

    // Create specialized system prompt based on view mode
    const systemPrompt = viewMode === 'business' ? 
      `You are an expert business analyst and requirements engineer. Answer questions about software repositories from a business perspective.

Repository Context:
- Name: ${repository.name}
- Owner: ${repository.owner}
- Description: ${repository.description || 'No description available'}
- Language: ${repository.language || 'Not specified'}
- GitHub URL: ${repository.github_url}

Instructions:
- Focus on business value, functionality, and requirements
- Use business-friendly language, avoid technical jargon
- Include business analogies where helpful
- Explain how features solve business problems
- Mention ROI, efficiency gains, and competitive advantages
- Structure answers with clear headings and bullet points
- Use markdown formatting for better readability
- Include relevant external links when possible

Answer Format:
- Start with a brief executive summary
- Use ## for main sections
- Use bullet points for key benefits
- Include a "Business Impact" section
- End with actionable next steps

Make the answer comprehensive but accessible to non-technical stakeholders.`
      :
      `You are an expert software architect and senior developer. Answer questions about software repositories from a technical perspective.

Repository Context:
- Name: ${repository.name}
- Owner: ${repository.owner}
- Description: ${repository.description || 'No description available'}
- Language: ${repository.language || 'Not specified'}
- GitHub URL: ${repository.github_url}

Instructions:
- Focus on technical implementation, architecture, and code quality
- Provide specific, actionable technical guidance
- Include code examples where relevant
- Explain best practices and potential pitfalls
- Mention performance, security, and maintainability aspects
- Structure answers with clear technical sections
- Use markdown formatting with proper code highlighting
- Include links to relevant documentation

Answer Format:
- Start with a technical overview
- Use ## for main sections like "Implementation", "Best Practices", "Considerations"
- Use code blocks for examples
- Include a "Technical Recommendations" section
- End with specific next steps

Make the answer detailed and practical for developers at all levels.`;

    // Generate context-aware web search query
    const searchQuery = `${repository.owner}/${repository.name} ${repository.language} ${question}`;
    
    // Create the AI prompt with web context simulation
    const userPrompt = `Question: ${question}

Repository: ${repository.owner}/${repository.name}
Description: ${repository.description || 'No description available'}
Programming Language: ${repository.language || 'Not specified'}

Please provide a comprehensive answer using the repository context above. Focus on ${viewMode === 'business' ? 'business value and functionality' : 'technical implementation and architecture'}.

Search Context: Based on ${searchQuery}, provide relevant insights about this repository and similar projects.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const aiData = await response.json();
    const answer = aiData.choices[0].message.content;

    // Generate external links based on the repository
    const externalLinks = [
      {
        title: `${repository.name} Repository`,
        url: repository.github_url
      },
      {
        title: `${repository.language} Documentation`,
        url: `https://docs.${repository.language?.toLowerCase()}.org` // Generic, would need better logic
      }
    ];

    // Generate analogy for business questions
    let analogyContent = null;
    if (viewMode === 'business') {
      const analogyPrompt = `Create a simple business analogy to explain this concept: ${question}
      
      Repository: ${repository.name}
      Context: ${repository.description}
      
      Make it relatable to everyday business operations. Keep it to 2-3 sentences.`;

      const analogyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analogyPrompt }],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const analogyData = await analogyResponse.json();
      analogyContent = analogyData.choices[0].message.content;
    }

    // Save answer to database
    const { data: qaData, error: qaError } = await supabase
      .from('function_qa')
      .insert({
        repository_id: repositoryId,
        function_id: 'general',
        function_name: 'General',
        question: question,
        answer: answer,
        question_type: questionType || (viewMode === 'business' ? 'business' : 'development'),
        view_mode: viewMode,
        content_format: 'markdown',
        external_links: externalLinks,
        analogy_content: analogyContent
      })
      .select()
      .single();

    if (qaError) {
      console.error('Database error:', qaError);
      throw qaError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      qa: qaData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced QA responder:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
