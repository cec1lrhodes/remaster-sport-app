import { useMemo } from "react";
import { ChevronLeft, XIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { useTemplatesStore } from "@/store/templatesStore";
import type { DraftTemplateExercise } from "@/types/templates";

const exercises = [
  { name: "Squat", id: 1 },
  { name: "Bench Press", id: 2 },
  { name: "Deadlift", id: 3 },
  { name: "Squat", id: 4 },
  { name: "Pull-ups", id: 5 },
  { name: "Bar pressing", id: 6 },
];

const dayLabels: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
};

export const AddTemplatesPage = () => {
  const navigate = useNavigate();
  const draft = useTemplatesStore((state) => state.draft);
  const error = useTemplatesStore((state) => state.error);
  const isCreating = useTemplatesStore((state) => state.isCreating);
  const setDraftField = useTemplatesStore((state) => state.setDraftField);
  const addExerciseToDraft = useTemplatesStore(
    (state) => state.addExerciseToDraft,
  );
  const removeExerciseFromDraft = useTemplatesStore(
    (state) => state.removeExerciseFromDraft,
  );
  const createTemplate = useTemplatesStore((state) => state.createTemplate);

  const groupedExercises = useMemo(() => {
    return draft.exercises.reduce<
      Record<number, Record<number, DraftTemplateExercise[]>>
    >((acc, exercise) => {
      acc[exercise.weekNumber] ??= {};
      acc[exercise.weekNumber][exercise.dayNumber] ??= [];
      acc[exercise.weekNumber][exercise.dayNumber].push(exercise);

      return acc;
    }, {});
  }, [draft.exercises]);

  const handleConfirm = async () => {
    const template = await createTemplate();

    if (template) {
      navigate({ to: "/templates" });
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link
          to="/templates"
          aria-label="Back to library"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-[20px] font-space-grotesk text-[#fcfdff]">
          Create new template
        </h1>
      </div>

      <div className="mt-8 pl-2">
        <h1 className="text-[16px] font-montserrat text-[#fcfdff]">
          select week & day
        </h1>

        <div className="mt-3 grid w-full grid-cols-2 gap-3">
          <Select
            value={String(draft.selectedWeek)}
            onValueChange={(value) =>
              setDraftField("selectedWeek", Number(value))
            }
          >
            <SelectTrigger className="w-full focus-visible:border-input focus-visible:ring-0 border-0 border-b border-white/20 rounded-none ">
              <SelectValue placeholder="week" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={String(draft.selectedDay)}
            onValueChange={(value) =>
              setDraftField("selectedDay", Number(value))
            }
          >
            <SelectTrigger className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0">
              <SelectValue placeholder="day" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              align="start"
              className="z-9999 w-(--radix-select-trigger-width) border border-white/20 bg-black ring-0"
            >
              <SelectGroup>
                <SelectItem value="1">A</SelectItem>
                <SelectItem value="2">B</SelectItem>
                <SelectItem value="3">C</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {exercises.map((exercise) => (
          <div key={exercise.id}>
            <Button
              type="button"
              className={
                draft.currentExercise === exercise.name
                  ? "border border-white/40 bg-white text-black"
                  : ""
              }
              onClick={() => setDraftField("currentExercise", exercise.name)}
            >
              <span className="font-space-mono">{exercise.name}</span>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Input
          className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
          placeholder="custom exercise"
          value={draft.customExercise}
          onChange={(event) =>
            setDraftField("customExercise", event.target.value)
          }
        />
        <Button
          type="button"
          className=""
          onClick={() =>
            addExerciseToDraft(draft.customExercise || draft.currentExercise)
          }
        >
          <span className="font-montserrat">Add</span>
        </Button>
      </div>

      {draft.currentExercise && (
        <p className="mt-3 pl-2 font-space-mono text-sm text-white/60">
          selected: {draft.currentExercise}
        </p>
      )}

      {/* REPS SETS KG */}
      <div className="mt-10 flex  justify-center gap-20 font-montserrat text-[#fcfdff]">
        <div>
          <h2>reps</h2>
          <Input
            className="w-full border-0 border-b placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentReps}
            onChange={(event) =>
              setDraftField("currentReps", event.target.value)
            }
          />
        </div>
        <div>
          <h2>sets</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentSets}
            onChange={(event) =>
              setDraftField("currentSets", event.target.value)
            }
          />
        </div>
        <div>
          <h2>kg</h2>
          <Input
            className="w-full border-0 border-b  placeholder:text-center text-center border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
            placeholder="0"
            value={draft.currentKg}
            onChange={(event) => setDraftField("currentKg", event.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 pl-2 font-montserrat text-sm text-red-400">
          {error}
        </p>
      )}

      {/* FULL CARD | CONFIRM | NAME */}

      <div className="mt-10">
        <Card className="rounded-[10px] border border-white/20 bg-transparent ring-0 ">
          <CardHeader>
            <CardTitle className="font-space-grotesk text-[#fcfdff]">
              Full Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Input
                className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
                placeholder="template name"
                value={draft.title}
                onChange={(event) => setDraftField("title", event.target.value)}
              />
              <Input
                className="w-full border-0 border-b border-white/20 rounded-none focus-visible:border-input focus-visible:ring-0 placeholder:font-space-mono"
                placeholder="description"
                value={draft.description}
                onChange={(event) =>
                  setDraftField("description", event.target.value)
                }
              />
            </div>

            {draft.exercises.length === 0 ? (
              <p className="font-space-mono text-sm text-white/50">
                Add exercises to build this template.
              </p>
            ) : (
              <Accordion
                type="single"
                collapsible
                defaultValue={`week-${draft.selectedWeek}`}
              >
                {Object.entries(groupedExercises).map(([weekNumber, days]) => (
                  <AccordionItem
                    key={weekNumber}
                    value={`week-${weekNumber}`}
                    className="border-white/20"
                  >
                    <AccordionTrigger className=" text-[#fcfdff] hover:no-underline focus-visible:border-input focus-visible:ring-0 border-0 border-b border-white/20 rounded-none  ">
                      <span className="font-montserrat">Week {weekNumber}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-5 mt-5">
                      {Object.entries(days).map(([dayNumber, dayExercises]) => (
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
                                    removeExerciseFromDraft(exercise.localId)
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
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
              onClick={handleConfirm}
            >
              <span className="font-montserrat">
                {isCreating ? "Saving..." : "Confirm"}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
