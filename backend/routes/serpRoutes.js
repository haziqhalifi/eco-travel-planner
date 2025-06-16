import express from "express";
import {handleSearch, handleSearchReturnFlights} from "../controller/searchController.js";

const router = express.Router();

router.get("/search", handleSearch);
router.get("/search/returnFlight", handleSearchReturnFlights);

export default router;
