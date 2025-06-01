import Trip from "../models/Trip.js";

export const getFilteredTrips = async ({
  tags,
  budgetRange,
  transportation,
  search,
}) => {
  const query = {};

  if (tags) {
    query.tags = { $all: tags };
  }

  if (budgetRange && budgetRange !== "all") {
    query.budgetRange = budgetRange;
  }

  if (transportation && transportation !== "all") {
    query.transportation = transportation;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { tags: regex },
      { transportation: regex },
      { activities: regex },
    ];
  }
  const trips = await Trip.find(query).lean();
  return trips;
};

export const getTripById = async (tripId) => {
  let trip = await Trip.findOne({ tripId: tripId.toString() });

  if (!trip) {
    trip = await Trip.findOne({ id: parseInt(tripId) });
  }

  return trip;
};

export const getTopTrips = async (limit = 4) => {
  // You can sort by popularity, rating, or just return the latest/first N trips
  // For now, return the first N trips
  const trips = await Trip.find().limit(limit).lean();
  return trips;
};

// export const getAllTags = () => [
//   ...new Set(tripsData.flatMap((trip) => trip.tags)),
// ];
//
// export const getAllBudgetRanges = () => [
//   ...new Set(tripsData.map((trip) => trip.budgetRange)),
// ];
