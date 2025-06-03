
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Plus, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DevBusinessToggle from "./DevBusinessToggle";
import QAItem from "./QAItem";
import ChatInterface from "./ChatInterface";

interface QAData {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
  rating_score: number | null;
  view_mode: string | null;
  function_name: string;
}

interface ArchitectureDoc {
  id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
}

interface BusinessExplanation {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
}

interface ExplainCodeTabProps {
  repositoryId: string;
  functionAnalyses: any[];
}

const ExplainCodeTab = ({ repositoryId, functionAnalyses }: ExplainCodeTabProps) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'dev' | 'business'>('dev');
  const [searchTerm, setSearchTerm] = useState('');
  const [qaData, setQaData] = useState<QAData[]>([]);
  const [architectureDocs, setArchitectureDocs] = useState<ArchitectureDoc[]>([]);
  const [businessExplanations, setBusinessExplanations] = useState<BusinessExplanation[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');

  useEffect(() => {
    fetchQAData();
    fetchArchitectureDocs();
    fetchBusinessExplanations();
  }, [repositoryId]);

  const fetchQAData = async () => {
    const { data, error } = await supabase
      .from('function_qa')
      .select('*')
      .eq('repository_id', repositoryId)
      .order('rating_score', { ascending: false });

    if (error) {
      console.error('Error fetching Q&A data:', error);
    } else {
      setQaData(data || []);
    }
  };

  const fetchArchitectureDocs = async () => {
    const { data, error } = await supabase
      .from('architecture_docs')
      .select('*')
      .eq('repository_id', repositoryId)
      .order('order_index');

    if (error) {
      console.error('Error fetching architecture docs:', error);
    } else {
      setArchitectureDocs(data || []);
    }
  };

  const fetchBusinessExplanations = async () => {
    const { data, error } = await supabase
      .from('business_explanations')
      .select('*')
      .eq('repository_id', repositoryId)
      .order('order_index');

    if (error) {
      console.error('Error fetching business explanations:', error);
    } else {
      setBusinessExplanations(data || []);
    }
  };

  const handleCreateQA = async (question: string, answer: string, questionType: string, mode: string) => {
    const { error } = await supabase
      .from('function_qa')
      .insert({
        repository_id: repositoryId,
        function_id: 'general',
        function_name: 'General',
        question,
        answer,
        question_type: questionType,
        view_mode: mode
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create Q&A",
        variant: "destructive"
      });
    } else {
      fetchQAData();
      toast({
        title: "Success",
        description: "Q&A created successfully",
      });
    }
  };

  const handleChatStart = (question: string) => {
    setChatQuestion(question);
    setShowChat(true);
  };

  const filteredQA = qaData.filter(qa => {
    const matchesSearch = qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qa.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qa.function_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = viewMode === 'dev' ? qa.view_mode !== 'business' : qa.view_mode === 'business';
    return matchesSearch && matchesMode;
  });

  // Convert architecture docs and business explanations to Q&A format for unified display
  const convertedDocs = viewMode === 'business' 
    ? businessExplanations.map(exp => ({
        id: `business-${exp.id}`,
        question: exp.question || exp.category,
        answer: exp.answer,
        question_type: 'business',
        rating_score: 0,
        view_mode: 'business',
        function_name: 'Business Logic'
      }))
    : architectureDocs.map(doc => ({
        id: `arch-${doc.id}`,
        question: doc.title,
        answer: doc.content,
        question_type: 'architecture',
        rating_score: 0,
        view_mode: 'dev',
        function_name: 'Architecture'
      }));

  const allQAData = [...filteredQA, ...convertedDocs];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Explain Me The Code
          </CardTitle>
          <p className="text-gray-600">
            StackOverflow-like experience for understanding your codebase. Ask questions, get answers, and build knowledge.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1">
              <DevBusinessToggle mode={viewMode} onModeChange={setViewMode} />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={() => setShowChat(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Q&A List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {viewMode === 'dev' ? 'Developer' : 'Business'} Questions & Answers
                </h3>
                <Badge variant="outline">
                  {allQAData.length} {allQAData.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>

              {allQAData.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No questions available yet.</p>
                      <p className="text-sm">Start a chat to create your first Q&A.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allQAData.map((qa) => (
                    <QAItem
                      key={qa.id}
                      qa={qa}
                      onAnswerUpdate={fetchQAData}
                      onChatStart={handleChatStart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-1">
              {showChat ? (
                <ChatInterface
                  repositoryId={repositoryId}
                  initialQuestion={chatQuestion}
                  onQuestionCreate={handleCreateQA}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">Start a conversation to get help understanding the code</p>
                      <Button onClick={() => setShowChat(true)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainCodeTab;
