import mongoose from 'mongoose';


const actSchema = new mongoose.Schema({
  time: String,
  place: String,
  icon: String,
  type: String,
  details: String,
  ecoRating: Number,
  imageUrl: String,
});

const tripSchema = new mongoose.Schema({
  tripId: {
    type: Number,
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
      activities: [actSchema]
    }
  ]
})


export default mongoose.model('Trip', tripSchema);