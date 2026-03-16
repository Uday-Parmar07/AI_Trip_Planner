"use client";

import { useMemo } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Clock3, MapPin, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SortableItem({ item, isActive, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`w-full rounded-2xl border bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900/80 ${
          isActive ? "border-sky-400 ring-2 ring-sky-300/70" : ""
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="font-medium">{item.name}</h4>
          <Badge variant="accent" className="capitalize">
            {item.type}
          </Badge>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {item.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Route className="h-3.5 w-3.5" />
            {item.travelTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            Tap to locate
          </span>
        </div>
      </button>
    </div>
  );
}

/**
 * Skeleton placeholder shown while the AI trip plan is being generated.
 */
function ItinerarySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((day) => (
        <div key={day}>
          <Skeleton className="mb-3 h-5 w-20" />
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="rounded-2xl border bg-white/80 p-4 dark:bg-slate-900/80">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mb-3 h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="mt-3 flex gap-4">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ItineraryBoard({ itinerary, setItinerary, selectedPlaceId, onSelectPlace, isLoading = false }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const itemToDayMap = useMemo(() => {
    const map = new Map();
    itinerary.forEach((day) => {
      day.items.forEach((item) => map.set(item.id, day.day));
    });
    return map;
  }, [itinerary]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromDay = itemToDayMap.get(active.id);
    const toDay = itemToDayMap.get(over.id);

    if (!fromDay || !toDay || fromDay !== toDay) return;

    setItinerary((previous) =>
      previous.map((day) => {
        if (day.day !== fromDay) return day;

        const oldIndex = day.items.findIndex((item) => item.id === active.id);
        const newIndex = day.items.findIndex((item) => item.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return day;

        return {
          ...day,
          items: arrayMove(day.items, oldIndex, newIndex)
        };
      })
    );
  };

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Generated Itinerary</CardTitle>
        <p className="text-sm text-[var(--muted-foreground)]">
          {isLoading ? "Generating your personalised itinerary…" : "Drag activity cards to reorder each day."}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        {isLoading ? (
          <ItinerarySkeleton />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            {itinerary.map((day, dayIndex) => (
              <motion.section
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.06 }}
              >
                <h3 className="mb-3 text-base font-semibold">{day.day}</h3>
                <SortableContext items={day.items.map((item) => item.id)} strategy={rectSortingStrategy}>
                  <div className="space-y-3">
                    {day.items.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        isActive={selectedPlaceId === item.id}
                        onSelect={onSelectPlace}
                      />
                    ))}
                  </div>
                </SortableContext>
              </motion.section>
            ))}
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
