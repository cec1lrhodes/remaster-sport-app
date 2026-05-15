import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

import { Button } from "@/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/ui/card";
import { Input } from "@/ui/input";
import { useTemplatesStore } from "@/store/templatesStore";
import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";

const dayLabels: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
};

type DayTone = "neutral" | "green" | "orange";

const isJournalLogComplete = (log: JournalExerciseLog | undefined) => {
  if (!log) {
    return false;
  }

  if (
    log.reps.trim() === "" ||
    log.sets.trim() === "" ||
    log.kg.trim() === ""
  ) {
    return false;
  }

  const reps = Number(log.reps);
  const sets = Number(log.sets);
  const kg = Number(log.kg);

  return (
    Number.isInteger(reps) &&
    reps >= 0 &&
    Number.isInteger(sets) &&
    sets >= 0 &&
    Number.isFinite(kg) &&
    kg >= 0
  );
};

const dayToneForExercises = (
  exercises: TemplateExercise[],
  logs: Record<string, JournalExerciseLog>,
): DayTone => {
  if (exercises.length === 0) {
    return "neutral";
  }

  for (const exercise of exercises) {
    if (!isJournalLogComplete(logs[exercise.id])) {
      return "neutral";
    }
  }

  let anyLower = false;

  for (const exercise of exercises) {
    const reps = Number(logs[exercise.id]!.reps);

    if (reps < exercise.reps) {
      anyLower = true;
    }
  }

  if (anyLower) {
    return "orange";
  }

  for (const exercise of exercises) {
    if (Number(logs[exercise.id]!.reps) !== exercise.reps) {
      return "neutral";
    }
  }

  return "green";
};

