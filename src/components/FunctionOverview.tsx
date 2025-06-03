
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Code, 
  TestTube, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ChevronRight 
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

interface FunctionOverviewProps {
  functions: FunctionAnalysis[];
  onSectionClick: (section: CodeSection) => void;
}

const FunctionOverview = ({ functions, onSectionClick }: FunctionOverviewProps) => {
  // Group functions by file path and calculate section complexity
  const sections: CodeSection[] = functions.reduce((acc, func) => {
    const pathParts = func.file_path.split('/');
    const sectionName = pathParts.slice(-2, -1)[0] || 'core';
    
    let section = acc.find(s => s.name === sectionName);
    if (!section) {
      section = {
        name: sectionName,
        path: func.file_path.split('/').slice(0, -1).join('/'),
        functions: [],
        complexity: 'simple',
        functionsCount: 0
      };
      acc.push(section);
    }
    
    section.functions.push(func);
    section.functionsCount++;
    
    // Calculate overall complexity (highest complexity wins)
    if (func.complexity_level === 'complex') section.complexity = 'complex';
    else if (func.complexity_level === 'moderate' && section.complexity !== 'complex') {
      section.complexity = 'moderate';
    }
    
    return acc;
  }, [] as CodeSection[]);

  // Sort sections by complexity (complex first) then by function count
  const sortedSections = sections.sort((a, b) => {
    const complexityOrder = { complex: 3, moderate: 2, simple: 1 };
    const aDiff = complexityOrder[a.complexity] - complexityOrder[b.complexity];
    if (aDiff !== 0) return -aDiff; // Reverse order (complex first)
    return b.functionsCount - a.functionsCount;
  });

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const totalFunctions = functions.length;
  const complexFunctions = functions.filter(f => f.complexity_level === 'complex').length;
  const moderateFunctions = functions.filter(f => f.complexity_level === 'moderate').length;
  const simpleFunctions = functions.filter(f => f.complexity_level === 'simple').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Structure Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalFunctions}</div>
              <div className="text-sm text-gray-600">Total Functions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{complexFunctions}</div>
              <div className="text-sm text-gray-600">Complex</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{moderateFunctions}</div>
              <div className="text-sm text-gray-600">Moderate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{simpleFunctions}</div>
              <div className="text-sm text-gray-600">Simple</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Complexity Distribution</span>
              <span>{Math.round((simpleFunctions / totalFunctions) * 100)}% Simple</span>
            </div>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
              <div 
                className="bg-green-500" 
                style={{ width: `${(simpleFunctions / totalFunctions) * 100}%` }}
              />
              <div 
                className="bg-yellow-500" 
                style={{ width: `${(moderateFunctions / totalFunctions) * 100}%` }}
              />
              <div 
                className="bg-red-500" 
                style={{ width: `${(complexFunctions / totalFunctions) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Code Sections (by Complexity)</h3>
        <div className="grid gap-4">
          {sortedSections.map((section) => (
            <Card 
              key={section.name} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSectionClick(section)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${getComplexityColor(section.complexity)}`}>
                      {getComplexityIcon(section.complexity)}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize text-lg">{section.name}</h4>
                      <p className="text-sm text-gray-600">{section.path}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {section.functionsCount} functions
                        </Badge>
                        <Badge className={`text-xs ${getComplexityColor(section.complexity)}`}>
                          {section.complexity} complexity
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionOverview;
