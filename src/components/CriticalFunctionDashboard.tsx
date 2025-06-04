import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle, TrendingUp, Users, Code, ChevronRight, Flame, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface ComplexFunction {
  id: number;
  function_name: string;
  github_url: string;
  file_url: string;
  combined_complexity_score: number;
  llm_business_description: string;
  llm_developer_description: string;
  llm_maintainability: number;
  llm_refactoring_urgency: number;
  llm_semantic_complexity: number;
  rule_cyclomatic_complexity: number;
  rule_function_length: number;
  rule_nesting_depth: number;
}
interface CriticalFunctionDashboardProps {
  onFunctionSelect: (func: ComplexFunction) => void;
}
const CriticalFunctionDashboard = ({
  onFunctionSelect
}: CriticalFunctionDashboardProps) => {
  const [functions, setFunctions] = useState<ComplexFunction[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchComplexFunctions();
  }, []);
  const fetchComplexFunctions = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('function_complexity').select('*').order('combined_complexity_score', {
        ascending: false
      });
      if (error) throw error;
      setFunctions(data || []);
    } catch (error) {
      console.error('Error fetching complex functions:', error);
    } finally {
      setLoading(false);
    }
  };
  const getPriorityLevel = (score: number) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Flame className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };
  const getBusinessImpact = (func: ComplexFunction) => {
    const urgency = func.llm_refactoring_urgency || 0;
    const maintainability = func.llm_maintainability || 0;
    if (urgency >= 8 || maintainability <= 2) return 'High Risk';
    if (urgency >= 6 || maintainability <= 4) return 'Medium Risk';
    return 'Manageable';
  };
  const getTechnicalDebt = (func: ComplexFunction) => {
    const cyclomatic = func.rule_cyclomatic_complexity || 0;
    const length = func.rule_function_length || 0;
    const nesting = func.rule_nesting_depth || 0;
    const debtScore = cyclomatic * 2 + length / 10 + nesting * 5;
    if (debtScore >= 30) return 'Severe';
    if (debtScore >= 20) return 'High';
    if (debtScore >= 10) return 'Medium';
    return 'Low';
  };
  if (loading) {
    return <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading critical functions...</p>
      </div>;
  }
  const criticalFunctions = functions.filter(f => getPriorityLevel(f.combined_complexity_score) === 'critical');
  const highPriorityFunctions = functions.filter(f => getPriorityLevel(f.combined_complexity_score) === 'high');
  const mediumPriorityFunctions = functions.filter(f => getPriorityLevel(f.combined_complexity_score) === 'medium');
  return <div className="space-y-6">
      {/* Critical Functions Alert */}
      {criticalFunctions.length > 0 && <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Flame className="w-5 h-5" />
              🚨 Critical Functions Requiring Immediate Attention
            </CardTitle>
            <p className="text-red-700">
              These functions pose significant risks to code maintainability and business continuity.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalFunctions.slice(0, 3).map(func => <div key={func.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50" onClick={() => onFunctionSelect(func)}>
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-900">{func.function_name}</div>
                      <div className="text-sm text-red-700">
                        Business Impact: {getBusinessImpact(func)} • Technical Debt: {getTechnicalDebt(func)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-200 text-red-800">
                      Score: {Math.round(func.combined_complexity_score)}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-red-400" />
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}

      {/* Priority Matrix */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              High Priority ({highPriorityFunctions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {highPriorityFunctions.slice(0, 5).map(func => <div key={func.id} className="p-2 bg-orange-50 rounded border cursor-pointer hover:bg-orange-100" onClick={() => onFunctionSelect(func)}>
                  <div className="font-medium text-sm">{func.function_name}</div>
                  <div className="text-xs text-orange-600">
                    Complexity: {Math.round(func.combined_complexity_score)}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5" />
              Medium Priority ({mediumPriorityFunctions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mediumPriorityFunctions.slice(0, 5).map(func => <div key={func.id} className="p-2 bg-yellow-50 rounded border cursor-pointer hover:bg-yellow-100" onClick={() => onFunctionSelect(func)}>
                  <div className="font-medium text-sm">{func.function_name}</div>
                  <div className="text-xs text-yellow-600">
                    Complexity: {Math.round(func.combined_complexity_score)}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-5 h-5" />
              Overall Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Functions</span>
                <Badge variant="outline">{functions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Critical Issues</span>
                <Badge className="bg-red-100 text-red-800">{criticalFunctions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Complexity</span>
                <Badge variant="outline">
                  {Math.round(functions.reduce((acc, f) => acc + f.combined_complexity_score, 0) / functions.length || 0)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Functions List */}
      <Card>
        <CardHeader>
          <CardTitle>Functions sorted by Complexity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {functions.map(func => {
            const priority = getPriorityLevel(func.combined_complexity_score);
            return <div key={func.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => onFunctionSelect(func)}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded border ${getPriorityColor(priority)}`}>
                      {getPriorityIcon(priority)}
                    </div>
                    <div>
                      <div className="font-medium">{func.function_name}</div>
                      <div className="text-sm text-gray-600">
                        {func.llm_business_description?.substring(0, 100)}...
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {getBusinessImpact(func)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Code className="w-3 h-3 mr-1" />
                          {getTechnicalDebt(func)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(priority)}>
                      {Math.round(func.combined_complexity_score)}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>;
          })}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default CriticalFunctionDashboard;