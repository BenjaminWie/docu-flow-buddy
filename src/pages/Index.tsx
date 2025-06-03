
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import DemoSection from "@/components/DemoSection";
import SecuritySection from "@/components/SecuritySection";
import ROISection from "@/components/ROISection";
import CTASection from "@/components/CTASection";
import AnalysisSection from "@/components/AnalysisSection";
import RepositoriesSection from "@/components/RepositoriesSection";

const Index = () => {
  const [searchParams] = useSearchParams();
  const repositoryId = searchParams.get('analysis');
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (repositoryId) {
      setShowAnalysis(true);
      // Scroll to analysis section after a brief delay
      setTimeout(() => {
        const analysisSection = document.getElementById('analysis');
        if (analysisSection) {
          analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [repositoryId]);

  const handleAnalysisComplete = (newRepositoryId: string) => {
    setShowAnalysis(true);
    // Update URL without page reload
    window.history.pushState({}, '', `/?analysis=${newRepositoryId}`);
    // Scroll to analysis section
    setTimeout(() => {
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onAnalysisComplete={handleAnalysisComplete} />
      <ProblemSection />
      <SolutionSection />
      <CapabilitiesSection />
      <DemoSection />
      <SecuritySection />
      <ROISection />
      
      {showAnalysis && repositoryId && (
        <AnalysisSection repositoryId={repositoryId} />
      )}
      
      <RepositoriesSection />
      <CTASection />
    </div>
  );
};

export default Index;
