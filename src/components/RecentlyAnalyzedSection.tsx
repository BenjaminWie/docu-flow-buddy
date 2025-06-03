
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Star, GitFork, Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
}

const RecentlyAnalyzedSection = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('status', 'completed')
        .order('analyzed_at', { ascending: false })
        .limit(6);

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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
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
      </section>
    );
  }

  if (repositories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recently Analyzed Repositories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore documentation and insights from repositories that have been analyzed with our AI-powered system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {repositories.map((repo) => (
            <Card key={repo.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">{repo.owner}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {repo.language}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {repo.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {repo.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {repo.forks.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(repo.analyzed_at)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-blue-50 group-hover:border-blue-200"
                  onClick={() => navigate(`/analysis/${repo.id}`)}
                >
                  View Analysis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/analyze')}
            className="px-8 py-3"
          >
            Analyze Your Repository
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentlyAnalyzedSection;
