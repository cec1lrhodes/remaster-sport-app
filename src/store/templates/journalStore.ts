import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { JournalExerciseLog, Template } from "@/types/templates";
import { journalDayDateKey } from "@/utils/journalUtils";

import {
  cleanupJournalForDeletedTemplate,
  pruneJournalDayDatesToTemplates,
  pruneJournalLogsToTemplates,
} from "./utils/journalPruneUtils";

type JournalState = {
  selectedTemplateId: string | null;
  journalLogs: Record<string, JournalExerciseLog>;
  /** ISO YYYY-MM-DD, ключ — journalDayDateKey */
  journalDayDates: Record<string, string>;
  setSelectedTemplateId: (templateId: string) => void;
  clearSelectedTemplateId: () => void;
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
  pruneToTemplates: (templates: Template[]) => void;
  cleanupForTemplate: (
    templateId: string,
    exercises: Template["exercises"],
  ) => void;
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      selectedTemplateId: null,
      journalLogs: {},
      journalDayDates: {},

      setSelectedTemplateId(templateId) {
        set({ selectedTemplateId: templateId });
      },

      clearSelectedTemplateId() {
        set({ selectedTemplateId: null });
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

          return { journalDayDates };
        });
      },

      pruneToTemplates(templates) {
        const { journalLogs, journalDayDates } = get();

        set({
          journalLogs: pruneJournalLogsToTemplates(journalLogs, templates),
          journalDayDates: pruneJournalDayDatesToTemplates(
            journalDayDates,
            templates,
          ),
        });
      },

      cleanupForTemplate(templateId, exercises) {
        const { journalLogs, journalDayDates, selectedTemplateId } = get();
        const cleaned = cleanupJournalForDeletedTemplate(
          journalLogs,
          journalDayDates,
          templateId,
          exercises,
        );

        set({
          ...cleaned,
          selectedTemplateId:
            selectedTemplateId === templateId ? null : selectedTemplateId,
        });
      },
    }),
    {
      name: "remaster-sport-journal",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedTemplateId: state.selectedTemplateId,
        journalLogs: state.journalLogs,
        journalDayDates: state.journalDayDates,
      }),
    },
  ),
);
