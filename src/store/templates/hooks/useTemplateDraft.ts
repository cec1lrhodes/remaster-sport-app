import { useMemo } from "react";

import { createTemplate } from "../actions/templateActions";
import { useDraftStore } from "../draftStore";
import { useTemplatesStore } from "../templatesStore";

export function useTemplateDraft() {
  const draft = useDraftStore((s) => s.draft);
  const error = useDraftStore((s) => s.error);
  const isCreating = useTemplatesStore((s) => s.isCreating);
  const createError = useTemplatesStore((s) => s.error);
  const setDraftField = useDraftStore((s) => s.setDraftField);
  const addExerciseToDraft = useDraftStore((s) => s.addExerciseToDraft);
  const removeExerciseFromDraft = useDraftStore(
    (s) => s.removeExerciseFromDraft,
  );

  return useMemo(
    () => ({
      draft,
      error: error ?? createError,
      isCreating,
      setDraftField,
      addExerciseToDraft,
      removeExerciseFromDraft,
      createTemplate,
    }),
    [
      draft,
      error,
      createError,
      isCreating,
      setDraftField,
      addExerciseToDraft,
      removeExerciseFromDraft,
    ],
  );
}
