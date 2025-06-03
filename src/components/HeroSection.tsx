
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, ArrowDown } from "lucide-react";
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";

interface HeroSectionProps {
  onRepositoryAnalyzed: (repositoryId: string) => void;
}

const HeroSection = ({ onRepositoryAnalyzed }: HeroSectionProps) => {
  const [githubUrl, setGithubUrl] = useState("");
  const { analyzeRepository, isAnalyzing } = useRepositoryAnalysis();

  const handleAnalyze = async () => {
    if (!githubUrl.trim()) return;
    
    try {
      const repositoryId = await analyzeRepository(githubUrl);
      if (repositoryId) {
        onRepositoryAnalyzed(repositoryId);
        // Scroll to analysis section
        const analysisSection = document.getElementById('analysis');
        if (analysisSection) {
          analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const scrollToRepositories = () => {
    const repositoriesSection = document.getElementById('repositories');
    if (repositoriesSection) {
      repositoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Repository</span> Into Documentation Gold
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            AI-powered code analysis that transforms complex repositories into clear, comprehensive documentation. 
            Understand any codebase instantly.
          </p>

          {/* Main CTA */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="pl-12 bg-white/90 border-0 text-gray-900 placeholder-gray-500 h-16 text-xl"
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={!githubUrl.trim() || isAnalyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 h-16 text-xl font-semibold group transition-all duration-300 transform hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Start Analysis
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Instant Analysis</h3>
              <p className="text-gray-400">Get comprehensive documentation in minutes, not hours</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Insights</h3>
              <p className="text-gray-400">Understand complex business logic and architecture patterns</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Q&A</h3>
              <p className="text-gray-400">Ask questions about your code and get intelligent answers</p>
            </div>
          </div>

          {/* View Repositories Button */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={scrollToRepositories}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              View All Repositories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
