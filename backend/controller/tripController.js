import Trip from "../models/Trip.js";

export const getAllTrips = async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
};

export const getTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return res.status(404).json({ msg: "Trip not found" });
  }
  res.json(trip);
}

export const createTrip = async (req, res) => {
  const {title, location, description} = req.body;
  const trip = await Trip.create({
    title, location, description, createdBy: req.user._id
  });
  res.status(201).json(trip);
}
