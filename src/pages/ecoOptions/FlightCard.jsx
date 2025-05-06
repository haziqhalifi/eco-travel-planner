export const FlightCard = ({
                               airline,
                               flightNumber,
                               departureAirport,
                               departureTime,
                               arrivalAirport,
                               arrivalTime,
                               duration,
                               stops,
                               travelClass,
                               price,
                               emissions,
                               logoUrl,
                           }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-4">
            {/* Airline */}
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

            {/* Flight Route */}
            <div className="flex items-center justify-between text-sm text-gray-700 border-t pt-4">
                <div className="text-center">
                    <p className="font-semibold">{departureTime}</p>
                    <p>{departureAirport}</p>
                </div>
                <div className="text-center">
                    <p>{duration}</p>
                    <p className="text-gray-500">{stops}</p>
                </div>
                <div className="text-center">
                    <p className="font-semibold">{arrivalTime}</p>
                    <p>{arrivalAirport}</p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                <span>Class: {travelClass}</span>
                {emissions && <span>🌿 Emissions: {emissions}</span>}
            </div>
        </div>
    );
};
