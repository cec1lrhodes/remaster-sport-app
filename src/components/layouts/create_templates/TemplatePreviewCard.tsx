import { useMemo } from "react";
import { ChevronDown, XIcon } from "lucide-react";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/ui/card";
import type { DraftTemplateExercise, TemplateDraft } from "@/types/templates";

const dayLabels: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
};

type SetDraftField = <Key extends keyof TemplateDraft>(
  field: Key,
  value: TemplateDraft[Key],
) => void;

interface TemplatePreviewCardProps {
  draft: TemplateDraft;
  openWeek: number | null;
  isCreating: boolean;
  setDraftField: SetDraftField;
  onOpenWeekChange: (week: number | null) => void;
  onRemoveExercise: (localId: string) => void;
  onConfirm: () => void;
}

export const TemplatePreviewCard = ({
  draft,
  openWeek,
  isCreating,
  setDraftField,
  onOpenWeekChange,
  onRemoveExercise,
  onConfirm,
}: TemplatePreviewCardProps) => {
  const groupedExerciseEntries = useMemo(() => {
    const groupedExercises = draft.exercises.reduce<
      Record<number, Record<number, DraftTemplateExercise[]>>
    >((acc, exercise) => {
      acc[exercise.weekNumber] ??= {};
      acc[exercise.weekNumber][exercise.dayNumber] ??= [];
      acc[exercise.weekNumber][exercise.dayNumber].push(exercise);

      return acc;
    }, {});

    return Object.entries(groupedExercises).sort(
      ([weekA], [weekB]) => Number(weekA) - Number(weekB),
    );
  }, [draft.exercises]);

  return (
    <div className="mt-10">
      <Card className="rounded-[10px] border border-none bg-[#1a1a1a] ring-0 ">
        <CardHeader>
          <CardTitle className="font-space-grotesk text-[#fcfdff]">
            Full Card
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[45vh] space-y-5 overflow-y-auto pr-2">
          <div className="space-y-3">
            <Input
              className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
              placeholder="template name"
              value={draft.title}
              onChange={(event) => setDraftField("title", event.target.value)}
            />
          </div>

          {draft.exercises.length === 0 ? (
            <p className="font-space-mono text-sm text-white/50">
              Add exercises to build this template.
            </p>
          ) : (
            <div>
              {groupedExerciseEntries.map(([weekNumber, days]) => {
                const numericWeek = Number(weekNumber);
                const isOpen = openWeek === numericWeek;
                const dayEntries = Object.entries(days).sort(
                  ([dayA], [dayB]) => Number(dayA) - Number(dayB),
                );

                return (
                  <div key={weekNumber} className="border-white/20">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between border-0 border-b border-white/20 py-4 font-montserrat font-normal text-[#fcfdff] focus-visible:border-input focus-visible:ring-0"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() =>
                        onOpenWeekChange(isOpen ? null : numericWeek)
                      }
                    >
                      <span>Week {weekNumber}</span>
                      <ChevronDown
                        className={`size-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-5 space-y-6 pb-2">
                        {dayEntries.map(([dayNumber, dayExercises]) => (
                          <div key={dayNumber} className="space-y-2">
                            <h3 className="font-space-mono text-sm text-white/70">
                              {dayLabels[Number(dayNumber)] ?? dayNumber}
                            </h3>

                            <div className="space-y-2">
                              {dayExercises.map((exercise) => (
                                <div
                                  key={exercise.localId}
                                  className="flex items-center justify-between gap-3 rounded-md border border-white/10 px-3 py-2"
                                >
                                  <span className="font-space-mono text-sm text-[#fcfdff]">
                                    {exercise.exercise} {exercise.sets}x
                                    {exercise.reps} {exercise.kg ?? 0}kg
                                  </span>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    aria-label={`Delete ${exercise.exercise}`}
                                    className="text-white/50 hover:bg-white/10 hover:text-white focus-visible:border-input focus-visible:ring-0"
                                    onClick={() =>
                                      onRemoveExercise(exercise.localId)
                                    }
                                  >
                                    <XIcon
                                      className="size-3"
                                      aria-hidden="true"
                                    />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t-0 bg-transparent">
          <span className="font-space-mono text-sm text-white/50">
            {draft.exercises.length} exercises
          </span>
          <Button
            type="button"
            className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 hover:text-green-500"
            disabled={isCreating}
            onClick={onConfirm}
          >
            <span className="font-montserrat">
              {isCreating ? "Saving..." : "Confirm"}
            </span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
