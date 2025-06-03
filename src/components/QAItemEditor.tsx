
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QAItemEditorProps {
  answerText: string;
  onAnswerTextChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  hasExistingAnswer: boolean;
}

const QAItemEditor = ({ 
  answerText, 
  onAnswerTextChange, 
  onSave, 
  onCancel, 
  hasExistingAnswer 
}: QAItemEditorProps) => {
  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Provide your answer..."
        value={answerText}
        onChange={(e) => onAnswerTextChange(e.target.value)}
        rows={4}
      />
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={!answerText.trim()}>
          Save Answer
        </Button>
        {hasExistingAnswer && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default QAItemEditor;
