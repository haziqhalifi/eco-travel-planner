import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Accommodation from './pages/ecoOptions/data/Accommodation.js';
import Activity from './pages/ecoOptions/data/Activity.js';
import Restaurant from './pages/ecoOptions/data/Restaurant.js';
import Transportation from './pages/ecoOptions/data/Transportation.js';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());

app.get('/api/serp/search', async (req, res) => {
    console.log('Received request:', req.query);
    const type = req.headers['type']
    console.log('Search type:', type);
    // const { type, ...queryParams } = req.query;
    try {
        const model = getModelForType(type);

        // let queryParams = req.query;
        // if (type === 'restaurant' || type === 'activity') {
        //     console.log("Query params:", queryParams.q);
        //     queryParams = { searchTerm: req.query.q, ...req.query };
        // }

        const existingResults = await findQueryParams(model, req.query);
        if (existingResults) {
            console.log("Existing results length" , existingResults.length);
            console.log('Found existing results', existingResults);
            return res.json(existingResults);
        } else {
            console.log("no existing results")
        }

        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                ...req.query,
                api_key: process.env.VITE_SERPAPI_KEY,
            },
        });

        // const results = response.data?.local_results || [];
        let responseData;
        if (type === 'accommodation') {
            const { q, check_in_date, check_out_date, adults } = req.query;
            responseData = {
                queryParams: {
                    q,
                    check_in_date,
                    check_out_date,
                    adults
                },
                serpData: response.data,  // Include the SerpAPI response
            };
        } else if (type === 'transportation') {
            const { departure_id, arrival_id, outbound_date, return_date } = req.query;
            responseData = {
                queryParams: {
                    departure_id,
                    arrival_id,
                    outbound_date,
                    return_date
                },
                serpData: response.data,  // Include the SerpAPI response
            };
        } else if (type === 'restaurant' || type === 'activity') {
            const { q } = req.query;
            responseData = {
                queryParams: {
                    q,
                },
                serpData: response.data,  // Include the SerpAPI response
            };
        } else {
            return res.status(400).json({ error: 'Invalid search type' });
        }

        try {
            const result = await model.insertMany([responseData]);
            console.log('Insert result:', result);
        } catch (err) {
            console.error('Insert error:', err);
        }

        res.json(response.data);
        console.log('SerpAPI Response:', response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from SerpAPI', err: err.message });
        console.error('Error occurred during SerpAPI fetch:', err);
    }
});

app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).json({ error: 'Missing image URL' });
    }

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Forward the content type from the response
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.send(response.data);
    } catch (err) {
        console.error('Error fetching image:', err.message);
        res.status(500).json({ error: 'Failed to fetch image', details: err.message });
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

function getModelForType(type) {
    switch (type) {
        case 'accommodation':
            return Accommodation;
        case 'transportation':
            return Transportation;
        case 'restaurant':
            return Restaurant;
        case 'activity':
            return Activity;
        default:
            throw new Error('Invalid search type');
    }
}

// async function findQueryParams(model, queryParams) {
//     let mongoQuery = {};
//
//     switch (model) {
//         case Accommodation:
//             mongoQuery = {
//                 searchTerm: { $regex: queryParams.q, $options: 'i' },
//                 checkInDate: queryParams.check_in_date,
//                 checkOutDate: queryParams.check_out_date,
//                 adults: queryParams.adults
//             };
//             break;
//         case Transportation:
//             mongoQuery = {
//                 origin: queryParams.departure_id,
//                 destination: queryParams.arrival_id,
//                 departureDate: queryParams.outbound_date,
//                 returnDate: queryParams.return_date
//             };
//             break;
//         case Restaurant:
//             mongoQuery = {
//                 searchTerm: { $regex: queryParams.q, $options: 'i' },
//                 ...(queryParams.place_id
//                     ? { placeId: queryParams.place_id }
//                     : { data: queryParams.data })
//             };
//             break;
//         case Activity:
//             mongoQuery = {
//                 searchTerm: { $regex: queryParams.q, $options: 'i' },
//                 ...(queryParams.place_id
//                     ? { placeId: queryParams.place_id }
//                     : { data: queryParams.data })
//             };
//             break;
//         default:
//             throw new Error('Invalid type for MongoDB search');
//     }
//
//     try {
//         const data = await model.find(mongoQuery);
//         return data;  // Returns the data
//     } catch (err) {
//         console.error('MongoDB query error:', err);
//         throw err;  // Throws error if query fails
//     }
// }

async function findQueryParams(model, queryParams) {
    let mongoQuery = {};

    switch (model) {
        case Accommodation:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
                'queryParams.check_in_date': queryParams.check_in_date,
                'queryParams.check_out_date': queryParams.check_out_date,
                'queryParams.adults': queryParams.adults
            };
            break;
        case Transportation:
            mongoQuery = {
                'queryParams.departure_id': queryParams.departure_id,
                'queryParams.arrival_id': queryParams.arrival_id,
                'queryParams.outbound_date': queryParams.outbound_date,
                'queryParams.return_date': queryParams.return_date
            };
            break;
        case Restaurant:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
                // ...(queryParams.place_id
                //     ? { 'queryParams.place_id': queryParams.place_id }
                //     : { 'queryParams.data': queryParams.data })
            };
            break;
        case Activity:
            mongoQuery = {
                'queryParams.q': { $regex: queryParams.q, $options: 'i' },
            };
            break;
        default:
            throw new Error('Invalid type for MongoDB search');
    }

    try {
        // Query the database using the constructed query
        const data = await model.find(mongoQuery);

        // If data is found, return the serpData
        if (data && data.length > 0) {
            console.log("DATA", data[0].serpData);
            console.log("Data length", data.length);
            return data[0].serpData;
        } else {
            // throw new Error("No data found for the provided query parameters.");
            return null;
        }
    } catch (err) {
        console.error('MongoDB query error:', err);
        throw err;
    }
}

app.listen(5000, () => console.log('Server running on http://localhost:5000'));