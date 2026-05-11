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
  cardDescription: string;
  cardDate: string;
}

export const CardTemplate = ({
  title,
  cardDescription,
  cardDate,
}: CardTemplateProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-space-mono">{title}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
          <CardAction>
            <Button className="bg-red-800 ">
              <span className="font-montserrat">delete</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p className="text-[#eeece7]">DATE: {cardDate}</p>
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            completed
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
};
