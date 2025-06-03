
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Calendar } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Documentation</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join forward-thinking teams who've already revolutionized their development workflow
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 text-xl font-semibold group transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="mr-3 w-6 h-6" />
              Schedule a Pilot
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-400 text-gray-300 hover:bg-gray-800 px-10 py-6 text-xl"
            >
              <Download className="mr-3 w-6 h-6" />
              Download arc42 AI Sample Pack
            </Button>
          </div>

          {/* Secondary info */}
          <div className="border-t border-gray-700 pt-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Free Pilot Program</h3>
                <p className="text-gray-400">30-day trial with full support</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No Data Lock-in</h3>
                <p className="text-gray-400">Your data stays yours, always</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-gray-400">Dedicated implementation team</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Questions? We're here to help.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Service</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">EU AI Act Compliance</a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
