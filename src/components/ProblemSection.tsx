
import { AlertTriangle, Code, Users, FileX, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
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

        {/* Enhanced Hidden Costs with Numbers and Sources */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            The Hidden <span className="text-red-500">Costs</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-red-900/20 border-red-500/30 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-red-400 mb-4">8-12</div>
                <div className="text-xl font-semibold text-white mb-2">Hours per Week</div>
                <p className="text-gray-300 mb-4">
                  Wasted deciphering undocumented functions and legacy code
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://stripe.com/reports/developer-coefficient-2018', '_blank')}
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Source: Stripe Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-orange-900/20 border-orange-500/30 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-orange-400 mb-4">6-8</div>
                <div className="text-xl font-semibold text-white mb-2">Weeks</div>
                <p className="text-gray-300 mb-4">
                  New developer onboarding without clear documentation
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.glassdoor.com/employers/blog/the-true-cost-of-a-bad-hire/', '_blank')}
                  className="text-orange-400 border-orange-400 hover:bg-orange-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Source: Glassdoor
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-500/30 text-center p-8">
              <CardContent className="pt-6">
                <div className="text-5xl font-bold text-yellow-400 mb-4">60%</div>
                <div className="text-xl font-semibold text-white mb-2">Projects</div>
                <p className="text-gray-300 mb-4">
                  Business decisions blocked waiting for technical explanations
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/tech-debt-reclaiming-tech-equity', '_blank')}
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Source: McKinsey
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Cost Breakdown */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold text-white mb-6 text-center">
                Annual Cost Impact per Developer
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-lg font-semibold text-red-400 mb-4">Time Costs</h5>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span>Code comprehension delays</span>
                      <span className="text-red-400 font-semibold">$18,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Onboarding inefficiencies</span>
                      <span className="text-red-400 font-semibold">$25,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Context switching penalties</span>
                      <span className="text-red-400 font-semibold">$12,000</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-orange-400 mb-4">Opportunity Costs</h5>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span>Delayed feature delivery</span>
                      <span className="text-orange-400 font-semibold">$35,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Technical debt accumulation</span>
                      <span className="text-orange-400 font-semibold">$20,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Knowledge silos</span>
                      <span className="text-orange-400 font-semibold">$15,000</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-600 mt-6 pt-6 text-center">
                <div className="text-3xl font-bold text-red-500">$125,000</div>
                <p className="text-gray-400">Total annual cost per developer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
