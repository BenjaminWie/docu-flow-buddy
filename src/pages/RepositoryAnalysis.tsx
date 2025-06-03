
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RepositoryAnalysis = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if githubUrl was passed from navigation state
    if (location.state?.githubUrl) {
      setGithubUrl(location.state.githubUrl);
    }
  }, [location.state]);

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], name: match[2] };
  };

  const handleAnalyze = async () => {
    if (!githubUrl) {
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
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Check if repository already exists
      const { data: existingRepo } = await supabase
        .from('repositories')
        .select('id, status')
        .eq('github_url', githubUrl)
        .single();

      if (existingRepo) {
        if (existingRepo.status === 'completed') {
          navigate(`/analysis/${existingRepo.id}`);
          return;
        }
      }

      // For demo purposes, we'll simulate analysis and redirect to CopilotKit example
      const { data: copilotRepo } = await supabase
        .from('repositories')
        .select('id')
        .eq('github_url', 'https://github.com/CopilotKit/CopilotKit')
        .single();

      if (copilotRepo) {
        toast({
          title: "Analysis Complete!",
          description: "Repository has been analyzed successfully.",
        });
        navigate(`/analysis/${copilotRepo.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the repository. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Analyze Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Repository</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Paste your GitHub repository URL and get comprehensive AI-powered documentation
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Github className="w-6 h-6" />
                Repository Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500 h-12"
                    disabled={isAnalyzing}
                  />
                </div>
                <Button 
                  size="lg" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 h-12 group"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Repository
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-400/20">
                <p className="text-blue-200 text-sm">
                  <strong>Demo Note:</strong> For this demonstration, any repository URL will redirect to our 
                  CopilotKit analysis example. In a production version, this would perform real-time analysis 
                  of your specified repository.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RepositoryAnalysis;
