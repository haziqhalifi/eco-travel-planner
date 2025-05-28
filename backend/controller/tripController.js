import { getFilteredTrips, getTripById } from "../service/tripService.js";

export const fetchAllTrips = async (req, res) => {
  try {
    const filters = req.query;
    const data = await getFilteredTrips(filters);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching trips",
        error: err.message,
      });
  }
};

export const fetchTripById = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);

    if (isNaN(tripId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid trip ID" });
    }

    const trip = await getTripById(tripId);

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    res.json({ success: true, data: trip });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching trip",
        error: err.message,
      });
  }
};
