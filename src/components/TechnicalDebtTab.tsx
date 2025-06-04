
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, AlertTriangle, CheckCircle, Clock, Shield, Zap, Wrench, BarChart3, FileX, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DisallowedFilesTab from "./DisallowedFilesTab";

interface TechnicalDebtTabProps {
  repositoryId: string;
}

interface Assessment {
  id: string;
  assessment_name: string;
  overall_score: number;
  security_score: number;
  performance_score: number;
  maintainability_score: number;
  compliance_score: number;
  created_at: string;
}

interface ComplianceRule {
  id: string;
  rule_name: string;
  category: string;
  description: string;
  severity: string;
  is_active: boolean;
}

interface ToolRequirement {
  id: string;
  tool_name: string;
  required_version: string;
  current_version: string;
  status: string;
  compliance_notes: string;
}

const TechnicalDebtTab = ({ repositoryId }: TechnicalDebtTabProps) => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [toolRequirements, setToolRequirements] = useState<ToolRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newToolName, setNewToolName] = useState('');
  const [newToolVersion, setNewToolVersion] = useState('');

  useEffect(() => {
    fetchData();
  }, [repositoryId]);

  const fetchData = async () => {
    try {
      // Fetch assessments
      const { data: assessmentData } = await supabase
        .from('technical_debt_assessments')
        .select('*')
        .eq('repository_id', repositoryId)
        .order('created_at', { ascending: false });

      // Fetch compliance rules
      const { data: rulesData } = await supabase
        .from('compliance_rules')
        .select('*')
        .eq('is_active', true)
        .order('severity', { ascending: false });

      // Fetch tool requirements
      const { data: toolsData } = await supabase
        .from('tool_requirements')
        .select('*')
        .eq('repository_id', repositoryId);

      setAssessments(assessmentData || []);
      setComplianceRules(rulesData || []);
      setToolRequirements(toolsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToolRequirement = async () => {
    if (!newToolName.trim() || !newToolVersion.trim()) return;

    const { error } = await supabase
      .from('tool_requirements')
      .insert({
        repository_id: repositoryId,
        tool_name: newToolName,
        required_version: newToolVersion,
        status: 'pending'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add tool requirement",
        variant: "destructive"
      });
    } else {
      setNewToolName('');
      setNewToolVersion('');
      fetchData();
      toast({
        title: "Success",
        description: "Tool requirement added successfully"
      });
    }
  };

  const runAssessment = async () => {
    try {
      // Simulate running an assessment
      const newAssessment = {
        repository_id: repositoryId,
        assessment_name: `Assessment ${new Date().toLocaleDateString()}`,
        overall_score: Math.floor(Math.random() * 40) + 60, // 60-100
        security_score: Math.floor(Math.random() * 30) + 70,
        performance_score: Math.floor(Math.random() * 25) + 75,
        maintainability_score: Math.floor(Math.random() * 35) + 65,
        compliance_score: Math.floor(Math.random() * 20) + 80
      };

      const { error } = await supabase
        .from('technical_debt_assessments')
        .insert(newAssessment);

      if (error) throw error;

      fetchData();
      toast({
        title: "Assessment Complete",
        description: "Technical debt assessment has been completed"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run assessment",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'non-compliant':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const latestAssessment = assessments[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Technical Debt Analysis
          </CardTitle>
          <p className="text-gray-600">
            Analyze your codebase against industry standards and compliance requirements
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={runAssessment} className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Run New Assessment
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Requirements
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="disallowed">Disallowed Files</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Rules</TabsTrigger>
          <TabsTrigger value="tools">Tools & Versions</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="history">Assessment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {latestAssessment ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Security</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAssessment.security_score)}`}>
                    {latestAssessment.security_score}%
                  </div>
                  <Progress value={latestAssessment.security_score} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Performance</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAssessment.performance_score)}`}>
                    {latestAssessment.performance_score}%
                  </div>
                  <Progress value={latestAssessment.performance_score} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Maintainability</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAssessment.maintainability_score)}`}>
                    {latestAssessment.maintainability_score}%
                  </div>
                  <Progress value={latestAssessment.maintainability_score} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Compliance</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(latestAssessment.compliance_score)}`}>
                    {latestAssessment.compliance_score}%
                  </div>
                  <Progress value={latestAssessment.compliance_score} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments available yet.</p>
                  <p className="text-sm">Run your first assessment to get started.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="disallowed">
          <DisallowedFilesTab />
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {complianceRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rule.rule_name}</h4>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{rule.description}</p>
                      <Badge variant="outline">{rule.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Tool Requirement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Tool name (e.g., Java, Spring Boot)"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                  />
                  <Input
                    placeholder="Required version (e.g., 17, 2.7.0)"
                    value={newToolVersion}
                    onChange={(e) => setNewToolVersion(e.target.value)}
                  />
                  <Button onClick={addToolRequirement}>Add</Button>
                </div>
              </CardContent>
            </Card>

            {toolRequirements.map((tool) => (
              <Card key={tool.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(tool.status)}
                        <h4 className="font-semibold">{tool.tool_name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Required: {tool.required_version}
                        {tool.current_version && ` | Current: ${tool.current_version}`}
                      </p>
                      {tool.compliance_notes && (
                        <p className="text-sm text-gray-500 mt-1">{tool.compliance_notes}</p>
                      )}
                    </div>
                    <Badge variant={tool.status === 'compliant' ? 'default' : 'destructive'}>
                      {tool.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Dependency Analysis
              </CardTitle>
              <p className="text-gray-600">
                Dependency documentation and analysis will be integrated here.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Dependency analysis coming soon.</p>
                <p className="text-sm">Upload your dependency documents to get started.</p>
                <Button variant="outline" className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Dependency Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{assessment.assessment_name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Overall</p>
                      <p className={`text-lg font-bold ${getScoreColor(assessment.overall_score)}`}>
                        {assessment.overall_score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security</p>
                      <p className={`text-lg font-bold ${getScoreColor(assessment.security_score)}`}>
                        {assessment.security_score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <p className={`text-lg font-bold ${getScoreColor(assessment.performance_score)}`}>
                        {assessment.performance_score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Maintainability</p>
                      <p className="text-lg font-bold ${getScoreColor(assessment.maintainability_score)}">
                        {assessment.maintainability_score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Compliance</p>
                      <p className={`text-lg font-bold ${getScoreColor(assessment.compliance_score)}`}>
                        {assessment.compliance_score}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalDebtTab;
