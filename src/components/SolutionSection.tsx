
import { MessageSquare, FileSearch, TrendingDown, ArrowRight, Github, Users, Code } from "lucide-react";
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
        "New dev: 'How do I set up the payment flow?'",
        "Business: 'What happens when a user cancels?'",
        "Dev: 'Why is this function so slow?'"
      ],
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-900/20 border-cyan-500/30"
    },
    {
      icon: FileSearch,
      title: "Smart Documentation",
      subtitle: "Only What's Needed",
      description: "Documents only the complex, poorly understood functions that actually waste your time. Not everything.",
      features: [
        "Identifies functions causing confusion",
        "Creates clear explanations for complex logic",
        "Helps with refactoring suggestions"
      ],
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-900/20 border-green-500/30"
    },
    {
      icon: TrendingDown,
      title: "Technical Debt Clarity",
      subtitle: "Current vs Ideal State",
      description: "See exactly where your codebase is versus where it should be. Make informed decisions about refactoring.",
      features: [
        "Visual debt mapping",
        "Priority recommendations",
        "Business impact of technical choices"
      ],
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-900/20 border-orange-500/30"
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

        {/* Three Core Functions */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {functions.map((func, index) => (
            <Card key={index} className={`${func.bgColor} hover:bg-opacity-40 transition-all duration-300 group h-full`}>
              <CardContent className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className={`p-4 rounded-full bg-gradient-to-r ${func.color} mb-4 group-hover:scale-110 transition-transform w-16 h-16 mx-auto flex items-center justify-center`}>
                    <func.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {func.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 font-medium">
                    {func.subtitle}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {func.description}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <ul className="text-xs text-gray-400 space-y-2">
                    {func.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Preview */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-600 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    See It In Action
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Watch how Docu Buddy analyzes the OpenRewrite repository and makes complex Java code understandable for everyone.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Business-friendly explanations</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Developer onboarding shortcuts</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <TrendingDown className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">Technical debt insights</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
