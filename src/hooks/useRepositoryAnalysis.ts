
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRepositoryAnalysis = () => {
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
      let repoName = match[2];
      // Strip .git suffix if present
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

  const simulateAnalysisProgress = (repoId: string) => {
    const steps = [
      { message: "Connecting to GitHub...", duration: 1000 },
      { message: "Fetching repository metadata...", duration: 2000 },
      { message: "Analyzing code structure...", duration: 3000 },
      { message: "Extracting functions...", duration: 2500 },
      { message: "Running complexity analysis...", duration: 2000 },
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
          currentProgress += 3;
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            currentStep++;
            setTimeout(runStep, 200);
          }
          setProgress(Math.min(currentProgress, targetProgress));
        }, 100);

      } else {
        setAnalysisStatus("Analysis complete!");
        setProgress(100);
        setTimeout(() => {
          navigate(`/analysis/${repoId}`);
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
        
        // If repository exists but analysis failed or is pending, restart the analysis
        if (existingRepo.status === 'failed' || existingRepo.status === 'pending') {
          // Start real analysis with existing repository
          const { data, error } = await supabase.functions.invoke('scrape-github-repo', {
            body: { githubUrl, repositoryId: existingRepo.id }
          });

          if (error) throw error;

          if (data.success) {
            // Start progress simulation while real analysis happens in background
            simulateAnalysisProgress(existingRepo.id);
          } else {
            throw new Error(data.error || 'Analysis failed');
          }
        } else {
          // Repository is currently being analyzed
          simulateAnalysisProgress(existingRepo.id);
        }
      } else {
        // Create new repository entry
        const { data: newRepo, error } = await supabase
          .from('repositories')
          .insert({
            github_url: githubUrl,
            owner: repoInfo.owner,
            name: repoInfo.name,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        setRepositoryId(newRepo.id);

        // Start real analysis
        const { data, error: analysisError } = await supabase.functions.invoke('scrape-github-repo', {
          body: { githubUrl, repositoryId: newRepo.id }
        });

        if (analysisError) throw analysisError;

        if (data.success) {
          // Start progress simulation while real analysis happens in background
          simulateAnalysisProgress(newRepo.id);
        } else {
          throw new Error(data.error || 'Analysis failed');
        }
      }

    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to start repository analysis. Please try again.",
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
