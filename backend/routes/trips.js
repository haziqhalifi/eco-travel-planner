import express from "express";
import tripsData from "../data/tripsData.js";

const router = express.Router();

// @route   GET /api/trips
// @desc    Get all trips with optional filtering
// @access  Public
router.get("/", (req, res) => {
  try {
    const { tags, budgetRange, transportation, search } = req.query;

    let filteredTrips = [...tripsData];

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      filteredTrips = filteredTrips.filter((trip) =>
        tagArray.some((tag) =>
          trip.tags.some((tripTag) => tripTag.toLowerCase().includes(tag))
        )
      );
    }

    // Filter by budget range
    if (budgetRange && budgetRange !== "all") {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.budgetRange === budgetRange
      );
    }

    // Filter by transportation
    if (transportation && transportation !== "all") {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.transportation === transportation
      );
    }

    // Filter by search term (title, location, description)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTrips = filteredTrips.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchTerm) ||
          trip.location.toLowerCase().includes(searchTerm) ||
          trip.description.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      success: true,
      count: filteredTrips.length,
      data: filteredTrips,
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching trips",
      error: error.message,
    });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip by ID
// @access  Public
router.get("/:id", (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID format",
      });
    }

    const trip = tripsData.find((t) => t.id === tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching trip",
      error: error.message,
    });
  }
});

// @route   GET /api/trips/tags/all
// @desc    Get all available tags
// @access  Public
router.get("/tags/all", (req, res) => {
  try {
    const allTags = [...new Set(tripsData.flatMap((trip) => trip.tags))];

    res.json({
      success: true,
      data: allTags.sort(),
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tags",
      error: error.message,
    });
  }
});

// @route   GET /api/trips/budget-ranges/all
// @desc    Get all available budget ranges
// @access  Public
router.get("/budget-ranges/all", (req, res) => {
  try {
    const budgetRanges = [
      ...new Set(tripsData.map((trip) => trip.budgetRange)),
    ];

    res.json({
      success: true,
      data: budgetRanges.sort(),
    });
  } catch (error) {
    console.error("Error fetching budget ranges:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching budget ranges",
      error: error.message,
    });
  }
});

export default router;
