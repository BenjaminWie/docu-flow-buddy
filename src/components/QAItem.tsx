
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Edit, X, Tag, Check, Trash2, Save, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "./MarkdownRenderer";

interface QAItemProps {
  qa: {
    id: string;
    question: string;
    answer: string | null;
    question_type: string;
    view_mode: string | null;
    tags?: string[];
    is_approved?: boolean;
    approved_by?: string;
    approved_at?: string;
  };
  onAnswerUpdate: () => void;
  onChatStart: (question: string, answer?: string) => void;
}

const QAItem = ({ qa, onAnswerUpdate, onChatStart }: QAItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!qa.answer);
  const [answerText, setAnswerText] = useState(qa.answer || '');
  const [tags, setTags] = useState<string[]>(qa.tags || []);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');

  const PREDEFINED_TAGS = [
    'architecture', 'security', 'performance', 'business-logic', 
    'database', 'api', 'testing', 'documentation', 'deployment',
    'java', 'spring', 'react', 'typescript', 'aws', 'docker',
    'high-priority', 'medium-priority', 'low-priority', 'refactoring'
  ];

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

  const handleDeleteQA = async () => {
    if (!confirm('Are you sure you want to delete this entire Q&A? This action cannot be undone.')) return;

    const { error } = await supabase
      .from('function_qa')
      .delete()
      .eq('id', qa.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete Q&A",
        variant: "destructive"
      });
    } else {
      onAnswerUpdate();
      toast({
        title: "Success",
        description: "Q&A deleted successfully",
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
      setTags(tags);
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
      setTags(tags);
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
                          setTimeout(handleAddTag, 0);
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChatStart(qa.question, qa.answer || undefined)}
                title="Continue this conversation in chat"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteQA}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete entire Q&A"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {qa.answer && !isEditing ? (
            <div className={`border rounded-lg p-4 ${qa.is_approved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {qa.is_approved ? (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved by Developer
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending Approval
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleApproveAnswer}
                    className={qa.is_approved ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                    title={qa.is_approved ? 'Remove approval' : 'Approve this answer'}
                  >
                    {qa.is_approved ? (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Unapprove
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    title="Edit answer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAnswer}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete answer only"
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
