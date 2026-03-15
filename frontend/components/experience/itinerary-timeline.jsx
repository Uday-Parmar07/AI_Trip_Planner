import Image from "next/image";

export function ItineraryTimeline({ itinerary }) {
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Experience Itinerary</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--border)]" />

        <div className="space-y-0">
          {itinerary.map((step, index) => (
            <div key={index} className="group relative flex gap-4 pb-8 last:pb-0">
              {/* Timeline dot */}
              <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--background)] text-xs font-bold text-[var(--primary)]">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border bg-white/60 p-4 transition hover:bg-white/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                      {step.time}
                    </span>
                    <h3 className="text-base font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {step.description}
                    </p>
                  </div>
                  {step.thumbnail && (
                    <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-28">
                      <Image
                        src={step.thumbnail}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 112px"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
