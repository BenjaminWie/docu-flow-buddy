
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import QAItem from "./QAItem";

interface QAData {
  id: string;
  question: string;
  answer: string | null;
  question_type: string;
  rating_score: number | null;
  view_mode: string | null;
  function_name: string;
}

interface QAListProps {
  viewMode: 'dev' | 'business';
  qaData: QAData[];
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const QAList = ({ viewMode, qaData, onAnswerUpdate, onChatStart }: QAListProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {viewMode === 'dev' ? 'Developer' : 'Business'} Questions & Answers
        </h3>
        <Badge variant="outline">
          {qaData.length} {qaData.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {qaData.length === 0 ? (
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
          {qaData.map((qa) => (
            <QAItem
              key={qa.id}
              qa={qa}
              onAnswerUpdate={onAnswerUpdate}
              onChatStart={onChatStart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QAList;
