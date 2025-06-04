import { Clock, Users, AlertTriangle, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const ProblemSection = () => {
  return <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Knowledge Gaps <span className="text-red-500">Kill Velocity</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Every team faces the same two crushing problems
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* New Dev Problem */}
          <Card className="bg-red-900/20 border-red-500/30 hover:bg-red-900/30 transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="p-4 rounded-full bg-red-500/20 mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                  <Clock className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  New Devs Lost for Weeks
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  "Where do I start? What does this function actually do? Why was it built this way?"
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Code className="w-5 h-5 text-red-400" />
                    <span>Complex functions with zero context</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span>Critical setup steps buried in code</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span>Hours wasted deciphering business logic</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Problem */}
          <Card className="bg-orange-900/20 border-orange-500/30 hover:bg-orange-900/30 transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="p-4 rounded-full bg-orange-500/20 mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  "How Does It Work?" Chaos
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Business teams asking simple questions, getting buried in technical jargon or waiting days for answers.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span>Cross-department confusion</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span>Decisions blocked waiting for explanations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span>Endless back-and-forth meetings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="bg-gray-800/50 border-gray-600">
            <CardContent className="p-8 my-[131px]">
              <h4 className="text-2xl font-bold text-white mb-4">The Real Cost</h4>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-red-400 mb-2">6-8</div>
                  <div className="text-lg text-white mb-1">Weeks</div>
                  <p className="text-gray-400 text-sm">New dev onboarding time</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400 mb-2">40%</div>
                  <div className="text-lg text-white mb-1">Time</div>
                  <p className="text-gray-400 text-sm">Wasted on context switching</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">Daily</div>
                  <div className="text-lg text-white mb-1">Questions</div>
                  <p className="text-gray-400 text-sm">"How does this work?"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default ProblemSection;