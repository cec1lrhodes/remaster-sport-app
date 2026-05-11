import { createFileRoute } from "@tanstack/react-router";
import { TemplatesPage } from "@/components/MainPages/TemplatesPage";

export const Route = createFileRoute("/templates")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TemplatesPage />;
}
