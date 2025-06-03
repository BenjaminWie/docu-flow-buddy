import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Plus, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DevBusinessToggle from "./DevBusinessToggle";
import EnhancedQAItem from "./EnhancedQAItem";
import EnhancedChatInterface from "./EnhancedChatInterface";

interface QAData {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
  rating_score: number | null;
  view_mode: string | null;
  function_name: string;
  content_format?: string;
  external_links?: Array<{ title: string; url: string }>;
  analogy_content?: string;
}

interface ArchitectureDoc {
  id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
  content_format?: string;
  external_links?: Array<{ title: string; url: string }>;
}

interface BusinessExplanation {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
  analogy_content?: string;
  content_format?: string;
  external_links?: Array<{ title: string; url: string }>;
}

interface ExplainCodeTabProps {
  repositoryId: string;
  functionAnalyses: any[];
}

const ExplainCodeTab = ({ repositoryId, functionAnalyses }: ExplainCodeTabProps) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'dev' | 'business'>('business');
  const [searchTerm, setSearchTerm] = useState('');
  const [qaData, setQaData] = useState<QAData[]>([]);
  const [architectureDocs, setArchitectureDocs] = useState<ArchitectureDoc[]>([]);
  const [businessExplanations, setBusinessExplanations] = useState<BusinessExplanation[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
        view_mode: mode,
        content_format: 'markdown',
        external_links: []
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
    ? businessExplanations
        .filter(exp => selectedCategory === 'all' || exp.category === selectedCategory)
        .map(exp => ({
          id: `business-${exp.id}`,
          question: exp.question || exp.category,
          answer: exp.answer,
          question_type: 'business',
          rating_score: 0,
          view_mode: 'business',
          function_name: 'Business Logic',
          content_format: exp.content_format || 'markdown',
          external_links: exp.external_links || [],
          analogy_content: exp.analogy_content
        }))
    : architectureDocs.map(doc => ({
        id: `arch-${doc.id}`,
        question: doc.title,
        answer: doc.content,
        question_type: 'architecture',
        rating_score: 0,
        view_mode: 'dev',
        function_name: 'Architecture',
        content_format: doc.content_format || 'markdown',
        external_links: doc.external_links || []
      }));

  const allQAData = [...filteredQA, ...convertedDocs];

  // Get unique categories for business mode
  const categories = ['all', ...new Set(businessExplanations.map(exp => exp.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            OpenRewrite Knowledge Base
          </CardTitle>
          <p className="text-gray-600">
            Comprehensive documentation and Q&A for the OpenRewrite automated refactoring ecosystem.
            Switch between technical documentation and business-friendly analogies.
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
              {viewMode === 'business' && (
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                  {viewMode === 'dev' ? 'Developer' : 'Business'} Knowledge
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
                      <p>No content available yet.</p>
                      <p className="text-sm">Start a chat to create your first Q&A.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {allQAData.map((qa) => (
                    <EnhancedQAItem
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
                <EnhancedChatInterface
                  repositoryId={repositoryId}
                  initialQuestion={chatQuestion}
                  onQuestionCreate={handleCreateQA}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">Ask the OpenRewrite AI assistant about:</p>
                      <ul className="text-sm text-left space-y-1 mb-6">
                        <li>• How to set up your development environment</li>
                        <li>• Creating custom recipes</li>
                        <li>• Understanding the architecture</li>
                        <li>• Business benefits and ROI</li>
                        <li>• Safety and best practices</li>
                      </ul>
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
