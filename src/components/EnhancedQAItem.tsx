
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QAItemHeader from "./QAItemHeader";
import QAItemAnswer from "./QAItemAnswer";
import QAItemEditor from "./QAItemEditor";
import QAItemAnalogy from "./QAItemAnalogy";

interface QAItemProps {
  qa: {
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
  };
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const EnhancedQAItem = ({ qa, onAnswerUpdate, onChatStart }: QAItemProps) => {
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
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <QAItemHeader 
            qa={qa}
            userRating={userRating}
            onRating={handleRating}
            onChatStart={onChatStart}
          />

          {qa.answer && !isEditing ? (
            <div>
              <QAItemAnswer 
                qa={qa}
                onEdit={() => setIsEditing(true)}
              />
              
              {/* Business Analogy */}
              {qa.analogy_content && (
                <QAItemAnalogy analogyContent={qa.analogy_content} />
              )}
            </div>
          ) : (
            <QAItemEditor
              answerText={answerText}
              onAnswerTextChange={setAnswerText}
              onSave={handleSaveAnswer}
              onCancel={() => setIsEditing(false)}
              hasExistingAnswer={!!qa.answer}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQAItem;
