
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Github, ExternalLink, Copy, Check } from "lucide-react";

interface GitHubCodePreviewProps {
  githubUrl: string;
  filePath: string;
  functionName?: string;
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
  const { toast } = useToast();
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fullGithubUrl, setFullGithubUrl] = useState<string>('');

  useEffect(() => {
    fetchCode();
  }, [githubUrl, filePath, functionName, startLine, endLine]);

  const fetchCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-github-code', {
        body: {
          githubUrl,
          filePath,
          functionName,
          startLine,
          endLine
        }
      });

      if (error) throw error;

      setCode(data.content);
      setFullGithubUrl(data.githubUrl);
    } catch (error) {
      console.error('Error fetching GitHub code:', error);
      toast({
        title: "Error",
        description: "Failed to fetch code from GitHub",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const generateLineNumbers = (code: string, startLineNum = 1) => {
    const lines = code.split('\n');
    return lines.map((line, index) => ({
      number: startLineNum + index,
      content: line
    }));
  };

  const numberedLines = generateLineNumbers(code, startLine || 1);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Github className="w-5 h-5" />
            {functionName || 'Code Preview'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filePath}</Badge>
            {startLine && endLine && (
              <Badge variant="secondary">
                Lines {startLine}-{endLine}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            {fullGithubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={fullGithubUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {numberedLines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 select-none w-12 flex-shrink-0 text-right pr-4">
                  {line.number}
                </span>
                <span className="flex-1">{line.content}</span>
              </div>
            ))}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubCodePreview;
