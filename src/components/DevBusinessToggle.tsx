
import { Button } from "@/components/ui/button";
import { Code, Users } from "lucide-react";

interface DevBusinessToggleProps {
  mode: 'dev' | 'business';
  onModeChange: (mode: 'dev' | 'business') => void;
}

const DevBusinessToggle = ({ mode, onModeChange }: DevBusinessToggleProps) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border">
      <Button
        variant={mode === 'dev' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('dev')}
        className={`w-8 h-8 p-0 transition-all duration-200 ${
          mode === 'dev' 
            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
            : 'text-blue-600 hover:bg-blue-100'
        }`}
        title="Developer Mode"
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        variant={mode === 'business' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('business')}
        className={`w-8 h-8 p-0 transition-all duration-200 ${
          mode === 'business' 
            ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
            : 'text-green-600 hover:bg-green-100'
        }`}
        title="Business Mode"
      >
        <Users className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DevBusinessToggle;
