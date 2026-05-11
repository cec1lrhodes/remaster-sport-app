import { Button } from "@/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Badge } from "@/ui/badge";

interface CardTemplateProps {
  title: string;
  cardDescription?: string | null;
  cardDate: string;
  exerciseCount: number;
  onDelete: () => void;
}

export const CardTemplate = ({
  title,
  cardDescription,
  cardDate,
  exerciseCount,
  onDelete,
}: CardTemplateProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-space-mono">{title}</CardTitle>
          <CardDescription>
            {cardDescription || "No description"}
          </CardDescription>
          <CardAction>
            <Button type="button" className="bg-red-800" onClick={onDelete}>
              <span className="font-montserrat">delete</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="font-montserrat">{exerciseCount} exercises</p>
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-[#eeece7]">DATE: {cardDate}</p>
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            template
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
};
