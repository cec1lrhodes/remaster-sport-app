import { createFileRoute } from "@tanstack/react-router";
import { AddTemplatesPage } from "@/components/MainPages/AddTemplatesPage";

export const Route = createFileRoute("/add_templates")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddTemplatesPage />;
}
