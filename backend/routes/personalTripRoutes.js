import express from "express";
import User from "../models/User.js";
import authenticateToken from "../middleware/auth.js";
import {
  fetchAllPersonalTrips,
  addPersonalTrip,
  deletePersonalTrip,
  getPersonalTrip, addPlaceToTrip
} from "../controller/personalTripController.js";

const router = express.Router();

router.get("/", authenticateToken, fetchAllPersonalTrips);
router.post("/:tripId", authenticateToken, addPersonalTrip);
router.post("/:tripId/add-place", authenticateToken, addPlaceToTrip);
router.get("/:tripId", authenticateToken, getPersonalTrip);
router.delete("/:tripId", authenticateToken, deletePersonalTrip);


// @route   POST /api/personal-trips/:tripId/activities
// @desc    Add custom activity to personal trip
// @access  Private
router.post("/:tripId/activities", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const personalTrip = user.personalTrips.find(
        (pt) => pt.tripId === req.params.tripId
    );
    if (!personalTrip) {
      return res.status(404).json({
        success: false,
        message: "Personal trip not found",
      });
    }

    const {
      dayIndex,
      activityIndex,
      time,
      place,
      icon,
      type,
      details,
      ecoRating,
      imageUrl,
    } = req.body;

    // Validation
    if (
        dayIndex === undefined ||
        activityIndex === undefined ||
        !time ||
        !place
    ) {
      return res.status(400).json({
        success: false,
        message:
            "Missing required fields: dayIndex, activityIndex, time, place",
      });
    }

    personalTrip.customActivities.push({
      dayIndex,
      activityIndex,
      time,
      place,
      icon: icon || "compass",
      type: type || "activity",
      details: details || "",
      ecoRating: ecoRating || 3,
      imageUrl: imageUrl || "",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Activity added successfully",
    });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding activity",
      error: error.message,
    });
  }
});

// @route   POST /api/personal-trips/:tripId/add-place
// @desc    Add custom place to personal trip
// @access  Private
// router.post("/:tripId/add-place", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//
//     const personalTrip = user.personalTrips.find(
//         (pt) => pt.tripId.toString() === req.params._id
//     );
//     if (!personalTrip) {
//       return res.status(404).json({
//         success: false,
//         message: "Personal trip not found",
//       });
//     }
//
//     const { type, serpData } = req.body;
//
//     // Validate required fields
//     if (!type || !serpData) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: type, serpData",
//       });
//     }
//
//     // Add place to trip — assuming personalTrip has a places array
//     if (!personalTrip.places) {
//       personalTrip.places = [];
//     }
//
//     personalTrip.places.push({
//       type,
//       serpData,
//       addedAt: new Date(),
//     });
//
//     await user.save();
//
//     res.status(201).json({
//       success: true,
//       message: "Place added successfully",
//       data: personalTrip, // optionally return updated trip
//     });
//   } catch (error) {
//     console.error("Error adding place:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while adding place",
//       error: error.message,
//     });
//   }
// });



// @route   DELETE /api/personal-trips/:tripId/activities/:dayIndex/:activityIndex
// @desc    Delete activity from personal trip
// @access  Private
router.delete(
    "/:tripId/activities/:dayIndex/:activityIndex",
    authenticateToken,
    async (req, res) => {
      try {
        const user = await User.findById(req.user.userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const personalTrip = user.personalTrips.find(
            (pt) => pt.tripId === req.params._id
        );
        if (!personalTrip) {
          return res.status(404).json({
            success: false,
            message: "Personal trip not found",
          });
        }

        const dayIndex = parseInt(req.params.dayIndex);
        const activityIndex = parseInt(req.params.activityIndex);

        if (isNaN(dayIndex) || isNaN(activityIndex)) {
          return res.status(400).json({
            success: false,
            message: "Invalid dayIndex or activityIndex",
          });
        }

        personalTrip.deletedActivities.push({dayIndex, activityIndex});

        await user.save();

        res.json({
          success: true,
          message: "Activity deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({
          success: false,
          message: "Server error while deleting activity",
          error: error.message,
        });
      }
    }
);

export default router;
