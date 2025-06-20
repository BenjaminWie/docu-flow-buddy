
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, RefreshCw, User, Bot, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

interface QAItemProps {
  qa: {
    id: string;
    question: string;
    answer: string;
    ai_response_style: 'business' | 'developer';
    function_name?: string;
    created_at: string;
    tags?: string[];
  };
  repositoryId: string;
  onUpdate?: () => void;
  onChatStart?: (question: string, answer?: string) => void;
}

const QAItem = ({ qa, repositoryId, onUpdate, onChatStart }: QAItemProps) => {
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const regenerateAnswer = async () => {
    setIsRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: qa.question,
          repositoryId,
          viewMode: qa.ai_response_style,
          regenerationSource: 'qa_item',
        }
      });

      if (error) throw error;

      // Update the Q&A item with the new answer
      const { error: updateError } = await supabase
        .from('function_qa')
        .update({
          answer: data.answer,
          ai_response_style: qa.ai_response_style
        })
        .eq('id', qa.id);

      if (updateError) throw updateError;

      toast({
        title: "Answer regenerated",
        description: "The answer has been updated with a fresh AI response.",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error regenerating answer:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAddToChat = () => {
    if (onChatStart) {
      onChatStart(qa.question, qa.answer);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Question</span>
              {qa.function_name && (
                <Badge variant="outline" className="text-xs">
                  {qa.function_name}
                </Badge>
              )}
              {qa.tags && qa.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {qa.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-900 mb-4 break-words">{qa.question}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 mt-4 pt-4 border-t">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">AI Answer</span>
                <Badge 
                  variant={qa.ai_response_style === 'business' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {qa.ai_response_style === 'business' ? 'Business' : 'Developer'}
                </Badge>
              </div>
              <div className="flex gap-1">
                {onChatStart && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddToChat}
                    className="text-gray-500 hover:text-gray-700"
                    title="Add to chat"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={regenerateAnswer}
                  disabled={isRegenerating}
                  className="text-gray-500 hover:text-gray-700"
                  title="Regenerate answer"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="overflow-hidden break-words">
              <MarkdownRenderer content={qa.answer} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QAItem;
