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
            currency: 'USD',
            eco_certified: true,
        }),
        mapResults: (data) => (data.properties || []).map((h, i) => ({
            id: `hotel-${i}`,
            type: 'Accommodation',
            name: h.name,
            location: h.address,
            rating: h.rating,
            description: h.description || 'Eco-friendly stay',
            image: h.thumbnail,
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
            currency: 'USD',
            emissions: 1
        }),
        mapResults: (data) => {
            const flights = [];

            ['best_flights','other_flights'].forEach((key) => {
                const list = data[key];
                if (!Array.isArray(list)) return;

                list.forEach((group, groupIdx) => {
                    // group.flights is an array of one or more legs
                    if (!Array.isArray(group.flights)) return;

                    group.flights.forEach((leg, legIdx) => {
                        flights.push({
                            id: `flight-${key}-${groupIdx}-${legIdx}`,
                            airline:        leg.airline || 'N/A',
                            flightNumber:   leg.flightNumber || 'N/A',
                            departureAirport: leg.departureAirport.id || 'N/A',
                            departureTime:    leg.departureAirport.time || 'N/A',
                            arrivalAirport:   leg.arrivalAirport.id || 'N/A',
                            arrivalTime:      leg.arrivalAirport.time || 'N/A',
                            duration:         group.duration || 'N/A',       // total minutes
                            stops:            (Array.isArray(group.stops)
                                ? group.stops.length
                                : 0),
                            price:            group.price || 'N/A',
                            emissions:        group.emissions || 'N/A',
                            logoUrl:          leg.logoUrl || group.airline_logo || '',
                            travelClass:      leg.travelClass || 'Economy',
                        });
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
            reviews:      a.reviews,      // number of reviews
            priceLevel:   a.price,        // $, $$, etc.
            description:  a.description,
            image:        a.thumbnail,
            placeId:      a.place_id,
            hours:        a.hours,
            gps:          a.gps,
            links:        a.links,
        })),
    },
};