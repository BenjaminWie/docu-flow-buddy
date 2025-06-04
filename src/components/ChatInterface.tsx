
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Code, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";
import DevBusinessToggle from "./DevBusinessToggle";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  responseStyle?: string;
}

interface ChatInterfaceProps {
  repositoryId: string;
  initialQuestion?: string;
  initialAnswer?: string;
  onQuestionCreate: (question: string, answer: string, questionType: string, viewMode: string) => void;
}

const ChatInterface = ({ repositoryId, initialQuestion, initialAnswer, onQuestionCreate }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dev' | 'business'>('dev');

  useEffect(() => {
    if (initialQuestion && initialAnswer) {
      setMessages([
        { role: 'user', content: initialQuestion },
        { role: 'assistant', content: initialAnswer }
      ]);
    }
  }, [initialQuestion, initialAnswer]);

  useEffect(() => {
    createConversation();
  }, [repositoryId]);

  const createConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        repository_id: repositoryId,
        conversation_type: 'explain_code'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
    } else {
      setConversationId(data.id);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !conversationId) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Choose the appropriate edge function based on mode
      const functionName = viewMode === 'business' ? 'chat-with-ai-business' : 'chat-with-ai-developer';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          message: userMessage,
          conversationId,
          repositoryId
        }
      });

      if (error) throw error;

      const aiResponse = data.response;
      const responseStyle = data.responseStyle || viewMode;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        responseStyle 
      }]);

      // Show success metrics based on mode
      if (viewMode === 'business' && data.businessMetrics) {
        toast({
          title: "Business Insights Generated",
          description: `${data.businessMetrics.actionableInsights} actionable insights provided`,
        });
      } else if (viewMode === 'dev' && data.technicalMetrics) {
        toast({
          title: "Technical Analysis Complete",
          description: `Implementation guidance with ${data.technicalMetrics.codeExamples}`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateWithMode = async (messageIndex: number, newMode: 'dev' | 'business') => {
    if (messageIndex <= 0 || !conversationId) return;

    const userMessage = messages[messageIndex - 1].content;
    setIsLoading(true);

    try {
      const functionName = newMode === 'business' ? 'chat-with-ai-business' : 'chat-with-ai-developer';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          message: userMessage,
          conversationId,
          repositoryId
        }
      });

      if (error) throw error;

      const newResponse = {
        role: 'assistant' as const,
        content: data.response,
        responseStyle: newMode
      };

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[messageIndex] = newResponse;
        return newMessages;
      });

      toast({
        title: `Regenerated for ${newMode === 'business' ? 'Business' : 'Developer'}`,
        description: "Response updated with new perspective",
      });

    } catch (error) {
      console.error('Error regenerating message:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAsQA = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = messages[messages.length - 2]?.content;
    const lastAssistantMessage = messages[messages.length - 1]?.content;
    const responseStyle = messages[messages.length - 1]?.responseStyle || viewMode;

    if (lastUserMessage && lastAssistantMessage) {
      onQuestionCreate(
        lastUserMessage, 
        lastAssistantMessage, 
        responseStyle === 'business' ? 'business' : 'technical',
        responseStyle === 'business' ? 'business' : 'dev'
      );
      
      toast({
        title: "Success",
        description: "Q&A saved successfully",
      });
    }
  };

  const getModeIcon = (responseStyle?: string) => {
    if (responseStyle === 'business') return <Users className="w-4 h-4 text-green-600" />;
    if (responseStyle === 'developer') return <Code className="w-4 h-4 text-blue-600" />;
    return <Bot className="w-4 h-4" />;
  };

  const getModeIndicator = (responseStyle?: string) => {
    if (responseStyle === 'business') return (
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
        Business Insights
      </span>
    );
    if (responseStyle === 'developer') return (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
        Technical Implementation
      </span>
    );
    return null;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="flex flex-col h-full pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <DevBusinessToggle mode={viewMode} onModeChange={setViewMode} />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">
                {viewMode === 'business' 
                  ? "Ask me about business impact and strategic implications"
                  : "Ask me about implementation details and technical guidance"
                }
              </p>
              <p className="text-sm">
                {viewMode === 'business'
                  ? "I'll help you understand ROI, timelines, and business decisions"
                  : "I'll provide code examples, architecture insights, and best practices"
                }
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="flex items-start gap-2">
                  {getModeIcon(message.responseStyle)}
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2">
                    {getModeIndicator(message.responseStyle)}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => regenerateWithMode(index, 'business')}
                        className="h-6 px-2 text-xs"
                        disabled={isLoading}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Business
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => regenerateWithMode(index, 'dev')}
                        className="h-6 px-2 text-xs"
                        disabled={isLoading}
                      >
                        <Code className="w-3 h-3 mr-1" />
                        Dev
                      </Button>
                    </div>
                  </div>
                )}
                
                {message.role === 'assistant' ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  message.content
                )}
              </div>
              
              {message.role === 'user' && (
                <User className="w-6 h-6 text-blue-600 mt-1" />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-6 h-6 text-gray-400 mt-1" />
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {messages.length >= 2 && (
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={saveAsQA}
                className="text-xs"
              >
                Save as Q&A
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={viewMode === 'business' 
                ? "Ask about business impact, ROI, or strategic decisions..."
                : "Ask about implementation, architecture, or technical details..."
              }
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
