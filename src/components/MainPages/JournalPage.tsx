import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/ui/card";
import { useTemplatesStore } from "@/store/templatesStore";
import { EmptyJournal } from "@/components/layouts/journal/EmptyJournal";
import {
  groupExercisesByWeekAndDay,
  isJournalLogComplete,
} from "@/utils/journalUtils";
import { WeekAccordion } from "@/components/layouts/journal/WeekAccordion";
import { CalendarSection } from "@/components/layouts/journal/CalendarSection";

export const JournalPage = () => {
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);

  const templates = useTemplatesStore((s) => s.templates);
  const selectedTemplateId = useTemplatesStore((s) => s.selectedTemplateId);
  const journalLogs = useTemplatesStore((s) => s.journalLogs);
  const setJournalLogField = useTemplatesStore((s) => s.setJournalLogField);
  const isLoading = useTemplatesStore((s) => s.isLoading);
  const error = useTemplatesStore((s) => s.error);
  const fetchTemplates = useTemplatesStore((s) => s.fetchTemplates);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [fetchTemplates, templates.length]);

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => template.id === selectedTemplateId);
  }, [selectedTemplateId, templates]);

  // Трансформація даних — групування вправ по тижнях/днях і підрахунок завершених
  const completedCount = useMemo(
    () =>
      selectedTemplate?.exercises.filter((ex) =>
        isJournalLogComplete(journalLogs[ex.id]),
      ).length ?? 0,
    [journalLogs, selectedTemplate],
  );

  const groupedWeeks = useMemo(
    () => groupExercisesByWeekAndDay(selectedTemplate?.exercises ?? []),
    [selectedTemplate?.exercises],
  );

  const handleWeekToggle = (week: number) => {
    setOpenWeek((prev) => (prev === week ? null : week));
    setOpenDay(null);
  };

  const handleDayToggle = (day: number) => {
    setOpenDay((prev) => (prev === day ? null : day));
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-space-grotesk text-[#fcfdff]">Journal</h1>
      </div>

      {error && (
        <p className="mt-4 font-montserrat text-sm text-red-400">{error}</p>
      )}

      {isLoading && (
        <p className="mt-8 font-space-mono text-sm text-white/50">
          Loading journal...
        </p>
      )}

      {/* EMPTY */}
      {!isLoading && !selectedTemplate && <EmptyJournal />}

      {/* JOURNAL */}
      {!isLoading && selectedTemplate && (
        <>
          <Card className="mt-8 rounded-[10px] border-0 bg-[#1a1a1a] ring-0">
            <CardHeader>
              <CardTitle className="font-space-grotesk text-[#fcfdff]">
                {selectedTemplate.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="max-h-[65vh] space-y-5 overflow-y-auto pr-2">
              {groupedWeeks.map(([weekNumber, days]) => {
                const numericWeek = Number(weekNumber);
                return (
                  <WeekAccordion
                    key={weekNumber}
                    templateId={selectedTemplate.id}
                    weekNumber={numericWeek}
                    days={days}
                    isOpen={openWeek === numericWeek}
                    openDay={openDay}
                    logs={journalLogs}
                    onWeekToggle={handleWeekToggle}
                    onDayToggle={handleDayToggle}
                    onFieldChange={setJournalLogField}
                  />
                );
              })}
            </CardContent>

            <CardFooter className="relative flex items-center justify-between border-t-0 bg-transparent">
              <span className="font-space-mono text-sm text-white/50">
                {selectedTemplate.exercises.length} exercises
              </span>
              <span className="absolute bottom-3 right-4 font-space-mono text-sm tabular-nums text-white/80">
                {completedCount}/{selectedTemplate.exercises.length}
              </span>
            </CardFooter>
          </Card>

          <CalendarSection templateId={selectedTemplate.id} className="mt-8" />
        </>
      )}
    </div>
  );
};
