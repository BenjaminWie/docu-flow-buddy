
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, FileText, MessageSquare, CheckCircle } from "lucide-react";

const DemoSection = () => {
  const analysisSteps = [
    {
      icon: Github,
      title: "Repository Scan",
      description: "AI analyzes code structure, dependencies, and patterns",
      preview: "Scanning 47 files, 12,453 lines of code..."
    },
    {
      icon: FileText,
      title: "Documentation Generation",
      description: "Creates function explanations and architecture docs",
      preview: "Generated 23 function docs, arc42 overview..."
    },
    {
      icon: MessageSquare,
      title: "Business Interface Setup",
      description: "Prepares natural language explanations for stakeholders",
      preview: "Ready to answer: 'How does payment processing work?'"
    },
    {
      icon: CheckCircle,
      title: "Analysis Complete",
      description: "Your documentation portal is ready",
      preview: "View your personalized documentation dashboard"
    }
  ];

  const sampleQuestions = [
    "How does the user authentication flow work?",
    "What's the purpose of the PaymentProcessor class?",
    "Can you explain the database schema relationships?",
    "What are the main architectural components?"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See It In <span className="text-blue-600">Action</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Watch how our AI transforms your repository into comprehensive documentation
          </p>
        </div>

        {/* Analysis Process */}
        <div className="max-w-6xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Analysis Process
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analysisSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                  <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-700 italic">
                    {step.preview}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sample Business Interface */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Business Interface Preview
          </h3>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Ask About Your Codebase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Once analyzed, stakeholders can ask natural language questions about your repository:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {sampleQuestions.map((question, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-700">"{question}"</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>AI Response:</strong> "The user authentication flow starts in the AuthController.js file, 
                  where login requests are validated using bcrypt for password hashing. The flow then generates 
                  a JWT token that's stored in the user session..."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
