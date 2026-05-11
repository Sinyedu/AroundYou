import { Router } from "express";
import { forwardGeocode, reverseGeocode } from "../controllers/geocodingController";

const router = Router();

router.get("/geocode", forwardGeocode);
router.get("/geocode/reverse", reverseGeocode);

export default router;
