
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Github, Download } from "lucide-react";
import { useState } from "react";

const CTASection = () => {
  const [githubUrl, setGithubUrl] = useState("");

  const handleStartAnalysis = () => {
    if (githubUrl) {
      // TODO: Implement analysis logic
      console.log("Starting analysis for:", githubUrl);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Analyze</span> Your Repository?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Get instant insights into your codebase with AI-powered documentation and analysis
          </p>

          {/* GitHub URL Input - Main CTA */}
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
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleStartAnalysis}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 h-16 text-xl font-semibold group transition-all duration-300 transform hover:scale-105"
              >
                Start Analysis
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-400 text-gray-300 hover:bg-gray-800 px-10 py-6 text-xl"
            >
              <Download className="mr-3 w-6 h-6" />
              See Sample Analysis Report
            </Button>
          </div>

          {/* Features */}
          <div className="border-t border-gray-700 pt-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Analysis</h3>
                <p className="text-gray-400">Get results in minutes, not hours</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No Setup Required</h3>
                <p className="text-gray-400">Just paste your GitHub URL and go</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                <p className="text-gray-400">We analyze, but never store your code</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Questions about repository analysis?</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">How It Works</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sample Reports</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
