
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import SeedDataButton from "./SeedDataButton";

interface ExplainCodeHeaderProps {
  repositoryId: string;
}

const ExplainCodeHeader = ({ repositoryId }: ExplainCodeHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Explain Me The Code
        </CardTitle>
        <p className="text-gray-600">
          StackOverflow-like experience for understanding your codebase. Ask questions, get answers, and build knowledge.
        </p>
      </CardHeader>
      <CardContent>
        {repositoryId === 'cbb24b3f-1590-40fa-91e5-b0ba660d2a6b' && (
          <SeedDataButton />
        )}
      </CardContent>
    </Card>
  );
};

export default ExplainCodeHeader;
