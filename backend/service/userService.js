import User from "../models/User.js";
import Accommodation from "../models/Accommodation.js";

export const getUserById = async (id) => {
  await User.findById(id);
}

export const getAllFavourites = async (req, res) => {
  try {
    const user = await User.findById(req);
    if (!user) return res.status(404).json({ message: "User not found" });

    // res.status(200).json({ success: true, favorites: user.favorites });
    return user.favorites;
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const toggleFavourites = async (userId, docId, itemId, itemType) => {
  if (!["accommodations", "restaurants", "activities", "transportation", "accommodation", "restaurant", "activity", "transportation"].includes(itemType)) {
    throw new Error("Invalid item type");
  }

  switch (itemType) {
    case "accommodation":
      itemType="accommodations";
      break;
    case "restaurant":
      itemType="restaurants";
      break;
    case "activity":
      itemType="activities";
      break;
    default:
      break;
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const favoritesList = user.favorites[itemType];

  const index = favoritesList.indexOf(itemId);

  if (index === -1) {
    // Add to favorites
    favoritesList.push(itemId);
  } else {
    // Remove from favorites
    favoritesList.splice(index, 1);
  }

  await user.save();
  return user.favorites;
};