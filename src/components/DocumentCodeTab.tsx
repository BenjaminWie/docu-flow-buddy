
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CriticalFunctionDashboard from "./CriticalFunctionDashboard";
import ComplexFunctionDetail from "./ComplexFunctionDetail";

interface ComplexFunction {
  id: number;
  function_name: string;
  github_url: string;
  file_url: string;
  start_line: number;
  end_line: number;
  language: string;
  combined_complexity_score: number;
  llm_business_description: string;
  llm_developer_description: string;
  llm_maintainability: number;
  llm_refactoring_urgency: number;
  llm_semantic_complexity: number;
  llm_cognitive_load: number;
  llm_documentation_quality: number;
  rule_cyclomatic_complexity: number;
  rule_function_length: number;
  rule_nesting_depth: number;
  rule_parameter_count: number;
  rule_score: number;
}

interface DocumentCodeTabProps {
  repositoryId: string;
}

const DocumentCodeTab = ({ repositoryId }: DocumentCodeTabProps) => {
  const [selectedFunction, setSelectedFunction] = useState<ComplexFunction | null>(null);
  const [view, setView] = useState<'dashboard' | 'function'>('dashboard');
  const [functionsCount, setFunctionsCount] = useState(0);

  useEffect(() => {
    fetchFunctionsCount();
  }, [repositoryId]);

  const fetchFunctionsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('function_complexity')
        .select('*', { count: 'exact' });
      
      if (error) throw error;
      setFunctionsCount(count || 0);
    } catch (error) {
      console.error('Error fetching functions count:', error);
    }
  };

  const handleFunctionSelect = (functionData: ComplexFunction) => {
    setSelectedFunction(functionData);
    setView('function');
  };

  const handleBackToDashboard = () => {
    setSelectedFunction(null);
    setView('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Critical Function Analysis
          </CardTitle>
          <p className="text-gray-600">
            AI-powered analysis of your most complex functions. Understand business impact, technical debt, and get prioritized recommendations for improvement.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-100 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">Business Intelligence</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Maintenance cost analysis & ROI estimates</li>
                <li>• Business risk assessment & impact scoring</li>
                <li>• Strategic planning & resource allocation</li>
                <li>• Plain English explanations for stakeholders</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Technical Analysis</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complexity metrics & quality scores</li>
                <li>• Refactoring strategies & implementation guides</li>
                <li>• Testing effort estimation & coverage gaps</li>
                <li>• Architecture impact & dependency analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {view === 'dashboard' ? (
          <CriticalFunctionDashboard onFunctionSelect={handleFunctionSelect} />
        ) : selectedFunction ? (
          <ComplexFunctionDetail
            functionData={selectedFunction}
            repositoryId={repositoryId}
            onBack={handleBackToDashboard}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DocumentCodeTab;
