import express from "express";
// import tripsData from "../data/tripsData.js";
import {fetchAllTrips, fetchTripById} from "../controller/tripController.js";

const router = express.Router();

router.get("/", fetchAllTrips);
router.get("/:tripId", fetchTripById);

// @route   GET /api/trips/tags/all
// @desc    Get all available tags
// @access  Public
// router.get("/tags/all", (req, res) => {
//   try {
//     const allTags = [...new Set(tripsData.flatMap((trip) => trip.tags))];
//
//     res.json({
//       success: true,
//       data: allTags.sort(),
//     });
//   } catch (error) {
//     console.error("Error fetching tags:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching tags",
//       error: error.message,
//     });
//   }
// });

// @route   GET /api/trips/budget-ranges/all
// @desc    Get all available budget ranges
// @access  Public
// router.get("/budget-ranges/all", (req, res) => {
//   try {
//     const budgetRanges = [
//       ...new Set(tripsData.map((trip) => trip.budgetRange)),
//     ];
//
//     res.json({
//       success: true,
//       data: budgetRanges.sort(),
//     });
//   } catch (error) {
//     console.error("Error fetching budget ranges:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching budget ranges",
//       error: error.message,
//     });
//   }
// });

export default router;
