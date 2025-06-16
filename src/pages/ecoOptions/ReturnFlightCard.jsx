import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plane, Clock, MapPin, Leaf, ArrowRight, Heart } from 'lucide-react';
import { userAPI } from "../../services/api.js";
import ReturnFlightOption from '../ecoOptions/ReturnFlightOption.jsx';

const ReturnFlightCard = ({
    flight,
    flights,
    returnFlights = [],
    layovers = [],
    stops_description,
    total_duration,
    price,
    emissions,
    travelClass,
    extensions = [],
    type,
    departure_token,
    onClose,
    flightSegments = [],
    layoverSegments = [],
    userId,
    airline,
    flightNumber,
    departureAirport,
    departureTime,
    arrivalAirport,
    arrivalTime,
    stops,
    logoUrl,
    all_airlines = [],
    onViewDetails,
    onSelectFlight
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [showReturnFlights, setShowReturnFlights] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);

    console.log("fligthts: ", flight)
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

    const handleViewDetails = () => {
        setShowDetails(!showDetails);
        if (onViewDetails) {
            onViewDetails({
                flight, returnFlights, layovers, stops_description, total_duration,
                price, emissions, travelClass, extensions, type, departure_token,
                flightSegments, layoverSegments, userId, airline, flightNumber,
                departureAirport, departureTime, arrivalAirport, arrivalTime,
                stops, logoUrl, all_airlines
            });
        }
    };

    const handleSelectDeparture = () => {
        setSelectedDeparture(flight);
        if (returnFlights && returnFlights.length > 0) {
            setShowReturnFlights(true);
        } else {
            // No return flights, complete selection
            if (onSelectFlight) {
                onSelectFlight({ departure: flight, return: null });
            }
        }
    };

    const handleSelectReturn = (returnFlight) => {
        setSelectedReturn(returnFlight);
        if (onSelectFlight) {
            onSelectFlight({ departure: selectedDeparture, return: returnFlight });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 hover:shadow-xl transition-all duration-300">
            {/* Main Flight Card */}
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                alt={airline}
                                className="w-10 h-10 object-contain"
                            />
                        )}
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{airline}</h3>
                            {flightNumber && (
                                <p className="text-sm text-gray-600">{flightNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {type || 'One way'}
                        </span>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Flight Route */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-8 flex-1">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {formatTime(departureTime)}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{departureAirport}</p>
                        </div>

                        <div className="flex flex-col items-center px-6 flex-1">
                            <div className="flex items-center space-x-2 w-full">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-blue-300"></div>
                                <Plane className="w-5 h-5 text-blue-500 transform rotate-90" />
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-blue-500"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    {formatDuration(total_duration)}
                                </span>
                                {stops !== undefined && (
                                    <span className="text-sm text-gray-500">
                                        {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                                {formatTime(arrivalTime)}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{arrivalAirport}</p>
                        </div>
                    </div>
                </div>

                {/* Flight Info */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        {travelClass && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-sm text-gray-600 capitalize font-medium">{travelClass}</span>
                            </div>
                        )}
                        {stops_description && (
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}</span>
                            </div>
                        )}
                        {emissions && (
                            <div className="flex items-center space-x-2 text-green-600">
                                <Leaf className="w-4 h-4" />
                                <span className="text-sm font-medium">{emissions.difference_percent}% CO₂</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-left">
                        {price && (
                            <p className="text-3xl font-bold text-blue-600">{price}</p>
                        )}
                        <p className="text-sm text-gray-500">per person</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleViewDetails}
                            className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                        >
                            <span>View Details</span>
                            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={handleSelectDeparture}
                            className="px-6 py-2 bg-dark-green text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Select Flight
                        </button>
                    </div>
                </div>
            </div>

            {/*/!* Details Section *!/*/}
            {/*{showDetails && (*/}
            {/*    <div className="bg-gray-50 p-6 border-t border-gray-100">*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
            {/*            <div>*/}
            {/*                <h4 className="font-semibold text-gray-900 mb-3">Flight Details</h4>*/}
            {/*                <div className="space-y-2 text-sm">*/}
            {/*                    <div className="flex justify-between">*/}
            {/*                        <span className="text-gray-600">Duration:</span>*/}
            {/*                        <span className="font-medium">{formatDuration(total_duration)}</span>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex justify-between">*/}
            {/*                        <span className="text-gray-600">Aircraft:</span>*/}
            {/*                        <span className="font-medium">{airline}</span>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex justify-between">*/}
            {/*                        <span className="text-gray-600">Class:</span>*/}
            {/*                        <span className="font-medium capitalize">{travelClass}</span>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            {flightSegments.length > 0 && (*/}
            {/*                <div>*/}
            {/*                    <h4 className="font-semibold text-gray-900 mb-3">Flight Segments</h4>*/}
            {/*                    <div className="space-y-2 text-sm">*/}
            {/*                        {flightSegments.slice(0, 3).map((segment, index) => (*/}
            {/*                            <div key={index} className="flex items-center space-x-2">*/}
            {/*                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>*/}
            {/*                                <span className="text-gray-600">{segment.from} → {segment.to}</span>*/}
            {/*                            </div>*/}
            {/*                        ))}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </div>*/}

            {/*        {extensions.length > 0 && (*/}
            {/*            <div className="mt-4 pt-4 border-t border-gray-200">*/}
            {/*                <div className="flex flex-wrap gap-2">*/}
            {/*                    {extensions.map((extension, index) => (*/}
            {/*                        <span*/}
            {/*                            key={index}*/}
            {/*                            className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border border-gray-200"*/}
            {/*                        >*/}
            {/*                            {extension}*/}
            {/*                        </span>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Details Section for Return Flight Card */}
            {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">{formatDuration(flight.total_duration)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Aircraft:</span>
                                <span className="font-medium">{flight.flightSegments && flight.flightSegments[0] ? flight.flightSegments[0].aircraft || 'N/A' : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Class:</span>
                                <span className="font-medium capitalize">{flight.travelClass || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Stops:</span>
                                <span className="font-medium">
                                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {flight.flightSegments && flight.flightSegments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Flight Segments</h5>
                            <div className="space-y-1">
                                {flight.flightSegments.map((segment, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span className="text-blue-600">
                                            {segment.from} → {segment.to}
                                        </span>
                                        <span className="text-gray-500">
                                            ({segment.flightNumber})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {flight.layoverSegments && flight.layoverSegments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Layovers</h5>
                            <div className="space-y-1">
                                {flight.layoverSegments.map((layover, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                        <span className="text-orange-600">
                                            {layover.airportName} ({layover.airportCode}) - {formatDuration(layover.duration)}
                                            {layover.overnight && <span className="text-orange-600 ml-1">(Overnight)</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Return Flights Section - Simplified */}
            {showReturnFlights && (
                <div className="bg-blue-50 p-6 border-t border-blue-100">
                    <div className="flex items-center space-x-2 mb-4">
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">Select Return Flight</h3>
                    </div>

                    {/*<div className="space-y-3">*/}
                    {/*    {returnFlights.map((returnFlight, index) => (*/}
                    {/*        console.log(returnFlight)*/}
                    {/*        <ReturnFlightOption*/}
                    {/*            key={index}*/}
                    {/*            returnFlight={returnFlight}*/}
                    {/*            userId={userId}*/}
                    {/*            bookingToken={returnFlight.bookingToken}*/}
                    {/*            onSelectReturn={handleSelectReturn}*/}
                    {/*            flights={returnFlight.flights}*/}
                    {/*            layovers={returnFlight.layovers}*/}
                    {/*            total_duration={returnFlight.total_duration}*/}
                    {/*            carbon_emission={returnFlight.carbon_emission}*/}
                    {/*            price={returnFlight.price}*/}
                    {/*            type={returnFlight.type}*/}
                    {/*            airline_logo={returnFlight.airline_logo}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                    <div className="space-y-3">
                        {returnFlights.map((returnFlight, index) => {
                            console.log("returnFlight", returnFlight);
                            return (
                                // <ReturnFlightOption
                                //     key={index}
                                //     returnFlight={returnFlight}
                                //     userId={userId}
                                //     bookingToken={returnFlight.bookingToken}
                                //     onSelectReturn={handleSelectReturn}
                                //     flights={returnFlight.flightSegments}
                                //     layovers={returnFlight.layoverSegments}
                                //     total_duration={returnFlight.total_duration}
                                //     carbon_emission={returnFlight.emissions}
                                //     price={returnFlight.price}
                                //     type={returnFlight.type}
                                //     airline_logo={returnFlight.logoUrl}
                                // />

                                <ReturnFlightOption
                                    key={index}
                                    returnFlight={returnFlight}
                                    userId={userId}
                                    bookingToken={returnFlight.booking_token}
                                    onSelectReturn={handleSelectReturn}
                                    flights={returnFlight.flights}
                                    layovers={returnFlight.layovers}
                                    total_duration={returnFlight.total_duration}
                                    carbon_emission={returnFlight.carbon_emissions}
                                    price={returnFlight.price}
                                    type={returnFlight.type}
                                    airline_logo={returnFlight.airline_log}
                                />
                            );
                        })}
                    </div>

                </div>
            )}

            {/* Selected Flights Summary */}
            {selectedDeparture && selectedReturn && (
                <div className="bg-green-50 p-6 border-t border-green-100">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-green-800">Flight Selection Complete</h3>
                    </div>
                    <p className="text-green-700">
                        Departure: {formatTime(selectedDeparture.departureTime)} - {formatTime(selectedDeparture.arrivalTime)} |
                        Return: {formatTime(selectedReturn.departureTime)} - {formatTime(selectedReturn.arrivalTime)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReturnFlightCard;