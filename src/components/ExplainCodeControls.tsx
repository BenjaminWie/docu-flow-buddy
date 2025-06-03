
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import DevBusinessToggle from "./DevBusinessToggle";

interface ExplainCodeControlsProps {
  viewMode: 'dev' | 'business';
  onModeChange: (mode: 'dev' | 'business') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onStartChat: () => void;
}

const ExplainCodeControls = ({ 
  viewMode, 
  onModeChange, 
  searchTerm, 
  onSearchChange, 
  onStartChat 
}: ExplainCodeControlsProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        <DevBusinessToggle mode={viewMode} onModeChange={onModeChange} />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search questions and answers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Button onClick={onStartChat}>
        <Plus className="w-4 h-4 mr-2" />
        Start Chat
      </Button>
    </div>
  );
};

export default ExplainCodeControls;
