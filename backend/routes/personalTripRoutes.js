import express from "express";
import User from "../models/User.js";
import authenticateToken from "../middleware/auth.js";
import {
  fetchAllPersonalTrips,
  addPersonalTrip,
  deletePersonalTrip,
  getPersonalTrip, addActivity, deleteActivity
} from "../controller/personalTripController.js";

const router = express.Router();

router.get("/", authenticateToken, fetchAllPersonalTrips);
router.post("/:tripId", authenticateToken, addPersonalTrip);
router.get("/:tripId", authenticateToken, getPersonalTrip);
router.delete("/:tripId", authenticateToken, deletePersonalTrip);
router.post("/:tripId/activities", authenticateToken, addActivity);
router.delete("/:tripId/activities/:activityId", authenticateToken, deleteActivity);


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
