import express from 'express';
import { handleSerpSearch } from '../controllers/searchController.js';

const router = express.Router();

router.get('/search', handleSerpSearch);

export default router;