
import { Shield, Lock, Eye, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Residency",
      description: "Runs on-prem or German-cloud regions only"
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "OAuth2 + RBAC inherited from Git & Confluence permissions"
    },
    {
      icon: Eye,
      title: "Explainability",
      description: "Every answer cites code lines & doc URLs"
    },
    {
      icon: Award,
      title: "EU AI Act Alignment",
      description: "Classified as 'limited risk'—transparency obligations auto-fulfilled"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-indigo-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Safety, Security & <span className="text-green-400">Governance</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Enterprise-grade security and compliance built-in from day one
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="bg-indigo-800/30 border-indigo-600/30 hover:bg-indigo-800/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-3 bg-indigo-800/30 px-6 py-3 rounded-full border border-indigo-600/30">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">EU AI Act Compliant</span>
          </div>
          <div className="flex items-center gap-3 bg-indigo-800/30 px-6 py-3 rounded-full border border-indigo-600/30">
            <Lock className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">GDPR Secure</span>
          </div>
          <div className="flex items-center gap-3 bg-indigo-800/30 px-6 py-3 rounded-full border border-indigo-600/30">
            <Award className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">ISO 27001 Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
