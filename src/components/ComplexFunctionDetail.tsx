
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Users, 
  Code, 
  Github, 
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Flame,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GitHubCodePreview from "./GitHubCodePreview";
import ChatInterface from "./ChatInterface";

interface ComplexFunction {
  id: number;
  function_name: string;
  github_url: string;
  file_url: string;
  start_line: number;
  end_line: number;
  language: string;
  rule_score: number;
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
}

interface GitHubCodeData {
  content: string;
  startLine: number;
  endLine: number;
  githubUrl: string;
  language: string;
}

interface ComplexFunctionDetailProps {
  functionData: ComplexFunction;
  repositoryId: string;
  onBack: () => void;
}

const ComplexFunctionDetail = ({ functionData, repositoryId, onBack }: ComplexFunctionDetailProps) => {
  const [githubCodeData, setGithubCodeData] = useState<GitHubCodeData | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [activeView, setActiveView] = useState<'business' | 'developer'>('business');

  useEffect(() => {
    fetchGithubCode();
  }, [functionData]);

  const fetchGithubCode = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-github-code', {
        body: {
          githubUrl: functionData.github_url,
          filePath: functionData.file_url,
          functionName: functionData.function_name
        }
      });

      if (error) throw error;

      setGithubCodeData({
        content: data.content,
        startLine: data.startLine || functionData.start_line,
        endLine: data.endLine || functionData.end_line,
        githubUrl: data.githubUrl,
        language: data.language || functionData.language
      });
    } catch (error) {
      console.error('Error fetching GitHub code:', error);
    }
  };

  const getPriorityLevel = (score: number) => {
    if (score >= 1000) return 'critical';
    if (score >= 600) return 'high';
    if (score >= 300) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Flame className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const priority = getPriorityLevel(functionData.rule_score || 0);

  const getBusinessMetrics = () => {
    const urgency = functionData.llm_refactoring_urgency || 0;
    const maintainability = functionData.llm_maintainability || 0;
    
    const maintenanceCost = urgency >= 8 ? 'High' : urgency >= 6 ? 'Medium' : 'Low';
    const businessRisk = maintainability <= 2 ? 'High' : maintainability <= 4 ? 'Medium' : 'Low';
    const timeToFix = urgency >= 8 ? '2-4 weeks' : urgency >= 6 ? '1-2 weeks' : '< 1 week';

    return { maintenanceCost, businessRisk, timeToFix };
  };

  const getTechnicalMetrics = () => {
    const cyclomatic = functionData.rule_cyclomatic_complexity || 0;
    const length = functionData.rule_function_length || 0;
    const nesting = functionData.rule_nesting_depth || 0;
    const cognitive = functionData.llm_cognitive_load || 0;

    return {
      testingEffort: cyclomatic >= 10 ? 'High' : cyclomatic >= 6 ? 'Medium' : 'Low',
      refactoringComplexity: nesting >= 4 ? 'Complex' : nesting >= 3 ? 'Moderate' : 'Simple',
      documentationNeeded: cognitive >= 8 ? 'Extensive' : cognitive >= 6 ? 'Moderate' : 'Minimal'
    };
  };

  const businessMetrics = getBusinessMetrics();
  const technicalMetrics = getTechnicalMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Function Overview */}
      <Card className={`border-2 ${priority === 'critical' ? 'border-red-300 bg-red-50' : 
                                    priority === 'high' ? 'border-orange-300 bg-orange-50' : 
                                    'border-gray-200'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg border ${getPriorityColor(priority)}`}>
                {getPriorityIcon(priority)}
              </div>
              <div>
                <CardTitle className="text-2xl">{functionData.function_name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getPriorityColor(priority)} variant="outline">
                    {priority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge variant="outline">
                    Rule Score: {Math.round(functionData.rule_score || 0)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(functionData.github_url, '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Dual Perspective Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Function Analysis</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeView === 'business' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('business')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Business Impact
              </Button>
              <Button
                variant={activeView === 'developer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('developer')}
                className="flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Technical Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeView === 'business' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Business Description</h4>
                <p className="text-blue-800">{functionData.llm_business_description}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{businessMetrics.maintenanceCost}</div>
                  <div className="text-sm text-gray-600">Maintenance Cost</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{businessMetrics.businessRisk}</div>
                  <div className="text-sm text-gray-600">Business Risk</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{businessMetrics.timeToFix}</div>
                  <div className="text-sm text-gray-600">Estimated Fix Time</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">💡 Business Recommendations</h4>
                <ul className="text-green-800 space-y-1">
                  <li>• Priority: {priority === 'critical' ? 'Immediate action required' : 'Schedule for upcoming sprint'}</li>
                  <li>• Impact: Affects code maintainability and team velocity</li>
                  <li>• ROI: Reducing complexity will improve development speed by ~{Math.round((functionData.llm_refactoring_urgency || 5) * 10)}%</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Technical Description</h4>
                <p className="text-blue-800">{functionData.llm_developer_description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Complexity Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cyclomatic Complexity</span>
                      <Badge variant="outline">{functionData.rule_cyclomatic_complexity || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Function Length</span>
                      <Badge variant="outline">{functionData.rule_function_length || 0} lines</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Nesting Depth</span>
                      <Badge variant="outline">{functionData.rule_nesting_depth || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Parameter Count</span>
                      <Badge variant="outline">{functionData.rule_parameter_count || 0}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Maintainability</span>
                      <Badge variant="outline">{functionData.llm_maintainability || 0}/10</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cognitive Load</span>
                      <Badge variant="outline">{functionData.llm_cognitive_load || 0}/10</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Documentation Quality</span>
                      <Badge variant="outline">{functionData.llm_documentation_quality || 0}/10</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Refactoring Urgency</span>
                      <Badge variant="outline">{functionData.llm_refactoring_urgency || 0}/10</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">🔧 Technical Recommendations</h4>
                <ul className="text-purple-800 space-y-1">
                  <li>• Testing Effort: {technicalMetrics.testingEffort}</li>
                  <li>• Refactoring Complexity: {technicalMetrics.refactoringComplexity}</li>
                  <li>• Documentation Needed: {technicalMetrics.documentationNeeded}</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Code Preview */}
      {githubCodeData && (
        <GitHubCodePreview
          code={githubCodeData.content}
          language={githubCodeData.language}
          githubUrl={githubCodeData.githubUrl}
          startLine={githubCodeData.startLine}
          endLine={githubCodeData.endLine}
          filePath={functionData.file_url}
        />
      )}

      {/* Chat Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask About This Function
            </CardTitle>
            {!showChat && (
              <Button onClick={() => setShowChat(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            )}
          </div>
        </CardHeader>
        {showChat && (
          <CardContent>
            <ChatInterface
              repositoryId={repositoryId}
              initialQuestion={`Tell me about the function ${functionData.function_name} and its complexity`}
              onQuestionCreate={() => {}} // No Q&A generation for this chat
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ComplexFunctionDetail;
