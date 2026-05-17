import type { JournalExerciseLog, TemplateExercise } from "@/types/templates";

export type DayTone = "neutral" | "green" | "orange";

export const DAY_LABELS: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
};

export const isJournalLogComplete = (
  log: JournalExerciseLog | undefined,
): boolean => {
  if (!log) return false;

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

export const getDayTone = (
  exercises: TemplateExercise[],
  logs: Record<string, JournalExerciseLog>,
): DayTone => {
  if (exercises.length === 0) return "neutral";

  const allComplete = exercises.every((ex) =>
    isJournalLogComplete(logs[ex.id]),
  );
  if (!allComplete) return "neutral";

  const anyBelowTarget = exercises.some(
    (ex) => Number(logs[ex.id]!.reps) < ex.reps,
  );
  if (anyBelowTarget) return "orange";

  const allMatchTarget = exercises.every(
    (ex) => Number(logs[ex.id]!.reps) === ex.reps,
  );
  return allMatchTarget ? "green" : "neutral";
};

export const groupExercisesByWeekAndDay = (
  exercises: TemplateExercise[],
): [string, Record<number, TemplateExercise[]>][] => {
  const grouped = exercises.reduce<
    Record<number, Record<number, TemplateExercise[]>>
  >((acc, exercise) => {
    acc[exercise.weekNumber] ??= {};
    acc[exercise.weekNumber][exercise.dayNumber] ??= [];
    acc[exercise.weekNumber][exercise.dayNumber].push(exercise);
    return acc;
  }, {});

  return Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b));
};
