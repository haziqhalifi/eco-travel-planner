import authenticateToken from "../middleware/auth.js";
import express from "express";
import {getDocumentByPropertyToken} from "../controller/ecoOptionController.js";

const router = express.Router();

router.post("/:propertyToken", authenticateToken, getDocumentByPropertyToken);

export default router;