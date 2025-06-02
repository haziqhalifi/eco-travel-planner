import mongoose from 'mongoose';

// Define the schema for Restaurant
const RestaurantSchema = new mongoose.Schema({
    queryParams: {
        q: {type: String, required: true},
    },     // Search term used to find the restaurant

    // id: { type: String, required: true },             // Unique restaurant ID
    // type: { type: String, default: 'Restaurant' },    // Type of place
    // name: { type: String, required: true },           // Restaurant name
    // location: { type: String, required: true },       // Address
    // rating: { type: Number, required: false },        // Average rating
    // reviews: { type: Number, required: false },       // Number of reviews
    // priceLevel: { type: String, required: false },    // Price level (e.g., $, $$)
    // description: { type: String, required: false },   // Description of the place
    // image: { type: String, required: false },         // Thumbnail image URL
    // placeId: { type: String, required: false },       // Google Place ID
    // hours: { type: mongoose.Schema.Types.Mixed },     // Could be an object or array
    // gps: { type: mongoose.Schema.Types.Mixed },       // GPS coordinates (lat, lng)
    // links: { type: mongoose.Schema.Types.Mixed },     // e.g., website, menu

    serpData: mongoose.Schema.Types.Mixed,
    fetchedAt: { type: Date, default: Date.now },     // Timestamp for when data was fetched
}, {
    collection: 'restaurants',
    db: 'eco-options-data'
});

export default mongoose.model('Restaurant', RestaurantSchema);
