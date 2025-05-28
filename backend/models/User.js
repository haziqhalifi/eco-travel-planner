import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    personalTrips: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PersonalTrip' }],
      default: [],
    },
    favorites: {
      accommodations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation' }],
      restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
      activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
      transportation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transportation' }],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
export default mongoose.model("User", userSchema);
