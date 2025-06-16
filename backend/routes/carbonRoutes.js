import express from "express";
import { saveFootprint, getAllFootprints } from "../controller/carbonController.js";

const router = express.Router();

router.post("/saveFootprint", saveFootprint);      // POST /api/carbon/saveFootprint
router.get("/getFootprint", getAllFootprints);     // GET /api/carbon/getFootprint

export default router;
