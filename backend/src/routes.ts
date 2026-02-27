import { Router, Request, Response } from "express";
import {
  createAttraction,
  getAllAttractions,
  getAttractionById,
  updateAttractionById,
  deleteAttractionById,
  getAttractionsByQuery,
  getAttractionsByQueryGeneric,
} from "./controllers/attractionController";
import {
  loginUser,
  registerUser,
  verifyToken,
} from "./controllers/authController";

const router: Router = Router();


router.get("/", (req: Request, res: Response) => {
  // connect
  res.status(200).send("Welcome to the AroundYou API");
  // disconnect
});


router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

// create
/**
 * @swagger
 * /attractions:
 *   post:
 *     tags:
 *       - Attraction Routes
 *     summary: Create a new ATTRACTION
 *     description: Creates a new ATTRACTION in the database. Requires authentication.
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attraction'
 *     responses:
 *       201:
 *         description: ATTRACTION created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/attractions", createAttraction);
router.get("/attractions", getAllAttractions);
router.get("/attractions/:id", getAttractionById);


router.post("/attractions/query", getAttractionsByQueryGeneric);
router.get("/attractions/:key/:value", verifyToken, getAttractionsByQuery);


router.put("/attractions/:id", updateAttractionById);
router.delete("/attractions/:id", deleteAttractionById);

export default router;
