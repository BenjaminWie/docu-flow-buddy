
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Zap } from "lucide-react";

interface AnalysisFormProps {
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const AnalysisForm = ({ githubUrl, setGithubUrl, onAnalyze, isAnalyzing }: AnalysisFormProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Github className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl">Analyze Your Repository</CardTitle>
        <p className="text-gray-600 mt-2">
          Enter your GitHub repository URL to start the analysis process. 
          We'll extract functions, analyze complexity, and generate comprehensive documentation.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="github-url" className="text-sm font-medium">
              GitHub Repository URL
            </label>
            <div className="flex gap-2">
              <Input
                id="github-url"
                type="url"
                placeholder="https://github.com/owner/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                disabled={isAnalyzing}
                className="flex-1"
              />
              <Button 
                onClick={onAnalyze}
                disabled={isAnalyzing || !githubUrl}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                {!isAnalyzing && <Zap className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisForm;
