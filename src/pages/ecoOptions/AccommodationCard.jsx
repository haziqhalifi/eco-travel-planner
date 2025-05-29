import {useEffect, useState} from "react";
import {ecoOptionsAPI, userAPI} from "/src/services/api.js"
import {personalTripsAPI} from "/src/services/api.js";
// import {findDocumentByPropertyToken} from "../../../backend/utils/findDocumentByPropertyToken.js";

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span id={`full-${i}`} className="text-yellow-500">★</span>);
    }
    if (hasHalfStar) {
        stars.push(<span id="half" className="text-yellow-500">⯪</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span id={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
};

const AccommodationCard = ({ userId, itemId, type, title, rating, location, description, image, serpData }) => {
    const [showTripPopup, setShowTripPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [trips, setTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [favourites, setFavourites] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        async function fetchTrips() {
            try {
                const response = await personalTripsAPI.getPersonalTrips();
                if (response.success) {
                    setTrips(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch trips:", err);
            } finally {
                setLoadingTrips(false);
            }
        }
        fetchTrips();
    }, []);

    // Filter trips based on search term
    const filteredTrips = trips.filter(trip =>
        trip.title && trip.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // useEffect(() => {
    //     if (!userId) return; // avoid running if userId is missing
    //
    //     const fetchFavourites = async () => {
    //         try {
    //             const response = await userAPI.getFavourites(userId);
    //             console.log(response.data.accommodations);
    //             setFavourites(response.data.accommodations);
    //         } catch (error) {
    //             console.error("Failed to fetch favourites:", error);
    //         }
    //     };
    //
    //     fetchFavourites();
    // }, [userId]);
    //
    // useEffect(() => {
    //     setIsFavorited(favourites.some(fav => fav.id === itemId));
    // }, [favourites, itemId]);

    useEffect(() => {
        const fetchAndDetermineFavouriteStatus = async () => {
            setIsFavorited(false); // Default to not favorited

            try {
                const favouritesRes = await userAPI.getFavourites(userId);
                const favouritesList = favouritesRes.data.accommodations || [];
                setFavourites(favouritesList);

                if (typeof itemId === 'string' && favouritesList.includes(itemId)) {
                    setIsFavorited(true);
                    console.log(`Match found for current item! Property token: ${itemId} is in favourites.`);
                }

            } catch (error) {
                console.error("Failed to fetch favourites or determine status:", error);
                setIsFavorited(false);
            }
        };

        if (userId && itemId) { // Only run if we have the necessary IDs
            fetchAndDetermineFavouriteStatus();
        }
    }, [itemId, type, userId, setIsFavorited, setFavourites]);

    const handleToggleFavourite = async () => {
        try {
            // const doc = await ecoOptionsAPI.findDocumentByPropertyToken(itemId, type);
            // const docId = doc.data;
            await userAPI.toggleFavourite(userId, itemId, type);
            setIsFavorited(prev => !prev);
        } catch (err) {
            console.error("Failed to toggle favourite", err);
        }
    };

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
                    onClick={handleToggleFavourite}
                    className={`absolute bottom-3 right-3 text-xl bg-transparent border-none focus:outline-none ${
                        isFavorited ? "text-red-500" : "text-gray-400"
                    }`}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
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

                        {loadingTrips ? (
                            <p>Loading trips...</p>
                        ) : filteredTrips.length > 0 ? (
                            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                                {filteredTrips.map((trip) => (
                                    <li id={trip._id} className="py-2">
                                        <button
                                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center"
                                            onClick={async () => {
                                                try {
                                                    const meow = await personalTripsAPI.getPersonalTripById(trip._id);
                                                    console.log("Get trip: ", meow);
                                                    await personalTripsAPI.addPlaceToTrip(trip._id, serpData, "accommodation");
                                                    alert(`Added to ${trip.title}`);
                                                    setShowTripPopup(false);
                                                } catch (err) {
                                                    alert("Failed to add accommodation to trip");
                                                    console.error(err);
                                                }
                                            }}
                                        >
                                            <span className="mr-2">📋</span>
                                            {trip.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-2">No trips found</p>
                        )}


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