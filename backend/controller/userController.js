import User from "../models/user.js";
import * as service from "../service/userService.js";

export const getAllFavourites = async (req, res) => {
    try {
        const favourites = await service.getAllFavourites(req.params.userId);
        return res.json({success: true, data: favourites});
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
}

export const toggleFavourites = async (req, res) => {
    const { objectId, itemId, itemType } = req.body;

    if (!itemId || !itemType) {
        return res.status(400).json({ message: "Missing itemId or itemType" });
    }

    try {
        const updatedFavorites = await service.toggleFavourites(req.user.userId, objectId, itemId, itemType);
        res.status(200).json({ success: true, data: updatedFavorites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};