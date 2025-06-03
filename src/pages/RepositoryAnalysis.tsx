
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnalysisForm from "@/components/analysis/AnalysisForm";
import AnalysisStatus from "@/components/analysis/AnalysisStatus";
import AnalysisFeatures from "@/components/analysis/AnalysisFeatures";
import AnalysisExamples from "@/components/analysis/AnalysisExamples";
import { useRepositoryAnalysis } from "@/hooks/useRepositoryAnalysis";

const RepositoryAnalysis = () => {
  const navigate = useNavigate();
  const {
    githubUrl,
    setGithubUrl,
    isAnalyzing,
    analysisStatus,
    progress,
    handleAnalyze
  } = useRepositoryAnalysis();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <AnalysisForm
              githubUrl={githubUrl}
              setGithubUrl={setGithubUrl}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            <div className="mt-6">
              <AnalysisStatus
                isAnalyzing={isAnalyzing}
                analysisStatus={analysisStatus}
                progress={progress}
              />
            </div>

            <div className="mt-6">
              <AnalysisFeatures />
            </div>

            <div className="mt-6">
              <AnalysisExamples />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryAnalysis;