export const JournalPage = () => {
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const templates = useTemplatesStore((state) => state.templates);
  const selectedTemplateId = useTemplatesStore(
    (state) => state.selectedTemplateId,
  );
  const journalLogs = useTemplatesStore((state) => state.journalLogs);
  const setJournalLogField = useTemplatesStore(
    (state) => state.setJournalLogField,
  );
  const isLoading = useTemplatesStore((state) => state.isLoading);
  const error = useTemplatesStore((state) => state.error);
  const fetchTemplates = useTemplatesStore((state) => state.fetchTemplates);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [fetchTemplates, templates.length]);

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => template.id === selectedTemplateId);
  }, [selectedTemplateId, templates]);

  const completedExerciseCount = useMemo(() => {
    if (!selectedTemplate) {
      return 0;
    }

    return selectedTemplate.exercises.filter((exercise) =>
      isJournalLogComplete(journalLogs[exercise.id]),
    ).length;
  }, [journalLogs, selectedTemplate]);

  const groupedExerciseEntries = useMemo(() => {
    const groupedExercises = (selectedTemplate?.exercises ?? []).reduce<
      Record<number, Record<number, TemplateExercise[]>>
    >((acc, exercise) => {
      acc[exercise.weekNumber] ??= {};
      acc[exercise.weekNumber][exercise.dayNumber] ??= [];
      acc[exercise.weekNumber][exercise.dayNumber].push(exercise);

      return acc;
    }, {});

    return Object.entries(groupedExercises).sort(
      ([weekA], [weekB]) => Number(weekA) - Number(weekB),
    );
  }, [selectedTemplate?.exercises]);

  return (
    <div>
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

      {!isLoading && !selectedTemplate && (
        <Card className="mt-8 rounded-[10px] border-0 bg-[#1a1a1a] ring-0">
          <CardHeader>
            <CardTitle className="font-space-grotesk text-[#fcfdff]">
              No program selected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-space-mono text-sm text-white/50">
              Choose a training template first to see weeks and training days
              here.
            </p>
            <Button asChild className="bg-white text-black">
              <Link to="/templates">Open Templates</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && selectedTemplate && (
        <Card className="mt-8 rounded-[10px] border-0 bg-[#1a1a1a] ring-0">
          <CardHeader>
            <CardTitle className="font-space-grotesk text-[#fcfdff]">
              {selectedTemplate.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="max-h-[65vh] space-y-5 overflow-y-auto pr-2">
            {groupedExerciseEntries.map(([weekNumber, days]) => {
              const numericWeek = Number(weekNumber);
              const isWeekOpen = openWeek === numericWeek;
              const dayEntries = Object.entries(days).sort(
                ([dayA], [dayB]) => Number(dayA) - Number(dayB),
              );

              return (
                <div key={weekNumber} className="border-white/20">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between border-0 border-b border-white/20 py-4 font-montserrat font-normal text-[#fcfdff] focus-visible:border-input focus-visible:ring-0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={() => {
                      setOpenWeek(isWeekOpen ? null : numericWeek);
                      setOpenDay(null);
                    }}
                  >
                    <span>Week {weekNumber}</span>
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        isWeekOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isWeekOpen && (
                    <div className="mt-5 space-y-4 pb-2">
                      <div className="grid grid-cols-3 gap-3">
                        {dayEntries.map(([dayNumber]) => {
                          const numericDay = Number(dayNumber);
                          const isDayOpen = openDay === numericDay;
                          const exercisesForDay = days[numericDay] ?? [];
                          const tone = dayToneForExercises(
                            exercisesForDay,
                            journalLogs,
                          );
                          const toneClasses =
                            tone === "green"
                              ? "border-green-500/55 bg-green-950/45 text-green-100"
                              : tone === "orange"
                                ? "border-orange-500/55 bg-orange-950/45 text-orange-100"
                                : "border-white/10 text-white/70 hover:bg-white/10 hover:text-white";

                          return (
                            <button
                              key={dayNumber}
                              type="button"
                              className={`rounded-md border px-3 py-2 font-space-mono text-sm transition-colors ${
                                isDayOpen
                                  ? "border-white/40 bg-white text-black ring-2 ring-white/25 ring-offset-2 ring-offset-[#1a1a1a]"
                                  : toneClasses
                              }`}
                              onClick={() =>
                                setOpenDay(isDayOpen ? null : numericDay)
                              }
                            >
                              Day {dayLabels[numericDay] ?? dayNumber}
                            </button>
                          );
                        })}
                      </div>

                      {openDay && days[openDay] && (
                        <div className="space-y-3">
                          {days[openDay].map((exercise) => (
                            <div
                              key={exercise.id}
                              className="rounded-md border border-white/10 px-3 py-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-space-mono text-sm text-[#fcfdff]">
                                  {exercise.exercise}
                                </span>
                                <span className="font-space-mono text-xs text-white/50">
                                  plan: {exercise.sets}x{exercise.reps}{" "}
                                  {exercise.kg ?? 0}kg
                                </span>
                              </div>

                              <div className="mt-4 grid grid-cols-3 gap-3 font-montserrat text-[#fcfdff]">
                                <div>
                                  <h3 className="text-sm">reps</h3>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="w-full rounded-none border-0 border-b border-white/20 text-center placeholder:text-center focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
                                    placeholder="0"
                                    value={journalLogs[exercise.id]?.reps ?? ""}
                                    onChange={(event) =>
                                      setJournalLogField(
                                        exercise.id,
                                        "reps",
                                        event.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <h3 className="text-sm">sets</h3>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="w-full rounded-none border-0 border-b border-white/20 text-center placeholder:text-center focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
                                    placeholder="0"
                                    value={journalLogs[exercise.id]?.sets ?? ""}
                                    onChange={(event) =>
                                      setJournalLogField(
                                        exercise.id,
                                        "sets",
                                        event.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <h3 className="text-sm">kg</h3>
                                  <Input
                                    type="number"
                                    min={0}
                                    className="w-full rounded-none border-0 border-b border-white/20 text-center placeholder:text-center focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
                                    placeholder="0"
                                    value={journalLogs[exercise.id]?.kg ?? ""}
                                    onChange={(event) =>
                                      setJournalLogField(
                                        exercise.id,
                                        "kg",
                                        event.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="relative flex items-center justify-between border-t-0 bg-transparent">
            <span className="font-space-mono text-sm text-white/50">
              {selectedTemplate.exercises.length} exercises
            </span>
            <span className="absolute bottom-3 right-4 font-space-mono text-sm tabular-nums text-white/80">
              {completedExerciseCount}/{selectedTemplate.exercises.length}
            </span>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
