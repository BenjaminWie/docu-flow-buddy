
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp, ChevronDown, MessageSquare, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QAItemProps {
  qa: {
    id: string;
    question: string;
    answer: string | null;
    question_type: string;
    rating_score: number | null;
    view_mode: string | null;
  };
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const QAItem = ({ qa, onAnswerUpdate, onChatStart }: QAItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!qa.answer);
  const [answerText, setAnswerText] = useState(qa.answer || '');
  const [userRating, setUserRating] = useState<number | null>(null);

  const handleSaveAnswer = async () => {
    if (!answerText.trim()) return;

    const { error } = await supabase
      .from('function_qa')
      .update({ answer: answerText })
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive"
      });
    } else {
      setIsEditing(false);
      onAnswerUpdate();
      toast({
        title: "Success",
        description: "Answer saved successfully",
      });
    }
  };

  const handleRating = async (rating: number) => {
    const userSession = localStorage.getItem('userSession') || 
      (() => {
        const session = Math.random().toString(36).substring(7);
        localStorage.setItem('userSession', session);
        return session;
      })();

    const { error } = await supabase
      .from('qa_ratings')
      .upsert({
        qa_id: qa.id,
        user_session: userSession,
        rating
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    } else {
      setUserRating(rating);
      onAnswerUpdate();
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{qa.question_type}</Badge>
                <Badge variant="secondary">{qa.view_mode || 'dev'}</Badge>
              </div>
              <h4 className="font-semibold text-lg mb-2">{qa.question}</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRating(1)}
                  className={userRating === 1 ? 'text-green-600' : ''}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{qa.rating_score || 0}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRating(-1)}
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

          {qa.answer && !isEditing ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <p className="text-green-800 flex-1">{qa.answer}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder="Provide your answer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveAnswer} disabled={!answerText.trim()}>
                  Save Answer
                </Button>
                {qa.answer && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QAItem;
