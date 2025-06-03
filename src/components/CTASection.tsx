
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, Download } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
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

  const handleStartAnalysis = async () => {
    if (!githubUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a GitHub repository URL",
        variant: "destructive"
      });
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
      console.error('Error starting analysis:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to start repository analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleReport = async () => {
    try {
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
        navigate('/analyze');
      }
    } catch (error) {
      console.error('Error fetching sample analysis:', error);
      navigate('/analyze');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Analyze</span> Your Repository?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Get instant insights into your codebase with AI-powered documentation and analysis
          </p>

          {/* GitHub URL Input - Main CTA */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isAnalyzing}
                  className="pl-12 bg-white/90 border-0 text-gray-900 placeholder-gray-500 h-16 text-xl"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 h-16 text-xl font-semibold group transition-all duration-300 transform hover:scale-105"
              >
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                {!isAnalyzing && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSampleReport}
              className="border-gray-400 text-gray-300 hover:bg-gray-800 px-10 py-6 text-xl"
            >
              <Download className="mr-3 w-6 h-6" />
              See Sample Analysis Report
            </Button>
          </div>

          {/* Features */}
          <div className="border-t border-gray-700 pt-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Analysis</h3>
                <p className="text-gray-400">Get results in minutes, not hours</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No Setup Required</h3>
                <p className="text-gray-400">Just paste your GitHub URL and go</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                <p className="text-gray-400">We analyze, but never store your code</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Questions about repository analysis?</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">How It Works</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sample Reports</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
