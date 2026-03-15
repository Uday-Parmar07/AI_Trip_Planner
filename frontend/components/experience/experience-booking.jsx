"use client";

import { motion } from "framer-motion";
import { SiteNav } from "@/components/layout/site-nav";
import { HeroExperience } from "@/components/experience/hero-experience";
import { BookingSidebar } from "@/components/experience/booking-sidebar";
import { QuickFacts } from "@/components/experience/quick-facts";
import { ItineraryTimeline } from "@/components/experience/itinerary-timeline";
import { MapMeeting } from "@/components/experience/map-meeting";
import { OperatorTrust } from "@/components/experience/operator-trust";
import { ReviewsSection } from "@/components/experience/reviews-section";
import {
  experienceData,
  experiencePhotos,
  experienceItinerary,
  operatorData,
  reviewsData
} from "@/lib/experience-data";

export function ExperienceBooking() {
  return (
    <main className="min-h-screen pb-16">
      <SiteNav />

      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-w-0 space-y-10"
          >
            {/* Hero Section */}
            <HeroExperience experience={experienceData} photos={experiencePhotos} />

            {/* Quick Facts */}
            <QuickFacts experience={experienceData} />

            {/* Itinerary Timeline */}
            <ItineraryTimeline itinerary={experienceItinerary} />

            {/* Map & Meeting */}
            <MapMeeting experience={experienceData} />

            {/* Operator Trust */}
            <OperatorTrust operator={operatorData} />

            {/* Reviews */}
            <ReviewsSection reviewsData={reviewsData} />
          </motion.div>

          {/* Right: Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:block"
          >
            <BookingSidebar experience={experienceData} />
          </motion.div>
        </div>

        {/* Mobile Booking Bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 p-4 backdrop-blur-xl dark:bg-slate-950/90 lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">${experienceData.pricePerPerson}</span>
                <span className="text-sm text-[var(--muted-foreground)]">/ person</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Only {experienceData.spotsLeft} spots left
              </p>
            </div>
            <button
              type="button"
              className="rounded-2xl bg-[var(--primary)] px-8 py-3 text-sm font-bold text-[var(--primary-foreground)] shadow-lg transition hover:brightness-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
