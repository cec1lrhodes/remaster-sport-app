import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export const EmptyJournal = () => {
  return (
    <Card className="mt-8 rounded-[10px] border-0 bg-[#1a1a1a] ring-0">
      <CardHeader>
        <CardTitle className="font-space-grotesk text-[#fcfdff]">
          No program selected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-space-mono text-sm text-white/50">
          Choose a training template first to see weeks and training days here.
        </p>
        <Button asChild className="bg-white text-black">
          <Link to="/templates">Open Templates</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
