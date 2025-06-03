
import { Bot, Zap, FileCheck, MessageSquare, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SolutionSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Specialized LLM Pipeline",
      description: "Trained on your code, Git history, Confluence pages, and Jira tickets"
    },
    {
      icon: FileCheck,
      title: "Arc42-Compliant Automation",
      description: "Generates architecture sections automatically at merge time"
    },
    {
      icon: MessageSquare,
      title: "Plain-Language Explanations",
      description: "Complex business rules & function flows made simple"
    },
    {
      icon: Zap,
      title: "Legacy Code Revival",
      description: "Enriches legacy repos with modern inline doc-blocks and UML snippets"
    },
    {
      icon: MessageSquare,
      title: "Chat-Ops Interface",
      description: "Ask 'How does invoice reconciliation work?' and get cited answers"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-blue-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
            <Bot className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">The Solution</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Your AI Documentation <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Buddy</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Transform your development workflow with intelligent, automated documentation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-blue-800/20 border-blue-600/30 hover:bg-blue-800/30 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
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
            {[
              { step: "1", title: "Ingest & Vectorize", desc: "Source code, APIs, ADRs, run-books" },
              { step: "2", title: "Guarded RAG", desc: "Only factual, permission-scoped context" },
              { step: "3", title: "LLM Orchestration", desc: "Task-specific prompts for arc42, code-to-comment, Q&A" },
              { step: "4", title: "Human-in-the-Loop", desc: "Review suggestions inside PR; accept or tweak" },
              { step: "5", title: "Continuous Learning", desc: "Feedback fine-tunes private model" }
            ].map((item, index) => (
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
