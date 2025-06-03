
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, MessageSquare } from "lucide-react";

interface QAItemHeaderProps {
  qa: {
    question: string;
    question_type: string;
    view_mode: string | null;
    function_name: string;
    rating_score: number | null;
  };
  userRating: number | null;
  onRating: (rating: number) => void;
  onChatStart: (question: string) => void;
}

const getQuestionTypeColor = (type: string) => {
  switch (type) {
    case 'setup': return 'bg-blue-100 text-blue-800';
    case 'development': return 'bg-purple-100 text-purple-800';
    case 'business': return 'bg-green-100 text-green-800';
    case 'benefits': return 'bg-emerald-100 text-emerald-800';
    case 'architecture': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const QAItemHeader = ({ qa, userRating, onRating, onChatStart }: QAItemHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={getQuestionTypeColor(qa.question_type)}>
            {qa.question_type}
          </Badge>
          <Badge variant="secondary">{qa.view_mode || 'dev'}</Badge>
          {qa.function_name && (
            <Badge variant="outline" className="text-xs">
              {qa.function_name}
            </Badge>
          )}
        </div>
        <h4 className="font-semibold text-lg mb-2">{qa.question}</h4>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRating(1)}
            className={userRating === 1 ? 'text-green-600' : ''}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">{qa.rating_score || 0}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRating(-1)}
            className={userRating === -1 ? 'text-red-600' : ''}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChatStart(qa.question)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default QAItemHeader;
