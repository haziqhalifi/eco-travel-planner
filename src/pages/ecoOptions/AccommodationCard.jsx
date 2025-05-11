import { useState } from "react";

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }
    if (hasHalfStar) {
        stars.push(<span key="half" className="text-yellow-500">⯪</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
};

const AccommodationCard = ({ type, title, rating, location, description, image }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showTripPopup, setShowTripPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const trips = [
        "North America Trip",
        "South East Asia Trip",
        "Japan Trip",
        "Australia Trip",
        "Europe Adventure",
        "South America Expedition"
    ];

    // Filter trips based on search term
    const filteredTrips = trips.filter(trip =>
        trip.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <div className="relative h-48">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {type}
                </div>

                {/* Plus Icon */}
                <button
                    onClick={() => setShowTripPopup(true)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Add to trip"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="flex justify-content-center items-center text-sm text-yellow-500 mb-2">
                    {renderStars(rating)}
                    <span className="text-gray-800 ml-1">{rating}</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{location}</div>
                <p className="text-gray-600 text-sm mb-8">{description}</p>

                {/* Heart Icon for Favorites */}
                <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="absolute bottom-3 right-3 text-red-500 text-xl bg-transparent border-none focus:outline-none"
                    aria-label="Add to favorites"
                >
                    {isFavorited ? "❤️" : "🤍"}
                </button>
            </div>

            {/* Trip Selection Popup */}
            {showTripPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Select a Trip</h3>
                            <button
                                onClick={() => setShowTripPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search trips..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Trips List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredTrips.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {filteredTrips.map((trip, index) => (
                                        <li key={index} className="py-2">
                                            <button
                                                className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                                                onClick={() => {
                                                    alert(`Added to ${trip}`);
                                                    setShowTripPopup(false);
                                                }}
                                            >
                                                <span className="mr-2">📋</span>
                                                {trip}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-2">No trips found</p>
                            )}
                        </div>

                        <button
                            className="mt-4 w-full bg-dark-green text-white py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                alert("Create a new trip");
                                setShowTripPopup(false);
                            }}
                        >
                            Create New Trip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccommodationCard;