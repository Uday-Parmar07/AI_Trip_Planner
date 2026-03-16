"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Plane, Utensils, Building2, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placePhotos } from "@/lib/planner-data";

const typeIcon = {
  attraction: Landmark,
  hotel: Building2,
  restaurant: Utensils,
  airport: Plane
};

export function MapView({ itinerary, selectedPlaceId, onSelectPlace }) {
  const [openPopupId, setOpenPopupId] = useState(null);

  const places = useMemo(() => itinerary.flatMap((day) => day.items), [itinerary]);

  // Only places that have valid coordinates can be shown on the map
  const mappablePlaces = useMemo(() => places.filter((p) => Array.isArray(p.location)), [places]);

  const selectedPlace = places.find((place) => place.id === (openPopupId || selectedPlaceId)) || places[0];
  const selectedIsMappable = selectedPlace && Array.isArray(selectedPlace.location);

  const hasMapboxToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Interactive Map View</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        {hasMapboxToken ? (
          <div className="h-[380px] overflow-hidden rounded-2xl border">
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{ longitude: 103.85, latitude: 1.29, zoom: 11.5 }}
              mapStyle="mapbox://styles/mapbox/light-v11"
            >
              {mappablePlaces.map((place) => {
                const Icon = typeIcon[place.type] || MapPin;
                const isActive = selectedPlaceId === place.id;

                return (
                  <Marker key={place.id} longitude={place.location[0]} latitude={place.location[1]} anchor="bottom">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlace(place.id);
                        setOpenPopupId(place.id);
                      }}
                      className={`rounded-full border-2 p-2 shadow transition ${
                        isActive ? "border-sky-400 bg-sky-500 text-white" : "border-white bg-slate-900 text-white"
                      }`}
                      aria-label={place.name}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  </Marker>
                );
              })}

              {selectedIsMappable && (
                <Popup
                  longitude={selectedPlace.location[0]}
                  latitude={selectedPlace.location[1]}
                  anchor="top"
                  closeButton={false}
                  offset={12}
                  closeOnClick={false}
                >
                  <div className="max-w-[220px] space-y-1">
                    <p className="text-sm font-semibold">{selectedPlace.name}</p>
                    <p className="text-xs text-slate-600">{selectedPlace.description}</p>
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-4 text-sm text-[var(--muted-foreground)]">
            Add `NEXT_PUBLIC_MAPBOX_TOKEN` in `frontend/.env.local` to enable interactive map rendering. Marker and place synchronization remains active through the list below.
          </div>
        )}

        {selectedPlace && (
          <div className="grid gap-4 rounded-2xl border bg-white/80 p-4 dark:bg-slate-900/60 sm:grid-cols-[220px_1fr]">
            <div className="relative h-36 overflow-hidden rounded-xl sm:h-full">
              <Image
                src={placePhotos[selectedPlace.type]}
                alt={selectedPlace.name}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-base font-semibold">{selectedPlace.name}</p>
              <p className="text-[var(--muted-foreground)]">{selectedPlace.description}</p>
              <p>
                <span className="font-medium">Rating:</span> {selectedPlace.rating} / 5
              </p>
              <p>
                <span className="font-medium">Opening hours:</span> {selectedPlace.opens}
              </p>
              <p>
                <span className="font-medium">Travel time:</span> {selectedPlace.travelTime}
              </p>
              <p>
                <span className="font-medium">Type:</span> {selectedPlace.type}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {places.map((place) => {
            const Icon = typeIcon[place.type] || MapPin;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => onSelectPlace(place.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                  selectedPlaceId === place.id ? "border-sky-400 bg-sky-100/60 dark:bg-sky-950/30" : "hover:bg-[var(--muted)]"
                }`}
              >
                <Icon className="h-4 w-4 text-[var(--primary)]" />
                <span className="truncate">{place.name}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
