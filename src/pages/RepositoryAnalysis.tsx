
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Github, Zap, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RepositoryAnalysis = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [repositoryId, setRepositoryId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateGithubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+\/?$/;
    return githubRegex.test(url);
  };

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        name: match[2].replace(/\.git$/, '')
      };
    }
    return null;
  };

  const simulateAnalysisProgress = () => {
    const steps = [
      { message: "Cloning repository...", duration: 2000 },
      { message: "Analyzing code structure...", duration: 3000 },
      { message: "Extracting functions...", duration: 2500 },
      { message: "Running complexity analysis...", duration: 3500 },
      { message: "Generating documentation...", duration: 2000 },
      { message: "Creating Q&A content...", duration: 1500 },
      { message: "Finalizing analysis...", duration: 1000 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const runStep = () => {
      if (currentStep < steps.length) {
        setAnalysisStatus(steps[currentStep].message);
        
        const stepProgress = (100 / steps.length);
        const targetProgress = (currentStep + 1) * stepProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            currentStep++;
            setTimeout(runStep, 200);
          }
          setProgress(Math.min(currentProgress, targetProgress));
        }, 50);

      } else {
        setAnalysisStatus("Analysis complete!");
        setProgress(100);
        setTimeout(() => {
          if (repositoryId) {
            navigate(`/analysis/${repositoryId}`);
          }
        }, 1000);
      }
    };

    runStep();
  };

  const handleAnalyze = async () => {
    if (!validateGithubUrl(githubUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    const repoInfo = extractRepoInfo(githubUrl);
    if (!repoInfo) {
      toast({
        title: "Invalid URL",
        description: "Could not extract repository information from URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisStatus("Starting analysis...");

    try {
      // Check if repository already exists
      const { data: existingRepo } = await supabase
        .from('repositories')
        .select('*')
        .eq('github_url', githubUrl)
        .single();

      if (existingRepo) {
        setRepositoryId(existingRepo.id);
        if (existingRepo.status === 'completed') {
          toast({
            title: "Repository Already Analyzed",
            description: "This repository has already been analyzed. Redirecting to results...",
          });
          setTimeout(() => navigate(`/analysis/${existingRepo.id}`), 1000);
          return;
        }
      } else {
        // Create new repository entry
        const { data: newRepo, error } = await supabase
          .from('repositories')
          .insert({
            github_url: githubUrl,
            owner: repoInfo.owner,
            name: repoInfo.name,
            status: 'analyzing'
          })
          .select()
          .single();

        if (error) throw error;
        setRepositoryId(newRepo.id);
      }

      // Start the simulated analysis process
      simulateAnalysisProgress();

      // In a real implementation, you would call the scrape-github-repo function here
      // const { data, error } = await supabase.functions.invoke('scrape-github-repo', {
      //   body: { githubUrl }
      // });

    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to start repository analysis. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = () => {
    if (isAnalyzing) {
      if (progress === 100) return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    return <Zap className="w-5 h-5 text-purple-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="max-w-4xl mx-auto">
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
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !githubUrl}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                        {!isAnalyzing && <Zap className="ml-2 w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Analysis Status */}
                  {isAnalyzing && (
                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon()}
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">{analysisStatus}</p>
                              <p className="text-sm text-blue-700">This may take a few minutes...</p>
                            </div>
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                              {Math.round(progress)}%
                            </Badge>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Features Overview */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">What we analyze:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Function signatures and complexity
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Code structure and architecture
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Business logic patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Documentation gaps
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">What you get:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Interactive function explorer
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        AI-powered Q&A system
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Business-friendly explanations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Documentation generation
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Example URLs */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Example URLs:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• https://github.com/openrewrite/rewrite</p>
                    <p>• https://github.com/spring-projects/spring-boot</p>
                    <p>• https://github.com/facebook/react</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-900 mb-1">Requirements:</p>
                    <ul className="text-orange-800 space-y-1">
                      <li>• Repository must be public</li>
                      <li>• Must contain source code files</li>
                      <li>• Analysis time depends on repository size</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryAnalysis;
