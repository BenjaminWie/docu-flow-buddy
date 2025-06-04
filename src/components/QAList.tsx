
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import QAItem from "./QAItem";

interface QAData {
  id: string;
  question: string;
  answer: string | null;
  ai_response_style: 'business' | 'developer';
  function_name?: string;
  created_at: string;
  tags?: string[];
}

interface QAListProps {
  viewMode: 'dev' | 'business';
  qaData: QAData[];
  repositoryId: string;
  onAnswerUpdate: () => void;
  onChatStart: (question: string, answer?: string) => void;
}

const QAList = ({ viewMode, qaData, repositoryId, onAnswerUpdate, onChatStart }: QAListProps) => {
  // Filter and transform data to match QAItem expected format
  const transformedData = qaData
    .filter(qa => qa.answer) // Only show items with answers
    .map(qa => ({
      id: qa.id,
      question: qa.question,
      answer: qa.answer!,
      ai_response_style: qa.ai_response_style,
      function_name: qa.function_name,
      created_at: qa.created_at,
      tags: qa.tags
    }));

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {viewMode === 'dev' ? 'Developer' : 'Business'} Questions & Answers
        </h3>
        <Badge variant="outline">
          {transformedData.length} {transformedData.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {transformedData.length === 0 ? (
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
          {transformedData.map((qa) => (
            <QAItem
              key={qa.id}
              qa={qa}
              repositoryId={repositoryId}
              onUpdate={onAnswerUpdate}
              onChatStart={onChatStart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QAList;
