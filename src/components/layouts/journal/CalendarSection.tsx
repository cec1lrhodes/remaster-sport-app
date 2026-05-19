import { useMemo, useState } from "react";

import { Calendar } from "@/ui/calendar";
import { Card, CardContent } from "@/ui/card";
import { cn } from "@/lib/utils";
import { useTemplatesStore } from "@/store/templatesStore";
import { parseJournalDate } from "@/utils/journalUtils";

interface CalendarSectionProps {
  className?: string;
}

export const CalendarSection = ({ className }: CalendarSectionProps) => {
  const selectedTemplateId = useTemplatesStore((s) => s.selectedTemplateId);
  const journalDayDates = useTemplatesStore((s) => s.journalDayDates);
  const [focusedDate, setFocusedDate] = useState<Date | undefined>();

  const workoutDates = useMemo(() => {
    if (!selectedTemplateId) return [];

    const prefix = `${selectedTemplateId}:`;

    return Object.entries(journalDayDates)
      .filter(([key]) => key.startsWith(prefix))
      .map(([, iso]) => parseJournalDate(iso));
  }, [journalDayDates, selectedTemplateId]);

  return (
    <Card
      className={cn(
        "w-full rounded-[10px] border-0 bg-[#1a1a1a] ring-0",
        className,
      )}
    >
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={focusedDate}
          onSelect={setFocusedDate}
          modifiers={{ workout: workoutDates }}
          modifiersClassNames={{
            workout:
              "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
          }}
          className="w-full bg-[#1a1a1a] p-3 [--cell-size:--spacing(9)]"
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full max-w-none",
            month_grid: "w-full",
          }}
        />
      </CardContent>
    </Card>
  );
};
