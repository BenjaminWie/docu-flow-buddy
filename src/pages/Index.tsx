
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import DemoSection from "@/components/DemoSection";
import SecuritySection from "@/components/SecuritySection";
import ROISection from "@/components/ROISection";
import AnalysisSection from "@/components/AnalysisSection";
import RepositoriesSection from "@/components/RepositoriesSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | null>(null);

  const handleRepositoryAnalyzed = (repositoryId: string) => {
    setSelectedRepositoryId(repositoryId);
  };

  const handleRepositorySelected = (repositoryId: string) => {
    setSelectedRepositoryId(repositoryId);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onRepositoryAnalyzed={handleRepositoryAnalyzed} />
      <ProblemSection />
      <SolutionSection />
      <CapabilitiesSection />
      <DemoSection />
      <SecuritySection />
      <ROISection />
      <AnalysisSection repositoryId={selectedRepositoryId} />
      <RepositoriesSection onSelectRepository={handleRepositorySelected} />
      <CTASection />
    </div>
  );
};

export default Index;
