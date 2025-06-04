import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";
import { useNavigate } from "react-router-dom";
const CTASection = () => {
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
  return <section className="py-20 bg-gradient-to-b from-blue-900 to-gray-900 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Ready to Try?</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Turn Code Confusion Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Crystal Clarity</span>
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto">
            Start with the OpenRewrite repository or paste your own. See how Docu Buddy transforms complex code into understanding.
          </p>

          {/* CTA Form */}
          <div className="max-w-4xl mx-auto mb-12">
            
          </div>

          {/* What Happens Next */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-cyan-400 mb-2">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Docu Buddy scans your code and identifies complex functions</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-2">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Documentation</h3>
              <p className="text-gray-400 text-sm">Get explanations for the functions that actually need them</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-orange-400 mb-2">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Chat</h3>
              <p className="text-gray-400 text-sm">Ask questions and get answers in plain language</p>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-gray-400 mb-4">Or explore existing analyses</p>
            <Button variant="outline" onClick={() => navigate('/repositories')} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              View All Repositories
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CTASection;