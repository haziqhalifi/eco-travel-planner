import CarbonModel from "../models/CarbonFootprint.js";

// Save a new footprint
export const saveFootprint = async (req, res) => {
  try {
    const newFootprint = new CarbonModel(req.body);
    const saved = await newFootprint.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to save footprint", error: error.message });
  }
};

// Get all footprints
export const getAllFootprints = async (req, res) => {
  try {
    const footprints = await CarbonModel.find().sort({ date: -1 });
    res.status(200).json(footprints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch footprints", error: error.message });
  }
};
