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
    personalTrips: [
      {
        tripId: {
          type: String,
          required: true,
        },
        customActivities: [
          {
            dayIndex: {
              type: Number,
              required: true,
            },
            activityIndex: {
              type: Number,
              required: true,
            },
            time: {
              type: String,
              required: true,
            },
            place: {
              type: String,
              required: true,
            },
            icon: {
              type: String,
              default: "compass",
            },
            type: {
              type: String,
              default: "activity",
            },
            details: String,
            ecoRating: {
              type: Number,
              min: 1,
              max: 5,
              default: 3,
            },
            imageUrl: String,
          },
        ],
        deletedActivities: [
          {
            dayIndex: {
              type: Number,
              required: true,
            },
            activityIndex: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ "personalTrips.tripId": 1 });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
export default mongoose.model("User", userSchema);
