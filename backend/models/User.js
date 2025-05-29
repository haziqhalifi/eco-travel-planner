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
      accommodations: [{ type: String, ref: 'Accommodation', default: [] }],
      restaurants: [{ type: String, ref: 'Restaurant', default: [] }],
      activities: [{ type: String, ref: 'Activity', default: [] }],
      transportation: [{ type: String, ref: 'Transportation', default: [] }],
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
if (mongoose.models.User) {
    delete mongoose.models.User;
}

// module.exports = User;
export default mongoose.model("User", userSchema);
