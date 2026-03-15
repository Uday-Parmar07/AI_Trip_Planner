import { Clock, Users, Sun, MapPin } from "lucide-react";

export function QuickFacts({ experience }) {
  const facts = [
    { icon: Clock, label: "Duration", value: experience.duration },
    { icon: Users, label: "Group Size", value: experience.groupSize },
    { icon: Sun, label: "Start Time", value: experience.startTime },
    { icon: MapPin, label: "Meeting Point", value: experience.meetingLocation }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-white/60 px-6 py-5 dark:bg-slate-900/40 sm:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10">
            <fact.icon className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--muted-foreground)]">{fact.label}</p>
            <p className="truncate text-sm font-medium">{fact.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
