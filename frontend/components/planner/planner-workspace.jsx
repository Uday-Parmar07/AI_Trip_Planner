"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/layout/site-nav";
import { Badge } from "@/components/ui/badge";
import { ChatPanel } from "@/components/planner/chat-panel";
import { ItineraryBoard } from "@/components/planner/itinerary-board";
import { MapView } from "@/components/planner/map-view";
import { BudgetPanel } from "@/components/planner/budget-panel";
import { ExportActions } from "@/components/planner/export-actions";
import { initialItinerary, suggestionChips } from "@/lib/planner-data";
import { parseItinerary } from "@/lib/parse-itinerary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchTripPlan(question, tripDetails) {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, tripDetails })
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.answer;
}

export function PlannerWorkspace({ searchParams }) {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [selectedPlaceId, setSelectedPlaceId] = useState(initialItinerary[0].items[0].id);
  const [budget, setBudget] = useState(Number(searchParams?.budget || 3200));
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialChatMessages, setInitialChatMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "I can help you craft a balanced trip with local food spots, hidden gems, and optimised routes. Tell me what you want to tune first."
    }
  ]);

  const destination = searchParams?.destination || "Singapore";
  const travelStyle = searchParams?.travelStyle || "Adventure";
  const travelers = searchParams?.travelers || "2";
  const travelDates = searchParams?.travelDates || "";
  const hasGeneratedRef = useRef(false);

  const tripDetails = useMemo(
    () => ({
      destination,
      travelDates,
      budget: String(budget),
      tripType: travelStyle,
      numberOfPeople: Number(travelers)
    }),
    [destination, travelDates, budget, travelStyle, travelers]
  );

  const headerTags = useMemo(
    () => [destination, `${travelers} travelers`, travelStyle, `Budget $${budget.toLocaleString()}`],
    [destination, travelers, travelStyle, budget]
  );

  // Build the initial trip question from search params
  const initialQuestion = useMemo(() => {
    const parts = [`Plan a trip to ${destination}`];
    if (travelDates) parts.push(`on ${travelDates}`);
    parts.push(`for ${travelers} traveler${Number(travelers) !== 1 ? "s" : ""}`);
    parts.push(`with a ${travelStyle.toLowerCase()} style`);
    parts.push(`and a budget of $${Number(budget).toLocaleString()}`);
    return parts.join(", ") + ".";
  }, [destination, travelDates, travelers, travelStyle, budget]);

  // Generate the trip plan from the backend when the planner first loads.
  // Intentionally runs only once: search-params are baked in at mount time and
  // the page is fully re-created when the user navigates with different params.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    setIsGenerating(true);
    setInitialChatMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Generating your personalised trip to ${destination}…`
      }
    ]);

    fetchTripPlan(initialQuestion, tripDetails)
      .then((answer) => {
        // Try to parse the AI response into structured itinerary cards
        const parsed = parseItinerary(answer);
        if (parsed && parsed.length > 0) {
          setItinerary(parsed);
          setSelectedPlaceId(parsed[0].items[0]?.id ?? null);
        }

        // Show the AI answer in the chat panel as the initial assistant message
        setInitialChatMessages([
          {
            id: "trip-plan",
            role: "assistant",
            content: answer
          }
        ]);
      })
      .catch(() => {
        // Fall back to the static demo itinerary if the backend is unavailable
        setInitialChatMessages([
          {
            id: "fallback",
            role: "assistant",
            content:
              "I couldn't reach the trip planning service right now. Showing you a sample itinerary. You can still refine it using the chat below."
          }
        ]);
      })
      .finally(() => setIsGenerating(false));
  }, []); // Run only on mount – see comment above

  // Handler passed to ChatPanel so follow-up messages also hit the real API
  const handleSendMessage = useCallback(
    async (userMessage) => {
      const answer = await fetchTripPlan(userMessage, tripDetails);
      const parsed = parseItinerary(answer);
      if (parsed && parsed.length > 0) {
        setItinerary(parsed);
        setSelectedPlaceId(parsed[0].items[0]?.id ?? null);
      }
      return answer;
    },
    [tripDetails]
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
          <ChatPanel
            initialMessages={initialChatMessages}
            suggestionChips={suggestionChips}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
          />
          <ItineraryBoard
            itinerary={itinerary}
            setItinerary={setItinerary}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={setSelectedPlaceId}
            isLoading={isGenerating}
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
