import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

import { TemplateExerciseForm } from "@/components/layouts/create_templates/CreateTemplates";
import { TemplatePreviewCard } from "@/components/layouts/create_templates/TemplatePreviewCard";
import { useTemplatesStore } from "@/store/templatesStore";

export const AddTemplatesPage = () => {
  const navigate = useNavigate();
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const draft = useTemplatesStore((state) => state.draft);
  const error = useTemplatesStore((state) => state.error);
  const isCreating = useTemplatesStore((state) => state.isCreating);
  const setDraftField = useTemplatesStore((state) => state.setDraftField);
  const addExerciseToDraft = useTemplatesStore(
    (state) => state.addExerciseToDraft,
  );
  const removeExerciseFromDraft = useTemplatesStore(
    (state) => state.removeExerciseFromDraft,
  );
  const createTemplate = useTemplatesStore((state) => state.createTemplate);

  const selectedExercise = draft.customExercise.trim() || draft.currentExercise;

  const handleExerciseSelect = (exerciseName: string) => {
    setDraftField("currentExercise", exerciseName);

    if (draft.customExercise) {
      setDraftField("customExercise", "");
    }
  };

  const handleCustomExerciseChange = (value: string) => {
    setDraftField("customExercise", value);

    if (value.trim() && draft.currentExercise) {
      setDraftField("currentExercise", "");
    }
  };

  const handleAddExercise = () => {
    setOpenWeek(draft.selectedWeek);
    addExerciseToDraft();
  };

  const handleConfirm = async () => {
    const template = await createTemplate();

    if (template) {
      navigate({ to: "/templates" });
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link
          to="/templates"
          aria-label="Back to library"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-[20px] font-space-grotesk text-[#fcfdff]">
          Create new template
        </h1>
      </div>

      <TemplateExerciseForm
        draft={draft}
        selectedExercise={selectedExercise}
        setDraftField={setDraftField}
        onExerciseSelect={handleExerciseSelect}
        onCustomExerciseChange={handleCustomExerciseChange}
        onAddExercise={handleAddExercise}
      />

      {error && (
        <p className="mt-4 pl-2 font-montserrat text-sm text-red-400">
          {error}
        </p>
      )}

      <TemplatePreviewCard
        draft={draft}
        openWeek={openWeek}
        isCreating={isCreating}
        setDraftField={setDraftField}
        onOpenWeekChange={setOpenWeek}
        onRemoveExercise={removeExerciseFromDraft}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
