import { useMemo } from "react";

import { fetchTemplates } from "../actions/templateActions";
import { useJournalStore } from "../journalStore";
import { useTemplatesStore } from "../templatesStore";

export function useJournal() {
  const templates = useTemplatesStore((s) => s.templates);
  const isLoading = useTemplatesStore((s) => s.isLoading);
  const error = useTemplatesStore((s) => s.error);
  const selectedTemplateId = useJournalStore((s) => s.selectedTemplateId);
  const journalLogs = useJournalStore((s) => s.journalLogs);
  const journalDayDates = useJournalStore((s) => s.journalDayDates);
  const setSelectedTemplateId = useJournalStore((s) => s.setSelectedTemplateId);
  const setJournalLogField = useJournalStore((s) => s.setJournalLogField);
  const setJournalDayDate = useJournalStore((s) => s.setJournalDayDate);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId],
  );

  return useMemo(
    () => ({
      templates,
      selectedTemplateId,
      selectedTemplate,
      journalLogs,
      journalDayDates,
      isLoading,
      error,
      fetchTemplates,
      setSelectedTemplateId,
      setJournalLogField,
      setJournalDayDate,
    }),
    [
      templates,
      selectedTemplateId,
      selectedTemplate,
      journalLogs,
      journalDayDates,
      isLoading,
      error,
      setSelectedTemplateId,
      setJournalLogField,
      setJournalDayDate,
    ],
  );
}
