import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());

app.get('/api/serp/search', async (req, res) => {
    console.log('Received request:', req.query);
    try {
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                ...req.query,
                api_key: process.env.VITE_SERPAPI_KEY,
            },
        });
        res.json(response.data);
        console.log('SerpAPI Response:', response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from SerpAPI', err: err.message });
        console.error('Error occurred during SerpAPI fetch:', err);
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
