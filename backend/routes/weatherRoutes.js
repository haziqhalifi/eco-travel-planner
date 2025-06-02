import express from "express";
import {
  saveCity,
  getSavedCities,
  removeCity,
} from "../controller/weatherController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Save a city for the user
router.post("/save", auth, saveCity);

// Get all saved cities for the user
router.get("/saved", auth, getSavedCities);

// Remove a city from the user's saved list
router.post("/remove", auth, removeCity);

export default router;
