"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Minus,
  Plus,
  ShieldCheck,
  RotateCcw,
  Zap,
  Bookmark,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingSidebar({ experience }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const totalGuests = adults + children;
  const totalPrice = (adults * experience.pricePerPerson) + (children * Math.round(experience.pricePerPerson * 0.6));

  return (
    <div className="sticky top-24 space-y-6">
      <div className="rounded-2xl border bg-white/80 p-6 shadow-lg dark:bg-slate-900/80">
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">
              ${experience.pricePerPerson}
            </span>
            <span className="text-base text-[var(--muted-foreground)]">/ person</span>
          </div>
        </div>

        {/* Date Selector */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>

          {/* Guest Counter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Guests</label>

            <div className="flex items-center justify-between rounded-xl border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">Adults</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="rounded-lg border p-1 transition hover:bg-[var(--muted)]"
                  aria-label="Decrease adults"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(12, adults + 1))}
                  className="rounded-lg border p-1 transition hover:bg-[var(--muted)]"
                  aria-label="Increase adults"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm">Children</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="rounded-lg border p-1 transition hover:bg-[var(--muted)]"
                  aria-label="Decrease children"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{children}</span>
                <button
                  type="button"
                  onClick={() => setChildren(Math.min(10, children + 1))}
                  className="rounded-lg border p-1 transition hover:bg-[var(--muted)]"
                  aria-label="Increase children"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Only {experience.spotsLeft} spots left this week
            </span>
          </div>

          {/* Total */}
          {totalGuests > 0 && (
            <div className="flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-[var(--muted-foreground)]">
                Total for {totalGuests} guest{totalGuests > 1 ? "s" : ""}
              </span>
              <span className="text-lg font-bold">${totalPrice}</span>
            </div>
          )}

          {/* Book Now CTA */}
          <Button size="lg" className="w-full text-base font-bold">
            Book Now
          </Button>

          {/* Save to Itinerary */}
          <Button variant="outline" size="lg" className="w-full gap-2">
            <Bookmark className="h-4 w-4" />
            Save to Itinerary
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t pt-5">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-[10px] leading-tight text-[var(--muted-foreground)]">
              Secure Payment
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <RotateCcw className="h-5 w-5 text-emerald-500" />
            <span className="text-[10px] leading-tight text-[var(--muted-foreground)]">
              Free Cancellation
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Zap className="h-5 w-5 text-emerald-500" />
            <span className="text-[10px] leading-tight text-[var(--muted-foreground)]">
              Instant Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
