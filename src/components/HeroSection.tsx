
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, Zap, FileText, Bot } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleAnalyze = async () => {
    if (!githubUrl) {
      navigate('/analyze');
      return;
    }

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

    try {
      // Check if repository already exists
      const { data: existingRepo } = await supabase
        .from('repositories')
        .select('*')
        .eq('github_url', githubUrl)
        .single();

      if (existingRepo && existingRepo.status === 'completed') {
        toast({
          title: "Repository Already Analyzed",
          description: "This repository has already been analyzed. Redirecting to results...",
        });
        navigate(`/analysis/${existingRepo.id}`);
        return;
      }

      let repositoryId = existingRepo?.id;

      if (!existingRepo) {
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
        repositoryId = newRepo.id;
      } else {
        // Update existing repository to analyzing status
        await supabase
          .from('repositories')
          .update({ status: 'analyzing' })
          .eq('id', existingRepo.id);
      }

      // Start the real analysis by calling the scrape-github-repo function
      const { data: scrapeResult, error: scrapeError } = await supabase.functions.invoke('scrape-github-repo', {
        body: { githubUrl }
      });

      if (scrapeError) throw scrapeError;

      if (scrapeResult.success) {
        // Update repository with metadata from GitHub
        await supabase
          .from('repositories')
          .update({
            description: scrapeResult.metadata.description,
            language: scrapeResult.metadata.language,
            stars: scrapeResult.metadata.stars,
            forks: scrapeResult.metadata.forks,
            status: 'completed',
            analyzed_at: new Date().toISOString()
          })
          .eq('id', repositoryId);

        toast({
          title: "Analysis Complete",
          description: "Repository has been successfully analyzed!",
        });

        // Navigate to analysis results
        navigate(`/analysis/${repositoryId}`);
      } else {
        throw new Error(scrapeResult.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Error analyzing repository:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze repository. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleAnalysis = async () => {
    try {
      // Get the first completed repository (OpenRewrite by default)
      const { data: sampleRepo } = await supabase
        .from('repositories')
        .select('id')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sampleRepo) {
        navigate(`/analysis/${sampleRepo.id}`);
      } else {
        // Fallback to analyze page if no completed repos
        navigate('/analyze');
      }
    } catch (error) {
      console.error('Error fetching sample analysis:', error);
      navigate('/analyze');
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Github className="w-8 h-8 text-cyan-400 opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delayed">
          <FileText className="w-6 h-6 text-blue-400 opacity-40" />
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float">
          <Bot className="w-10 h-10 text-purple-400 opacity-50" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">AI-Powered Repository Analysis</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">GitHub Repository</span> Into Living <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Documentation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
            Paste your public repository URL and watch our AI analyze, understand, and document your codebase in <span className="text-cyan-400 font-semibold">minutes</span>.
          </p>

          {/* GitHub URL Input */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isAnalyzing}
                  className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500 h-14 text-lg"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 h-14 text-lg font-semibold group transition-all duration-300 transform hover:scale-105"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
                {!isAnalyzing && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSampleAnalysis}
              className="border-gray-400 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
            >
              See Sample Analysis
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Works with Public Repositories
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Privacy-First Analysis
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No Code Storage
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
