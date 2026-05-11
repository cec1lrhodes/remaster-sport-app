import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import BottomNav from "@/components/layouts/common/BottomNav";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </React.Fragment>
  );
}
