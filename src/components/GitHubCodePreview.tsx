
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Github, ExternalLink } from "lucide-react";

interface GitHubCodePreviewProps {
  code: string;
  language: string;
  githubUrl: string;
  startLine: number;
  endLine: number;
  filePath: string;
}

const GitHubCodePreview = ({ 
  code, 
  language, 
  githubUrl, 
  startLine, 
  endLine, 
  filePath 
}: GitHubCodePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineNumbers = Array.from(
    { length: endLine - startLine + 1 }, 
    (_, i) => startLine + i
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Function Implementation
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Lines {startLine}-{endLine}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(githubUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">{filePath}</p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={oneDark as any}
            PreTag="div"
            className="rounded-lg"
            showLineNumbers={true}
            startingLineNumber={startLine}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#6b7280',
              borderRight: '1px solid #374151',
              marginRight: '1em',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubCodePreview;
