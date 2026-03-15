"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Car, Train, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapMeeting({ experience }) {
  const hasMapboxToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Meeting Point & Route</h2>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border">
          {hasMapboxToken ? (
            <div className="h-[320px] sm:h-[400px]">
              <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{
                  longitude: experience.mapCenter.longitude,
                  latitude: experience.mapCenter.latitude,
                  zoom: 14
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
              >
                <Marker
                  longitude={experience.mapCenter.longitude}
                  latitude={experience.mapCenter.latitude}
                  anchor="bottom"
                >
                  <div className="rounded-full border-2 border-sky-400 bg-sky-500 p-2 text-white shadow-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                </Marker>
                {experience.routePoints.slice(1).map((point, i) => (
                  <Marker
                    key={i}
                    longitude={point.longitude}
                    latitude={point.latitude}
                    anchor="bottom"
                  >
                    <div className="rounded-full border-2 border-white bg-slate-800 p-1.5 text-white">
                      <Navigation className="h-3 w-3" />
                    </div>
                  </Marker>
                ))}
              </Map>
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center border-dashed bg-[var(--muted)]/30 p-6 text-center text-sm text-[var(--muted-foreground)] sm:h-[400px]">
              <div>
                <MapPin className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Add <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable map</p>
              </div>
            </div>
          )}
        </div>

        {/* Meeting Details */}
        <div className="space-y-4 rounded-2xl border bg-white/60 p-6 dark:bg-slate-900/40">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Meeting Location</h3>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium">{experience.meetingLocation}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{experience.meetingAddress}</p>
              </div>
            </div>

            <div className="h-px bg-[var(--border)]" />

            <div className="flex items-start gap-3">
              <Car className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs font-medium">Parking</p>
                <p className="text-xs text-[var(--muted-foreground)]">{experience.parkingInfo}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Train className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs font-medium">Public Transport</p>
                <p className="text-xs text-[var(--muted-foreground)]">{experience.publicTransport}</p>
              </div>
            </div>
          </div>

          <a
            href={experience.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Google Maps
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
