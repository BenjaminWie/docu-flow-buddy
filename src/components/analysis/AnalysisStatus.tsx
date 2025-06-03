
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle } from "lucide-react";

interface AnalysisStatusProps {
  isAnalyzing: boolean;
  analysisStatus: string;
  progress: number;
}

const AnalysisStatus = ({ isAnalyzing, analysisStatus, progress }: AnalysisStatusProps) => {
  const getStatusIcon = () => {
    if (isAnalyzing) {
      if (progress === 100) return <CheckCircle className="w-5 h-5 text-green-500" />;
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    return null;
  };

  if (!isAnalyzing) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-medium text-blue-900">{analysisStatus}</p>
              <p className="text-sm text-blue-700">This may take a few minutes...</p>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {Math.round(progress)}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisStatus;
