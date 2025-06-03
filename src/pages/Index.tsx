
import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        
        const sections = ['hero', 'problem', 'solution', 'cta'];
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Find current section
        let currentSection = 0;
        sections.forEach((sectionId, index) => {
          const element = document.getElementById(sectionId);
          if (element && element.offsetTop <= currentScroll + windowHeight / 2) {
            currentSection = index;
          }
        });
        
        // Go to next section
        const nextSection = Math.min(currentSection + 1, sections.length - 1);
        const nextElement = document.getElementById(sections[nextSection]);
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen">
      <div id="hero">
        <HeroSection />
      </div>
      <div id="problem">
        <ProblemSection />
      </div>
      <div id="solution">
        <SolutionSection />
      </div>
      <div id="cta">
        <CTASection />
      </div>
      
      {/* Spacebar hint */}
      <div className="fixed bottom-6 right-6 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm z-50">
        Press <kbd className="bg-white/20 px-2 py-1 rounded text-xs">Space</kbd> to continue
      </div>
    </div>
  );
};

export default Index;
