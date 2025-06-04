
import { MessageSquare, FileSearch, TrendingDown, ArrowRight, Github, Users, Code, CheckCircle, Zap, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SolutionSection = () => {
  const functions = [
    {
      icon: MessageSquare,
      title: "Chat Understanding",
      subtitle: "For Devs & Business",
      description: "Ask questions about your codebase in plain language. Get answers that make sense whether you code or not.",
      features: [
        { icon: Users, text: "New dev: 'How do I set up the payment flow?'", color: "text-blue-400" },
        { icon: Code, text: "Business: 'What happens when a user cancels?'", color: "text-green-400" },
        { icon: Zap, text: "Dev: 'Why is this function so slow?'", color: "text-orange-400" }
      ],
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-900/20 border-cyan-500/30",
      screenshot: "Chat interface showing natural language Q&A"
    },
    {
      icon: FileSearch,
      title: "Smart Documentation",
      subtitle: "Only What's Needed",
      description: "Documents only the complex functions that actually need it. Not everything.",
      features: [
        { icon: Target, text: "Identifies functions causing confusion", color: "text-purple-400" },
        { icon: CheckCircle, text: "Creates clear explanations for complex logic", color: "text-green-400" },
        { icon: Zap, text: "Helps with refactoring suggestions", color: "text-orange-400" }
      ],
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-900/20 border-green-500/30",
      screenshot: "Function documentation with complexity scores"
    },
    {
      icon: TrendingDown,
      title: "Technical Debt Clarity",
      subtitle: "Current vs Ideal State",
      description: "See exactly where your codebase is versus where it should be. Make informed decisions about refactoring.",
      features: [
        { icon: Target, text: "Visual debt mapping across files", color: "text-red-400" },
        { icon: CheckCircle, text: "Priority recommendations with impact", color: "text-yellow-400" },
        { icon: Users, text: "Business impact of technical choices", color: "text-blue-400" }
      ],
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-900/20 border-orange-500/30",
      screenshot: "Technical debt dashboard with metrics"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-blue-900 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
            <Github className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">The Solution</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Three Ways <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Docu Buddy</span> Helps
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Interactive, intelligent, made for your team
          </p>
        </div>

        {/* Three Core Functions with Screenshots */}
        <div className="space-y-12 max-w-7xl mx-auto mb-20">
          {functions.map((func, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <Card className={`${func.bgColor} hover:bg-opacity-40 transition-all duration-300 group h-full`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${func.color} group-hover:scale-110 transition-transform`}>
                        <func.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">
                          {func.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-medium">
                          {func.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                      {func.description}
                    </p>
                    
                    <div className="space-y-4">
                      {func.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <feature.icon className={`w-5 h-5 ${feature.color}`} />
                          <span className="text-gray-300 text-sm leading-relaxed">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Screenshot Mockup */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-2xl">
                    {/* Browser-like header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="bg-gray-800 rounded px-3 py-1 text-gray-400 text-xs">
                          docu-buddy.app
                        </div>
                      </div>
                    </div>
                    
                    {/* Screenshot content */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded p-6 min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <func.icon className={`w-12 h-12 mx-auto mb-4 text-gray-400`} />
                        <p className="text-gray-400 text-sm italic">
                          {func.screenshot}
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="h-2 bg-gray-700 rounded w-3/4 mx-auto"></div>
                          <div className="h-2 bg-gray-700 rounded w-1/2 mx-auto"></div>
                          <div className="h-2 bg-gray-700 rounded w-2/3 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating indicator */}
                  <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r ${func.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See It In Action */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  See It In Action
                </h3>
                <p className="text-gray-300 text-lg">
                  Experience Docu Buddy with the OpenRewrite repository - a complex Java codebase made understandable.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Users className="w-5 h-5 text-green-400" />
                      <span>Business-friendly explanations</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Code className="w-5 h-5 text-blue-400" />
                      <span>Developer onboarding shortcuts</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <TrendingDown className="w-5 h-5 text-orange-400" />
                      <span>Technical debt insights</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Demo Repository:</div>
                  <div className="text-green-400 font-mono text-sm mb-4">github.com/openrewrite/rewrite</div>
                  <div className="space-y-2 text-xs">
                    <div className="text-gray-300">✓ 847 functions analyzed</div>
                    <div className="text-gray-300">✓ 23 complex functions documented</div>
                    <div className="text-gray-300">✓ 5 technical debt areas identified</div>
                  </div>
                </div>
              </div>
              
              {/* CTA Button - Navigate to repositories page instead of hardcoded ID */}
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/repositories'}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold group transition-all duration-300 transform hover:scale-105"
                >
                  View Repository Analysis
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-gray-400 text-sm mt-3">
                  Explore complete analysis results
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
