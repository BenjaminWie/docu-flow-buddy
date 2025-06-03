
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Star, GitFork, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  status: string;
}

const RepositoriesSection = () => {
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRepositories(data || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error",
        description: "Failed to load repositories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = (repositoryId: string) => {
    window.location.href = `/?analysis=${repositoryId}`;
  };

  return (
    <section id="repositories" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recently Analyzed Repositories
          </h2>
          <p className="text-xl text-gray-600">
            Explore repositories that have been analyzed with our AI-powered documentation system
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading repositories...</span>
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center py-12">
            <Github className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">No repositories analyzed yet.</p>
            <p className="text-sm text-gray-500">
              Start by analyzing your first repository above!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Github className="w-5 h-5 text-gray-600" />
                      <CardTitle className="text-lg">
                        {repo.owner}/{repo.name}
                      </CardTitle>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {repo.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {repo.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="outline">{repo.language}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stars.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleViewAnalysis(repo.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RepositoriesSection;
