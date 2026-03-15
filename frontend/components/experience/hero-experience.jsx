"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeroExperience({ experience, photos }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openGallery = useCallback((index) => {
    setActiveIndex(index);
    setGalleryOpen(true);
  }, []);

  const navigate = useCallback(
    (direction) => {
      setActiveIndex((prev) => {
        if (direction === "next") return (prev + 1) % photos.length;
        return (prev - 1 + photos.length) % photos.length;
      });
    },
    [photos.length]
  );

  return (
    <>
      <div className="space-y-4">
        {/* Title, Rating, Badges */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {experience.title}
          </h1>
          <p className="text-base text-[var(--muted-foreground)]">{experience.subtitle}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(experience.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-[var(--muted-foreground)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{experience.rating}</span>
            <span className="text-sm text-[var(--muted-foreground)]">
              ({experience.totalReviews} reviews)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {experience.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]">
          {/* Main Hero Image */}
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="group relative h-[280px] overflow-hidden rounded-2xl sm:h-[340px] md:h-[420px]"
          >
            <Image
              src={photos[0]}
              alt={experience.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              1 / {photos.length} photos
            </div>
          </button>

          {/* Side Preview Stack */}
          <div className="hidden gap-2 md:grid md:grid-rows-3">
            {photos.slice(1, 4).map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openGallery(i + 1)}
                className="group relative overflow-hidden rounded-xl"
              >
                <Image
                  src={photo}
                  alt={`Preview ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                {i === 2 && photos.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                    +{photos.length - 4} more
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => setGalleryOpen(false)}
          >
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div
              className="relative h-[70vh] w-[90vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[activeIndex]}
                alt={`Photo ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
