"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-[var(--muted-foreground)]"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right">{stars}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-[var(--muted-foreground)]">{count}</span>
    </div>
  );
}

export function ReviewsSection({ reviewsData }) {
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? reviewsData.reviews : reviewsData.reviews.slice(0, 2);

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Guest Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col gap-6 rounded-2xl border bg-white/60 p-6 dark:bg-slate-900/40 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold">{reviewsData.average}</span>
          <StarRating rating={Math.round(reviewsData.average)} />
          <span className="text-xs text-[var(--muted-foreground)]">
            {reviewsData.total} reviews
          </span>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <RatingBar
              key={stars}
              stars={stars}
              count={reviewsData.breakdown[stars]}
              total={reviewsData.total}
            />
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border bg-white/60 p-5 dark:bg-slate-900/40"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{review.author}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {review.content}
            </p>
          </div>
        ))}
      </div>

      {/* Expand button */}
      {reviewsData.reviews.length > 2 && (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded
            ? "Show fewer reviews"
            : `View all ${reviewsData.total} reviews`}
        </Button>
      )}
    </section>
  );
}
