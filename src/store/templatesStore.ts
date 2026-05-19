import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { templatesApi } from "@/api/templatesApi";
import type {
  CreateTemplatePayload,
  JournalExerciseLog,
  Template,
  TemplateDraft,
} from "@/types/templates";
import { journalDayDateKey } from "@/utils/journalUtils";

const initialDraft: TemplateDraft = {
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

type TemplatesState = {
  templates: Template[];
  selectedTemplateId: string | null;
  journalLogs: Record<string, JournalExerciseLog>;
  /** ISO YYYY-MM-DD, ключ — journalDayDateKey */
  journalDayDates: Record<string, string>;
  draft: TemplateDraft;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: () => Promise<Template | null>;
  deleteTemplate: (templateId: string) => Promise<void>;
  setSelectedTemplateId: (templateId: string) => void;
  setJournalLogField: (
    templateExerciseId: string,
    field: keyof JournalExerciseLog,
    value: string,
  ) => void;
  setJournalDayDate: (
    templateId: string,
    weekNumber: number,
    dayNumber: number,
    dateIso: string | null,
  ) => void;
  setDraftField: <Key extends keyof TemplateDraft>(
    field: Key,
    value: TemplateDraft[Key],
  ) => void;
  addExerciseToDraft: (exerciseName?: string) => void;
  removeExerciseFromDraft: (localId: string) => void;
  resetDraft: () => void;
};

const toPositiveInt = (value: string) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
};

const toOptionalNonNegativeNumber = (value: string) => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
};

const pruneJournalLogsToTemplates = (
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

const pruneJournalDayDatesToTemplates = (
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

const createPayloadFromDraft = (
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

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set, get) => ({
      templates: [],
      selectedTemplateId: null,
      journalLogs: {},
      journalDayDates: {},
      draft: initialDraft,
      isLoading: false,
      isCreating: false,
      error: null,

      async fetchTemplates() {
        set({ isLoading: true, error: null });

        try {
          const templates = await templatesApi.getTemplates();
          set((state) => ({
            templates,
            isLoading: false,
            journalLogs: pruneJournalLogsToTemplates(
              state.journalLogs,
              templates,
            ),
            journalDayDates: pruneJournalDayDatesToTemplates(
              state.journalDayDates,
              templates,
            ),
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load templates",
            isLoading: false,
          });
        }
      },

      async createTemplate() {
        const payload = createPayloadFromDraft(get().draft);

        if (!payload) {
          set({ error: "Add a template name and at least one exercise" });
          return null;
        }

        set({ isCreating: true, error: null });

        try {
          const template = await templatesApi.createTemplate(payload);
          set((state) => ({
            templates: [template, ...state.templates],
            draft: initialDraft,
            isCreating: false,
          }));

          return template;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create template",
            isCreating: false,
          });

          return null;
        }
      },

      async deleteTemplate(templateId) {
        set({ error: null });

        try {
          await templatesApi.deleteTemplate(templateId);
          set((state) => {
            const removed = state.templates.find(
              (template) => template.id === templateId,
            );
            const removedExerciseIds = new Set(
              removed?.exercises.map((exercise) => exercise.id) ?? [],
            );
            const journalLogs = Object.fromEntries(
              Object.entries(state.journalLogs).filter(
                ([exerciseId]) => !removedExerciseIds.has(exerciseId),
              ),
            );
            const templatePrefix = `${templateId}:`;
            const journalDayDates = Object.fromEntries(
              Object.entries(state.journalDayDates).filter(
                ([key]) => !key.startsWith(templatePrefix),
              ),
            );

            const templates = state.templates.filter(
              (template) => template.id !== templateId,
            );

            return {
              templates,
              journalLogs,
              journalDayDates,
              selectedTemplateId:
                state.selectedTemplateId === templateId
                  ? null
                  : state.selectedTemplateId,
            };
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete template",
          });
        }
      },

      setSelectedTemplateId(templateId) {
        set({ selectedTemplateId: templateId, error: null });
      },

      setJournalLogField(templateExerciseId, field, value) {
        set((state) => {
          const prev = state.journalLogs[templateExerciseId] ?? {
            reps: "",
            sets: "",
            kg: "",
          };

          return {
            journalLogs: {
              ...state.journalLogs,
              [templateExerciseId]: {
                ...prev,
                [field]: value,
              },
            },
            error: null,
          };
        });
      },

      setJournalDayDate(templateId, weekNumber, dayNumber, dateIso) {
        const key = journalDayDateKey(templateId, weekNumber, dayNumber);

        set((state) => {
          const journalDayDates = { ...state.journalDayDates };

          if (dateIso) {
            journalDayDates[key] = dateIso;
          } else {
            delete journalDayDates[key];
          }

          return { journalDayDates, error: null };
        });
      },

      setDraftField(field, value) {
        set((state) => ({
          draft: {
            ...state.draft,
            [field]: value,
          },
          error: null,
        }));
      },

      addExerciseToDraft(exerciseName) {
        const draft = get().draft;
        const exercise =
          exerciseName?.trim() ||
          draft.customExercise.trim() ||
          draft.currentExercise.trim();
        const sets = toPositiveInt(draft.currentSets);
        const reps = toPositiveInt(draft.currentReps);
        const kg = toOptionalNonNegativeNumber(draft.currentKg);

        if (!exercise || !sets || !reps || kg === null) {
          set({ error: "Choose exercise and enter valid sets, reps and kg" });
          return;
        }

        const order =
          draft.exercises.filter(
            (item) =>
              item.weekNumber === draft.selectedWeek &&
              item.dayNumber === draft.selectedDay,
          ).length + 1;

        set((state) => ({
          draft: {
            ...state.draft,
            currentExercise: "",
            customExercise: "",
            exercises: [
              ...state.draft.exercises,
              {
                localId: crypto.randomUUID(),
                exercise,
                weekNumber: draft.selectedWeek,
                dayNumber: draft.selectedDay,
                order,
                sets,
                reps,
                kg,
              },
            ],
          },
          error: null,
        }));
      },

      removeExerciseFromDraft(localId) {
        set((state) => ({
          draft: {
            ...state.draft,
            exercises: state.draft.exercises.filter(
              (exercise) => exercise.localId !== localId,
            ),
          },
          error: null,
        }));
      },

      resetDraft() {
        set({ draft: initialDraft, error: null });
      },
    }),
    {
      name: "remaster-sport-template-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draft: state.draft,
        selectedTemplateId: state.selectedTemplateId,
        journalLogs: state.journalLogs,
        journalDayDates: state.journalDayDates,
      }),
    },
  ),
);
