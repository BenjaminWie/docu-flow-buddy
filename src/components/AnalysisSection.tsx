
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, BarChart3 } from "lucide-react";
import ExplainCodeTab from "./ExplainCodeTab";
import DocumentCodeTab from "./DocumentCodeTab";
import TechnicalDebtTab from "./TechnicalDebtTab";

interface AnalysisSectionProps {
  repositoryId: string;
}

interface Repository {
  id: string;
  github_url: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  status: string;
}

interface FunctionAnalysis {
  id: string;
  file_path: string;
  function_name: string;
  function_signature: string;
  description: string;
  parameters: any;
  return_value: string;
  usage_example: string;
  complexity_level: string;
  tags: string[];
}

const AnalysisSection = ({ repositoryId }: AnalysisSectionProps) => {
  const { toast } = useToast();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [functionAnalyses, setFunctionAnalyses] = useState<FunctionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repositoryId) {
      fetchAnalysisData();
    }
  }, [repositoryId]);

  const fetchAnalysisData = async () => {
    try {
      // Fetch repository info
      const { data: repoData, error: repoError } = await supabase
        .from('repositories')
        .select('*')
        .eq('id', repositoryId)
        .single();

      if (repoError) throw repoError;
      setRepository(repoData);

      // Fetch function analyses
      const { data: functionsData, error: functionsError } = await supabase
        .from('function_analyses')
        .select('*')
        .eq('repository_id', repositoryId);

      if (functionsError) throw functionsError;
      setFunctionAnalyses(functionsData || []);

    } catch (error) {
      console.error('Error fetching analysis data:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analysis results...</p>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Repository not found</p>
      </div>
    );
  }

  return (
    <section id="analysis" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Analysis Results for {repository.owner}/{repository.name}
          </h2>
          <p className="text-xl text-gray-600">{repository.description}</p>
        </div>

        <Tabs defaultValue="explain" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explain" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Explain Me The Code
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Help Me Document
            </TabsTrigger>
            <TabsTrigger value="debt" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Understand Technical Debt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explain">
            <ExplainCodeTab 
              repositoryId={repository.id} 
              functionAnalyses={functionAnalyses}
            />
          </TabsContent>

          <TabsContent value="document">
            <DocumentCodeTab 
              functions={functionAnalyses} 
              repository={repository}
            />
          </TabsContent>

          <TabsContent value="debt">
            <TechnicalDebtTab repositoryId={repository.id} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AnalysisSection;
