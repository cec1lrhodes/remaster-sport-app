import { JournalPage } from "@/components/MainPages/JournalPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/journal")({
  component: RouteComponent,
});

function RouteComponent() {
  return <JournalPage />;
}
