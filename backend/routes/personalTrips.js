import express from "express";
import User from "../models/User.js";
import tripsData from "../data/tripsData.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/personal-trips
// @desc    Get user's personal trips with modifications
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get full trip data with personal modifications
    const personalTrips = user.personalTrips
      .map((personalTrip) => {
        const baseTrip = tripsData.find(
          (t) => t.id === parseInt(personalTrip.tripId)
        );
        if (!baseTrip) return null;

        // Deep clone the base trip to avoid modifying the original
        const modifiedTrip = JSON.parse(JSON.stringify(baseTrip));

        // Add custom activities
        personalTrip.customActivities.forEach((customActivity) => {
          if (modifiedTrip.days[customActivity.dayIndex]) {
            modifiedTrip.days[customActivity.dayIndex].activities.splice(
              customActivity.activityIndex,
              0,
              {
                time: customActivity.time,
                place: customActivity.place,
                icon: customActivity.icon,
                type: customActivity.type,
                details: customActivity.details,
                ecoRating: customActivity.ecoRating,
                imageUrl: customActivity.imageUrl,
                isCustom: true,
              }
            );
          }
        });

        // Mark deleted activities
        personalTrip.deletedActivities.forEach((deleted) => {
          if (
            modifiedTrip.days[deleted.dayIndex] &&
            modifiedTrip.days[deleted.dayIndex].activities[
              deleted.activityIndex
            ]
          ) {
            modifiedTrip.days[deleted.dayIndex].activities[
              deleted.activityIndex
            ].isDeleted = true;
          }
        });

        // Filter out deleted activities
        modifiedTrip.days.forEach((day) => {
          day.activities = day.activities.filter(
            (activity) => !activity.isDeleted
          );
        });

        return {
          ...modifiedTrip,
          personalTripId: personalTrip._id,
        };
      })
      .filter((trip) => trip !== null);

    res.json({
      success: true,
      count: personalTrips.length,
      data: personalTrips,
    });
  } catch (error) {
    console.error("Error fetching personal trips:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching personal trips",
      error: error.message,
    });
  }
});

// @route   POST /api/personal-trips/:tripId
// @desc    Add trip to user's personal collection
// @access  Private
router.post("/:tripId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tripId = req.params.tripId;
    const trip = tripsData.find((t) => t.id === parseInt(tripId));
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Check if trip is already in personal trips
    const existingTrip = user.personalTrips.find((pt) => pt.tripId === tripId);
    if (existingTrip) {
      return res.status(400).json({
        success: false,
        message: "Trip already in personal collection",
      });
    }

    user.personalTrips.push({
      tripId,
      customActivities: [],
      deletedActivities: [],
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Trip added to personal collection",
    });
  } catch (error) {
    console.error("Error adding personal trip:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding trip",
      error: error.message,
    });
  }
});

// @route   DELETE /api/personal-trips/:tripId
// @desc    Remove trip from user's personal collection
// @access  Private
router.delete("/:tripId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const initialLength = user.personalTrips.length;
    user.personalTrips = user.personalTrips.filter(
      (pt) => pt.tripId !== req.params.tripId
    );

    if (user.personalTrips.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Trip not found in personal collection",
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Trip removed from personal collection",
    });
  } catch (error) {
    console.error("Error removing personal trip:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing trip",
      error: error.message,
    });
  }
});

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
        (pt) => pt.tripId === req.params.tripId
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

      personalTrip.deletedActivities.push({ dayIndex, activityIndex });

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
