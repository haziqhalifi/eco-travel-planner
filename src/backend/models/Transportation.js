import mongoose from 'mongoose';

// Define the schema for Transportation
const TransportationSchema = new mongoose.Schema({
    queryParams: {
        departure_id: { type: String, required: true },      // e.g., airport code or city code
        arrival_id: { type: String, required: true },
        outbound_date: { type: String, required: true },     // format: YYYY-MM-DD
        return_date: { type: String, required: true },       // format: YYYY-MM-DD
    },

    // id: { type: String, required: true },                // unique flight identifier
    // airline: { type: String, required: true },
    // flightNumber: { type: String, required: true },
    // departureAirport: { type: String, required: true },  // airport code
    // departureTime: { type: String, required: true },     // time string
    // arrivalAirport: { type: String, required: true },    // airport code
    // arrivalTime: { type: String, required: true },       // time string
    // duration: { type: Number, required: true },          // in minutes
    // stops: { type: Number, required: true },
    // price: { type: String, required: true },             // string to allow formatting like "$123"
    // emissions: { type: String, required: true },         // or Number, depending on source
    // logoUrl: { type: String, required: false },
    // travelClass: { type: String, default: 'Economy' },   // Economy, Business, etc.

    // queryParams: mongoose.Schema.Types.Mixed,
    serpData: mongoose.Schema.Types.Mixed,
    fetchedAt: { type: Date, default: Date.now },        // when the data was fetched
}, {
    collection: 'transportations',
    db: 'eco-options-data'
});

export default mongoose.model('Transportation', TransportationSchema);
