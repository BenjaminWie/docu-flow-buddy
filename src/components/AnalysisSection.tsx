
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Code, MessageSquare, TrendingUp } from "lucide-react";
import DocumentCodeTab from "./DocumentCodeTab";
import ExplainCodeTab from "./ExplainCodeTab";
import TechnicalDebtTab from "./TechnicalDebtTab";

interface Repository {
  id: string;
  github_url: string;
  owner: string;
  name: string;
  description: string | null;
  analysis_status: string;
  created_at: string;
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

interface AnalysisSectionProps {
  repositoryId: string | null;
  onClose?: () => void;
}

const AnalysisSection = ({ repositoryId, onClose }: AnalysisSectionProps) => {
  const { toast } = useToast();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [functions, setFunctions] = useState<FunctionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repositoryId) {
      fetchRepositoryData();
      fetchFunctions();
    }
  }, [repositoryId]);

  const fetchRepositoryData = async () => {
    if (!repositoryId) return;

    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('id', repositoryId)
        .single();

      if (error) throw error;
      setRepository(data);
    } catch (error) {
      console.error('Error fetching repository:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repository data",
        variant: "destructive"
      });
    }
  };

  const fetchFunctions = async () => {
    if (!repositoryId) return;

    try {
      const { data, error } = await supabase
        .from('function_analyses')
        .select('*')
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFunctions(data || []);
    } catch (error) {
      console.error('Error fetching functions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch function analyses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!repositoryId) {
    return (
      <div className="py-16 text-center">
        <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Repository Selected</h3>
        <p className="text-gray-600">
          Start by analyzing a GitHub repository above to see detailed insights and documentation.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="py-16 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Repository Not Found</h3>
        <p className="text-gray-600">
          The requested repository could not be found or may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <section id="analysis" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="space-y-6">
          {/* Repository Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {repository.owner}/{repository.name}
                  </CardTitle>
                  {repository.description && (
                    <p className="text-gray-600 mt-2">{repository.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge 
                      className={
                        repository.analysis_status === 'completed' ? 'bg-green-100 text-green-800' :
                        repository.analysis_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {repository.analysis_status}
                    </Badge>
                    <Badge variant="outline">
                      {functions.length} functions analyzed
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Analysis Tabs */}
          <Tabs defaultValue="document" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Help Me Document
              </TabsTrigger>
              <TabsTrigger value="explain" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Explain Me The Code
              </TabsTrigger>
              <TabsTrigger value="debt" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Technical Debt Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="document">
              <DocumentCodeTab functions={functions} repository={repository} />
            </TabsContent>

            <TabsContent value="explain">
              <ExplainCodeTab repositoryId={repositoryId} functionAnalyses={functions} />
            </TabsContent>

            <TabsContent value="debt">
              <TechnicalDebtTab repositoryId={repositoryId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
