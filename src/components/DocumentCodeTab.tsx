import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileText } from "lucide-react";
import FunctionOverview from "./FunctionOverview";
import FunctionDetail from "./FunctionDetail";
interface FunctionAnalysis {
  id: string;
  file_path: string;
  function_name: string;
  function_signature: string;
  description: string;
  parameters: any;
  return_value: string;
  usage_example: string;
  complexity_level: string;
  tags: string[];
}
interface Repository {
  id: string;
  github_url: string;
  owner: string;
  name: string;
}
interface DocumentCodeTabProps {
  functions: FunctionAnalysis[];
  repository: Repository;
}
const DocumentCodeTab = ({
  functions,
  repository
}: DocumentCodeTabProps) => {
  const [selectedFunction, setSelectedFunction] = useState<FunctionAnalysis | null>(null);
  const [view, setView] = useState<'overview' | 'function'>('overview');
  const handleFunctionSelect = (functionAnalysis: FunctionAnalysis) => {
    setSelectedFunction(functionAnalysis);
    setView('function');
  };
  const handleBackToOverview = () => {
    setSelectedFunction(null);
    setView('overview');
  };
  return <div className="space-y-6">
      <Card>
        
      </Card>

      <div className="space-y-6">
        {view === 'overview' ? <FunctionOverview functions={functions} onFunctionSelect={handleFunctionSelect} /> : selectedFunction && repository ? <FunctionDetail functionData={selectedFunction} repository={repository} onBack={handleBackToOverview} /> : null}
      </div>
    </div>;
};
export default DocumentCodeTab;