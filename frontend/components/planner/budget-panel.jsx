"use client";

import { useMemo } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const baseCosts = {
  flights: 850,
  hotels: 1050,
  food: 420,
  activities: 380,
  transport: 240
};

export function BudgetPanel({ budget, setBudget }) {
  const costs = useMemo(() => {
    const baseline = 2940;
    const multiplier = budget / baseline;

    return Object.fromEntries(
      Object.entries(baseCosts).map(([key, value]) => [key, Math.round(value * multiplier)])
    );
  }, [budget]);

  const total = Object.values(costs).reduce((sum, value) => sum + value, 0);

  const recommendation =
    budget < 2200
      ? "Budget mode: prioritize hostels, transit passes, and compact activity blocks."
      : budget > 4200
        ? "Premium mode: elevate hotels, fine dining, and private transfers."
        : "Balanced mode: mix premium highlights with budget-friendly local experiences.";

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div className="rounded-2xl border bg-white/80 p-4 dark:bg-slate-900/60">
          <p className="text-sm text-[var(--muted-foreground)]">Trip Budget</p>
          <div className="mt-1 flex items-center gap-2 text-2xl font-semibold">
            <DollarSign className="h-5 w-5 text-[var(--accent)]" />
            {budget.toLocaleString()}
          </div>
        </div>

        <Slider value={[budget]} min={1200} max={6000} step={100} onValueChange={(value) => setBudget(value[0])} />

        <ul className="space-y-2 text-sm">
          {Object.entries(costs).map(([key, value]) => (
            <li key={key} className="flex items-center justify-between rounded-xl bg-[var(--muted)]/60 px-3 py-2 capitalize">
              <span>{key}</span>
              <span className="font-medium">${value.toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-sky-200/60 bg-sky-100/40 p-4 dark:border-sky-900/50 dark:bg-sky-950/30">
          <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Estimated Total</p>
          <p className="text-xl font-semibold">${total.toLocaleString()}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
