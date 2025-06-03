
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Bot, User, Save, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  sources?: Array<{ title: string; url: string; snippet: string }>;
}

interface ChatConversation {
  id: string;
  title: string | null;
  created_at: string;
}

interface EnhancedChatInterfaceProps {
  repositoryId: string;
  functionId?: string;
  initialQuestion?: string;
  onQuestionCreate: (question: string, answer: string, questionType: string, viewMode: string) => void;
}

const EnhancedChatInterface = ({ repositoryId, functionId, initialQuestion, onQuestionCreate }: EnhancedChatInterfaceProps) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [repositoryId]);

  useEffect(() => {
    if (initialQuestion && !activeConversation) {
      startNewConversation(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('id, title, created_at')
      .eq('repository_id', repositoryId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setConversations(data || []);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at
      }));
      setMessages(typedMessages);
    }
  };

  const startNewConversation = async (firstMessage?: string) => {
    const message = firstMessage || inputMessage;
    if (!message.trim()) return;

    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .insert({
        repository_id: repositoryId,
        function_id: functionId,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        conversation_type: functionId ? 'function_specific' : 'general'
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
      return;
    }

    setActiveConversation(conversation.id);
    await sendMessage(conversation.id, message);
    fetchConversations();
    if (!firstMessage) setInputMessage('');
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);

    // Add user message
    const { error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content
      });

    if (userMsgError) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Get AI response with web search
    try {
      const { data, error } = await supabase.functions.invoke(
        webSearchEnabled ? 'web-search-ai' : 'chat-with-ai',
        {
          body: {
            message: content,
            conversationId,
            repositoryId,
            functionId
          }
        }
      );

      if (error) throw error;

      // Add AI response
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: data.response
        });

      fetchMessages(conversationId);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation) {
      await startNewConversation();
    } else {
      await sendMessage(activeConversation, inputMessage);
      setInputMessage('');
    }
  };

  const saveConversationAsQA = async () => {
    if (messages.length < 2) {
      toast({
        title: "Error",
        description: "Need at least one question and answer to save as Q&A",
        variant: "destructive"
      });
      return;
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');

    if (!lastUserMessage || !lastAssistantMessage) {
      toast({
        title: "Error",
        description: "Need both question and answer to create Q&A",
        variant: "destructive"
      });
      return;
    }

    // Use LLM to create a refined Q&A from the conversation
    try {
      const { data, error } = await supabase.functions.invoke('generate-qa-from-chat', {
        body: {
          messages: messages.slice(-4), // Last 4 messages for context
          repositoryId,
          functionId
        }
      });

      if (error) throw error;

      onQuestionCreate(
        data.question,
        data.answer,
        data.questionType || 'general',
        data.viewMode || 'dev'
      );

      toast({
        title: "Success",
        description: "Q&A created and saved to knowledge base",
      });
    } catch (error) {
      console.error('Error generating Q&A:', error);
      // Fallback to simple creation
      onQuestionCreate(
        lastUserMessage.content,
        lastAssistantMessage.content,
        'general',
        'dev'
      );

      toast({
        title: "Success",
        description: "Q&A created from chat conversation",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Conversation List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat Conversations</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={webSearchEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              >
                <Globe className="w-4 h-4 mr-2" />
                Web Search
              </Button>
              <Button size="sm" onClick={() => startNewConversation()}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-2 rounded cursor-pointer text-sm ${
                  activeConversation === conv.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveConversation(conv.id);
                  fetchMessages(conv.id);
                }}
              >
                {conv.title || 'Untitled Conversation'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">OpenRewrite Assistant</CardTitle>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={saveConversationAsQA}>
                <Save className="w-4 h-4 mr-2" />
                Save as Q&A
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.role === 'assistant' ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Sources:</p>
                        {message.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-blue-600 hover:underline mb-1"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about OpenRewrite architecture, recipes, setup, or anything else..."
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedChatInterface;
