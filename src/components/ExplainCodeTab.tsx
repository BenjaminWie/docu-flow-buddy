
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ExplainCodeHeader from "./ExplainCodeHeader";
import ExplainCodeControls from "./ExplainCodeControls";
import QAList from "./QAList";
import ChatSection from "./ChatSection";

interface QAData {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
  view_mode: string | null;
  function_name: string;
  tags?: string[];
  is_approved?: boolean;
  approved_by?: string;
  approved_at?: string;
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
  const [chatAnswer, setChatAnswer] = useState('');

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
      .order('created_at', { ascending: false });

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
        tags: ['new', 'chat-generated'],
        is_approved: false
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

  const handleChatStart = (question: string, answer?: string) => {
    setChatQuestion(question);
    setChatAnswer(answer || '');
    setShowChat(true);
  };

  const filteredQA = qaData.filter(qa => {
    const matchesSearch = qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qa.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qa.function_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qa.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMode = viewMode === 'business' ? 
      (qa.view_mode === 'business' || qa.question_type === 'business') :
      (qa.view_mode !== 'business' && qa.question_type !== 'business');
    
    return matchesSearch && matchesMode;
  });

  // Convert docs to Q&A format for unified display
  const convertedDocs: QAData[] = viewMode === 'business' 
    ? businessExplanations.map(exp => ({
        id: `business-${exp.id}`,
        question: exp.question || exp.category,
        answer: exp.answer,
        question_type: 'business',
        view_mode: 'business',
        function_name: 'Business Logic',
        tags: ['business', 'documentation'],
        is_approved: true
      }))
    : architectureDocs.map(doc => ({
        id: `arch-${doc.id}`,
        question: doc.title,
        answer: doc.content,
        question_type: 'architecture',
        view_mode: 'dev',
        function_name: 'Architecture',
        tags: ['architecture', 'documentation'],
        is_approved: true
      }));

  const allQAData = [...filteredQA, ...convertedDocs];

  return (
    <div className="space-y-6">
      <ExplainCodeHeader repositoryId={repositoryId} />
      
      <div className="space-y-6">
        <ExplainCodeControls
          viewMode={viewMode}
          onModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onStartChat={() => setShowChat(true)}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <QAList
            viewMode={viewMode}
            qaData={allQAData}
            onAnswerUpdate={fetchQAData}
            onChatStart={handleChatStart}
          />

          <ChatSection
            showChat={showChat}
            repositoryId={repositoryId}
            chatQuestion={chatQuestion}
            chatAnswer={chatAnswer}
            onStartChat={() => setShowChat(true)}
            onQuestionCreate={handleCreateQA}
          />
        </div>
      </div>
    </div>
  );
};

export default ExplainCodeTab;
