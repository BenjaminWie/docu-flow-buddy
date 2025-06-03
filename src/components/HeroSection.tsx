import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, Database, MessageSquare, FileSearch, TrendingDown } from "lucide-react";
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState("https://github.com/openrewrite/rewrite");
  const {
    analyzeRepository,
    isAnalyzing
  } = useRepositoryAnalysis();
  const handleAnalyze = async () => {
    if (!githubUrl.trim()) return;
    try {
      const repositoryId = await analyzeRepository(githubUrl);
      if (repositoryId) {
        navigate(`/analysis/${repositoryId}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent"></div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 right-6 z-10">
        
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Code Understanding</span> Buddy
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Finally understand any codebase - whether you're a new dev getting up to speed or a business person asking "what does this actually do?"
          </p>

          {/* Demo CTA */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col lg:flex-row gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input type="url" placeholder="Try with OpenRewrite repository" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="pl-12 bg-white/90 border-0 text-gray-900 placeholder-gray-500 h-16 text-xl" disabled={isAnalyzing} />
              </div>
              <Button size="lg" onClick={handleAnalyze} disabled={!githubUrl.trim() || isAnalyzing} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 h-16 text-xl font-semibold group transition-all duration-300 transform hover:scale-105">
                {isAnalyzing ? <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </> : <>
                    Try Docu Buddy
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>}
              </Button>
            </div>
          </div>

          {/* Core Value Props */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <MessageSquare className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Chat with Your Code</h3>
              <p className="text-gray-400">Ask questions in plain language, get answers that make sense</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <FileSearch className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Smart Documentation</h3>
              <p className="text-gray-400">Documents only the complex functions that actually need explaining</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <TrendingDown className="w-8 h-8 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Technical Debt Clarity</h3>
              <p className="text-gray-400">See the gap between where your code is and where it should be</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;