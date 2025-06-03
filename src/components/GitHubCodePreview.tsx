
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Copy, Check } from "lucide-react";

interface GitHubCodePreviewProps {
  githubUrl: string;
  filePath: string;
  functionName: string;
  startLine?: number;
  endLine?: number;
}

const GitHubCodePreview = ({ 
  githubUrl, 
  filePath, 
  functionName, 
  startLine, 
  endLine 
}: GitHubCodePreviewProps) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateGitHubPermalink = () => {
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    if (startLine && endLine) {
      return `https://github.com/${owner}/${repo}/blob/main/${filePath}#L${startLine}-L${endLine}`;
    }
    return `https://github.com/${owner}/${repo}/blob/main/${filePath}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true);
        const response = await fetch('/supabase/functions/v1/fetch-github-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            githubUrl,
            filePath,
            functionName,
            startLine,
            endLine
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch code');
        }

        const data = await response.json();
        setCode(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load code');
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [githubUrl, filePath, functionName, startLine, endLine]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading code...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-600">
            <p>Failed to load code: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderCodeWithLineNumbers = () => {
    const lines = code.split('\n');
    const displayStartLine = startLine || 1;
    
    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
        {lines.map((line, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 mr-4 select-none min-w-[3rem] text-right">
              {displayStartLine + index}
            </span>
            <span className="flex-1">{line || ' '}</span>
          </div>
        ))}
      </pre>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            {functionName}
            {startLine && endLine && (
              <span className="text-sm text-gray-500">
                (lines {startLine}-{endLine})
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={generateGitHubPermalink()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {renderCodeWithLineNumbers()}
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubCodePreview;
