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
    query.$text = { $search: search };
  }
  const trips = await Trip.find(query).lean();
  return trips;
};

export const getTripById = async (tripId) => {
  // Try to find by tripId first (string field in database)
  let trip = await Trip.findOne({ tripId: tripId.toString() });

  // If not found, try to find by id field (in case data was seeded with id)
  if (!trip) {
    trip = await Trip.findOne({ id: parseInt(tripId) });
  }

  // If still not found in database, fall back to tripsData.js
  if (!trip) {
    trip = tripsData.find((t) => t.id === parseInt(tripId));
  }

  return trip;
};

export const getAllTags = () => [
  ...new Set(tripsData.flatMap((trip) => trip.tags)),
];

export const getAllBudgetRanges = () => [
  ...new Set(tripsData.map((trip) => trip.budgetRange)),
];
