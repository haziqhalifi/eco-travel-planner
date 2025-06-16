import mongoose from "mongoose";

const CarbonFootprintSchema = new mongoose.Schema({
  vehicleType: String,
  carUsage: Number,
  electricityUsage: Number,
  foodType: String,
  shortFlight: Number,
  mediumFlight: Number,
  longFlight: Number,
  totalEmission: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const CarbonModel = mongoose.model("footprints", CarbonFootprintSchema);
export default CarbonModel;
