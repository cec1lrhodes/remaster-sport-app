import { useMemo } from "react";

import { uk } from "react-day-picker/locale";

import { Calendar } from "@/ui/calendar";

import { Card, CardContent } from "@/ui/card";

import { cn } from "@/lib/utils";

import { useJournal } from "@/store/templates/hooks/useJournal";

import {
  DAY_TONE_CALENDAR_CLASSES,
  getTemplateWorkoutDatesByTone,
} from "@/utils/journalUtils";

interface CalendarSectionProps {
  templateId: string;

  className?: string;
}

export const CalendarSection = ({
  templateId,

  className,
}: CalendarSectionProps) => {
  const { journalDayDates, journalLogs, templates } = useJournal();

  const templateExercises = useMemo(
    () => templates.find((template) => template.id === templateId)?.exercises,

    [templates, templateId],
  );

  const { green, orange, neutral, all } = useMemo(() => {
    const tones = getTemplateWorkoutDatesByTone(
      templateId,

      journalDayDates,

      templateExercises ?? [],

      journalLogs,
    );

    return {
      ...tones,

      all: [...tones.green, ...tones.orange, ...tones.neutral],
    };
  }, [journalDayDates, journalLogs, templateExercises, templateId]);

  return (
    <Card
      className={cn(
        "w-full rounded-[10px] border-0 bg-[#1a1a1a] ring-0",

        className,
      )}
    >
      <CardContent className="p-0">
        <Calendar
          mode="multiple"
          locale={uk}
          selected={all}
          onSelect={() => undefined}
          modifiers={{
            onTarget: green,

            mismatch: orange,

            scheduled: neutral,
          }}
          modifiersClassNames={{
            onTarget: DAY_TONE_CALENDAR_CLASSES.green,

            mismatch: DAY_TONE_CALENDAR_CLASSES.orange,

            scheduled: DAY_TONE_CALENDAR_CLASSES.neutral,
          }}
          className="w-full bg-[#1a1a1a] p-3 [--cell-size:--spacing(9)]"
          classNames={{
            root: "w-full",
          }}
        />
      </CardContent>
    </Card>
  );
};
