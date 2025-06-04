
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Cog, Users, CheckCircle, MessageSquare } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Enterprise <span className="text-blue-600">Integration</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We don't just provide software - we help you securely integrate code understanding into your existing processes and infrastructure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Security & Compliance */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl">Data Security & Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">On-premise deployment options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">SOC 2 Type II & GDPR compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom security controls & encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Air-gapped environment support</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Integration & Setup */}
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Cog className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-xl">Seamless Integration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">CI/CD pipeline integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Custom API endpoints & webhooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Slack, Teams, and Jira integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Single sign-on (SSO) support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Let's Talk About Your Setup
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every organization has unique security requirements and existing workflows. 
              We'll work with your team to design a solution that fits perfectly into your environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Schedule a Security Review
              </Button>
              <Button variant="outline" size="lg">
                Download Security Whitepaper
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Free consultation • No commitment • 30-day pilot available
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingSection;
