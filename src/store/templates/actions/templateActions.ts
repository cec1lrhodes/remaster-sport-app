import { templatesApi } from "@/api/templatesApi";
import type { Template } from "@/types/templates";

import { useDraftStore } from "../draftStore";
import { useJournalStore } from "../journalStore";
import { useTemplatesStore } from "../templatesStore";
import { createPayloadFromDraft } from "../utils/draftUtils";

export async function fetchTemplates(): Promise<void> {
  const templatesStore = useTemplatesStore.getState();
  const journalStore = useJournalStore.getState();

  templatesStore.setLoading(true);
  templatesStore.setError(null);

  try {
    const templates = await templatesApi.getTemplates();
    templatesStore.setTemplates(templates);
    journalStore.pruneToTemplates(templates);
    templatesStore.setLoading(false);
  } catch (error) {
    templatesStore.setError(
      error instanceof Error ? error.message : "Failed to load templates",
    );
    templatesStore.setLoading(false);
  }
}

export async function createTemplate(): Promise<Template | null> {
  const templatesStore = useTemplatesStore.getState();
  const draftStore = useDraftStore.getState();
  const payload = createPayloadFromDraft(draftStore.draft);

  if (!payload) {
    draftStore.setError("Add a template name and at least one exercise");
    return null;
  }

  templatesStore.setCreating(true);
  templatesStore.setError(null);
  draftStore.setError(null);

  try {
    const template = await templatesApi.createTemplate(payload);
    templatesStore.addTemplate(template);
    draftStore.resetDraft();
    templatesStore.setCreating(false);
    return template;
  } catch (error) {
    templatesStore.setError(
      error instanceof Error ? error.message : "Failed to create template",
    );
    templatesStore.setCreating(false);
    return null;
  }
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const templatesStore = useTemplatesStore.getState();
  const journalStore = useJournalStore.getState();

  templatesStore.setError(null);

  const removed = templatesStore.templates.find(
    (template) => template.id === templateId,
  );

  try {
    await templatesApi.deleteTemplate(templateId);
    templatesStore.removeTemplate(templateId);

    if (removed) {
      journalStore.cleanupForTemplate(templateId, removed.exercises);
    }
  } catch (error) {
    templatesStore.setError(
      error instanceof Error ? error.message : "Failed to delete template",
    );
  }
}
