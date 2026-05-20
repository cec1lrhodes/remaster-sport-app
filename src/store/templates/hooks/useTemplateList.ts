import { useMemo } from "react";

import { deleteTemplate, fetchTemplates } from "../actions/templateActions";
import { useTemplatesStore } from "../templatesStore";

export function useTemplateList() {
  const templates = useTemplatesStore((s) => s.templates);
  const isLoading = useTemplatesStore((s) => s.isLoading);
  const error = useTemplatesStore((s) => s.error);

  return useMemo(
    () => ({
      templates,
      isLoading,
      error,
      fetchTemplates,
      deleteTemplate,
    }),
    [templates, isLoading, error],
  );
}
