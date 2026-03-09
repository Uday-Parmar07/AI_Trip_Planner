"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/layout/site-nav";
import { Badge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/planner/chat-panel";
import { ItineraryBoard } from "@/components/planner/itinerary-board";
import { MapView } from "@/components/planner/map-view";
import { BudgetPanel } from "@/components/planner/budget-panel";
import { ExportActions } from "@/components/planner/export-actions";
import { initialItinerary, initialMessages, suggestionChips } from "@/lib/planner-data";

export function PlannerWorkspace({ searchParams }) {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [selectedPlaceId, setSelectedPlaceId] = useState(initialItinerary[0].items[0].id);
  const [budget, setBudget] = useState(Number(searchParams?.budget || 3200));

  const destination = searchParams?.destination || "Singapore";
  const travelStyle = searchParams?.travelStyle || "Adventure";
  const travelers = searchParams?.travelers || "2";

  const headerTags = useMemo(
    () => [destination, `${travelers} travelers`, travelStyle, `Budget $${budget.toLocaleString()}`],
    [destination, travelers, travelStyle, budget]
  );

  return (
    <main className="min-h-screen pb-10">
      <SiteNav />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Your AI-Powered Trip Workspace</h1>
          <div className="flex flex-wrap gap-2">
            {headerTags.map((tag, index) => (
              <Badge key={tag} variant={index % 2 ? "secondary" : "default"}>
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        <section className="grid gap-6 xl:grid-cols-2">
          <ChatPanel initialMessages={initialMessages} suggestionChips={suggestionChips} />
          <ItineraryBoard
            itinerary={itinerary}
            setItinerary={setItinerary}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <MapView itinerary={itinerary} selectedPlaceId={selectedPlaceId} onSelectPlace={setSelectedPlaceId} />
          <div className="space-y-6">
            <BudgetPanel budget={budget} setBudget={setBudget} />
            <ExportActions />
          </div>
        </section>
      </section>
    </main>
  );
}
