export const experienceData = {
  id: "exp-001",
  title: "Sunset Kayak & Mangrove Discovery Tour",
  subtitle: "Paddle through bioluminescent waters and ancient mangrove forests",
  rating: 4.8,
  totalReviews: 342,
  pricePerPerson: 129,
  currency: "USD",
  spotsLeft: 4,
  badges: ["Family Friendly", "Wheelchair Accessible", "Scenic Views", "Moderate Difficulty"],
  duration: "3.5 hours",
  groupSize: "Up to 12",
  startTime: "4:30 PM",
  meetingLocation: "Marina Bay Waterfront Deck",
  meetingAddress: "18 Marina Gardens Drive, Singapore 018953",
  parkingInfo: "Free parking at Marina Bay P3 (5 min walk)",
  publicTransport: "Bayfront MRT (CE1/DT16) — Exit B, 8 min walk",
  googleMapsLink: "https://maps.google.com/?q=1.2816,103.8636",
  mapCenter: { longitude: 103.8636, latitude: 1.2816 },
  routePoints: [
    { longitude: 103.8636, latitude: 1.2816 },
    { longitude: 103.8680, latitude: 1.2840 },
    { longitude: 103.8700, latitude: 1.2860 },
    { longitude: 103.8650, latitude: 1.2870 }
  ]
};

export const experiencePhotos = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1400&q=80"
];

export const experienceItinerary = [
  {
    time: "4:30 PM",
    title: "Meet & Safety Briefing",
    description: "Arrive at Marina Bay Waterfront Deck. Receive your equipment, meet your guide, and get a safety overview before we hit the water.",
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
  },
  {
    time: "5:00 PM",
    title: "Kayak Through Mangrove Channels",
    description: "Paddle through winding mangrove waterways. Spot wildlife including monitor lizards, kingfishers, and mudskippers in their natural habitat.",
    thumbnail: "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=400&q=80"
  },
  {
    time: "5:45 PM",
    title: "Hidden Lagoon Rest Stop",
    description: "Take a break at a secluded lagoon. Enjoy complimentary tropical refreshments while your guide shares local ecology stories.",
    thumbnail: null
  },
  {
    time: "6:15 PM",
    title: "Sunset Paddle & Photo Opportunity",
    description: "Catch golden hour on the open water with the city skyline as your backdrop. Perfect for stunning sunset photographs.",
    thumbnail: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=400&q=80"
  },
  {
    time: "7:00 PM",
    title: "Bioluminescent Waters Experience",
    description: "As dusk falls, witness the magical glow of bioluminescent plankton illuminating the water around your kayak.",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
  },
  {
    time: "7:45 PM",
    title: "Return & Farewell",
    description: "Paddle back to the dock. Rinse off, return equipment, and receive your digital photo collection from the tour.",
    thumbnail: null
  }
];

export const operatorData = {
  name: "Marina Adventures Co.",
  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  verified: true,
  yearsActive: 8,
  responseTime: "Usually responds within 1 hour",
  totalTours: 2450,
  bio: "Award-winning eco-tourism operator specializing in water-based adventures across Southeast Asia."
};

export const reviewsData = {
  average: 4.8,
  total: 342,
  breakdown: {
    5: 248,
    4: 68,
    3: 18,
    2: 6,
    1: 2
  },
  reviews: [
    {
      id: "r1",
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
      rating: 5,
      date: "2 weeks ago",
      content: "Absolutely magical experience! The bioluminescent waters were unlike anything I've ever seen. Our guide Kai was incredibly knowledgeable about the local ecosystem and made us feel safe throughout. The sunset views were breathtaking. Highly recommend for families!"
    },
    {
      id: "r2",
      author: "James T.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      rating: 5,
      date: "1 month ago",
      content: "This was the highlight of our Singapore trip. Well-organized, great equipment, and the mangrove channels were stunning. The hidden lagoon stop was a nice surprise. Only wish it was a bit longer!"
    },
    {
      id: "r3",
      author: "Priya K.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
      rating: 4,
      date: "1 month ago",
      content: "Great tour overall. The kayaks were comfortable and easy to maneuver even for beginners. The sunset portion was incredible. Took off one star because our group was a bit large, but the guides managed it well."
    },
    {
      id: "r4",
      author: "David L.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      rating: 5,
      date: "2 months ago",
      content: "Second time doing this tour and it was just as amazing. Brought my parents this time and they loved it. The wheelchair accessible launch point made it easy for my dad. Fantastic experience from start to finish."
    },
    {
      id: "r5",
      author: "Emma W.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      rating: 4,
      date: "3 months ago",
      content: "Beautiful scenery and a well-planned itinerary. The safety briefing was thorough which helped calm my nerves as a first-time kayaker. Would definitely do this again on my next visit."
    }
  ]
};
