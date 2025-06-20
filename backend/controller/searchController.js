import axios from 'axios';
import getModelForType from '../utils/getModelForType.js';
import findQueryParams from '../utils/findQueryParams.js';

export const handleSearch = async (req, res) => {
    const type = req.headers['type'];
    console.log('Received request:', req.query);

    try {
        const model = getModelForType(type);
        const existingResults = await findQueryParams(model, req.query);

        if (existingResults) {
            return res.json(existingResults);
        }

        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                ...req.query,
                api_key: process.env.VITE_SERPAPI_KEY,
            },
        });

        let responseData;
        let modifiedTransportationData = response.data;
        const { q, check_in_date, check_out_date, adults, departure_id, arrival_id, outbound_date, return_date, departure_token } = req.query;

        if (type === 'transportation' && modifiedTransportationData) {
            const dataCopy = JSON.parse(JSON.stringify(modifiedTransportationData));

            if (dataCopy.best_flights && Array.isArray(dataCopy.best_flights)) {
                dataCopy.best_flights = dataCopy.best_flights.map(flightOffer => ({
                    ...flightOffer,
                    return_flights: [] // Add the empty array
                }));
            }
            if (dataCopy.other_flights && Array.isArray(dataCopy.other_flights)) {
                dataCopy.other_flights = dataCopy.other_flights.map(flightOffer => ({
                    ...flightOffer,
                    return_flights: [] // Add the empty array
                }));
            }
            modifiedTransportationData = dataCopy; // Use the modified data for saving and returning
        }

        console.log("departure_token", departure_token);
        console.log("response.data:", modifiedTransportationData);
        switch (type) {
            case 'accommodation':
                responseData = {
                    queryParams: { q, check_in_date, check_out_date, adults },
                    serpData: response.data,
                };
                break;
            case 'transportation':
                responseData = {
                    queryParams: { departure_id, arrival_id, outbound_date, return_date, departure_token },
                    serpData: modifiedTransportationData,
                };
                break;
            case 'restaurant':
            case 'activity':
                responseData = {
                    queryParams: { q },
                    serpData: response.data,
                };
                break;
            default:
                return res.status(400).json({ error: 'Invalid search type' });
        }

        await model.insertMany([responseData]);

        res.json(response.data);
    } catch (err) {
        console.error('Search error:', err.message);
        res.status(500).json({ error: 'Failed to fetch from SerpAPI', details: err.message });
    }
};

