"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const styleOptions = ["Adventure", "Luxury", "Backpacking", "Family"];
const suggestedPrompts = [
  "3-day Tokyo food trail",
  "Romantic Paris weekend",
  "Budget Bali backpacking",
  "Family trip to Dubai"
];

export function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [budget, setBudget] = useState(2500);
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [travelers, setTravelers] = useState(2);

  const onSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      destination: destination || "Bali",
      travelDates: travelDates || "Flexible",
      budget: String(budget),
      travelStyle,
      travelers: String(travelers)
    });

    router.push(`/planner?${params.toString()}`);
  };

  return (
    <section className="relative isolate overflow-hidden px-4 pb-14 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(2, 6, 23, 0.40), rgba(2, 6, 23, 0.55)), url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1800&q=80')"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-500/30 via-teal-500/10 to-[var(--background)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <Badge className="mb-4 border-white/40 bg-white/20 text-white backdrop-blur-md">AI Powered Travel Planning</Badge>
        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Plan Your Perfect Trip with AI
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-100 sm:text-lg">
          Tell us where you want to go and we&apos;ll generate the perfect itinerary instantly.
        </p>

        <Card className="mt-10 w-full max-w-4xl border-white/40 bg-white/70 p-5 shadow-2xl shadow-sky-900/20 dark:bg-slate-900/60">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
              <Sparkles className="h-5 w-5 text-[var(--primary)]" />
              <Input
                className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                placeholder="Where do you want to travel?"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 text-left text-sm">
                <span className="text-[var(--muted-foreground)]">Travel Dates</span>
                <div className="flex items-center gap-2 rounded-2xl border bg-white/75 px-3 py-2 dark:bg-slate-950/40">
                  <CalendarDays className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    value={travelDates}
                    onChange={(event) => setTravelDates(event.target.value)}
                    placeholder="Aug 12 - Aug 18"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </label>

              <label className="space-y-2 text-left text-sm">
                <span className="text-[var(--muted-foreground)]">Budget</span>
                <Input
                  type="number"
                  min="500"
                  step="100"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value || 0))}
                />
              </label>

              <label className="space-y-2 text-left text-sm">
                <span className="text-[var(--muted-foreground)]">Travel Style</span>
                <select
                  className="flex h-11 w-full rounded-2xl border bg-white/75 px-3 text-sm dark:bg-slate-950/40"
                  value={travelStyle}
                  onChange={(event) => setTravelStyle(event.target.value)}
                >
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-left text-sm">
                <span className="text-[var(--muted-foreground)]">Number of Travelers</span>
                <div className="flex items-center gap-2 rounded-2xl border bg-white/75 px-3 py-2 dark:bg-slate-950/40">
                  <Users className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={travelers}
                    onChange={(event) => setTravelers(Number(event.target.value || 1))}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
            </div>

            <Button size="lg" className="w-full md:w-auto">
              Generate Trip
            </Button>
          </form>
        </Card>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <motion.button
              key={prompt}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              onClick={() => setDestination(prompt)}
              className="rounded-full border border-white/45 bg-white/20 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              {prompt}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
