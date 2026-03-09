import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/60 backdrop-blur-xl dark:bg-slate-950/60">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Trip Planner</p>
            <p className="text-xs text-[var(--muted-foreground)]">Smart itineraries in seconds</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/planner">
            <Button variant="ghost">Planner</Button>
          </Link>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="https://images.unsplash.com/photo-1542204625-de293a50f40f?auto=format&fit=facearea&w=128&q=80" alt="User" />
            <AvatarFallback>UT</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  );
}
