
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Star, GitFork, Calendar, ArrowRight, Clock, CheckCircle, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Repository {
  id: string;
  github_url: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  analyzed_at: string;
  status: string;
  created_at: string;
}

const RecentlyAnalyzedSection = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingQuestions, setRegeneratingQuestions] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('repositories').select('*').order('created_at', {
        ascending: false
      }).limit(8);
      if (error) throw error;
      setRepositories(data || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>;
      case 'analyzing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Analyzing
          </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>;
      default:
        return <Badge variant="secondary">
            {status}
          </Badge>;
    }
  };

  const canViewAnalysis = (repo: Repository) => {
    return repo.status === 'completed';
  };

  const regenerateQuestions = async (repo: Repository, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to the analysis page
    
    setRegeneratingQuestions(prev => ({ ...prev, [repo.id]: true }));
    
    try {
      // Generate developer questions
      await supabase.functions.invoke('generate-dev-questions', {
        body: {
          repositoryId: repo.id,
          githubUrl: repo.github_url,
          repoData: {
            name: repo.name,
            owner: repo.owner,
            description: repo.description,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks
          }
        }
      });
      
      // Generate business questions
      await supabase.functions.invoke('generate-business-questions', {
        body: {
          repositoryId: repo.id,
          githubUrl: repo.github_url,
          repoData: {
            name: repo.name,
            owner: repo.owner,
            description: repo.description,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks
          }
        }
      });
      
      toast({
        title: "Questions Generated",
        description: "New questions have been created for this repository.",
      });
      
    } catch (error) {
      console.error('Error regenerating questions:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate new questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRegeneratingQuestions(prev => ({ ...prev, [repo.id]: false }));
    }
  };

  if (loading) {
    return <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recently Analyzed Repositories
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>;
  }

  if (repositories.length === 0) {
    return <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Repository Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start by analyzing your first repository to see the power of AI-driven code documentation.
            </p>
          </div>
          <div className="text-center">
            <Button size="lg" onClick={() => navigate('/analyze')} className="px-8 py-3">
              Analyze Your First Repository
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>;
  }

  return <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Repository Analysis Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your analyzed repositories and explore comprehensive documentation and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {repositories.map(repo => <Card key={repo.id} className="hover:shadow-lg transition-shadow cursor-pointer group" 
              onClick={() => {
                if (canViewAnalysis(repo)) {
                  navigate(`/analysis/${repo.id}`);
                } else {
                  navigate('/analyze');
                }
              }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{repo.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {repo.language && <Badge variant="outline" className="text-xs">
                        {repo.language}
                      </Badge>}
                    {getStatusBadge(repo.status)}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {repo.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {repo.stars > 0 && <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {repo.stars.toLocaleString()}
                    </div>}
                  {repo.forks > 0 && <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      {repo.forks.toLocaleString()}
                    </div>}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(repo.analyzed_at || repo.created_at)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 group-hover:bg-blue-50 group-hover:border-blue-200" disabled={repo.status === 'analyzing'}>
                    {repo.status === 'completed' ? 'View Analysis' : repo.status === 'analyzing' ? 'Analysis in Progress...' : 'Continue Analysis'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  
                  {repo.status === 'completed' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="px-2" 
                      disabled={regeneratingQuestions[repo.id]}
                      onClick={(e) => regenerateQuestions(repo, e)}
                      title="Generate new questions">
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => navigate('/analyze')}>
            Analyze Another Repository
          </Button>
        </div>
      </div>
    </section>;
};

export default RecentlyAnalyzedSection;
