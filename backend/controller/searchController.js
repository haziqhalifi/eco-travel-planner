import axios from 'axios';
import getModelForType from '../utils/getModelForType.js';
import findQueryParams from '../utils/findQueryParams.js';

export const handleSerpSearch = async (req, res) => {
    const type = req.headers['type'];
    console.log('Received request:', req.query);
    console.log('Search type:', type);

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
        const { q, check_in_date, check_out_date, adults, departure_id, arrival_id, outbound_date, return_date } = req.query;

        switch (type) {
            case 'accommodation':
                responseData = {
                    queryParams: { q, check_in_date, check_out_date, adults },
                    serpData: response.data,
                };
                break;
            case 'transportation':
                responseData = {
                    queryParams: { departure_id, arrival_id, outbound_date, return_date },
                    serpData: response.data,
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