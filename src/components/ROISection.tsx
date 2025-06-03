
import { TrendingUp, Clock, Users, DollarSign } from "lucide-react";

const ROISection = () => {
  const metrics = [
    {
      icon: Clock,
      metric: "80%",
      description: "Documentation lead-time reduction",
      detail: "Quicker releases, fewer blockers"
    },
    {
      icon: TrendingUp,
      metric: "35%",
      description: "Incident MTTR reduction",
      detail: "Thanks to instant root-cause insights"
    },
    {
      icon: Users,
      metric: "+25%",
      description: "Developer satisfaction increase",
      detail: "Backed by eNPS pulse surveys"
    },
    {
      icon: DollarSign,
      metric: "ROI+",
      description: "Total cost of ownership reduction",
      detail: "By sunsetting ad-hoc documentation tools"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Measurable Business <span className="text-green-600">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Real results that drive organizational efficiency and growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {metrics.map((item, index) => (
            <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{item.metric}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.description}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Quote section */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-6xl text-gray-300 mb-4">"</div>
            <blockquote className="text-2xl text-gray-700 italic mb-6">
              We cut our onboarding from 6 weeks to 10 days. The AI documentation assistant made our legacy codebase accessible to new developers instantly.
            </blockquote>
            <cite className="text-lg font-semibold text-gray-900">
              — Lead Engineer, Pilot Customer
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROISection;
