
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRepositoryAnalysis = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateGithubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+\/?$/;
    return githubRegex.test(url);
  };

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      let repoName = match[2];
      if (repoName.endsWith('.git')) {
        repoName = repoName.slice(0, -4);
      }
      return {
        owner: match[1],
        name: repoName
      };
    }
    return null;
  };

  const trackAnalysisProgress = () => {
    const steps = [
      { message: "Connecting to GitHub...", duration: 2000 },
      { message: "Fetching repository metadata...", duration: 3000 },
      { message: "Analyzing code structure...", duration: 4000 },
      { message: "Generating documentation...", duration: 3000 },
      { message: "Creating Q&A content...", duration: 2000 },
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
            setTimeout(runStep, 300);
          }
          setProgress(Math.min(currentProgress, targetProgress));
        }, 150);
      } else {
        setAnalysisStatus("Analysis complete!");
        setProgress(100);
      }
    };

    runStep();
  };

  const handleAnalyze = async () => {
    if (!githubUrl || !validateGithubUrl(githubUrl)) {
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
      // Check if repository already exists and is completed
      const { data: existingRepo } = await supabase
        .from('repositories')
        .select('*')
        .eq('github_url', githubUrl)
        .single();

      if (existingRepo && existingRepo.status === 'completed') {
        toast({
          title: "Repository Already Analyzed",
          description: "Redirecting to analysis results...",
        });
        setTimeout(() => navigate(`/analysis/${existingRepo.id}`), 1000);
        setIsAnalyzing(false);
        return;
      }

      // Start progress tracking
      trackAnalysisProgress();

      // Call the simplified scrape function that only needs githubUrl
      const { data, error } = await supabase.functions.invoke('scrape-github-repo', {
        body: { githubUrl }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysisStatus("Analysis complete!");
        setProgress(100);
        
        toast({
          title: "Analysis Complete",
          description: "Repository has been successfully analyzed!",
        });

        // Navigate to results
        setTimeout(() => {
          navigate(`/analysis/${data.repositoryId}`);
          setIsAnalyzing(false);
        }, 1500);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Error analyzing repository:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze repository. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      setProgress(0);
      setAnalysisStatus('');
    }
  };

  return {
    githubUrl,
    setGithubUrl,
    isAnalyzing,
    analysisStatus,
    progress,
    handleAnalyze
  };
};
