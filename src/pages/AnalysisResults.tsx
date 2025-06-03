import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ArrowLeft, Code, Building, Users, Star, GitFork } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FunctionOverview from "@/components/FunctionOverview";
import FunctionDetail from "@/components/FunctionDetail";

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

interface ArchitectureDoc {
  id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
}

interface BusinessExplanation {
  id: string;
  category: string;
  question: string;
  answer: string;
  order_index: number;
}

interface CodeSection {
  name: string;
  path: string;
  functions: FunctionAnalysis[];
  complexity: 'simple' | 'moderate' | 'complex';
  functionsCount: number;
}

const AnalysisResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [functionAnalyses, setFunctionAnalyses] = useState<FunctionAnalysis[]>([]);
  const [architectureDocs, setArchitectureDocs] = useState<ArchitectureDoc[]>([]);
  const [businessExplanations, setBusinessExplanations] = useState<BusinessExplanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<FunctionAnalysis | null>(null);
  const [view, setView] = useState<'overview' | 'function'>('overview');

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

      // Fetch architecture docs
      const { data: archData, error: archError } = await supabase
        .from('architecture_docs')
        .select('*')
        .eq('repository_id', id)
        .order('order_index');

      if (archError) throw archError;
      setArchitectureDocs(archData || []);

      // Fetch business explanations
      const { data: businessData, error: businessError } = await supabase
        .from('business_explanations')
        .select('*')
        .eq('repository_id', id)
        .order('order_index');

      if (businessError) throw businessError;
      setBusinessExplanations(businessData || []);

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

  const handleFunctionSelect = (functionAnalysis: FunctionAnalysis) => {
    setSelectedFunction(functionAnalysis);
    setView('function');
  };

  const handleBackToOverview = () => {
    setSelectedFunction(null);
    setView('overview');
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <Button onClick={() => navigate('/analyze')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Analysis
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
            onClick={() => navigate('/analyze')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Analysis
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
        <Tabs defaultValue="integration" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Integration Buddy
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Architecture Documentation
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Business Interface
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integration">
            <div className="space-y-6">
              {view === 'overview' ? (
                <FunctionOverview 
                  functions={functionAnalyses} 
                  onFunctionSelect={handleFunctionSelect}
                />
              ) : selectedFunction && repository ? (
                <FunctionDetail 
                  functionData={selectedFunction}
                  repository={repository}
                  onBack={handleBackToOverview}
                />
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="architecture">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Documentation (arc42)</CardTitle>
                  <p className="text-gray-600">Structured architecture documentation following arc42 template</p>
                </CardHeader>
              </Card>
              
              <div className="space-y-6">
                {architectureDocs.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle className="capitalize">{doc.title}</CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {doc.section_type.replace('_', ' ')}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{doc.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="business">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Interface</CardTitle>
                  <p className="text-gray-600">Natural language explanations for stakeholders and business teams</p>
                </CardHeader>
              </Card>
              
              <div className="space-y-4">
                {businessExplanations.map((explanation) => (
                  <Card key={explanation.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-600 font-semibold text-sm">Q</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {explanation.question}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-semibold text-sm">A</span>
                          </div>
                          <div className="text-gray-700 leading-relaxed">
                            {explanation.answer}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisResults;
