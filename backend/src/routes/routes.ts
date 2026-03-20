import { Router, Request, Response } from "express";

import { createAttraction, getAllAttractions, getAttractionById, updateAttractionById, deleteAttractionById, getAttractionsByQuery, getAttractionsByQueryGeneric } from "../controllers/attractionController";
import { createEvent,getAllEvents, getEventById, updateEventById,deleteEventById, getEventByQuery, getEventByGenericQuery } from "../controllers/eventController";
import { createCity, getAllCities, getCityById, updateCityById, deleteCityById, getCityByQuery, getCityByGenericQuery } from "../controllers/cityController";
import { createReview, getAllReviews, getReviewById, updateReviewById, deleteReviewById, getReviewByQuery, getReviewByGenericQuery } from "../controllers/reviewController";

import { loginUser, registerUser } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyUserToken";


const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  // connect
  res.status(200).send("Welcome to the AroundYou API");
  // disconnect
});



// AUTH ROUTES
// REGISTER
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

// LOGIN
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



// ATTRACTION ROUTES
// CREATE ATTRACTION
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

// GET ALL ATTRACTIONS
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

// GET ATTRACTION BY ID
/**
 * @swagger
 * /attractions/{id}:
 *   get:
 *     tags:
 *       - Attraction Routes
 *     summary: Get an ATTRACTION by ID
 *     description: Retrieves an ATTRACTION from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ATTRACTION to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ATTRACTION found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */
router.get("/attractions/:id", getAttractionById);




router.put("/attractions/:id", updateAttractionById);
router.delete("/attractions/:id", deleteAttractionById);
router.get("/attractions/:key/:value", verifyToken, getAttractionsByQuery);
router.post("/attractions/query", getAttractionsByQueryGeneric);



// EVENT ROUTES
// CREATE
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

// GET ALL
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

router.get("/events/:id", getEventById);
router.put("/events/:id", updateEventById);
router.delete("/events/:id", deleteEventById);
router.get("/events/:key/:value", verifyToken, getEventByQuery);
router.post("/events/query", getEventByGenericQuery);



// CITY ROUTES
router.post("/city", createCity);
router.get("/city", getAllCities);
router.get("/city/:id", getCityById);
router.put("/city/:id", updateCityById);
router.delete("/city/:id", deleteCityById);
router.get("/city/:key/:value", verifyToken, getCityByQuery);
router.post("/city/query", getCityByGenericQuery);


// REVIEW ROUTES
router.post("/reviews", createReview);
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.put("/reviews/:id", updateReviewById);
router.delete("/reviews/:id", deleteReviewById);
router.get("/reviews/:key/:value", verifyToken, getReviewByQuery);
router.post("/reviews/query", getReviewByGenericQuery);






export default router;
