
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Users } from "lucide-react";

interface DevBusinessToggleProps {
  mode: 'dev' | 'business';
  onModeChange: (mode: 'dev' | 'business') => void;
}

const DevBusinessToggle = ({ mode, onModeChange }: DevBusinessToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={mode === 'dev' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('dev')}
        className="flex items-center gap-2"
      >
        <Code className="w-4 h-4" />
        Developer
      </Button>
      <Button
        variant={mode === 'business' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('business')}
        className="flex items-center gap-2"
      >
        <Users className="w-4 h-4" />
        Business
      </Button>
    </div>
  );
};

export default DevBusinessToggle;
