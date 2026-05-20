import type {
  JournalExerciseLog,
  Template,
  TemplateExercise,
} from "@/types/templates";

export const pruneJournalLogsToTemplates = (
  logs: Record<string, JournalExerciseLog>,
  templates: Template[],
) => {
  const validIds = new Set(
    templates.flatMap((template) =>
      template.exercises.map((exercise) => exercise.id),
    ),
  );

  return Object.fromEntries(
    Object.entries(logs).filter(([exerciseId]) => validIds.has(exerciseId)),
  );
};

export const pruneJournalDayDatesToTemplates = (
  dates: Record<string, string>,
  templates: Template[],
) => {
  const validPrefixes = templates.map((template) => `${template.id}:`);

  return Object.fromEntries(
    Object.entries(dates).filter(([key]) =>
      validPrefixes.some((prefix) => key.startsWith(prefix)),
    ),
  );
};

export const cleanupJournalForDeletedTemplate = (
  journalLogs: Record<string, JournalExerciseLog>,
  journalDayDates: Record<string, string>,
  templateId: string,
  exercises: TemplateExercise[],
) => {
  const removedExerciseIds = new Set(exercises.map((exercise) => exercise.id));
  const logs = Object.fromEntries(
    Object.entries(journalLogs).filter(
      ([exerciseId]) => !removedExerciseIds.has(exerciseId),
    ),
  );
  const templatePrefix = `${templateId}:`;
  const dayDates = Object.fromEntries(
    Object.entries(journalDayDates).filter(
      ([key]) => !key.startsWith(templatePrefix),
    ),
  );

  return { journalLogs: logs, journalDayDates: dayDates };
};
