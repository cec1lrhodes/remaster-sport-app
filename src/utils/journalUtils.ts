import { format } from "date-fns";

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

/** Ключ дати виконання дня в журналі: templateId:week:day */
export const journalDayDateKey = (
  templateId: string,
  weekNumber: number,
  dayNumber: number,
) => `${templateId}:${weekNumber}:${dayNumber}`;

export const parseJournalDate = (iso: string): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const toJournalDateIso = (date: Date) => format(date, "yyyy-MM-dd");

export const formatJournalDate = (iso: string) =>
  parseJournalDate(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });

export const getJournalDayDateIso = (
  templateId: string,
  weekNumber: number,
  dayNumber: number,
  journalDayDates: Record<string, string>,
) => journalDayDates[journalDayDateKey(templateId, weekNumber, dayNumber)];

export const getTemplateWorkoutDates = (
  templateId: string,
  journalDayDates: Record<string, string>,
): Date[] => {
  const prefix = `${templateId}:`;

  return Object.entries(journalDayDates)
    .filter(([key]) => key.startsWith(prefix))
    .map(([, iso]) => parseJournalDate(iso));
};

export const getTemplateWorkoutDatesByTone = (
  templateId: string,
  journalDayDates: Record<string, string>,
  exercises: TemplateExercise[],
  logs: Record<string, JournalExerciseLog>,
) => {
  const prefix = `${templateId}:`;
  const exercisesByWeekDay = exercises.reduce<
    Record<number, Record<number, TemplateExercise[]>>
  >((acc, exercise) => {
    acc[exercise.weekNumber] ??= {};
    acc[exercise.weekNumber][exercise.dayNumber] ??= [];
    acc[exercise.weekNumber][exercise.dayNumber].push(exercise);
    return acc;
  }, {});

  const green: Date[] = [];
  const orange: Date[] = [];
  const neutral: Date[] = [];

  for (const [key, iso] of Object.entries(journalDayDates)) {
    if (!key.startsWith(prefix)) continue;

    const [weekStr, dayStr] = key.slice(prefix.length).split(":");
    if (!weekStr || !dayStr) continue;

    const weekNumber = Number(weekStr);
    const dayNumber = Number(dayStr);
    const dayExercises = exercisesByWeekDay[weekNumber]?.[dayNumber] ?? [];
    const tone = getDayTone(dayExercises, logs);
    const date = parseJournalDate(iso);

    if (tone === "green") green.push(date);
    else if (tone === "orange") orange.push(date);
    else neutral.push(date);
  }

  return { green, orange, neutral };
};

/** Стилі кнопок дня в календарі — відповідають DaySelector */
export const DAY_TONE_CALENDAR_CLASSES = {
  green:
    "[&>button]:!bg-[#003c33] [&>button]:!text-white [&>button]:hover:!bg-[#003c33] [&>button]:hover:!text-white",
  orange:
    "[&>button]:!bg-[#a9583e] [&>button]:!text-white [&>button]:hover:!bg-[#a9583e] [&>button]:hover:!text-white",
  neutral:
    "[&>button]:!bg-white/10 [&>button]:!text-white/80 [&>button]:hover:!bg-white/15 [&>button]:hover:!text-white",
} as const;

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