export const handleSearchReturnFlights = async (req, res) => {
    const type = req.headers['type'];

    const { departure_id, arrival_id, outbound_date, return_date, departure_token } = req.query;

    if (!departure_id || !arrival_id || !outbound_date || !return_date || !departure_token) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    try {
        const model = getModelForType(type);
        const existingResults = await findQueryParams(model, req.query);

        if (existingResults) {
            const best = existingResults.serpData?.best_flights || [];
            const other = existingResults.serpData?.other_flights || [];

            const allFlights = [...best, ...other];

            async function hasAnyEmptyReturnFlights() {
                try {
                    const count = await model.countDocuments({
                        $or: [
                            { "serpData.best_flights.return_flights": { $size: 0 } },
                            { "serpData.other_flights.return_flights": { $size: 0 } },
                        ]
                    });

                    console.log(`Documents with empty return_flights: ${count}`);
                    return count !== 0;
                } catch (error) {
                    console.error("Error checking empty return_flights:", error);
                    return false;
                }
            }

            const anyEmptyReturnFlights = await hasAnyEmptyReturnFlights();
            console.log("anyEmptyReturnFlights", anyEmptyReturnFlights)
            if (!anyEmptyReturnFlights) {
                console.log("found document in mongoDB with all return_flights populated");
                console.log("existingResults", existingResults)
                return res.json({
                    message: 'Return flights fetched from database successfully.',
                    data: existingResults
                });
                // return res.json(existingResults);
            } else {
                console.log("document return_flights empty")
            }
        }
    } catch (e) {
        console.log("error searching mongoDB: ", e);
    }

    const findDocQuery = {
        'queryParams.departure_id': departure_id,
        'queryParams.arrival_id': arrival_id,
        'queryParams.outbound_date': outbound_date,
        'queryParams.return_date': return_date,
    };

    try {
        const model = getModelForType(type);
        console.log(type);
        console.log(model)
        const existingDocument = await model.findOne(findDocQuery);

        if (!existingDocument) {
            console.error('[DB_UPDATE_RETURNS] Original document not found with query:', findDocQuery);
            return res.status(404).json({ error: 'Original search document not found.' });
        }
        console.log('[DB_UPDATE_RETURNS] Found document ID:', existingDocument._id);

        // 2. Prepare parameters to call SerpApi for return flights
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                ...req.query,
                api_key: process.env.VITE_SERPAPI_KEY,
            },
        });

        if (!response || !response.data) {
            return res.status(500).json({ error: 'SerpAPI returned empty data for return flights.' });
        }
        const rawReturnFlightsData = response.data;
        // console.log('[DB_UPDATE_RETURNS] Successfully fetched return flights from SerpAPI.');
        console.log("raw flights", rawReturnFlightsData)

        let newReturnFlightsContent = [];
        if (rawReturnFlightsData.other_flights && Array.isArray(rawReturnFlightsData.other_flights)) {
            newReturnFlightsContent = rawReturnFlightsData.other_flights;
        } else if (rawReturnFlightsData.flights && Array.isArray(rawReturnFlightsData.best_flights)) { // Some APIs might use 'flights'
            newReturnFlightsContent = rawReturnFlightsData.best_flights;
        } else {
            console.warn("[DB_UPDATE_RETURNS] No 'other_flights' or 'flights' array in SerpApi return data. Storing empty array for returns.");
        }

        // 4. Update the specific flight offer within existingDocument.serpData
        let offerWasUpdated = false;

        const targetTokenForUpdate = departure_token;
        let offerActuallyUpdatedInDB = false;

        // Try to update in best_flights
        let updateResult = await model.updateOne(
            findDocQuery,
            { $set: { "serpData.best_flights.$[elem].return_flights": newReturnFlightsContent } },
            { arrayFilters: [{ "elem.departure_token": targetTokenForUpdate }] }
        );

        if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
            offerWasUpdated = true;
            console.log(`[UPDATE_RETURNS_DB] Updated return_flights in best_flights for token: ${targetTokenForUpdate}`);
        } else {
            console.log(`[UPDATE_RETURNS_DB] Token ${targetTokenForUpdate} not updated in best_flights (matched: ${updateResult.matchedCount}, modified: ${updateResult.modifiedCount}). Trying other_flights.`);
            // If not updated in best_flights, try other_flights
            updateResult = await model.updateOne(
                findDocQuery,
                { $set: { "serpData.other_flights.$[elem].return_flights": newReturnFlightsContent } },
                { arrayFilters: [{ "elem.departure_token": targetTokenForUpdate }] }
            );
            if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
                offerWasUpdated = true;
                console.log(`[UPDATE_RETURNS_DB] Updated return_flights in other_flights for token: ${targetTokenForUpdate}`);
            }
        }
        console.log("updateResult", updateResult)
        const updatedDocument = await model.findOne(findDocQuery);
        // console.log("Updated Document After Update:", updatedDocument.best_flights.return_flights);
        const firstBestFlight = updatedDocument.serpData?.best_flights?.[0];
        if (firstBestFlight) {
            console.log("[DB_UPDATE_RETURNS] Re-fetched doc's first best_flight's return_flights length:", firstBestFlight.return_flights?.length);
        } else {
            console.log("[DB_UPDATE_RETURNS] Re-fetched doc has no best_flights or it's empty.");
        }

        console.log("existingDocument.serpData", existingDocument.serpData);
        // console.log('[DB_UPDATE_RETURNS] Document updated successfully in DB.');
        res.json({
            message: 'Return flights fetched and document updated successfully.',
            data: existingDocument.serpData // Send back the entire updated serpData
        });

    } catch (err) {
        console.error(`[DB_UPDATE_RETURNS] Error:`, err.message);
        return res.status(500).json({ error: 'Internal server error.', details: err.message });
    }
}