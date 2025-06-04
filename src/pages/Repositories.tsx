
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Github, Star, GitFork, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  github_url: string;
  language: string | null;
  stars: number | null;
  forks: number | null;
  status: string;
  analyzed_at: string | null;
  created_at: string;
}

const Repositories = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repositories:', error);
    } else {
      setRepositories(data || []);
    }
    setLoading(false);
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Repository Analysis Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            View and manage all repositories that have been analyzed
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {repositories.length}
              </div>
              <p className="text-sm text-gray-600">Total Repositories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {repositories.filter(r => r.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-600">Completed Analysis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {repositories.filter(r => r.status === 'processing').length}
              </div>
              <p className="text-sm text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {repositories.filter(r => r.status === 'failed').length}
              </div>
              <p className="text-sm text-gray-600">Failed</p>
            </CardContent>
          </Card>
        </div>

        {/* Repository List */}
        <div className="space-y-4">
          {filteredRepositories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No repositories found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRepositories.map((repo) => (
              <Card key={repo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        <Github className="w-5 h-5" />
                        <span>{repo.owner}/{repo.name}</span>
                        <Badge className={getStatusColor(repo.status)}>
                          {repo.status}
                        </Badge>
                      </CardTitle>
                      {repo.description && (
                        <p className="text-gray-600 mt-2">{repo.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(repo.github_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      {repo.status === 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/analysis/${repo.id}`)}
                        >
                          View Analysis
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    {repo.stars !== null && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stars}</span>
                      </div>
                    )}
                    {repo.forks !== null && (
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {repo.analyzed_at 
                          ? `Analyzed ${new Date(repo.analyzed_at).toLocaleDateString()}`
                          : `Added ${new Date(repo.created_at).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Repositories;
