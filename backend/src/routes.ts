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
  createEvent,
  getAllEvents,
} from "./controllers/eventController";
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

// auth routes
/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Takes a user in the body and tries to register it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                _id:
 *                  type: string
 */
router.post("/user/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           auth-token:
 *             description: JWT authentication token
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
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

// create
/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Event Routes
 *     summary: Create a new EVENT
 *     description: Creates a new EVENT in the database. Requires authentication.
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: EVENT created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/events", createEvent);

// gets
/**
 * @swagger
 * /attractions:
 *   get:
 *     tags:
 *       - Attraction Routes
 *     summary: Get all ATTRACTIONs
 *     description: Retrieves all ATTRACTIONs from the database.
 *     responses:
 *       200:
 *         description: A list of all ATTRACTIONs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       500:
 *         description: Server error
 */
router.get("/attractions", getAllAttractions);

// gets
/**
 * @swagger
 * /events:
 *   get:
 *     tags:
 *       - Event Routes
 *     summary: Get all EVENTS
 *     description: Retrieves all EVENTS from the database.
 *     responses:
 *       200:
 *         description: A list of all EVENTS
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
router.get("/events", getAllEvents); 

router.get("/attractions/:id", getAttractionById);


router.post("/attractions/query", getAttractionsByQueryGeneric);
router.get("/attractions/:key/:value", verifyToken, getAttractionsByQuery);


router.put("/attractions/:id", updateAttractionById);
router.delete("/attractions/:id", deleteAttractionById);

export default router;
