import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import serpRoutes from './routes/serpRoutes.js';
import connectDB from './config/db.js';
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/serp', serpRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));