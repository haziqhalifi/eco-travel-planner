import * as service from "../service/personalTripService.js";

export const fetchAllPersonalTrips = async (req, res) => {
  try {
    const trips = await service.getAllPersonalTrips(req.user.userId);
    return res.json({success: true, data: trips});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}

export const addPersonalTrip = async (req, res) => {
  try {
    const trip = await service.addPersonalTrip(req.user.userId, req.params.tripId);
    return res.json({success: true, data: trip});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}

export const deletePersonalTrip = async (req, res) => {
  try {
    const trip = await service.deletePersonalTrip(req.user.userId, req.params.tripId);
    return res.json({success: true, data: trip});
  }catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}

export const getPersonalTrip = async (req, res) => {
  try {
    const trip = await service.getPersonalTripById(req.user.userId, req.params.tripId);
    return res.json({success: true, data: trip});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}