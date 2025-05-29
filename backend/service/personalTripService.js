import User from "../models/User.js";
import PersonalTrip from "../models/PersonalTrip.js";
import Trip from "../models/Trip.js";
import {getTripById} from "./tripService.js";
import mongoose from "mongoose";

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

export const getPersonalTripByIdAndUpdate = async (userId, tripId, update) => {
  // Check if the user exists
  console.log("Updating trip:", { tripId, userId, update });
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  console.log(typeof update.type, update.type); // should print: string accommodation
  console.log(typeof update.serpData, update.serpData);

  const updatedTrip = await PersonalTrip.findOneAndUpdate(
      { _id: tripId },    // filter by trip ID and user ID
      {
        $push: {
          addedPlaces: {
            type: update.type,     // e.g. 'accommodation'
            serpData: update.serpData  // your place data object
          }
        }
      },
      { new: true }   // return the updated document
  );
  if (!updatedTrip) throw new Error("Trip not found or update failed" + updatedTrip);

  return updatedTrip;
};

export const deletePersonalTrip = async (userId, ptId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.personalTrips.filter((tripId) => tripId.toString() !== ptId);
  await user.save();

  const deletedTrip = await PersonalTrip.findByIdAndDelete(ptId);
  if (!deletedTrip) throw new Error("Trip not found");
  return deletedTrip;
}