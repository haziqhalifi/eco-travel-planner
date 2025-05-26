import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: String,
  description: String,
  time: String,
});

const tripSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  activities: [activitySchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Trip', tripSchema);