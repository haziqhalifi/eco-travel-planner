import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cities: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

// Add indexes for better performance
weatherSchema.index({ userId: 1 });

const SavedCity = mongoose.model("SavedCity", weatherSchema);

export default SavedCity;
