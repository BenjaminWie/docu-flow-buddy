
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ArrowLeft, MessageSquare, FileText, Star, GitFork, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ExplainCodeTab from "@/components/ExplainCodeTab";
import DocumentCodeTab from "@/components/DocumentCodeTab";
import TechnicalDebtTab from "@/components/TechnicalDebtTab";

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

const AnalysisResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [functionAnalyses, setFunctionAnalyses] = useState<FunctionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAnalysisData();
  }, [id]);

  const fetchAnalysisData = async () => {
    try {
      // Fetch repository info
      const { data: repoData, error: repoError } = await supabase
        .from('repositories')
        .select('*')
        .eq('id', id)
        .single();

      if (repoError) throw repoError;
      setRepository(repoData);

      // Fetch function analyses
      const { data: functionsData, error: functionsError } = await supabase
        .from('function_analyses')
        .select('*')
        .eq('repository_id', id);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Repository not found</p>
          <Button onClick={() => navigate('/repositories')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Repositories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/repositories')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Repositories
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{repository.owner}/{repository.name}</CardTitle>
                    <p className="text-gray-600 mt-2">{repository.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="secondary">{repository.language}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4" />
                        {repository.stars.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <GitFork className="w-4 h-4" />
                        {repository.forks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {repository.status}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Analysis Tabs */}
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
    </div>
  );
};

export default AnalysisResults;
