import Image from "next/image";
import { BadgeCheck, Clock, Compass } from "lucide-react";

export function OperatorTrust({ operator }) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Your Experience Operator</h2>
      <div className="flex flex-col gap-5 rounded-2xl border bg-white/60 p-6 dark:bg-slate-900/40 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
          <Image
            src={operator.photo}
            alt={operator.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{operator.name}</h3>
            {operator.verified && (
              <BadgeCheck className="h-5 w-5 text-[var(--primary)]" />
            )}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">{operator.bio}</p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              {operator.yearsActive} years active
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {operator.responseTime}
            </span>
            <span className="font-medium text-[var(--foreground)]">
              {operator.totalTours.toLocaleString()} tours completed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
