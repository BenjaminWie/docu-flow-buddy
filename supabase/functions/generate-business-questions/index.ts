
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
    const { repositoryId, githubUrl, repoData } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Check if this is the OpenRewrite repository
    const isOpenRewrite = repoData.owner?.toLowerCase() === 'openrewrite' && repoData.name?.toLowerCase() === 'rewrite';

    // Create specialized system prompt for OpenRewrite or general repositories
    const systemPrompt = isOpenRewrite ? 
      `You are an expert business analyst specializing in enterprise software development tools. Generate exactly 5 high-quality business questions for OpenRewrite, focusing on business value and ROI.

Repository Context:
- Name: ${repoData.name}
- Owner: ${repoData.owner}
- Description: ${repoData.description || 'Automated source code refactoring toolkit'}
- Language: ${repoData.language || 'Java'}
- Stars: ${repoData.stars || 0}
- URL: ${githubUrl}

Focus Areas for OpenRewrite Business Questions:
1. ROI & Cost Savings - Quantifiable benefits of automated refactoring
2. Risk Mitigation - How automation reduces migration and upgrade risks
3. Developer Productivity - Impact on team efficiency and satisfaction
4. Technical Debt Reduction - Business case for code modernization
5. Compliance & Security - Meeting regulatory and security requirements

Generate questions that would help:
- CTOs understand the business case for automated refactoring
- Engineering managers justify OpenRewrite adoption
- Project managers plan migration timelines and budgets
- Compliance teams understand security and audit benefits
- Executives evaluate ROI and competitive advantages

Return exactly 5 questions in this JSON format:
{
  "questions": [
    {
      "question": "What is the ROI and cost savings of using OpenRewrite for automated code modernization?",
      "question_type": "benefits",
      "priority": 1
    },
    // ... 4 more questions with types: business, workflow, compliance, requirements
  ]
}

Focus on business value, not technical implementation. Use business-friendly language.`
      :
      `You are an expert business analyst and requirements engineer. Generate exactly 5 high-quality business questions for a GitHub repository.

Repository Context:
- Name: ${repoData.name}
- Owner: ${repoData.owner}
- Description: ${repoData.description || 'No description available'}
- Language: ${repoData.language || 'Not specified'}
- Stars: ${repoData.stars || 0}
- URL: ${githubUrl}

Focus Areas for Business Questions:
1. Business Value & Benefits - What problems does this solve?
2. Functionality & Features - What can the system do?
3. Requirements Coverage - What business needs are met?
4. Workflow Implementation - How are business processes handled?
5. Compliance & Standards - What business rules are enforced?

Generate questions that would help:
- Business analysts validate requirements
- Product managers understand capabilities
- Stakeholders assess business value
- Requirements engineers identify gaps
- Decision makers understand ROI

Return exactly 5 questions in this JSON format:
{
  "questions": [
    {
      "question": "What are the main business benefits and key USPs of ${repoData.name}?",
      "question_type": "benefits",
      "priority": 1
    },
    // ... 4 more questions with types: business, requirements, workflow, compliance
  ]
}

Make questions focused on business value, not technical implementation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate 5 specialized business questions for the ${repoData.name} repository.` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const aiData = await response.json();
    const content = aiData.choices[0].message.content;
    
    let questions;
    try {
      questions = JSON.parse(content).questions;
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      // Fallback questions specific to OpenRewrite or general business
      questions = isOpenRewrite ? [
        { question: `What is the ROI and cost savings of using OpenRewrite for automated code modernization?`, question_type: 'benefits', priority: 1 },
        { question: `How does OpenRewrite reduce business risks during framework migrations and upgrades?`, question_type: 'business', priority: 2 },
        { question: `What impact does OpenRewrite have on developer productivity and team satisfaction?`, question_type: 'workflow', priority: 3 },
        { question: `How does automated refactoring help meet compliance and security requirements?`, question_type: 'compliance', priority: 4 },
        { question: `What business requirements does OpenRewrite address for enterprise development teams?`, question_type: 'requirements', priority: 5 }
      ] : [
        { question: `What are the main business benefits and key USPs of ${repoData.name}?`, question_type: 'benefits', priority: 1 },
        { question: `What business functionality does ${repoData.name} provide?`, question_type: 'business', priority: 2 },
        { question: `How does ${repoData.name} address core business requirements?`, question_type: 'requirements', priority: 3 },
        { question: `What business workflows are implemented in ${repoData.name}?`, question_type: 'workflow', priority: 4 },
        { question: `What compliance and business standards does ${repoData.name} follow?`, question_type: 'compliance', priority: 5 }
      ];
    }

    // Insert questions into database
    const qaInserts = questions.map(q => ({
      repository_id: repositoryId,
      function_id: 'general',
      function_name: 'General',
      question: q.question,
      question_type: q.question_type,
      view_mode: 'business'
    }));

    const { data, error } = await supabase
      .from('function_qa')
      .insert(qaInserts)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Generated ${questions.length} business questions for repository ${repositoryId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      questions: data,
      count: questions.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating business questions:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
