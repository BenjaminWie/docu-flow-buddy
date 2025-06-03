
import { Bot, FileCheck, MessageSquare, Zap, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SolutionSection = () => {
  const pillars = [
    {
      icon: Bot,
      title: "Integration Buddy",
      description: "Analyzes complex functions and creates clear explanations of business logic",
      features: ["Function-level documentation", "Complex logic breakdown", "Code relationship mapping"]
    },
    {
      icon: FileCheck,
      title: "Architecture Documentation",
      description: "Generates arc42-compliant docs validated with company rules and best practices",
      features: ["Automated arc42 sections", "Compliance validation", "Visual system overviews"]
    },
    {
      icon: MessageSquare,
      title: "Business Interface",
      description: "Provides chat interface for non-technical stakeholders to understand business logic",
      features: ["Natural language explanations", "Interactive Q&A", "Business logic discovery"]
    }
  ];

  const steps = [
    { step: "1", title: "Enter GitHub URL", desc: "Paste your public repository link" },
    { step: "2", title: "AI Analysis", desc: "Our buddy scans your codebase and maps business logic" },
    { step: "3", title: "Documentation Generation", desc: "Creates explanations, architecture docs, and summaries" },
    { step: "4", title: "Interactive Setup", desc: "Get your personalized documentation portal" },
    { step: "5", title: "Ongoing Integration", desc: "Continuous updates as your code evolves" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-blue-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
            <Github className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">The Solution</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your AI Documentation <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Trio</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Three specialized AI assistants working together to understand and document your repository
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {pillars.map((pillar, index) => (
            <Card key={index} className="bg-blue-800/20 border-blue-600/30 hover:bg-blue-800/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 group-hover:scale-110 transition-transform w-16 h-16 mx-auto flex items-center justify-center">
                    <pillar.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {pillar.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            How It <span className="text-green-400">Works</span>
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
