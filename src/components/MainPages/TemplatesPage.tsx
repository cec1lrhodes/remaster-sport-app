import { Button } from "@/ui/button";

import { CardTemplate } from "@/components/layouts/templates/CardTemplate";
import { useNavigate } from "@tanstack/react-router";

export const TemplatesPage = () => {
  const navigate = useNavigate();

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
      <div className="grid grid-cols-2 gap-5 mt-5">
        <CardTemplate
          title="FULL BODY"
          cardDescription="Card Description"
          cardDate="10/05/2026"
        />
      </div>
    </div>
  );
};
