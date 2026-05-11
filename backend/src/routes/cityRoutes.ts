import { Router } from "express";
import {
  createCity,
  deleteCityById,
  getAllCities,
  getCityByGenericQuery,
  getCityById,
  getCityByName,
  getCityByQuery,
  updateCityById,
} from "../controllers/cityController";
import { contentWriteRateLimiter } from "../middleware/rateLimit";
import { requirePermission } from "../middleware/requirePermission";
import { verifyToken } from "../middleware/verifyUserToken";

const router = Router();

router.post(
  "/city",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("city:create"),
  createCity,
);
router.get("/city", getAllCities);
router.get("/city/name/:cityName", getCityByName);
router.get("/city/:id", getCityById);
router.put(
  "/city/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("city:update"),
  updateCityById,
);
router.delete(
  "/city/:id",
  verifyToken,
  contentWriteRateLimiter,
  requirePermission("city:delete"),
  deleteCityById,
);
router.get(
  "/city/query/:key/:value",
  verifyToken,
  requirePermission("city:read"),
  getCityByQuery,
);
router.post(
  "/city/query",
  verifyToken,
  requirePermission("city:read"),
  getCityByGenericQuery,
);

export default router;
