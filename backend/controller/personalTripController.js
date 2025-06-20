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

// POST /api/trips/:tripId/add-place
export const addPlaceToTrip = async (req, res) => {
  const { tripId } = req.params;
  const { serpData, type } = req.body;
  console.log("serpdata:", serpData);

  console.log("req.params:", req.params.tripId);
  console.log("req.body:", req.body);
  if (!serpData || !type) {
    return res.status(400).json({ error: "Missing serpData or type" });
  }

  console.log(req.body.type);
  console.log(req.body.serpData);
  try {
    const updatedTrip = await service.getPersonalTripByIdAndUpdate(
        req.user.userId,   // user ID for scoping
        tripId,            // trip ID to find
        req.body,
        { new: true }
    );

    res.status(200).json({ success: true, data: updatedTrip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

export const addActivity = async (req, res) => {
  try {
    const {activity, date} = req.body;
    const trip = await service.addActivityToTrip(req.user.userId,req.params.tripId, activity, date);
    return res.json({success: true, data: trip});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}

export const deleteActivity = async (req, res) => {
  try {
    const trip = await service.deleteActivityFromTrip(req.user.userId, req.params.tripId, req.params.activityId);
    return res.json({success: true, data: trip});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
}