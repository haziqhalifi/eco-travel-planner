import React, { useState } from 'react';

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
                                       flights = [],
                                       layovers = [],
                                       total_duration,
                                       price,
                                       emissions,
                                       travelClass,
                                       extensions = [],
                                       onClose,
                                        flightSegments,
                                        layoverSegments
                                   }) => {
    // Format duration from minutes to hours and minutes
    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours}h ${minutes}m`;
    };

    // Format date for display
    const formatDate = (timeString) => {
        // This is a placeholder - in a real app you'd parse the actual date
        return new Date(timeString).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Flight Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Price and Class Info */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-2xl font-bold text-green-600">{price}</span>
                            <span className="text-gray-500 ml-2">{travelClass}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {emissions && emissions.this_flight && (
                                <div className="flex items-center bg-green-50 p-2 rounded-lg">
                                    <span className="text-green-600 mr-1">🌿</span>
                                    <div>
                                        <div className="text-xs">Carbon emissions</div>
                                        <div className="text-sm font-medium">{emissions.this_flight}g</div>
                                        <div className="text-xs text-gray-500">
                                            {emissions.difference_percent < 0 ?
                                                `${Math.abs(emissions.difference_percent)}% less than average` :
                                                `${emissions.difference_percent}% more than average`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Duration */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">Total duration</div>
                            <div className="font-semibold">{formatDuration(total_duration)}</div>
                        </div>
                    </div>

                    {/* Flight Segments */}
                    <div className="space-y-6">
                        {flights.map((flight, index) => {
                            const isLastFlight = index === flights.length - 1;
                            const hasLayover = !isLastFlight && layovers && layovers[index];

                            return (
                                <div key={index} className="space-y-4">
                                    {/* Flight Segment */}
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 p-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <img src={flight.airline_logo} alt={flight.airline} className="h-8 w-8 object-contain" />
                                                <div>
                                                    <div className="font-semibold">{flight.airline}</div>
                                                    <div className="text-sm text-gray-500">Flight {flight.flight_number}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {flight.plane_and_crew_by && (
                                                    <div>Operated by {flight.plane_and_crew_by}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-4">
                                            {/* Flight Times */}
                                            <div className="flex justify-between">
                                                <div className="text-center">
                                                    <div className="text-xl font-bold">{flight.departure_airport.time}</div>
                                                    <div className="text-sm">{formatDate(flight.departure_airport.time)}</div>
                                                    <div className="font-medium">{flight.departure_airport.id}</div>
                                                    <div className="text-sm text-gray-500">{flight.departure_airport.name}</div>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center justify-center px-4">
                                                    <div className="text-sm text-gray-500">{formatDuration(flight.duration)}</div>
                                                    <div className="w-full flex items-center justify-center">
                                                        <div className="h-0.5 w-full bg-gray-300 relative">
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {flight.overnight && (
                                                        <div className="text-xs text-gray-500 mt-1">Overnight flight</div>
                                                    )}
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-xl font-bold">{flight.arrival_airport.time}</div>
                                                    <div className="text-sm">{formatDate(flight.arrival_airport.time)}</div>
                                                    <div className="font-medium">{flight.arrival_airport.id}</div>
                                                    <div className="text-sm text-gray-500">{flight.arrival_airport.name}</div>
                                                </div>
                                            </div>

                                            {/* Flight Details */}
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {flight.airplane && (
                                                    <div className="flex items-center space-x-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>{flight.airplane}</span>
                                                    </div>
                                                )}

                                                {flight.legroom && (
                                                    <div className="flex items-center space-x-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Legroom: {flight.legroom}</span>
                                                    </div>
                                                )}

                                                {flight.travel_class && (
                                                    <div className="flex items-center space-x-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>{flight.travel_class}</span>
                                                    </div>
                                                )}

                                                {flight.often_delayed_by_over_30_min && (
                                                    <div className="flex items-center space-x-1 text-amber-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <span>Often delayed by over 30 min</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Extensions */}
                                            {flight.extensions && flight.extensions.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {flight.extensions.map((extension, i) => (
                                                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                              {extension}
                            </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Layover Info */}
                                    {hasLayover && (
                                        <div className="pl-8 border-l-2 border-dashed border-gray-300 ml-4 py-2">
                                            <div className="bg-orange-50 p-3 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatDuration(layovers[index].duration)} layover in {layovers[index].name} ({layovers[index].id})
                                                        </div>
                                                        {layovers[index].overnight && (
                                                            <div className="text-xs text-gray-500">Overnight layover</div>
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

                    {/* Extensions */}
                    {extensions && extensions.length > 0 && (
                        <div className="border-t pt-4">
                            <div className="text-sm font-medium mb-2">Features</div>
                            <div className="flex flex-wrap gap-2">
                                {extensions.map((extension, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {extension}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};