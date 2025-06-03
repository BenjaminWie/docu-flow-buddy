
import { AlertTriangle, Clock, Users, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: "Slow, Fragmented Documentation",
      description: "Developers burn 30% of sprint time writing or hunting docs",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Opaque Legacy Systems", 
      description: "Only a handful of veterans understand critical code paths",
      color: "text-orange-500"
    },
    {
      icon: AlertTriangle,
      title: "Compliance Drift",
      description: "Missing arc42 sections risk audit findings & prolonged release gates",
      color: "text-yellow-500"
    },
    {
      icon: FileX,
      title: "Business Bottlenecks",
      description: "Ideation stalls because nobody can answer 'Can our platform do X?'",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Documentation <span className="text-red-500">Crisis</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Every development team faces the same painful reality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gray-700/50 ${problem.color} group-hover:scale-110 transition-transform`}>
                    <problem.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {problem.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consequences */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            The Real <span className="text-red-500">Cost</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">£€$ Wasted</div>
              <p className="text-gray-400">Re-implementing features already built</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">+25%</div>
              <p className="text-gray-400">Incident mean-time-to-resolve due to tribal knowledge</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">Months</div>
              <p className="text-gray-400">Employee on-boarding takes months, not weeks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
