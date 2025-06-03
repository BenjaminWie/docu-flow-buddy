
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, MessageSquare, Edit, X, Tag } from "lucide-react";
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
    tags?: string[];
  };
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const QAItem = ({ qa, onAnswerUpdate, onChatStart }: QAItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!qa.answer);
  const [answerText, setAnswerText] = useState(qa.answer || '');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [tags, setTags] = useState<string[]>(qa.tags || []);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');

  const PREDEFINED_TAGS = [
    'architecture', 'security', 'performance', 'business-logic', 
    'database', 'api', 'testing', 'documentation', 'deployment',
    'java', 'spring', 'react', 'typescript', 'aws', 'docker',
    'high-priority', 'medium-priority', 'low-priority', 'refactoring'
  ];

  useEffect(() => {
    checkUserRating();
    fetchCurrentScore();
  }, [qa.id]);

  const checkUserRating = async () => {
    const userSession = localStorage.getItem('userSession') || 
      (() => {
        const session = Math.random().toString(36).substring(7);
        localStorage.setItem('userSession', session);
        return session;
      })();

    const { data } = await supabase
      .from('qa_ratings')
      .select('rating')
      .eq('qa_id', qa.id)
      .eq('user_session', userSession)
      .single();

    if (data) {
      setUserRating(data.rating);
    }
  };

  const fetchCurrentScore = async () => {
    const { data } = await supabase
      .from('qa_ratings')
      .select('rating')
      .eq('qa_id', qa.id);

    if (data) {
      const upvotes = data.filter(r => r.rating === 1).length;
      const downvotes = data.filter(r => r.rating === -1).length;
      const totalVotes = upvotes + downvotes;
      
      // Calculate percentage score (0-100)
      let score = 50; // Default neutral score
      if (totalVotes > 0) {
        score = Math.round((upvotes / totalVotes) * 100);
      }
      
      setCurrentScore(score);
      setVoteCount(totalVotes);
      
      // Update the database with the calculated score
      await supabase
        .from('function_qa')
        .update({ rating_score: score })
        .eq('id', qa.id);
    }
  };

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

    // Remove existing rating if same rating is clicked
    if (userRating === rating) {
      const { error } = await supabase
        .from('qa_ratings')
        .delete()
        .eq('qa_id', qa.id)
        .eq('user_session', userSession);

      if (!error) {
        setUserRating(null);
        await fetchCurrentScore();
        toast({
          title: "Success",
          description: "Rating removed",
        });
      }
      return;
    }

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
      await fetchCurrentScore();
      onAnswerUpdate();
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;

    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);
    setNewTag('');

    const { error } = await supabase
      .from('function_qa')
      .update({ tags: updatedTags })
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive"
      });
      setTags(tags); // Revert on error
    } else {
      onAnswerUpdate();
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);

    const { error } = await supabase
      .from('function_qa')
      .update({ tags: updatedTags })
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive"
      });
      setTags(tags); // Revert on error
    } else {
      onAnswerUpdate();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
              
              {/* Tags Section */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    {isEditingTags && (
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    )}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTags(!isEditingTags)}
                  className="flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {isEditingTags ? 'Done' : 'Edit Tags'}
                </Button>
              </div>

              {isEditingTags && (
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add new tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="max-w-xs"
                  />
                  <Button size="sm" onClick={handleAddTag}>Add</Button>
                  <div className="flex gap-1 flex-wrap">
                    {PREDEFINED_TAGS.filter(tag => !tags.includes(tag)).slice(0, 5).map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewTag(tag);
                          handleAddTag();
                        }}
                        className="text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRating(1)}
                  className={userRating === 1 ? 'text-green-600 bg-green-50' : 'hover:text-green-600'}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <div className={`text-center px-2 py-1 rounded-md ${getScoreColor(currentScore)}`}>
                  <div className="text-sm font-bold">{currentScore}%</div>
                  <div className="text-xs">{voteCount} votes</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRating(-1)}
                  className={userRating === -1 ? 'text-red-600 bg-red-50' : 'hover:text-red-600'}
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
                <div className="flex-1">
                  <MarkdownRenderer content={qa.answer} />
                </div>
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
                placeholder="Provide your answer... (Markdown supported)"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={6}
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
