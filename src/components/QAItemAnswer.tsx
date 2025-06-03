
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface QAItemAnswerProps {
  qa: {
    answer: string;
    content_format?: string;
    external_links?: Array<{
      title: string;
      url: string;
    }>;
  };
  onEdit: () => void;
}

const QAItemAnswer = ({ qa, onEdit }: QAItemAnswerProps) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {qa.content_format === 'markdown' ? (
            <MarkdownRenderer content={qa.answer} />
          ) : (
            <p className="text-green-800">{qa.answer}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
      
      {/* External Links */}
      {qa.external_links && qa.external_links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-300">
          <h5 className="text-sm font-medium text-green-900 mb-2">Related Resources:</h5>
          <div className="flex flex-wrap gap-2">
            {qa.external_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-white text-green-700 px-2 py-1 rounded border border-green-300 hover:bg-green-100 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QAItemAnswer;
