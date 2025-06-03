
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface QAItemAnalogyProps {
  analogyContent: string;
}

const QAItemAnalogy = ({ analogyContent }: QAItemAnalogyProps) => {
  const [showAnalogy, setShowAnalogy] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-green-300">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAnalogy(!showAnalogy)}
        className="text-green-700 hover:text-green-900 p-0 h-auto"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {showAnalogy ? 'Hide' : 'Show'} Business Analogy
      </Button>
      {showAnalogy && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm italic">{analogyContent}</p>
        </div>
      )}
    </div>
  );
};

export default QAItemAnalogy;
