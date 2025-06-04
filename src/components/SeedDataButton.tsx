
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { seedOpenRewriteData } from "@/utils/seedOpenRewriteData";

const SeedDataButton = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedOpenRewriteData();
      toast({
        title: "Success!",
        description: "OpenRewrite example data has been seeded successfully"
      });
    } catch (error) {
      console.error('Seeding failed:', error);
      toast({
        title: "Error",
        description: "Failed to seed example data",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      disabled={isSeeding}
      className="flex items-center gap-2"
    >
      {isSeeding ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Database className="w-4 h-4" />
      )}
      {isSeeding ? "Seeding..." : "Seed OpenRewrite Data"}
    </Button>
  );
};

export default SeedDataButton;
