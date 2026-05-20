import type { CreateTemplatePayload, TemplateDraft } from "@/types/templates";

export const initialDraft: TemplateDraft = {
  title: "",
  description: "",
  selectedWeek: 1,
  selectedDay: 1,
  currentExercise: "",
  customExercise: "",
  currentSets: "",
  currentReps: "",
  currentKg: "",
  exercises: [],
};

export const toPositiveInt = (value: string) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

export const toOptionalNonNegativeNumber = (value: string) => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
};

export const createPayloadFromDraft = (
  draft: TemplateDraft,
): CreateTemplatePayload | null => {
  const title = draft.title.trim();

  if (!title || draft.exercises.length === 0) {
    return null;
  }

  return {
    title,
    description: draft.description.trim() || undefined,
    weeksCount: Math.max(
      ...draft.exercises.map((exercise) => exercise.weekNumber),
    ),
    exercises: draft.exercises.map((exercise) => ({
      exercise: exercise.exercise,
      weekNumber: exercise.weekNumber,
      dayNumber: exercise.dayNumber,
      order: exercise.order,
      sets: exercise.sets,
      reps: exercise.reps,
      kg: exercise.kg ?? undefined,
    })),
  };
};
