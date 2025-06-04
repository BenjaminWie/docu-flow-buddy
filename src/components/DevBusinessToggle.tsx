
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Users, Zap, Target } from "lucide-react";

interface DevBusinessToggleProps {
  mode: 'dev' | 'business';
  onModeChange: (mode: 'dev' | 'business') => void;
}

const DevBusinessToggle = ({ mode, onModeChange }: DevBusinessToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
      <Button
        variant={mode === 'dev' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('dev')}
        className={`flex items-center gap-2 transition-all duration-200 ${
          mode === 'dev' 
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <Code className="w-4 h-4" />
        Developer
        {mode === 'dev' && <Zap className="w-3 h-3" />}
      </Button>
      <Button
        variant={mode === 'business' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('business')}
        className={`flex items-center gap-2 transition-all duration-200 ${
          mode === 'business' 
            ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
            : 'text-green-600 hover:bg-green-100'
        }`}
      >
        <Users className="w-4 h-4" />
        Business
        {mode === 'business' && <Target className="w-3 h-3" />}
      </Button>
    </div>
  );
};

export default DevBusinessToggle;
