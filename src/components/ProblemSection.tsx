
import { AlertTriangle, Code, Users, FileX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProblemSection = () => {
  const problems = [
    {
      icon: Code,
      title: "Complex Functions Without Context",
      description: "Developers struggle to understand intricate business logic buried in complex functions",
      color: "text-red-500"
    },
    {
      icon: FileX,
      title: "Missing Architecture Overview", 
      description: "No clear picture of how components interact or what the system architecture looks like",
      color: "text-orange-500"
    },
    {
      icon: AlertTriangle,
      title: "Legacy Code Black Holes",
      description: "Critical functions that only original authors understand, creating knowledge silos",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Business Logic Buried in Code",
      description: "Stakeholders can't understand what the system actually does without technical expertise",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Repository's Hidden <span className="text-red-500">Challenges</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Every codebase faces the same knowledge and documentation gaps
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
            The Hidden <span className="text-red-500">Costs</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">Hours</div>
              <p className="text-gray-400">Wasted deciphering undocumented functions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">Weeks</div>
              <p className="text-gray-400">New developer onboarding without clear documentation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">Blocked</div>
              <p className="text-gray-400">Business decisions waiting for technical explanations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
