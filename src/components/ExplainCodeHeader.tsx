
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles, Users, Code, Target, Zap } from "lucide-react";
import SeedDataButton from "./SeedDataButton";

interface ExplainCodeHeaderProps {
  repositoryId: string;
}

const ExplainCodeHeader = ({ repositoryId }: ExplainCodeHeaderProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          Explain Me The Code
        </CardTitle>
        <p className="text-gray-600">
          StackOverflow-like experience with specialized AI perspectives. Get business insights or technical implementation guidance.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-green-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-800">Business Mode</h4>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• ROI analysis & timeline estimates</li>
              <li>• Strategic implications & risk assessment</li>
              <li>• Plain English explanations</li>
              <li>• Actionable business recommendations</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-blue-600" />
              <Zap className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Developer Mode</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Implementation strategies & code examples</li>
              <li>• Architecture impact & performance metrics</li>
              <li>• Best practices & common pitfalls</li>
              <li>• Quick wins & technical roadmaps</li>
            </ul>
          </div>
        </div>
        
        <SeedDataButton />
      </CardContent>
    </Card>
  );
};

export default ExplainCodeHeader;
