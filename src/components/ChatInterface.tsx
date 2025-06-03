
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Plus, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  repositoryId: string;
  initialQuestion?: string;
  onQuestionCreate: (question: string, answer: string, questionType: string, viewMode: string) => void;
}

const ChatInterface = ({ repositoryId, initialQuestion = '', onQuestionCreate }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showCreateQA, setShowCreateQA] = useState(false);
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [qaType, setQaType] = useState('technical');
  const [qaMode, setQaMode] = useState('dev');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion) {
      setInputMessage(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const createConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        repository_id: repositoryId,
        conversation_type: 'general',
        title: 'Chat Session'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }

    return data.id;
  };

  const fetchContextualData = async () => {
    // Fetch existing Q&A data to provide context to the AI
    const { data: qaData } = await supabase
      .from('function_qa')
      .select('question, answer, function_name, question_type')
      .eq('repository_id', repositoryId)
      .not('answer', 'is', null)
      .limit(10);

    // Fetch function analyses for technical context
    const { data: functionsData } = await supabase
      .from('function_analyses')
      .select('function_name, description, file_path')
      .eq('repository_id', repositoryId)
      .limit(5);

    return {
      existingQA: qaData || [],
      functions: functionsData || []
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    setLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    try {
      // Create conversation if it doesn't exist
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await createConversation();
        setConversationId(currentConversationId);
      }

      // Add user message to UI
      const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newUserMessage]);

      // Fetch contextual data
      const context = await fetchContextualData();

      // Save user message to database
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: currentConversationId,
          role: 'user',
          content: userMessage
        });

      // Call the chat AI function with context
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: userMessage,
          conversationId: currentConversationId,
          repositoryId,
          context: {
            existingQA: context.existingQA,
            functions: context.functions,
            type: 'code-explanation'
          }
        }
      });

      if (error) throw error;

      // Add AI response to UI
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save AI response to database
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: currentConversationId,
          role: 'assistant',
          content: data.response
        });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQA = async () => {
    if (!qaQuestion.trim() || !qaAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide both question and answer",
        variant: "destructive"
      });
      return;
    }

    try {
      await onQuestionCreate(qaQuestion, qaAnswer, qaType, qaMode);
      setQaQuestion('');
      setQaAnswer('');
      setShowCreateQA(false);
      toast({
        title: "Success",
        description: "Q&A created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Q&A",
        variant: "destructive"
      });
    }
  };

  const populateFromLastExchange = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      const lastAiMessage = messages[messages.length - 1];
      
      if (lastUserMessage.role === 'user' && lastAiMessage.role === 'assistant') {
        setQaQuestion(lastUserMessage.content);
        setQaAnswer(lastAiMessage.content);
        setShowCreateQA(true);
      }
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={populateFromLastExchange}
              disabled={messages.length < 2}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Q&A
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Ask me anything about the codebase!</p>
                <p className="text-sm">I have access to existing Q&As and function analyses.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about the code..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {showCreateQA && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Create Q&A from Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Question"
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
              />
              <Textarea
                placeholder="Answer (Markdown supported)"
                value={qaAnswer}
                onChange={(e) => setQaAnswer(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <select
                  value={qaType}
                  onChange={(e) => setQaType(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="technical">Technical</option>
                  <option value="architecture">Architecture</option>
                  <option value="business">Business</option>
                </select>
                <select
                  value={qaMode}
                  onChange={(e) => setQaMode(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="dev">Developer</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateQA}>Create Q&A</Button>
                <Button size="sm" variant="outline" onClick={() => setShowCreateQA(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
