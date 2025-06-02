import mongoose from 'mongoose';

// Define the schema for Accommodation
const AccommodationSchema = new mongoose.Schema({
    queryParams: {
        q: { type: String, required: true },
        check_in_date: { type: String, required: true },
        check_out_date: { type: String, required: true },
        adults: { type: Number, required: true }
    },

    // location: { type: String, required: true },      // location for query
    // title: { type: String, required: true },         // accommodation title
    // description: { type: String, required: true },   // description of the accommodation
    // image: { type: String, required: true },         // image URL for the accommodation
    // type: { type: String, required: true },          // type of accommodation (e.g., hotel, hostel)
    // rating: { type: Number, required: true },        // rating for the accommodation
    // fetchedAt: { type: Date, default: Date.now },    // timestamp for when data was fetched

    // queryParams: mongoose.Schema.Types.Mixed,
    serpData: mongoose.Schema.Types.Mixed,
    fetchedAt: { type: Date, default: Date.now }
}, {
    collection: 'accommodations',
    db: 'eco-options-data'
});

// export default mongoose.model('Accommodation', AccommodationSchema);
const Accommodation = mongoose.models.Accommodation || mongoose.model('Accommodation', AccommodationSchema);
export default Accommodation;