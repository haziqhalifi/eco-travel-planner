import authenticateToken from "../middleware/auth.js";
import express from "express";
import {getAllFavourites, toggleFavourites} from "../controller/userController.js";

const router = express.Router();

// @route   GET /api/user
router.get("/:userId/favorites", authenticateToken, getAllFavourites);
router.post("/:userId/favorites/:favoritesId/toggle", authenticateToken, toggleFavourites);

export default router;