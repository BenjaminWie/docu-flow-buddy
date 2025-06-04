import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
const TeamSection = () => {
  const teamMembers = [{
    name: "Benni",
    role: "Full-Stack Engineer",
    description: "Passionate about creating intuitive developer experiences and scalable architectures."
  }, {
    name: "Tobias",
    role: "AI/ML Engineer",
    description: "Specializes in natural language processing and code analysis algorithms."
  }, {
    name: "Oskar",
    role: "Backend Engineer",
    description: "Expert in distributed systems and enterprise-grade security implementations."
  }, {
    name: "Shiva",
    role: "DevOps Engineer",
    description: "Focuses on seamless CI/CD integration and infrastructure automation."
  }, {
    name: "Adarsh",
    role: "Product Engineer",
    description: "Bridges technical capabilities with user needs to create impactful solutions."
  }];
  return <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet the <span className="text-blue-600">Team</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Built by developers, for developers. Our team combines deep technical expertise with real-world experience in enterprise environments.
          </p>
        </div>

        {/* Team Photo - Made bigger */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className="overflow-hidden border-2 border-gray-200">
            <CardContent className="p-0">
              <div className="relative">
                <img src="/lovable-uploads/33a156ed-ffb0-47fe-9f56-c64ed17f76ec.png" alt="Team at hackathon working together on laptops" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Born at a Hackathon</h3>
                  <p className="text-gray-200">
                    What started as a weekend project has grown into a mission to democratize code understanding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid - Made cards smaller */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => <Card key={index} className="hover:shadow-lg transition-all duration-300 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                
                
                <div className="flex justify-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Github className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Team Culture Note */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Why We Built This
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We've all been the new developer trying to understand a complex codebase, or the business person asking 
              "what does this system actually do?" We believe understanding code shouldn't require a PhD in computer science 
              or weeks of detective work. Everyone deserves to understand the systems they work with.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default TeamSection;