export type TemplateExercise = {
  id: string;
  templateId: string;
  exercise: string;
  weekNumber: number;
  dayNumber: number;
  order: number;
  sets: number;
  reps: number;
  kg?: number | null;
  createdAt: string;
};

export type Template = {
  id: string;
  userId?: string | null;
  title: string;
  description?: string | null;
  weeksCount: number;
  createdAt: string;
  updatedAt: string;
  exercises: TemplateExercise[];
};

export type CreateTemplateExercisePayload = {
  exercise: string;
  weekNumber: number;
  dayNumber: number;
  order: number;
  sets: number;
  reps: number;
  kg?: number;
};

export type CreateTemplatePayload = {
  title: string;
  description?: string;
  weeksCount: number;
  exercises: CreateTemplateExercisePayload[];
};

export type DraftTemplateExercise = CreateTemplateExercisePayload & {
  localId: string;
};

export type TemplateDraft = {
  title: string;
  description: string;
  selectedWeek: number;
  selectedDay: number;
  currentExercise: string;
  customExercise: string;
  currentSets: string;
  currentReps: string;
  currentKg: string;
  exercises: DraftTemplateExercise[];
};
