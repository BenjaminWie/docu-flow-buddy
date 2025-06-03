
import { AlertCircle } from "lucide-react";

const AnalysisExamples = () => {
  return (
    <div className="space-y-6">
      {/* Example URLs */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Example URLs:</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• https://github.com/openrewrite/rewrite</p>
          <p>• https://github.com/spring-projects/spring-boot</p>
          <p>• https://github.com/facebook/react</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-orange-900 mb-1">Requirements:</p>
          <ul className="text-orange-800 space-y-1">
            <li>• Repository must be public</li>
            <li>• Must contain source code files</li>
            <li>• Analysis time depends on repository size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisExamples;
