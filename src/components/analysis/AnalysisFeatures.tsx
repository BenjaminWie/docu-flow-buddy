
import { CheckCircle } from "lucide-react";

const AnalysisFeatures = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">What we analyze:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Function signatures and complexity
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Code structure and architecture
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Business logic patterns
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Documentation gaps
          </li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">What you get:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Interactive function explorer
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            AI-powered Q&A system
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Business-friendly explanations
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Documentation generation
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisFeatures;
