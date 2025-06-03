
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRepositoryAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeRepository = async (githubUrl: string): Promise<string | null> => {
    setIsAnalyzing(true);
    
    try {
      console.log('Starting repository analysis for:', githubUrl);
      
      // Call the scrape-github-repo edge function
      const { data, error } = await supabase.functions.invoke('scrape-github-repo', {
        body: { githubUrl }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze repository",
          variant: "destructive",
        });
        return null;
      }

      if (data?.repositoryId) {
        toast({
          title: "Analysis Complete",
          description: "Repository has been successfully analyzed!",
        });
        return data.repositoryId;
      }

      return null;
    } catch (error) {
      console.error('Unexpected error during analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeRepository,
    isAnalyzing,
  };
};
