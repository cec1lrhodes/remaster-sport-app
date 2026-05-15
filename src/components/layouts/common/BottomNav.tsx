import { Link, useRouterState } from "@tanstack/react-router";
import { Book, Home, SquareLibrary } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavItem = {
  to: "/" | "/templates" | "/journal";
  label: string;
  matchPrefix?: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    to: "/templates",
    label: "Templates",
    matchPrefix: "/templates",
    icon: <SquareLibrary className="size-5 text-[#eeece7]" />,
  },
  {
    to: "/",
    label: "Home",
    icon: <Home className="size-5 text-[#eeece7]" />,
  },
  {
    to: "/journal",
    label: "Journal",
    matchPrefix: "/journal",
    icon: <Book className="size-5 text-[#eeece7]" />,
  },
];

const isActivePath = (pathname: string, item: NavItem): boolean => {
  if (item.matchPrefix) return pathname.startsWith(item.matchPrefix);
  return pathname === item.to;
};

const BottomNav = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <footer className="fixed bottom-0 left-1/2 z-40 w-full max-w-[490px] -translate-x-1/2 bg-black/95 px-6 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto grid w-full max-w-xs grid-cols-3 gap-8"
      >
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item);
          const { label, to } = item;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {item.icon}
              <span className="font-montserrat text-[#eeece7]">{label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
