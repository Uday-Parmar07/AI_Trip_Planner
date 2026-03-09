export const initialMessages = [
  {
    id: "m1",
    role: "assistant",
    content:
      "I can help you craft a balanced trip with local food spots, hidden gems, and optimized routes. Tell me what you want to tune first."
  },
  {
    id: "m2",
    role: "user",
    content: "Plan me a 3-day itinerary with a mix of adventure and culture."
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "Perfect. I drafted a route with flexible morning and evening options. You can drag cards, adjust budget, and click the map to refine places."
  }
];

export const suggestionChips = [
  "Add restaurants",
  "Add nightlife",
  "Reduce budget",
  "Add adventure",
  "Hidden gems"
];

export const initialItinerary = [
  {
    day: "Day 1",
    items: [
      {
        id: "a1",
        name: "Skyline Old Town Walk",
        description: "Guided neighborhood walk through heritage streets and cafés.",
        duration: "2h",
        travelTime: "20 min from airport",
        type: "attraction",
        location: [103.851959, 1.29027],
        rating: 4.7,
        opens: "08:00 - 22:00"
      },
      {
        id: "a2",
        name: "Harbor View Lunch Deck",
        description: "Waterfront seafood and local specials with panoramic city views.",
        duration: "1.5h",
        travelTime: "12 min",
        type: "restaurant",
        location: [103.8588, 1.2875],
        rating: 4.5,
        opens: "11:00 - 23:00"
      },
      {
        id: "a3",
        name: "Sunset Bay Kayak Trail",
        description: "Easy guided kayak route with glowing skyline views at dusk.",
        duration: "2h",
        travelTime: "18 min",
        type: "attraction",
        location: [103.8642, 1.2846],
        rating: 4.8,
        opens: "16:00 - 20:00"
      }
    ]
  },
  {
    day: "Day 2",
    items: [
      {
        id: "b1",
        name: "Botanic Discovery Gardens",
        description: "Morning nature trail with orchid houses and shaded walking paths.",
        duration: "2h",
        travelTime: "25 min",
        type: "attraction",
        location: [103.814, 1.3138],
        rating: 4.6,
        opens: "05:00 - 00:00"
      },
      {
        id: "b2",
        name: "Cultural Street Market",
        description: "Craft stalls, local snacks, and live street performances.",
        duration: "2h",
        travelTime: "14 min",
        type: "attraction",
        location: [103.8437, 1.2813],
        rating: 4.4,
        opens: "10:00 - 21:00"
      },
      {
        id: "b3",
        name: "Moonlight Rooftop Lounge",
        description: "Night skyline cocktails and light tapas menu.",
        duration: "1.5h",
        travelTime: "9 min",
        type: "restaurant",
        location: [103.85, 1.2861],
        rating: 4.3,
        opens: "17:00 - 01:00"
      }
    ]
  },
  {
    day: "Day 3",
    items: [
      {
        id: "c1",
        name: "Cloudline Hotel Checkpoint",
        description: "Premium city-center hotel with spa and late check-out options.",
        duration: "1h",
        travelTime: "15 min",
        type: "hotel",
        location: [103.8473, 1.2897],
        rating: 4.7,
        opens: "Open 24 hours"
      },
      {
        id: "c2",
        name: "Art District Brunch House",
        description: "Specialty coffee and fusion brunch in the arts quarter.",
        duration: "1.5h",
        travelTime: "11 min",
        type: "restaurant",
        location: [103.8392, 1.299],
        rating: 4.6,
        opens: "08:00 - 17:00"
      },
      {
        id: "c3",
        name: "Airport Smart Transfer",
        description: "Express terminal transfer with luggage support.",
        duration: "1h",
        travelTime: "35 min",
        type: "airport",
        location: [103.9915, 1.3644],
        rating: 4.5,
        opens: "Open 24 hours"
      }
    ]
  }
];

export const placePhotos = {
  attraction:
    "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  restaurant:
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
  airport:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
};
