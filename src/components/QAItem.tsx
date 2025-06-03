
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, MessageSquare, Edit, X, Tag, Check, Trash2, Save } from "lucide-react";
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
    is_approved?: boolean;
    approved_by?: string;
    approved_at?: string;
  };
  onAnswerUpdate: () => void;
  onChatStart: (question: string) => void;
}

const QAItem = ({ qa, onAnswerUpdate, onChatStart }: QAItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!qa.answer);
  const [answerText, setAnswerText] = useState(qa.answer || '');
  const [userVote, setUserVote] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState(qa.rating_score || 0);
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
    checkUserVote();
  }, [qa.id]);

  const checkUserVote = async () => {
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
      setUserVote(data.rating);
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

  const handleApproveAnswer = async () => {
    const isCurrentlyApproved = qa.is_approved;
    const updates = isCurrentlyApproved 
      ? { is_approved: false, approved_by: null, approved_at: null }
      : { is_approved: true, approved_by: 'Developer', approved_at: new Date().toISOString() };

    const { error } = await supabase
      .from('function_qa')
      .update(updates)
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update approval status",
        variant: "destructive"
      });
    } else {
      onAnswerUpdate();
      toast({
        title: "Success",
        description: isCurrentlyApproved ? "Answer unapproved" : "Answer approved by developer",
      });
    }
  };

  const handleDeleteAnswer = async () => {
    if (!confirm('Are you sure you want to delete this answer?')) return;

    const { error } = await supabase
      .from('function_qa')
      .update({ answer: null, is_approved: false, approved_by: null, approved_at: null })
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete answer",
        variant: "destructive"
      });
    } else {
      setAnswerText('');
      setIsEditing(true);
      onAnswerUpdate();
      toast({
        title: "Success",
        description: "Answer deleted successfully",
      });
    }
  };

  const handleVoting = async (voteType: 'up' | 'down') => {
    const userSession = localStorage.getItem('userSession') || 
      (() => {
        const session = Math.random().toString(36).substring(7);
        localStorage.setItem('userSession', session);
        return session;
      })();

    // Calculate new vote value
    let newVote = 0;
    if (voteType === 'up') {
      newVote = userVote === 1 ? 0 : 1; // Toggle if already voted up, otherwise vote up
    } else {
      newVote = userVote === -1 ? 0 : -1; // Toggle if already voted down, otherwise vote down
    }

    // Update the vote in database
    if (newVote === 0) {
      // Remove vote
      const { error } = await supabase
        .from('qa_ratings')
        .delete()
        .eq('qa_id', qa.id)
        .eq('user_session', userSession);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove vote",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Add or update vote
      const { error } = await supabase
        .from('qa_ratings')
        .upsert({
          qa_id: qa.id,
          user_session: userSession,
          rating: newVote
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to submit vote",
          variant: "destructive"
        });
        return;
      }
    }

    // Calculate new total score
    const { data: allVotes } = await supabase
      .from('qa_ratings')
      .select('rating')
      .eq('qa_id', qa.id);

    const totalScore = allVotes?.reduce((sum, vote) => sum + vote.rating, 0) || 0;

    // Update the question's rating score
    await supabase
      .from('function_qa')
      .update({ rating_score: totalScore })
      .eq('id', qa.id);

    setUserVote(newVote);
    setCurrentScore(totalScore);
    onAnswerUpdate();
    
    toast({
      title: "Success",
      description: newVote === 0 ? "Vote removed" : `Voted ${voteType}`,
    });
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{qa.question_type}</Badge>
                {qa.view_mode && qa.view_mode !== qa.question_type && (
                  <Badge variant="secondary">{qa.view_mode}</Badge>
                )}
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
                    {PREDEFINED_TAGS.filter(tag => !tags.includes(tag)).slice(0, 3).map((tag) => (
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
                  onClick={() => handleVoting('up')}
                  className={userVote === 1 ? 'text-green-600 bg-green-50' : 'hover:text-green-600'}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <div className="text-center px-2 py-1 rounded-md bg-gray-50">
                  <div className="text-sm font-bold">{currentScore}</div>
                  <div className="text-xs">votes</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoting('down')}
                  className={userVote === -1 ? 'text-red-600 bg-red-50' : 'hover:text-red-600'}
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
            <div className={`border rounded-lg p-4 ${qa.is_approved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {qa.is_approved && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Approved by Developer
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleApproveAnswer}
                    className={qa.is_approved ? 'text-green-600' : 'text-gray-500'}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAnswer}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <MarkdownRenderer content={qa.answer} />
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
                  <Save className="w-4 h-4 mr-2" />
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
