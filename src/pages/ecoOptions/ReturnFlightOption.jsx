import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plane, Clock, MapPin, Leaf, Heart } from 'lucide-react';
import { userAPI } from "../../services/api.js";

const ReturnFlightOption = ({ returnFlight, userId, bookingToken, onSelectReturn, flights, layovers, total_duration, carbon_emissions, price, type, airline_logo }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    console.log("returnFlight", returnFlight);

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return new Date(timeString).toLocaleTimeString('en-MY', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDuration = (duration) => {
        if (!duration) return '';
        if (typeof duration === 'number') {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return `${hours}h ${minutes}m`;
        }
        return duration;
    };

    // Helper functions to get flight data with fallbacks
    const getDepartureTime = () => {
        return flights?.[0]?.departure_airport?.time ||
            flights?.[0]?.departureTime ||
            returnFlight?.departureTime ||
            '';
    };

    const getArrivalTime = () => {
        const lastFlight = flights?.[flights.length - 1];
        return lastFlight?.arrival_airport?.time ||
            lastFlight?.arrivalTime ||
            returnFlight?.arrivalTime ||
            '';
    };

    const getDepartureAirport = () => {
        return flights?.[0]?.departure_airport?.id ||
            flights?.[0]?.from ||
            returnFlight?.departureAirport ||
            '';
    };

    const getArrivalAirport = () => {
        const lastFlight = flights?.[flights.length - 1];
        return lastFlight?.arrival_airport?.id ||
            lastFlight?.to ||
            returnFlight?.arrivalAirport ||
            '';
    };

    const getAirlineName = () => {
        return flights?.[0]?.airline ||
            returnFlight?.airline ||
            'Unknown Airline';
    };

    const getFlightNumber = () => {
        return flights?.[0]?.flight_number ||
            flights?.[0]?.flightNumber ||
            returnFlight?.flightNumber ||
            '';
    };

    const getTravelClass = () => {
        return flights?.[0]?.travel_class ||
            flights?.[0]?.travelClass ||
            returnFlight?.travelClass ||
            '';
    };

    const getAircraft = () => {
        return flights?.[0]?.airplane ||
            flights?.[0]?.aircraft ||
            returnFlight?.aircraft ||
            'N/A';
    };

    const handleViewDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleToggleFavorite = async () => {
        try {
            await userAPI.toggleFavourite(userId, bookingToken, 'transportation');
            setIsFavorited(!isFavorited);
        } catch (err) {
            console.error("Failed to toggle return flight favourite", err);
        }
    };

    // Check if this flight is favorited on component mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const favouritesRes = await userAPI.getFavourites(userId);
                const transportationFavourites = favouritesRes.data.transportation || [];
                setIsFavorited(transportationFavourites.includes(bookingToken));
            } catch (err) {
                console.error("Failed to fetch favorite status", err);
            }
        };

        if (userId && bookingToken) {
            checkFavoriteStatus();
        }
    }, [userId, bookingToken]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            {/* Flight Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {airline_logo && (
                        <img
                            src={airline_logo}
                            alt={getAirlineName()}
                            className="w-8 h-8 object-contain"
                        />
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-900">{getAirlineName()}</h4>
                        {getFlightNumber() && (
                            <p className="text-xs text-gray-600">{getFlightNumber()}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Flight Route */}
            <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                        {formatTime(getDepartureTime())}
                    </p>
                    <p className="text-xs text-gray-600">{getDepartureAirport()}</p>
                </div>

                <div className="flex flex-col items-center px-4 flex-1">
                    <div className="flex items-center space-x-2 w-full">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-blue-300"></div>
                        <Plane className="w-4 h-4 text-blue-400 transform rotate-90" />
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-blue-400"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                            {formatDuration(total_duration)}
                        </span>
                        <span className="text-xs text-gray-500">
                            {layovers && layovers.length === 0 ? 'Non-stop' : `${layovers ? layovers.length : returnFlight?.stops || 0} stop${layovers && layovers.length > 1 ? 's' : ''}`}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                        {formatTime(getArrivalTime())}
                    </p>
                    <p className="text-xs text-gray-600">{getArrivalAirport()}</p>
                </div>
            </div>

            {/* Flight Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                    {getTravelClass() && (
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-600 capitalize">{getTravelClass()}</span>
                        </div>
                    )}
                    {(carbon_emissions || returnFlight?.emissions) && (
                        <div className="flex items-center space-x-1 text-green-600">
                            <Leaf className="w-3 h-3" />
                            <span className="text-xs font-medium">
                                {(carbon_emissions?.difference_percent || returnFlight?.emissions?.difference_percent)}% CO₂
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                    {(price || returnFlight?.price) && (
                        <p className="text-xl font-bold text-blue-600">
                            {String(price || returnFlight?.price).startsWith('RM')
                                ? price || returnFlight?.price
                                : `RM ${price || returnFlight?.price}`}
                        </p>
                    )}
                    <p className="text-xs text-gray-500">per person</p>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleViewDetails}
                        className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                    >
                        <span>Details</span>
                        {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                        onClick={handleToggleFavorite}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                            isFavorited
                                ? 'bg-red-50 text-red-600 border border-red-600 hover:bg-red-100'
                                : 'bg-pink-50 text-pink-600 border border-pink-600 hover:bg-pink-100'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}/>
                        <span>{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                    </button>

                </div>
            </div>

            {/* Details Section */}
            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">{formatDuration(total_duration)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Aircraft:</span>
                                <span className="font-medium">{getAircraft()}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Class:</span>
                                <span className="font-medium capitalize">{getTravelClass() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Stops:</span>
                                <span className="font-medium">
                                    {layovers && layovers.length === 0 ? 'Non-stop' : `${layovers ? layovers.length : returnFlight?.stops || 0} stop${(layovers ? layovers.length : returnFlight?.stops || 0) > 1 ? 's' : ''}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {flights && flights.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Flight Segments</h5>
                            <div className="space-y-1">
                                {flights.map((flight, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span className="text-gray-600">
                                            {flight?.departure_airport?.id || flight?.from} → {flight?.arrival_airport?.id || flight?.to}
                                        </span>
                                        <span className="text-gray-500">
                                            ({flight?.flight_number || flight?.flightNumber})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show flightSegments fallback if flights is not available */}
                    {(!flights || flights.length === 0) && returnFlight?.flightSegments && returnFlight.flightSegments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Flight Segments</h5>
                            <div className="space-y-1">
                                {returnFlight.flightSegments.map((flight, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span className="text-gray-600">
                                            {flight.from} → {flight.to}
                                        </span>
                                        <span className="text-gray-500">
                                            ({flight.flightNumber})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {layovers && layovers.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Layovers</h5>
                            <div className="space-y-1">
                                {layovers.map((layover, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                        <span className="text-gray-600">
                                            {layover.name || layover.airportName} ({layover.id || layover.airportCode}) - {formatDuration(layover.duration)}
                                            {layover.overnight && <span className="text-orange-600 ml-1">(Overnight)</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show layoverSegments fallback if layovers is not available */}
                    {(!layovers || layovers.length === 0) && returnFlight?.layoverSegments && returnFlight.layoverSegments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Layovers</h5>
                            <div className="space-y-1">
                                {returnFlight.layoverSegments.map((layover, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                        <span className="text-gray-600">
                                            {layover.airportName} ({layover.airportCode}) - {formatDuration(layover.duration)}
                                            {layover.overnight && <span className="text-orange-600 ml-1">(Overnight)</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Optional: Emissions Information */}
                    {returnFlight.emissions && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Emissions</h5>
                            <div className="text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>This flight:</span>
                                    <span className="font-medium">{(returnFlight.emissions.this_flight / 1000).toFixed(0)} kg CO₂</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Typical for route:</span>
                                    <span className="font-medium">{(returnFlight.emissions.typical_for_this_route / 1000).toFixed(0)} kg CO₂</span>
                                </div>
                                {returnFlight.emissions.difference_percent !== 0 && (
                                    <div className="flex justify-between">
                                        <span>Difference:</span>
                                        <span className={`font-medium ${returnFlight.emissions.difference_percent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {returnFlight.emissions.difference_percent > 0 ? '+' : ''}{returnFlight.emissions.difference_percent}%
                            </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReturnFlightOption;