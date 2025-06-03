import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  FileText, 
  TestTube, 
  Brain, 
  Github, 
  Sparkles,
  Check,
  X,
  Edit,
  MessageSquare,
  ExternalLink
} from "lucide-react";

interface FunctionAnalysis {
  id: string;
  file_path: string;
  function_name: string;
  function_signature: string;
  description: string;
  parameters: any;
  return_value: string;
  usage_example: string;
  complexity_level: string;
  tags: string[];
}

interface Repository {
  id: string;
  github_url: string;
  owner: string;
  name: string;
}

interface FunctionDetailProps {
  functionData: FunctionAnalysis;
  repository: Repository;
  onBack: () => void;
}

interface DocumentationProposal {
  id: string;
  proposal_type: string;
  ai_generated_content: string;
  user_content: string | null;
  status: string;
}

interface FunctionQA {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
}

const FunctionDetail = ({ functionData, repository, onBack }: FunctionDetailProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [proposals, setProposals] = useState<DocumentationProposal[]>([]);
  const [questions, setQuestions] = useState<FunctionQA[]>([]);
  const [githubCode, setGithubCode] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [userContent, setUserContent] = useState<{ [key: string]: string }>({});
  const [answerInput, setAnswerInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProposals();
    fetchQuestions();
    fetchGithubCode();
  }, [functionData.id]);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from('documentation_proposals')
      .select('*')
      .eq('function_id', functionData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
    } else {
      setProposals(data || []);
    }
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('function_qa')
      .select('*')
      .eq('function_id', functionData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching questions:', error);
    } else {
      setQuestions(data || []);
      
      // If no questions exist, generate some automatically
      if (!data || data.length === 0) {
        generateQuestions();
      }
    }
  };

  const generateQuestions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: {
          functionData,
          repositoryId: repository.id
        }
      });

      if (error) throw error;
      
      // Refresh questions after generation
      fetchQuestions();
    } catch (error) {
      console.error('Error generating questions:', error);
    }
  };

  const fetchGithubCode = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-github-code', {
        body: {
          githubUrl: repository.github_url,
          filePath: functionData.file_path,
          functionName: functionData.function_name
        }
      });

      if (error) throw error;

      setGithubCode(data.content);
      setGithubUrl(data.githubUrl);
    } catch (error) {
      console.error('Error fetching GitHub code:', error);
      toast({
        title: "Error",
        description: "Failed to fetch code from GitHub",
        variant: "destructive"
      });
    }
  };

  const generateAIContent = async (proposalType: string) => {
    setLoading(proposalType);
    try {
      const { data, error } = await supabase.functions.invoke('generate-documentation', {
        body: {
          functionData,
          proposalType,
          repositoryId: repository.id
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `AI ${proposalType} generated successfully`,
      });

      fetchProposals();
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: `Failed to generate AI ${proposalType}`,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const updateProposal = async (proposalId: string, status: string, content?: string) => {
    const updates: any = { status };
    if (content) updates.user_content = content;

    const { error } = await supabase
      .from('documentation_proposals')
      .update(updates)
      .eq('id', proposalId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update proposal",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Proposal updated successfully",
      });
      fetchProposals();
    }
  };

  const submitAnswer = async (questionId: string) => {
    const answer = answerInput[questionId];
    if (!answer?.trim()) return;

    const { error } = await supabase
      .from('function_qa')
      .update({ answer })
      .eq('id', questionId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Answer submitted successfully",
      });
      setAnswerInput(prev => ({ ...prev, [questionId]: '' }));
      fetchQuestions();
    }
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProposalsByType = (type: string) => 
    proposals.filter(p => p.proposal_type === type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
      </div>

      {/* Function Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{functionData.function_name}</CardTitle>
              <p className="text-gray-600 mt-2">{functionData.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className={getComplexityColor(functionData.complexity_level)}>
                  {functionData.complexity_level} complexity
                </Badge>
                <Badge variant="outline">{functionData.file_path}</Badge>
              </div>
            </div>
            {githubUrl && (
              <Button variant="outline" asChild>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Function Signature</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {functionData.function_signature}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Return Value</h4>
              <p className="text-gray-700">{functionData.return_value}</p>
            </div>
          </div>
          
          {functionData.usage_example && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Usage Example</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {functionData.usage_example}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Code View */}
      {githubCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Function Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
              {githubCode}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button 
          onClick={() => generateAIContent('documentation')}
          disabled={loading === 'documentation'}
          className="h-20 flex-col gap-2"
        >
          <FileText className="w-6 h-6" />
          {loading === 'documentation' ? 'Generating...' : 'Generate Documentation'}
        </Button>
        
        <Button 
          onClick={() => generateAIContent('test')}
          disabled={loading === 'test'}
          className="h-20 flex-col gap-2"
          variant="outline"
        >
          <TestTube className="w-6 h-6" />
          {loading === 'test' ? 'Generating...' : 'Generate Tests'}
        </Button>
        
        <Button 
          onClick={() => generateAIContent('business_logic')}
          disabled={loading === 'business_logic'}
          className="h-20 flex-col gap-2"
          variant="outline"
        >
          <Brain className="w-6 h-6" />
          {loading === 'business_logic' ? 'Generating...' : 'Explain Business Logic'}
        </Button>
      </div>

      {/* AI Generated Proposals */}
      {proposals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Generated Content</h3>
          
          {['documentation', 'test', 'business_logic'].map(type => {
            const typeProposals = getProposalsByType(type);
            if (typeProposals.length === 0) return null;
            
            return (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {type.replace('_', ' ')} Proposals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {typeProposals.map(proposal => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={
                          proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                          proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {proposal.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProposal(proposal.id, 'approved')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateProposal(proposal.id, 'rejected')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                        {proposal.ai_generated_content}
                      </pre>
                      
                      <div className="mt-3">
                        <Textarea
                          placeholder="Add your modifications or comments..."
                          value={userContent[proposal.id] || ''}
                          onChange={(e) => setUserContent(prev => ({
                            ...prev,
                            [proposal.id]: e.target.value
                          }))}
                          className="mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={() => updateProposal(proposal.id, 'modified', userContent[proposal.id])}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Save Modifications
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Questions */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Development Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map(qa => (
              <div key={qa.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{qa.question_type}</Badge>
                </div>
                <h4 className="font-semibold mb-2">{qa.question}</h4>
                
                {qa.answer ? (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800">{qa.answer}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Provide your answer..."
                      value={answerInput[qa.id] || ''}
                      onChange={(e) => setAnswerInput(prev => ({
                        ...prev,
                        [qa.id]: e.target.value
                      }))}
                    />
                    <Button
                      size="sm"
                      onClick={() => submitAnswer(qa.id)}
                      disabled={!answerInput[qa.id]?.trim()}
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FunctionDetail;
