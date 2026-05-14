import { Button } from "@/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Badge } from "@/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Bookmark, Ellipsis, SquarePen, Trash2 } from "lucide-react";

interface CardTemplateProps {
  title: string;
  cardDescription?: string | null;
  cardDate: string;
  exerciseCount: number;
  totalTonnage: number;
  onDelete: () => void;
}

export const CardTemplate = ({
  title,

  cardDate,
  exerciseCount,
  totalTonnage,
  onDelete,
}: CardTemplateProps) => {
  return (
    <div>
      <Card className="gap-3 border-0 bg-[#1a1a1a] ring-0">
        <CardHeader className="items-center">
          <CardTitle className="justify-self-start text-left font-space-mono">
            {title}
          </CardTitle>

          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-100 w-32 bg-black text-[#eeece7] shadow-xl ring-1 ring-white/30"
              >
                <DropdownMenuItem>
                  <SquarePen />
                  change
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark />
                  mark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="text-[#ff2047] focus:bg-[#ff2047]/10 focus:text-[#ff2047] [&_svg]:text-[#ff2047]"
                  onClick={onDelete}
                >
                  <Trash2 />
                  delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-1">
          <p className="font-montserrat text-sm">{exerciseCount} exercises</p>
          <p className="font-montserrat text-xs text-[#eeece7]/70">
            total: {totalTonnage} kg
          </p>
        </CardContent>

        <CardFooter className="justify-between border-t-0 bg-transparent pt-0">
          <p className="text-xs text-[#eeece7]/80">DATE: {cardDate}</p>
          <Badge className="shrink-0 bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:bg-green-950 dark:text-green-300">
            template
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
};
