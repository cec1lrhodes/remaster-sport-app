import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TemplateDraft } from "@/types/templates";

import {
  initialDraft,
  toOptionalNonNegativeNumber,
  toPositiveInt,
} from "./utils/draftUtils";

type DraftState = {
  draft: TemplateDraft;
  error: string | null;
  setDraftField: <Key extends keyof TemplateDraft>(
    field: Key,
    value: TemplateDraft[Key],
  ) => void;
  addExerciseToDraft: (exerciseName?: string) => void;
  removeExerciseFromDraft: (localId: string) => void;
  resetDraft: () => void;
  setError: (error: string | null) => void;
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      error: null,

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
          set({
            error: "Choose exercise and enter valid sets, reps and kg",
          });
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

      setError(error) {
        set({ error });
      },
    }),
    {
      name: "remaster-sport-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
