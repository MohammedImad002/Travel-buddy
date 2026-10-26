import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

type Tab = { to: "/" | "/nearby" | "/assistant" | "/explore" | "/essentials"; label: string; icon: string; center?: boolean };

const TABS: Tab[] = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/nearby", label: "Nearby", icon: "📍" },
  { to: "/assistant", label: "Ask AI", icon: "✦", center: true },
  { to: "/explore", label: "Explore", icon: "🗺️" },
  { to: "/essentials", label: "Essentials", icon: "🧳" },
];

export function PhoneShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cream aura font-body text-ink">
      <div className="pointer-events-none absolute -left-16 top-24 size-72 rounded-full bg-lilac/25 blur-3xl floaty" />
      <div className="pointer-events-none absolute -right-20 top-1/3 size-80 rounded-full bg-sky/25 blur-3xl floaty" />
      <div className="relative mx-auto flex min-h-screen max-w-[430px] flex-col">
        <header className="sticky top-0 z-30 border-b border-white/50 bg-white/55 px-5 pb-3 pt-4 backdrop-blur-xl">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-lg text-primary-foreground shadow-lg shadow-brand/30">
              ✈
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[17px] font-bold leading-none">Travel Buddy</span>
              <span className="block text-[10px] font-medium text-inkmuted">Everything you need, one app</span>
            </span>
          </Link>
        </header>

        <main className="flex-1 px-5 pb-6 pt-4">{children}</main>

        <nav className="sticky bottom-0 z-30 border-t border-white/50 bg-white/60 px-3 pb-4 pt-2 backdrop-blur-xl">
          <div className="flex items-end justify-between">
            {TABS.map((tab) =>
              tab.center ? (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className="-mt-6 grid size-14 place-items-center rounded-full gradient-brand text-2xl text-primary-foreground shadow-lg shadow-brand/40 ring-4 ring-cream"
                  aria-label={tab.label}
                >
                  {tab.icon}
                </Link>
              ) : (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-colors ${
                    pathname === tab.to ? "text-brand" : "text-inkmuted"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </Link>
              ),
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 rise">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-xl ring-1 ring-white/60">
        {emoji}
      </span>
      <div className="min-w-0">
        <h1 className="truncate font-display text-[22px] font-bold leading-tight">{title}</h1>
        <p className="truncate text-[12px] text-inkmuted">{subtitle}</p>
      </div>
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl glass p-4 ${className}`}>{children}</section>;
}
