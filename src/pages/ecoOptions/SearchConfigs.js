export const searchConfigs = {
    accommodation: {
        endpoint: '/api/serp/search',
        method: 'get',
        buildParams: ({ searchTerm, checkInDate, checkOutDate, adults }) => ({
            engine: 'google_hotels',
            q: searchTerm || 'eco hotels',
            check_in_date: checkInDate.toISOString().slice(0, 10),
            check_out_date: checkOutDate.toISOString().slice(0, 10),
            adults,
            currency: 'MYR',
            eco_certified: true,
        }),
        mapResults: (data) => (data.properties || []).map((h, i) => ({
            id: `hotel-${i}`,
            type: 'Accommodation',
            name: h.name,
            location: h.gps_coordinates
                ? `${h.gps_coordinates.latitude}, ${h.gps_coordinates.longitude}`
                : 'Location not available',
            rating: h.overall_rating,
            description: h.description || 'Eco-friendly stay',
            image: Array.isArray(h.images) && h.images.length > 0
                ? `https://images.weserv.nl/?url=${encodeURIComponent(h.images[0].thumbnail.replace(/^https?:\/\//, ''))}`
                : 'https://via.placeholder.com/150'
            // image: Array.isArray(h.images) && h.images.length > 0
            //     ? `http://localhost:5173/proxy-image?url=${encodeURIComponent(h.images[0].thumbnail)}`
            //     : 'https://via.placeholder.com/150'

        })),
    },
    transportation: {
        endpoint: '/api/serp/search',
        method: 'get',
        buildParams: ({ origin, destination, departureDate, returnDate }) => ({
            engine: 'google_flights',
            departure_id: origin,
            arrival_id: destination,
            outbound_date: departureDate.toISOString().slice(0, 10),
            return_date: returnDate.toISOString().slice(0, 10),
            currency: 'MYR',
            emissions: 1
        }),
        mapResults: (data) => {
            const flights = [];

            ['best_flights', 'other_flights'].forEach((key) => {
                const list = data[key];
                if (!Array.isArray(list)) return;

                list.forEach((group, groupIdx) => {
                    const legs = group.flights;
                    if (!Array.isArray(legs) || legs.length === 0) return;

                    // Use the first leg for base info
                    const firstLeg = legs[0];
                    const lastLeg = legs[legs.length - 1];

                    const allAirlines = legs.map(leg => ({
                        name: leg.airline,
                        logo: leg.logoUrl || group.airline_logo || ''
                    }));

                    const emissions = group.carbon_emissions || {
                        this_flight: 'N/A',
                        difference_percent: 'N/A'
                    };

                    const flightSegments = legs.map((leg, idx) => ({
                        segmentNumber: idx + 1,
                        airline: leg.airline || 'N/A',
                        flightNumber: leg.flight_number || 'N/A',
                        from: leg.departure_airport?.id || 'N/A',
                        to: leg.arrival_airport?.id || 'N/A',
                        departureTime: leg.departure_airport?.time || 'N/A',
                        arrivalTime: leg.arrival_airport?.time || 'N/A',
                        duration: leg.duration || 0,
                        travelClass: leg.travel_class || 'Economy'
                    }));

                    // Each layover segment (if available)
                    const layoverSegments = Array.isArray(group.layovers) ? group.layovers.map((layover, idx) => ({
                        layoverNumber: idx + 1,
                        airportName: layover.name || 'N/A',
                        airportCode: layover.id || 'N/A',
                        duration: layover.duration || 0,
                        overnight: layover.overnight || false
                    })) : [];

                    flights.push({
                        id: `flight-${key}-${groupIdx}`,
                        airline: firstLeg.airline || 'N/A',
                        flightNumber: firstLeg.flight_number || 'N/A',
                        departureAirport: firstLeg.departure_airport?.id || 'N/A',
                        departureTime: firstLeg.departure_airport?.time || 'N/A',
                        arrivalAirport: lastLeg.arrival_airport?.id || 'N/A',
                        arrivalTime: lastLeg.arrival_airport?.time || 'N/A',
                        total_duration: group.total_duration,
                        stops: legs.length - 1,
                        all_airlines: allAirlines,
                        price: group.price ? `RM ${group.price}` : 'N/A',
                        emissions,
                        logoUrl: firstLeg.logoUrl || group.airline_logo || '',
                        travelClass: firstLeg.travel_class || 'Economy',
                        bookingToken: group.booking_token || 'N/A',
                        flightSegments,
                        layoverSegments
                    });
                });
            });

            return flights;
        }



    },

    restaurant: {
        endpoint: '/api/serp/search',
        method: 'get',
        buildParams: ({ searchTerm, placeId, data }) => ({
            engine: 'google_local',
            type: 'Restaurants',
            q: searchTerm + ' restaurants',
            ...(placeId ? { place_id: placeId } : { data }),
            hl: 'en',
            gl: 'us',
            // either search by place_id (detail lookup)…
            ...(placeId
                ? { place_id: placeId }
                // …or by a free-text query string:
                : { q: searchTerm + ' restaurants' || 'restaurants near me' }),
        }),
        mapResults: (data) => {
            if (!Array.isArray(data.local_results)) {
                console.warn('No local_results in API response', data);
                return [];
            }

            return data.local_results.map((r, i) => ({
                id:           `restaurant-${i}`,
                type:         'Restaurant',
                name:         r.title,
                location:     r.address,
                rating:       r.rating,
                reviews:      r.reviews,      // number of reviews
                priceLevel:   r.price,        // $, $$, etc.
                description:  r.description,
                image:        r.thumbnail,
                placeId:      r.place_id,
                hours:        r.hours,
                gps:          r.gps,
                links:        r.links,
                service_options: r.service_options || {
                    dine_in: false,
                    takeout: false,
                    delivery: false
                }
            }));
        },
    },


    activity: {
        endpoint: '/api/serp/search',
        method: 'get',
        buildParams: ({ placeId, data, searchTerm }) => ({
            engine: 'google_local',
            type: 'Activities',
            q: searchTerm + ' Activities',
            ...(placeId ? { place_id: placeId } : { data }),
            gl: 'us',
        }),
        mapResults: (data) => (data.local_results || []).map((a, i) => ({
            id:           `activity-${i}`,
            type:         'Activities',
            name:         a.title,
            location:     a.address,
            rating:       a.rating,
            reviews:      a.reviews,
            priceLevel:   a.price,
            description:  a.description,
            image:        a.thumbnail,
            placeId:      a.place_id,
            hours:        a.hours,
            gps:          a.gps,
            links:        a.links,
        })),
    },
};