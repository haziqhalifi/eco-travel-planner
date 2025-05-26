import React, { useState } from 'react';
import { X, Clock, Plane, MapPin, AlertTriangle, Leaf } from 'lucide-react';

// Summary Flight Card component - shown in search results
export const FlightCard = ({
                               airline,
                               flightNumber,
                               departureAirport,
                               departureTime,
                               arrivalAirport,
                               arrivalTime,
                               total_duration,
                               stops,
                               stops_description,
                               travelClass,
                               price,
                               emissions,
                               logoUrl,
                               all_airlines = [],
                               onViewDetails,
                               // bookingToken
                           }) => {
    // Format duration from minutes to hours and minutes
    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-3 hover:shadow-xl transition-shadow">
            {/* Airline & Price */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logoUrl} alt={airline} className="h-8 w-8 object-contain" />
                    <div>
                        <h2 className="font-semibold text-lg">{airline}</h2>
                        <p className="text-gray-500 text-sm">{flightNumber}</p>
                    </div>
                </div>
                <div className="text-green-600 font-semibold text-lg">{price}</div>
            </div>

            {/* Route Info */}
            <div className="flex items-center justify-between text-sm text-gray-700 border-t pt-3">
                <div className="text-center">
                    <p className="font-semibold text-base">{departureTime}</p>
                    <p>{departureAirport}</p>
                </div>
                <div className="text-center flex-1 px-4">
                    <div className="relative">
                        <div className="border-t border-gray-300 absolute w-full top-3"></div>
                        <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">
                {formatDuration(total_duration)}
              </span>
                        </div>
                        <p className="text-gray-500 mt-1">
                            {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-base">{arrivalTime}</p>
                    <p>{arrivalAirport}</p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs text-gray-600 border-t pt-3">
                <span>Class: {travelClass}</span>
                {emissions && emissions.this_flight && (
                    <span className="flex items-center">
            <span className="text-green-600 mr-1">🌿</span>
                        {emissions.difference_percent < 0 ?
                            `${Math.abs(emissions.difference_percent)}% less emissions` :
                            `${emissions.difference_percent}% more emissions`}
          </span>
                )}
                <button
                    onClick={onViewDetails}
                    className="bg-blue text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};


// Detailed Flight Card Component - shown when a flight is selected
export const DetailedFlightCard = ({
                                       flight,
                                       flights = [],
                                       layovers = [],
                                       stops_description,
                                       total_duration,
                                       price,
                                       emissions,
                                       travelClass,
                                       extensions = [],
                                       type,
                                       booking_token,
                                       departure_token,
                                       onClose,
                                       flightSegments = [],
                                       layoverSegments = []
                                   }) => {
    // Format duration from minutes to hours and minutes
    const formatDuration = (mins) => {
        console.log("Meow1:", booking_token);
        console.log(departure_token);
        if (!mins) return '';
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}h ${minutes}m`;
    };

    // Format time from ISO string or time string
    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch {
            return timeString;
        }
    };

    // Format date from ISO string
    const formatDate = (timeString) => {
        if (!timeString) return '';
        try {
            const date = new Date(timeString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '';
        }
    };

    // Use flightSegments if provided, otherwise use flights prop, otherwise fall back to single flight
    let segments = [];
    if (flightSegments && flightSegments.length > 0) {
        segments = flightSegments;
    } else if (flights && flights.length > 0) {
        segments = flights;
    } else if (flight) {
        segments = [flight];
    }

    const layoverData = layoverSegments.length > 0 ? layoverSegments : layovers;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 p-6 z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Flight Details
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">{stops_description || 'Your complete flight itinerary'}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white/80 rounded-full transition-all duration-200 hover:shadow-md"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                    {/* Price and Summary Section */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 border-b">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-baseline gap-4 mb-4">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                                        {price}
                                    </span>
                                    <span className="text-lg text-gray-700 font-semibold bg-white px-3 py-1 rounded-full shadow-sm">
                                        {travelClass}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 text-gray-700">
                                    <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Total: {formatDuration(total_duration)}</span>
                                    </div>
                                    {/* Show stops info from flights data */}
                                    {segments.length > 0 && segments[0].stops !== undefined && (
                                        <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                            <MapPin className="h-5 w-5 text-orange-500" />
                                            <span className="font-medium">
                                                {segments[0].stops === 0 ? 'Non-stop' : `${segments[0].stops} stop${segments[0].stops > 1 ? 's' : ''}`}
                                            </span>
                                        </div>
                                    )}
                                    {layoverData && layoverData.length > 0 && (
                                        <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                            <MapPin className="h-5 w-5 text-orange-500" />
                                            <span className="font-medium">
                                                {layoverData.length} stop{layoverData.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                    {type && (
                                        <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg">
                                            <span className="font-medium capitalize">{type}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Emissions Info */}
                            {emissions && emissions.this_flight && (
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <Leaf className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Carbon Footprint</div>
                                            <div className="text-2xl font-bold text-green-600">{emissions.this_flight}g CO₂</div>
                                            {emissions.difference_percent !== undefined && (
                                                <div className={`text-sm font-medium ${
                                                    emissions.difference_percent < 0 ? 'text-green-600' : 'text-orange-600'
                                                }`}>
                                                    {emissions.difference_percent < 0 ?
                                                        `${Math.abs(emissions.difference_percent)}% less than average` :
                                                        `${emissions.difference_percent}% more than average`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* All Airlines Display */}
                        {segments.length > 0 && segments[0].all_airlines && segments[0].all_airlines.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/50">
                                <div className="text-sm font-medium text-gray-600 mb-3">Airlines on this journey</div>
                                <div className="flex flex-wrap gap-3">
                                    {segments[0].all_airlines.map((airline, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-lg shadow-sm">
                                            <span className="text-sm font-medium text-gray-700">{airline}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Global Extensions */}
                        {extensions && extensions.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/50">
                                <div className="text-sm font-medium text-gray-600 mb-3">Trip Features</div>
                                <div className="flex flex-wrap gap-2">
                                    {extensions.map((ext, i) => (
                                        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {ext}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Flight Segments */}
                    <div className="p-8">
                        <div className="space-y-8">
                            {segments.map((flightSegment, index) => {
                                const isLastFlight = index === segments.length - 1;
                                const hasLayover = !isLastFlight && layoverData && layoverData[index];

                                // Handle both data structures - flightSegments and flights prop
                                const departureAirport = flightSegment.departureAirport || flightSegment.departure_airport || {};
                                const arrivalAirport = flightSegment.arrivalAirport || flightSegment.arrival_airport || {};
                                const airline = flightSegment.airline;
                                const flightNumber = flightSegment.flightNumber || flightSegment.flight_number;
                                const logoUrl = flightSegment.logoUrl || flightSegment.airline_logo;
                                const departureTime = flightSegment.departureTime || departureAirport.time;
                                const arrivalTime = flightSegment.arrivalTime || arrivalAirport.time;

                                return (
                                    <div key={index} className="space-y-6">
                                        {/* Flight Segment Card */}
                                        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                            {/* Airline Header */}
                                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-b border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {logoUrl && (
                                                            <div className="bg-white p-2 rounded-xl shadow-sm">
                                                                <img
                                                                    src={logoUrl}
                                                                    alt={airline}
                                                                    className="h-10 w-10 object-contain"
                                                                    onError={(e) => {e.target.style.display = 'none'}}
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-xl font-bold text-gray-900">
                                                                {airline}
                                                            </div>
                                                            {flightNumber && (
                                                                <div className="text-gray-600 font-medium">
                                                                    Flight {flightNumber}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {flightSegment.plane_and_crew_by && (
                                                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                            Operated by {flightSegment.plane_and_crew_by}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Flight Timeline */}
                                            <div className="p-8">
                                                <div className="flex items-center justify-between mb-8">
                                                    {/* Departure */}
                                                    <div className="text-center flex-shrink-0">
                                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                                            {formatTime(departureTime)}
                                                        </div>
                                                        <div className="text-gray-600 mb-3">
                                                            {formatDate(departureTime)}
                                                        </div>
                                                        <div className="text-xl font-bold text-blue-600 mb-1">
                                                            {departureAirport.id || departureAirport.code}
                                                        </div>
                                                        <div className="text-sm text-gray-600 max-w-[140px] leading-tight">
                                                            {departureAirport.name}
                                                        </div>
                                                    </div>

                                                    {/* Flight Path */}
                                                    <div className="flex-1 flex flex-col items-center justify-center px-12">
                                                        <div className="text-gray-600 mb-3 font-medium">
                                                            {formatDuration(flightSegment.duration || flightSegment.total_duration)}
                                                        </div>
                                                        <div className="w-full flex items-center justify-center relative">
                                                            <div className="h-1 w-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 relative rounded-full">
                                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border-2 border-blue-200">
                                                                    <Plane className="h-5 w-5 text-blue-600 transform rotate-90" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {flightSegment.overnight && (
                                                            <div className="text-xs text-indigo-600 mt-3 bg-indigo-100 px-3 py-1 rounded-full font-semibold">
                                                                Overnight flight
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Arrival */}
                                                    <div className="text-center flex-shrink-0">
                                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                                            {formatTime(arrivalTime)}
                                                        </div>
                                                        <div className="text-gray-600 mb-3">
                                                            {formatDate(arrivalTime)}
                                                        </div>
                                                        <div className="text-xl font-bold text-blue-600 mb-1">
                                                            {arrivalAirport.id || arrivalAirport.code}
                                                        </div>
                                                        <div className="text-sm text-gray-600 max-w-[140px] leading-tight">
                                                            {arrivalAirport.name}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Flight Details Grid */}
                                                <div className="border-t border-gray-100 pt-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {flightSegment.airplane && (
                                                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                                                <Plane className="h-5 w-5 text-gray-500" />
                                                                <span className="text-gray-700 font-medium">{flightSegment.airplane}</span>
                                                            </div>
                                                        )}

                                                        {flightSegment.legroom && (
                                                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                                                <span className="text-gray-500 text-lg">💺</span>
                                                                <span className="text-gray-700 font-medium">{flightSegment.legroom}</span>
                                                            </div>
                                                        )}

                                                        {(flightSegment.travelClass || flightSegment.travel_class || travelClass) && (
                                                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                                                <span className="text-gray-500 text-lg">🎫</span>
                                                                <span className="text-gray-700 font-medium">
                                                                    {flightSegment.travelClass || flightSegment.travel_class || travelClass}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Show stops information */}
                                                        {flightSegment.stops !== undefined && (
                                                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                                                                <MapPin className="h-5 w-5 text-gray-500" />
                                                                <span className="text-gray-700 font-medium">
                                                                    {flightSegment.stops === 0 ? 'Non-stop' : `${flightSegment.stops} stop${flightSegment.stops > 1 ? 's' : ''}`}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Warning for delays */}
                                                    {flightSegment.often_delayed_by_over_30_min && (
                                                        <div className="mt-4 flex items-center gap-3 text-amber-800 bg-amber-50 p-4 rounded-xl border-l-4 border-amber-400">
                                                            <AlertTriangle className="h-5 w-5" />
                                                            <span className="font-medium">This flight is often delayed by over 30 minutes</span>
                                                        </div>
                                                    )}

                                                    {/* Individual flight extensions */}
                                                    {flightSegment.extensions && flightSegment.extensions.length > 0 && (
                                                        <div className="mt-4">
                                                            <div className="text-sm text-gray-500 mb-2 font-medium">Flight Features:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {flightSegment.extensions.map((ext, i) => (
                                                                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {ext}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Ticket sellers */}
                                                    {flightSegment.ticket_also_sold_by && flightSegment.ticket_also_sold_by.length > 0 && (
                                                        <div className="mt-4">
                                                            <div className="text-sm text-gray-500 mb-2 font-medium">Also available on:</div>
                                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                                {flightSegment.ticket_also_sold_by.join(', ')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Layover Information */}
                                        {hasLayover && (
                                            <div className="flex items-center justify-center py-6">
                                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 max-w-md shadow-lg">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 rounded-full">
                                                            <Clock className="h-6 w-6 text-orange-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-gray-900">
                                                                {formatDuration(layoverData[index].duration)} layover
                                                            </div>
                                                            <div className="text-gray-600 font-medium">
                                                                {layoverData[index].name} ({layoverData[index].id})
                                                            </div>
                                                            {layoverData[index].overnight && (
                                                                <div className="text-sm text-orange-700 font-semibold mt-2 bg-orange-100 px-3 py-1 rounded-full inline-block">
                                                                    Overnight layover
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Booking Actions */}
                    {(booking_token || departure_token) && (
                        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-8">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {booking_token && (
                                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                        Book This Flight
                                    </button>
                                )}
                                {departure_token && type === 'Round trip' && (
                                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                                        Select Return Flight
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};