import { create } from "zustand";

import { templatesApi } from "@/api/templatesApi";
import type {
  CreateTemplatePayload,
  Template,
  TemplateDraft,
} from "@/types/templates";

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
  draft: TemplateDraft;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: () => Promise<Template | null>;
  deleteTemplate: (templateId: string) => Promise<void>;
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

const createPayloadFromDraft = (draft: TemplateDraft): CreateTemplatePayload | null => {
  const title = draft.title.trim();

  if (!title || draft.exercises.length === 0) {
    return null;
  }

  return {
    title,
    description: draft.description.trim() || undefined,
    weeksCount: Math.max(...draft.exercises.map((exercise) => exercise.weekNumber)),
    exercises: draft.exercises.map(({ localId: _localId, ...exercise }) => exercise),
  };
};

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  draft: initialDraft,
  isLoading: false,
  isCreating: false,
  error: null,

  async fetchTemplates() {
    set({ isLoading: true, error: null });

    try {
      const templates = await templatesApi.getTemplates();
      set({ templates, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load templates",
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
        error: error instanceof Error ? error.message : "Failed to create template",
        isCreating: false,
      });

      return null;
    }
  },

  async deleteTemplate(templateId) {
    set({ error: null });

    try {
      await templatesApi.deleteTemplate(templateId);
      set((state) => ({
        templates: state.templates.filter((template) => template.id !== templateId),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete template",
      });
    }
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
    const exercise = (exerciseName ?? draft.customExercise ?? draft.currentExercise).trim();
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
          item.weekNumber === draft.selectedWeek && item.dayNumber === draft.selectedDay,
      ).length + 1;

    set((state) => ({
      draft: {
        ...state.draft,
        currentExercise: "",
        customExercise: "",
        currentSets: "",
        currentReps: "",
        currentKg: "",
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
        exercises: state.draft.exercises.filter((exercise) => exercise.localId !== localId),
      },
      error: null,
    }));
  },

  resetDraft() {
    set({ draft: initialDraft, error: null });
  },
}));
