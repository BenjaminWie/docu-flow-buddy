
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
      `You are an expert in OpenRewrite, a powerful automated refactoring toolkit for source code transformation. Generate exactly 5 high-quality developer questions for the OpenRewrite repository.

Repository Context:
- Name: ${repoData.name}
- Owner: ${repoData.owner}
- Description: ${repoData.description || 'Automated source code refactoring'}
- Language: ${repoData.language || 'Java'}
- Stars: ${repoData.stars || 0}
- URL: ${githubUrl}

Focus Areas for OpenRewrite Developer Questions:
1. Recipe Development - How to create custom transformation recipes
2. AST Manipulation - Working with Abstract Syntax Trees and visitors
3. Build Tool Integration - Maven/Gradle plugin usage and configuration
4. Testing Strategies - Testing recipes and transformations effectively
5. Advanced Patterns - Visitor patterns, execution contexts, and recipe composition

Generate questions that would help:
- Java developers understand AST-based transformations
- DevOps teams integrate OpenRewrite into CI/CD pipelines
- Senior developers create custom recipes for code modernization
- Teams adopt OpenRewrite for framework migrations
- Architects understand the transformation engine design

Return exactly 5 questions in this JSON format:
{
  "questions": [
    {
      "question": "How do I create a custom OpenRewrite recipe to transform specific Java patterns?",
      "question_type": "development",
      "priority": 1
    },
    // ... 4 more questions with types: setup, architecture, testing, deployment
  ]
}

Make questions specific to OpenRewrite's recipe development, AST manipulation, and code transformation capabilities.`
      :
      `You are an expert software architect and developer mentor. Generate exactly 5 high-quality developer questions for a GitHub repository.

Repository Context:
- Name: ${repoData.name}
- Owner: ${repoData.owner}
- Description: ${repoData.description || 'No description available'}
- Language: ${repoData.language || 'Not specified'}
- Stars: ${repoData.stars || 0}
- URL: ${githubUrl}

Focus Areas for Developer Questions:
1. Development Environment Setup - How to get started quickly
2. Code Architecture - Understanding the structure and patterns
3. Critical Functions - Most important code areas to understand
4. Testing & Quality - How to test and maintain code quality
5. Integration & Deployment - How the system connects and deploys

Generate questions that would help:
- Junior developers understand the codebase faster
- New team members reduce onboarding time
- Senior developers quickly assess architecture
- Anyone understand the development workflow

Return exactly 5 questions in this JSON format:
{
  "questions": [
    {
      "question": "How do I set up the development environment for ${repoData.name}?",
      "question_type": "setup",
      "priority": 1
    },
    // ... 4 more questions with types: development, architecture, testing, deployment
  ]
}

Make questions specific to this repository's technology stack and apparent complexity.`;

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
          { role: 'user', content: `Generate 5 specialized developer questions for the ${repoData.name} repository.` }
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
      // Fallback questions specific to OpenRewrite or general development
      questions = isOpenRewrite ? [
        { question: `How do I create a custom OpenRewrite recipe to transform specific Java patterns?`, question_type: 'development', priority: 1 },
        { question: `How do I set up OpenRewrite in my Maven or Gradle build?`, question_type: 'setup', priority: 2 },
        { question: `What is the visitor pattern in OpenRewrite and how do I use it for AST traversal?`, question_type: 'architecture', priority: 3 },
        { question: `How do I test my OpenRewrite recipes to ensure they work correctly?`, question_type: 'testing', priority: 4 },
        { question: `How can I integrate OpenRewrite into my CI/CD pipeline for automated refactoring?`, question_type: 'deployment', priority: 5 }
      ] : [
        { question: `How do I set up the development environment for ${repoData.name}?`, question_type: 'setup', priority: 1 },
        { question: `What is the overall architecture of ${repoData.name}?`, question_type: 'architecture', priority: 2 },
        { question: `What are the most critical functions in ${repoData.name} that I should understand?`, question_type: 'development', priority: 3 },
        { question: `How do I run tests for ${repoData.name}?`, question_type: 'testing', priority: 4 },
        { question: `How is ${repoData.name} deployed and integrated?`, question_type: 'deployment', priority: 5 }
      ];
    }

    // Insert questions into database
    const qaInserts = questions.map(q => ({
      repository_id: repositoryId,
      function_id: 'general',
      function_name: 'General',
      question: q.question,
      question_type: q.question_type,
      view_mode: 'dev'
    }));

    const { data, error } = await supabase
      .from('function_qa')
      .insert(qaInserts)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Generated ${questions.length} developer questions for repository ${repositoryId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      questions: data,
      count: questions.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating dev questions:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
