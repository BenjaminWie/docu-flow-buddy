
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import ChatInterface from "./ChatInterface";

interface ChatSectionProps {
  showChat: boolean;
  repositoryId: string;
  chatQuestion: string;
  onStartChat: () => void;
  onQuestionCreate: (question: string, answer: string, questionType: string, viewMode: string) => void;
}

const ChatSection = ({ 
  showChat, 
  repositoryId, 
  chatQuestion, 
  onStartChat, 
  onQuestionCreate 
}: ChatSectionProps) => {
  return (
    <div className="lg:col-span-1">
      {showChat ? (
        <ChatInterface
          repositoryId={repositoryId}
          initialQuestion={chatQuestion}
          onQuestionCreate={onQuestionCreate}
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Start a conversation to get help understanding the code</p>
              <Button onClick={onStartChat}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatSection;
