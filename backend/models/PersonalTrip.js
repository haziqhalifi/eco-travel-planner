import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  time: String,
  place: String,
  icon: String,
  type: String,
  details: String,
  ecoRating: Number,
  imageUrl: String,
});

const addedPlaceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});

const personalTripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: String,
  carbonFootprint: String,
  budgetRange: String,
  tags: [
    String
  ],
  transportation: String,
  days: [
    {
      date: {
        type: String,
      },
      activities: [activitySchema]
    }
  ],
  // addedPlaces: [
  //   {
  //     type: String,
  //     data: mongoose.Schema.Types.Mixed
  //   }
  // ]
  addedPlaces: [
    new mongoose.Schema({
      type: String,
      data: mongoose.Schema.Types.Mixed
    })
  ]
  // addedPlaces: [addedPlaceSchema]
})


export default mongoose.model("PersonalTrip", personalTripSchema);