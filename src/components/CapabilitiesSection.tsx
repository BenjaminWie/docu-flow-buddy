
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Building, Users, Shield } from "lucide-react";

const CapabilitiesSection = () => {
  const capabilities = [
    {
      icon: Code,
      audience: "Developers",
      capability: "Function-level documentation, complex logic explanation, and code relationship mapping",
      value: "Instant code understanding",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Building,
      audience: "Architects", 
      capability: "Automated arc42 documentation, compliance with company standards, and visual system overviews",
      value: "Compliant architecture docs",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Users,
      audience: "Business Teams",
      capability: "Natural language explanations, chat interface for questions, and business logic discovery",
      value: "Business logic clarity",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      audience: "Teams",
      capability: "Onboarding acceleration, knowledge preservation, and cross-team understanding",
      value: "Knowledge democratization",
      color: "from-red-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Specialized <span className="text-blue-600">Capabilities</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Tailored AI assistance for every role working with your repository
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {capabilities.map((item, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group">
              <CardHeader className={`bg-gradient-to-r ${item.color} text-white relative`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{item.audience}</CardTitle>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform"></div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {item.capability}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">{item.value}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
