import { create } from "zustand";

import type { Template } from "@/types/templates";

type TemplatesState = {
  templates: Template[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  removeTemplate: (templateId: string) => Template | undefined;
  setLoading: (isLoading: boolean) => void;
  setCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
};

export const useTemplatesStore = create<TemplatesState>()((set, get) => ({
  templates: [],
  isLoading: false,
  isCreating: false,
  error: null,

  setTemplates(templates) {
    set({ templates });
  },

  addTemplate(template) {
    set((state) => ({
      templates: [template, ...state.templates],
    }));
  },

  removeTemplate(templateId) {
    const removed = get().templates.find(
      (template) => template.id === templateId,
    );

    set((state) => ({
      templates: state.templates.filter(
        (template) => template.id !== templateId,
      ),
    }));

    return removed;
  },

  setLoading(isLoading) {
    set({ isLoading });
  },

  setCreating(isCreating) {
    set({ isCreating });
  },

  setError(error) {
    set({ error });
  },
}));
