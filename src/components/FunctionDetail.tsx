
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  FileText, 
  Code, 
  TestTube, 
  HelpCircle,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

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

interface CodeSection {
  name: string;
  path: string;
  functions: FunctionAnalysis[];
  complexity: 'simple' | 'moderate' | 'complex';
  functionsCount: number;
}

interface FunctionDetailProps {
  section: CodeSection;
  onBack: () => void;
}

const FunctionDetail = ({ section, onBack }: FunctionDetailProps) => {
  const [selectedFunction, setSelectedFunction] = useState<FunctionAnalysis | null>(null);
  const [businessLogic, setBusinessLogic] = useState("");
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);

  // Sort functions by complexity
  const sortedFunctions = [...section.functions].sort((a, b) => {
    const complexityOrder = { complex: 3, moderate: 2, simple: 1 };
    return complexityOrder[b.complexity_level as keyof typeof complexityOrder] - 
           complexityOrder[a.complexity_level as keyof typeof complexityOrder];
  });

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityIcon = (level: string) => {
    switch (level) {
      case 'simple': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'complex': return <AlertTriangle className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const generateAIQuestions = (func: FunctionAnalysis) => {
    const questions = [
      `What is the primary business purpose of ${func.function_name}?`,
      `What edge cases should be considered for this function?`,
      `How does this function interact with other parts of the system?`,
      `What validation rules apply to the input parameters?`,
      `What are the performance implications of this implementation?`
    ];
    setAiQuestions(questions);
  };

  const handleDocumentBusinessLogic = () => {
    console.log("Documenting business logic:", businessLogic);
    // Here you would typically call an API to save the business logic documentation
  };

  const handleGenerateTest = (func: FunctionAnalysis) => {
    console.log("Generating test for:", func.function_name);
    // Here you would typically call an API to generate test code
  };

  const handleDocumentInCode = (func: FunctionAnalysis) => {
    console.log("Generating code documentation for:", func.function_name);
    // Here you would typically call an API to generate JSDoc comments
  };

  if (selectedFunction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setSelectedFunction(null)}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to {section.name}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-mono">{selectedFunction.function_name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedFunction.file_path}</p>
              </div>
              <Badge className={getComplexityColor(selectedFunction.complexity_level)}>
                {getComplexityIcon(selectedFunction.complexity_level)}
                <span className="ml-1">{selectedFunction.complexity_level}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="questions">AI Questions</TabsTrigger>
                <TabsTrigger value="business">Business Logic</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedFunction.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Function Signature</h4>
                  <code className="bg-gray-100 p-3 rounded-lg text-sm block font-mono">
                    {selectedFunction.function_signature}
                  </code>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Usage Example</h4>
                  <code className="bg-gray-100 p-3 rounded-lg text-sm block font-mono">
                    {selectedFunction.usage_example}
                  </code>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedFunction.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">AI Understanding Questions</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateAIQuestions(selectedFunction)}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Generate Questions
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {aiQuestions.length > 0 ? (
                    aiQuestions.map((question, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{question}</p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Click "Generate Questions" to see AI-generated questions about this function
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Document Business Logic</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Describe the business rules, constraints, and logic this function implements.
                  </p>
                  <Textarea
                    placeholder="Explain the business logic behind this function..."
                    value={businessLogic}
                    onChange={(e) => setBusinessLogic(e.target.value)}
                    className="min-h-32"
                  />
                  <Button 
                    className="mt-3"
                    onClick={handleDocumentBusinessLogic}
                    disabled={!businessLogic.trim()}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save Business Logic
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">Generate Code Documentation</h5>
                        <p className="text-sm text-gray-600">Add JSDoc comments to the function</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleDocumentInCode(selectedFunction)}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Document
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">Generate Test Cases</h5>
                        <p className="text-sm text-gray-600">Create unit tests to validate business logic</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => handleGenerateTest(selectedFunction)}
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        Generate Tests
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">Refactoring Analysis</h5>
                        <p className="text-sm text-gray-600">Analyze function for potential improvements</p>
                      </div>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Overview
        </Button>
        <div>
          <h2 className="text-2xl font-bold capitalize">{section.name}</h2>
          <p className="text-gray-600">{section.path}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Functions in this Section</CardTitle>
          <p className="text-gray-600">
            {section.functionsCount} functions sorted by complexity (most complex first)
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {sortedFunctions.map((func) => (
          <Card 
            key={func.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedFunction(func)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getComplexityColor(func.complexity_level)}`}>
                    {getComplexityIcon(func.complexity_level)}
                  </div>
                  <div>
                    <h4 className="font-semibold font-mono">{func.function_name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{func.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getComplexityColor(func.complexity_level)}>
                        {func.complexity_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {func.tags.length} tags
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <TestTube className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FunctionDetail;
