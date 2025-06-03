
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ArrowLeft, MessageSquare, FileText, Star, GitFork, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ExplainCodeTab from "@/components/ExplainCodeTab";
import DocumentCodeTab from "@/components/DocumentCodeTab";

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
  analyzed_at?: string;
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
  const [selectedFunction, setSelectedFunction] = useState<FunctionAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'dev' | 'business'>('dev');
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

      // Select first function by default if available
      if (functionsData && functionsData.length > 0) {
        setSelectedFunction(functionsData[0]);
      }

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
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
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
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{repository.owner}/{repository.name}</CardTitle>
                      <a
                        href={repository.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    <p className="text-gray-600 mt-2 max-w-3xl">{repository.description}</p>
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
                      {repository.analyzed_at && (
                        <div className="text-sm text-gray-500">
                          Analyzed on {new Date(repository.analyzed_at).toLocaleDateString()}
                        </div>
                      )}
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

        {/* Function Selection */}
        {functionAnalyses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Function to Analyze</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {functionAnalyses.map((func) => (
                  <Button
                    key={func.id}
                    variant={selectedFunction?.id === func.id ? "default" : "outline"}
                    onClick={() => setSelectedFunction(func)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium">{func.function_name}</div>
                      <div className="text-xs text-gray-500 truncate">{func.file_path}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode Toggle */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">View Mode:</span>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'dev' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('dev')}
                >
                  Developer
                </Button>
                <Button
                  variant={viewMode === 'business' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('business')}
                >
                  Business
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <Tabs defaultValue="explain" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explain" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Explain Me The Code
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Help Me Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explain">
            {selectedFunction ? (
              <ExplainCodeTab 
                repositoryId={repository.id}
                functionId={selectedFunction.id}
                functionName={selectedFunction.function_name}
                viewMode={viewMode}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No functions available
                    </h3>
                    <p className="text-gray-500">
                      No functions were found in this repository analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="document">
            <DocumentCodeTab 
              functions={functionAnalyses} 
              repository={repository}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisResults;
