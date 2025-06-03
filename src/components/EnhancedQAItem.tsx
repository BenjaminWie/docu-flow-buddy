
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare, Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

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

interface EnhancedQAItemProps {
  qa: QAData;
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const EnhancedQAItem = ({ qa, onAnswerUpdate, onChatStart }: EnhancedQAItemProps) => {
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showAnalogy, setShowAnalogy] = useState(false);

  const handleRating = async (rating: 'up' | 'down') => {
    const ratingValue = rating === 'up' ? 1 : -1;
    
    try {
      const { error } = await supabase
        .from('qa_ratings')
        .insert({
          qa_id: qa.id,
          rating: ratingValue,
          user_session: 'anonymous', // In real app, use actual user session
          rating_category: 'overall',
          feedback_text: feedbackText || null
        });

      if (error) throw error;

      setUserRating(rating);
      setShowFeedback(false);
      setFeedbackText('');
      
      toast({
        title: "Thank you!",
        description: "Your feedback helps improve the knowledge base.",
      });
      
      onAnswerUpdate();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive"
      });
    }
  };

  const isMarkdown = qa.content_format === 'markdown';
  const hasAnalogy = qa.analogy_content && qa.view_mode === 'business';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{qa.question}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{qa.function_name}</Badge>
                <Badge variant={qa.question_type === 'business' ? 'default' : 'secondary'}>
                  {qa.question_type}
                </Badge>
                {qa.rating_score !== null && qa.rating_score > 0 && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{qa.rating_score}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business analogy toggle */}
          {hasAnalogy && (
            <div className="flex gap-2">
              <Button
                variant={!showAnalogy ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAnalogy(false)}
              >
                Technical
              </Button>
              <Button
                variant={showAnalogy ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAnalogy(true)}
              >
                Analogy
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {qa.answer && (
              <div className="bg-gray-50 rounded-lg p-4">
                {showAnalogy && qa.analogy_content ? (
                  <MarkdownRenderer 
                    content={qa.analogy_content}
                    externalLinks={qa.external_links}
                  />
                ) : isMarkdown ? (
                  <MarkdownRenderer 
                    content={qa.answer}
                    externalLinks={qa.external_links}
                  />
                ) : (
                  <div>
                    <p className="text-gray-700 whitespace-pre-wrap">{qa.answer}</p>
                    {qa.external_links && qa.external_links.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Related Links:</h4>
                        <div className="space-y-1">
                          {qa.external_links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRating('up')}
                className={userRating === 'up' ? 'text-green-600' : ''}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFeedback(!showFeedback)}
                className={userRating === 'down' ? 'text-red-600' : ''}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                Not Helpful
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChatStart(qa.question)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Discuss
            </Button>
          </div>

          {/* Feedback Form */}
          {showFeedback && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <Textarea
                placeholder="Help us improve this answer (optional)..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleRating('down')}>
                  Submit Feedback
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowFeedback(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQAItem;
