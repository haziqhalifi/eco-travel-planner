const tripsData = [
  {
    id: 1,
    title: "Swiss Eco-Adventure",
    startDate: "2024-08-21",
    endDate: "2024-08-29",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95",
    description: "A low-impact journey through the Swiss Alps with sustainable stays and activities.",
    carbonFootprint: "120kg CO₂ (train travel)",
    budgetRange: "medium", // low | medium | high
    tags: ["hiking", "cycling", "wildlife", "sustainable-dining"],
    transportation: "train", // train | bike | electric-vehicle
    days: [
      {
        date: "2024-08-21",
        activities: [
          {
            time: "15:00",
            place: "Arrive via Train (Zurich HB Station)",
            icon: "train",
            type: "transport",
            details: "Zero-emission travel from neighboring countries.",
            ecoRating: 5, // 1-5 scale
            imageUrl: "https://media.istockphoto.com/id/1334470806/photo/modern-train-at-the-station-in-zurich-switzerland.jpg"
          },
          {
            time: "16:00",
            place: "Urban Farm Café",
            icon: "coffee",
            type: "sustainable-dining",
            details: "Organic, locally sourced ingredients. Zero-waste policy.",
            ecoRating: 4
          },
          {
            time: "17:00",
            place: "Bike Tour of Zurich",
            icon: "bike",
            type: "cycling",
            details: "Rent from **Züri Rollt** (free bike-sharing program).",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Green Pear Hotel",
          icon: "hotel",
          type: "eco-lodge",
          details: "LEED-certified, solar-powered, and plastic-free.",
          ecoRating: 4,
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
        }
      },
      {
        date: "2024-08-22",
        activities: [
          {
            time: "09:00",
            place: "Hiking in Swiss National Park",
            icon: "hiking",
            type: "hiking",
            details: "Guided eco-tour with wildlife conservation focus.",
            ecoRating: 5
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Costa Rica Rainforest Retreat",
    startDate: "2024-09-15",
    endDate: "2024-09-25",
    location: "Costa Rica",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e",
    description: "Immerse yourself in biodiversity with carbon-neutral lodges.",
    carbonFootprint: "280kg CO₂ (offset via reforestation)",
    budgetRange: "high",
    tags: ["wildlife", "eco-lodge", "kayaking"],
    transportation: "electric-vehicle",
    days: [
      {
        date: "2024-09-15",
        activities: [
          {
            time: "10:30",
            place: "Arrive at San José Airport (Carbon Offset)",
            icon: "plane",
            type: "transport",
            details: "100% carbon offset via local reforestation projects.",
            ecoRating: 3 // flights have higher impact
          },
          {
            time: "12:00",
            place: "Electric Shuttle to Monteverde",
            icon: "ev",
            type: "transport",
            details: "Renewable energy-powered transfer.",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Monteverde Eco Lodge",
          icon: "hotel",
          type: "eco-lodge",
          details: "Off-grid, rainwater harvesting, and supports local tribes.",
          ecoRating: 5
        }
      }
    ]
  },
  {
    id: 3,
    title: "Kyoto Bamboo & Culture",
    startDate: "2024-10-10",
    endDate: "2024-10-22",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d",
    description: "Traditional stays and low-waste experiences in Kyoto.",
    carbonFootprint: "200kg CO₂ (train/bike focus)",
    budgetRange: "medium",
    tags: ["cultural", "cycling", "sustainable-dining"],
    transportation: "train",
    days: [
      {
        date: "2024-10-10",
        activities: [
          {
            time: "14:00",
            place: "Arrive via Bullet Train (Tokyo → Kyoto)",
            icon: "train",
            type: "transport",
            details: "Japan Rail Pass (low-emission travel).",
            ecoRating: 4
          },
          {
            time: "16:00",
            place: "Zero-Waste Sushi Workshop",
            icon: "food",
            type: "sustainable-dining",
            details: "Learn to use every part of the fish with local chefs.",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Eco Ryokan Tofukuji",
          icon: "hotel",
          type: "eco-lodge",
          details: "Tatami rooms, geothermal heating, and organic meals.",
          ecoRating: 5
        }
      }
    ]
  },
  {
    id: 4,
    title: "Langkawi Island Eco-Escape",
    startDate: "2024-11-05",
    endDate: "2024-11-08",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974",
    description: "Sustainable island hopping with coral conservation activities.",
    carbonFootprint: "150kg CO₂ (ferry travel)",
    budgetRange: "medium",
    tags: ["beach", "wildlife", "kayaking"],
    transportation: "ferry",
    days: [
      {
        date: "2024-11-05",
        activities: [
          {
            time: "12:00",
            place: "Arrive via Ferry (Penang → Langkawi)",
            icon: "ferry",
            type: "transport",
            details: "Low-emission high-speed ferry.",
            ecoRating: 4
          },
          {
            time: "14:00",
            place: "Coral Planting Workshop",
            icon: "wildlife",
            type: "conservation",
            details: "Help restore marine ecosystems with local NGOs.",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Tuba Island Eco Resort",
          icon: "hotel",
          type: "eco-lodge",
          details: "Solar-powered stilt houses over the water.",
          ecoRating: 4
        }
      }
    ]
  },
  {
    id: 5,
    title: "Cameron Highlands Tea Trail",
    startDate: "2024-12-10",
    endDate: "2024-12-12",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1589010588553-46e8e7c21788",
    description: "Organic tea plantations and cool climate hikes.",
    carbonFootprint: "80kg CO₂ (electric bus)",
    budgetRange: "low",
    tags: ["hiking", "sustainable-dining", "cultural"],
    transportation: "electric-vehicle",
    days: [
      {
        date: "2024-12-10",
        activities: [
          {
            time: "09:00",
            place: "Electric Bus from Kuala Lumpur",
            icon: "ev",
            type: "transport",
            details: "Renewable energy-powered transportation.",
            ecoRating: 5
          },
          {
            time: "12:00",
            place: "BOH Organic Tea Plantation Tour",
            icon: "food",
            type: "sustainable-dining",
            details: "Chemical-free tea production since 1929.",
            ecoRating: 4
          }
        ],
        ecoStay: {
          name: "Strawberry Park Eco Lodge",
          icon: "hotel",
          type: "eco-lodge",
          details: "Rainwater harvesting and permaculture garden.",
          ecoRating: 3
        }
      }
    ]
  },
  {
    id: 6,
    title: "Borneo Wildlife Sanctuary",
    startDate: "2025-01-15",
    endDate: "2025-01-18",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e",
    description: "Ethical orangutan encounters and rainforest conservation.",
    carbonFootprint: "180kg CO₂ (offset flights)",
    budgetRange: "high",
    tags: ["wildlife", "conservation", "jungle"],
    transportation: "plane",
    days: [
      {
        date: "2025-01-15",
        activities: [
          {
            time: "08:00",
            place: "Flight to Sandakan (Carbon Offset)",
            icon: "plane",
            type: "transport",
            details: "100% carbon offset via Borneo reforestation.",
            ecoRating: 3
          },
          {
            time: "14:00",
            place: "Sepilok Orangutan Sanctuary",
            icon: "wildlife",
            type: "conservation",
            details: "Ethical rehabilitation program visit.",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Borneo Rainforest Lodge",
          icon: "hotel",
          type: "eco-lodge",
          details: "UNESCO-listed site with zero single-use plastics.",
          ecoRating: 5
        }
      }
    ]
  },
  {
    id: 7,
    title: "Penang Urban Eco Walk",
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1580852300558-3a1434b3d04e",
    description: "Street art, heritage, and zero-waste dining in George Town.",
    carbonFootprint: "40kg CO₂ (walking/bicycle)",
    budgetRange: "low",
    tags: ["cultural", "sustainable-dining", "cycling"],
    transportation: "bike",
    days: [
      {
        date: "2025-02-10",
        activities: [
          {
            time: "10:00",
            place: "Bike Rental @ George Town",
            icon: "bike",
            type: "transport",
            details: "Solar-powered bike share system",
            ecoRating: 5
          },
          {
            time: "12:00",
            place: "Joo Hooi Cafe (Zero-Waste Lunch)",
            icon: "food",
            type: "sustainable-dining",
            details: "Heritage spot with compostable packaging",
            ecoRating: 4
          }
        ],
        ecoStay: {
          name: "Clan Jetty Eco Homestay",
          icon: "hotel",
          type: "eco-lodge",
          details: "Traditional stilt house with rainwater harvesting",
          ecoRating: 3
        }
      }
    ]
  },
  {
    id: 8,
    title: "Perhentian Islands Marine Rescue",
    startDate: "2025-03-05",
    endDate: "2025-03-08",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
    description: "Beach cleanups and turtle conservation volunteering.",
    carbonFootprint: "90kg CO₂ (sailboat transfers)",
    budgetRange: "low",
    tags: ["beach", "wildlife", "conservation"],
    transportation: "ferry",
    days: [
      {
        date: "2025-03-05",
        activities: [
          {
            time: "14:00",
            place: "Plastic-Free Beach Workshop",
            icon: "wildlife",
            type: "conservation",
            details: "Learn to make eco-bricks from ocean waste",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Bubbles Dive Resort",
          icon: "hotel",
          type: "eco-lodge",
          details: "Solar-powered with coral adoption program",
          ecoRating: 4
        }
      }
    ]
  },
  {
    id: 9,
    title: "Taman Negara Canopy Exploration",
    startDate: "2025-04-15",
    endDate: "2025-04-17",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6",
    description: "Ancient rainforest hikes and indigenous culture.",
    carbonFootprint: "60kg CO₂ (electric shuttle)",
    budgetRange: "medium",
    tags: ["jungle", "hiking", "wildlife"],
    transportation: "electric-vehicle",
    days: [
      {
        date: "2025-04-15",
        activities: [
          {
            time: "09:00",
            place: "Batek Tribe Guided Walk",
            icon: "hiking",
            type: "cultural",
            details: "Learn forest survival from Orang Asli guides",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Mutiara Taman Negara",
          icon: "hotel",
          type: "eco-lodge",
          details: "River-facing chalets with strict no-plastic policy",
          ecoRating: 4
        }
      }
    ]
  },
  {
    id: 10,
    title: "Kuching Green City Break",
    startDate: "2025-05-20",
    endDate: "2025-05-22",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1596422846546-75cc0b7a9071",
    description: "Sustainable urban development and organic farms.",
    carbonFootprint: "70kg CO₂ (public transport)",
    budgetRange: "medium",
    tags: ["cultural", "sustainable-dining", "cycling"],
    transportation: "bike",
    days: [
      {
        date: "2025-05-20",
        activities: [
          {
            time: "15:00",
            place: "Sarawak Eco-Warriors Tour",
            icon: "bike",
            type: "cultural",
            details: "Visit urban permaculture projects",
            ecoRating: 4
          }
        ],
        ecoStay: {
          name: "The Waterfront Hotel",
          icon: "hotel",
          type: "eco-lodge",
          details: "Green Building Index certified",
          ecoRating: 3
        }
      }
    ]
  },
  {
    id: 11,
    title: "Redang Island Reef Restoration",
    startDate: "2025-06-10",
    endDate: "2025-06-13",
    location: "Malaysia",
    image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be",
    description: "Snorkel while helping scientists rebuild coral reefs.",
    carbonFootprint: "110kg CO₂ (low-emission boat)",
    budgetRange: "high",
    tags: ["beach", "conservation", "wildlife"],
    transportation: "ferry",
    days: [
      {
        date: "2025-06-10",
        activities: [
          {
            time: "11:00",
            place: "Coral Frame Building Workshop",
            icon: "wildlife",
            type: "conservation",
            details: "Create structures for new coral growth",
            ecoRating: 5
          }
        ],
        ecoStay: {
          name: "Laguna Redang Eco Resort",
          icon: "hotel",
          type: "eco-lodge",
          details: "SEA LIFE Trust partner with desalination plant",
          ecoRating: 4
        }
      }
    ]
  }
];

// Export for use in filters (e.g., filter by tags/budget)
export const filterOptions = {
  tags: ["hiking", "cycling", "wildlife", "sustainable-dining", "cultural", "kayaking"],
  budgetRange: ["low", "medium", "high"],
  transportation: ["train", "bike", "electric-vehicle"]
};

export default tripsData;