import SavedCity from "../models/Weather.js";

// Save a city for a user
export const saveCity = async (req, res) => {
  console.log("req.user:", req.user); // Debug log
  const userId = req.user?.userId || req.user?._id || req.user?.id;
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized: user not found in request. Please log in.",
    });
  }
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City is required" });
  try {
    let saved = await SavedCity.findOne({ userId });
    if (!saved) {
      saved = new SavedCity({ userId, cities: [city] });
    } else if (!saved.cities.includes(city)) {
      saved.cities.push(city);
    }
    await saved.save();
    res.json(saved.cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all saved cities for a user
export const getSavedCities = async (req, res) => {
  console.log("req.user:", req.user); // Debug log
  const userId = req.user?.userId || req.user?._id || req.user?.id;
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized: user not found in request. Please log in.",
    });
  }
  try {
    const saved = await SavedCity.findOne({ userId });
    res.json(saved ? saved.cities : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a city from saved list
export const removeCity = async (req, res) => {
  console.log("req.user:", req.user); // Debug log
  const userId = req.user?.userId || req.user?._id || req.user?.id;
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized: user not found in request. Please log in.",
    });
  }
  const { city } = req.body;
  try {
    const saved = await SavedCity.findOne({ userId });
    if (!saved) return res.json([]);
    saved.cities = saved.cities.filter((c) => c !== city);
    await saved.save();
    res.json(saved.cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
