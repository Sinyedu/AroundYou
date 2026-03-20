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
 *       400:
 *         description: Bad request - Invalid input
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Server error
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
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *     security:
 *       - bearerAuth: []
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
router.post("/attractions", verifyToken, createAttraction);

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

// UPDATE ATTRACTION BY ID
/**
 * @swagger
 * /attractions/{id}:
 *   put:
 *     tags:
 *       - Attraction Routes
 *     summary: Update an ATTRACTION by ID
 *     description: Updates an existing ATTRACTION in the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ATTRACTION to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attraction'
 *     responses:
 *       200:
 *         description: ATTRACTION updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */
router.put("/attractions/:id", updateAttractionById);

// DELETE ATTRACTION BY ID
/**
 * @swagger
 * /attractions/{id}:
 *   delete:
 *     tags:
 *       - Attraction Routes
 *     summary: Delete an ATTRACTION by ID
 *     description: Deletes an existing ATTRACTION from the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ATTRACTION to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: ATTRACTION deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */
router.delete("/attractions/:id", deleteAttractionById);

// GET ATTRACTION BY QUERY
/**
 * @swagger
 * /attractions/query/{key}/{value}:
 *   get:
 *     tags:
 *       - Attraction Routes
 *     summary: Get ATTRACTIONs by query
 *     description: Retrieves ATTRACTIONs from the database based on a key-value query. Requires authentication.
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         description: The field to query (e.g., name, city)
 *         schema:
 *           type: string
 *       - name: value
 *         in: path
 *         required: true
 *         description: The value to match for the specified key
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of matching ATTRACTIONs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/attractions/query/:key/:value", verifyToken, getAttractionsByQuery);

// GET ATTRACTION BY GENERIC QUERY
/**
 * @swagger
 * /attractions/query:
 *   post:
 *     tags:
 *       - Attraction Routes
 *     summary: Get ATTRACTIONs by generic query
 *     description: Retrieves ATTRACTIONs from the database based on a generic query object. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: A JSON object containing key-value pairs to query ATTRACTIONs
 *     responses:
 *       200:
 *         description: A list of matching ATTRACTIONs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/attractions/query", verifyToken, getAttractionsByQueryGeneric);



// EVENT ROUTES
// CREATE EVENT
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

// GET ALL EVENTS
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

// GET EVENT BY ID
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags:
 *       - Event Routes
 *     summary: Get an EVENT by ID
 *     description: Retrieves an EVENT from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EVENT to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: EVENT found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */
router.get("/events/:id", getEventById);

// UPDATE EVENT BY ID
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     tags:
 *       - Event Routes
 *     summary: Update an EVENT by ID
 *     description: Updates an existing EVENT in the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EVENT to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: EVENT updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */
router.put("/events/:id", updateEventById);

// DELETE EVENT BY ID
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Event Routes
 *     summary: Delete an EVENT by ID
 *     description: Deletes an existing EVENT from the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the EVENT to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: EVENT deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */
router.delete("/events/:id", deleteEventById);

// GET EVENT BY QUERY
/**
 * @swagger
 * /events/query/{key}/{value}:
 *   get:
 *     tags:
 *       - Event Routes
 *     summary: Get EVENTs by query
 *     description: Retrieves EVENTs from the database based on a key-value query. Requires authentication.
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         description: The field to query (e.g., name, city)
 *         schema:
 *           type: string
 *       - name: value
 *         in: path
 *         required: true
 *         description: The value to match for the specified key
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of matching EVENTs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/events/query/:key/:value", verifyToken, getEventByQuery);

// GET EVENT BY GENERIC QUERY
/**
 * @swagger
 * /events/query:
 *   post:
 *     tags:
 *       - Event Routes
 *     summary: Get EVENTs by generic query
 *     description: Retrieves EVENTs from the database based on a generic query object. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: A JSON object containing key-value pairs to query EVENTs
 *     responses:
 *       200:
 *         description: A list of matching EVENTs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/events/query", verifyToken, getEventByGenericQuery);



// CITY ROUTES
// CREATE CITY
/**
 * @swagger
 * /city:
 *   post:
 *     tags:
 *       - City Routes
 *     summary: Create a new CITY
 *     description: Creates a new CITY in the database. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: CITY created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/city", createCity);

// GET ALL CITIES
/**
 * @swagger
 * /city:
 *   get:
 *     tags:
 *       - City Routes
 *     summary: Get all CITIES
 *     description: Retrieves all CITIES from the database.
 *     responses:
 *       200:
 *         description: A list of all CITIES
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         description: Server error
 */
router.get("/city", getAllCities);


router.get("/city/:id", getCityById);
router.put("/city/:id", updateCityById);
router.delete("/city/:id", deleteCityById);
router.get("/city/query/:key/:value", verifyToken, getCityByQuery);
router.post("/city/query", verifyToken, getCityByGenericQuery);


// REVIEW ROUTES
router.post("/reviews", createReview);
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.put("/reviews/:id", updateReviewById);
router.delete("/reviews/:id", deleteReviewById);
router.get("/reviews/query/:key/:value", verifyToken, getReviewByQuery);
router.post("/reviews/query", verifyToken, getReviewByGenericQuery);






export default router;
