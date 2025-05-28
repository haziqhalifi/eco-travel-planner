import User from "../models/User.js";
import PersonalTrip from "../models/PersonalTrip.js";
import Trip from "../models/Trip.js";

export const getAllPersonalTrips = async (userId) => {
  const user = await User.findById(userId).populate("personalTrips");
  if (!user) {
    throw new Error("User not found");
  }
  return user.personalTrips;
}

export const addPersonalTrip = async (userId, tripId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const trip = await Trip.findOne({tripId: tripId})

  if (!trip) throw new Error("Trip not found");


  const newTrip = new PersonalTrip({
    tripId: tripId,
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    location: trip.location,
    image: trip.image,
    description: trip.description,
    carbonFootprint: trip.carbonFootprint,
    budgetRange: trip.budgetRange,
    tags: trip.tags,
    transportation: trip.transportation,
    days: trip.days,
  });
  await newTrip.save();

  user.personalTrips.push(newTrip._id);
  await user.save();
  return newTrip;
}

export const getPersonalTripById = async (userId, ptId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const trip = await PersonalTrip.findOne({_id : ptId});
  if (!trip) throw new Error("Trip not found");
  return trip;
}

export const deletePersonalTrip = async (userId, ptId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.personalTrips.filter((tripId) => tripId.toString() !== ptId);
  await user.save();

  const deletedTrip = await PersonalTrip.findByIdAndDelete(ptId);
  if (!deletedTrip) throw new Error("Trip not found");
  return deletedTrip;
}