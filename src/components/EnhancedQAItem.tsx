
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp, ChevronDown, MessageSquare, Edit, ExternalLink, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

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
  const [showAnalogy, setShowAnalogy] = useState(false);

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

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
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
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {qa.content_format === 'markdown' ? (
                    <MarkdownRenderer content={qa.answer} />
                  ) : (
                    <p className="text-green-800">{qa.answer}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              
              {/* External Links */}
              {qa.external_links && qa.external_links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-green-300">
                  <h5 className="text-sm font-medium text-green-900 mb-2">Related Resources:</h5>
                  <div className="flex flex-wrap gap-2">
                    {qa.external_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-white text-green-700 px-2 py-1 rounded border border-green-300 hover:bg-green-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Analogy */}
              {qa.analogy_content && (
                <div className="mt-3 pt-3 border-t border-green-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnalogy(!showAnalogy)}
                    className="text-green-700 hover:text-green-900 p-0 h-auto"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {showAnalogy ? 'Hide' : 'Show'} Business Analogy
                  </Button>
                  {showAnalogy && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 text-sm italic">{qa.analogy_content}</p>
                    </div>
                  )}
                </div>
              )}
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

export default EnhancedQAItem;
