import { useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/ui/button";

import { CardTemplate } from "@/components/layouts/templates/CardTemplate";

import { useJournal } from "@/store/templates/hooks/useJournal";

import { useTemplateList } from "@/store/templates/hooks/useTemplateList";

const formatTemplateDate = (date: string) => {
  return new Intl.DateTimeFormat("uk-UA").format(new Date(date));
};

const getTemplateTotalTonnage = (exercises: { kg?: number | null }[]) => {
  return exercises.reduce((total, exercise) => total + (exercise.kg ?? 0), 0);
};

export const TemplatesPage = () => {
  const navigate = useNavigate();

  const { templates, isLoading, error, fetchTemplates, deleteTemplate } =
    useTemplateList();

  const { setSelectedTemplateId } = useJournal();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return (
    <div>
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-space-grotesk text-[#fcfdff]">
          Templates
        </h2>

        <Button
          className="bg-white text-black"
          onClick={() => navigate({ to: "/add_templates" })}
        >
          <span className="font-montserrat">Create Template</span>
        </Button>
      </div>

      {error && (
        <p className="mt-4 font-montserrat text-sm text-red-400">{error}</p>
      )}

      {isLoading && (
        <p className="mt-5 font-space-mono text-sm text-white/50">
          Loading templates...
        </p>
      )}

      <div className="grid grid-cols-2 gap-5 mt-5">
        {!isLoading && templates.length === 0 ? (
          <p className="col-span-2 font-space-mono text-sm text-white/50">
            No templates yet.
          </p>
        ) : (
          templates.map((template) => (
            <CardTemplate
              key={template.id}
              title={template.title}
              cardDate={formatTemplateDate(template.createdAt)}
              exerciseCount={template.exercises.length}
              totalTonnage={getTemplateTotalTonnage(template.exercises)}
              onOpen={() => {
                setSelectedTemplateId(template.id);

                navigate({ to: "/journal" });
              }}
              onDelete={() => deleteTemplate(template.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
