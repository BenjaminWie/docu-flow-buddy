
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, Plus, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EnhancedQAItem from "./EnhancedQAItem";
import EnhancedChatInterface from "./EnhancedChatInterface";

interface QA {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
  rating_score: number | null;
  view_mode: string | null;
  function_name: string;
  content_format?: string;
  external_links?: Array<{
    title: string;
    url: string;
  }>;
  analogy_content?: string;
}

interface ExplainCodeTabProps {
  repositoryId: string;
  functionId: string;
  functionName: string;
  viewMode: 'dev' | 'business';
}

const ExplainCodeTab = ({ repositoryId, functionId, functionName, viewMode }: ExplainCodeTabProps) => {
  const { toast } = useToast();
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchQAs();
  }, [repositoryId, functionId, viewMode]);

  const fetchQAs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('function_qa')
        .select('*')
        .eq('repository_id', repositoryId)
        .eq('function_id', functionId)
        .eq('view_mode', viewMode)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQas(data || []);
    } catch (error) {
      console.error('Error fetching Q&As:', error);
      toast({
        title: "Error",
        description: "Failed to load questions and answers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const functionName = viewMode === 'dev' ? 'generate-dev-questions' : 'generate-business-questions';
      
      const { error } = await supabase.functions.invoke(functionName, {
        body: {
          repositoryId,
          functionId,
          functionName: functionName
        }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "New questions generated successfully",
      });
      
      fetchQAs();
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const createQuestion = async (question: string, answer: string, questionType: string, questionViewMode: string) => {
    try {
      const { error } = await supabase
        .from('function_qa')
        .insert({
          repository_id: repositoryId,
          function_id: functionId,
          function_name: functionName,
          question,
          answer,
          question_type: questionType,
          view_mode: questionViewMode
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question created successfully",
      });
      
      fetchQAs();
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            {viewMode === 'dev' ? 'Developer' : 'Business'} Questions
          </h3>
          <Badge variant="outline">{qas.length} questions</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {showChat ? 'Hide Chat' : 'Ask AI'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generateQuestions}
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Generate Questions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQAs}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedChatInterface
              repositoryId={repositoryId}
              functionId={functionId}
              onQuestionCreate={createQuestion}
            />
          </CardContent>
        </Card>
      )}

      {/* Q&A List */}
      <div className="space-y-4">
        {qas.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No questions yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Generate questions or ask the AI to get started
                </p>
                <Button onClick={generateQuestions} disabled={generating}>
                  {generating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Generate Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          qas.map((qa) => (
            <EnhancedQAItem
              key={qa.id}
              qa={qa}
              onAnswerUpdate={fetchQAs}
              onChatStart={(question) => {
                setShowChat(true);
                // You could also pass the initial question to the chat interface
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExplainCodeTab;
