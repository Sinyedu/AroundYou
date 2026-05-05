import { Router, Request, Response } from "express";

import {
  createAttraction,
  getAllAttractions,
  getAttractionById,
  updateAttractionById,
  deleteAttractionById,
  getAttractionsByQuery,
  getAttractionsByQueryGeneric,
} from "../controllers/attractionController";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getEventByQuery,
  getEventByGenericQuery,
} from "../controllers/eventController";
import {
  createCity,
  getAllCities,
  getCityById,
  getCityByName,
  updateCityById,
  deleteCityById,
  getCityByQuery,
  getCityByGenericQuery,
} from "../controllers/cityController";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  getReviewByQuery,
  getReviewByGenericQuery,
  getReviewsByTarget,
  likeReview,
  editReview,
} from "../controllers/reviewController";
import {
  getMe,
  loginUser,
  registerUser,
  restrictUser,
  updateMe,
} from "../controllers/authController";
import {
  approveContentSuggestion,
  createContentSuggestion,
  getContentSuggestions,
  rejectContentSuggestion,
} from "../controllers/contentSuggestionController";
import {
  forwardGeocode,
  reverseGeocode,
} from "../controllers/geocodingController";
import { verifyToken } from "../middleware/verifyUserToken";
import { requirePermission } from "../middleware/requirePermission";
import {
  uploadImage,
  uploadSingleImage,
} from "../controllers/uploadController";

const router: Router = Router();

router.post("/upload/image", uploadSingleImage, uploadImage);

router.get("/", (req: Request, res: Response) => {
  // connect
  res.status(200).send("Welcome to the AroundYou API");
  // disconnect
});

router.get("/geocode", forwardGeocode);
router.get("/geocode/reverse", reverseGeocode);

/**
 * @swagger
 * /suggestions:
 *   post:
 *     tags:
 *       - Content Suggestions
 *     summary: Submit a city, event, or attraction suggestion
 *     description: Authenticated users submit content suggestions for admin approval.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - payload
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [attraction, event, city]
 *               payload:
 *                 type: object
 *     responses:
 *       201:
 *         description: Suggestion submitted
 *       400:
 *         description: Invalid suggestion
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Insufficient permissions
 */
router.post(
  "/suggestions",
  verifyToken,
  requirePermission("content:suggest"),
  createContentSuggestion,
);

/**
 * @swagger
 * /admin/suggestions:
 *   get:
 *     tags:
 *       - Admin
 *     summary: List content suggestions for admin review
 *     description: Returns suggestions filtered by status. Defaults to pending.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Suggestions returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/admin/suggestions",
  verifyToken,
  requirePermission("admin:access"),
  getContentSuggestions,
);

/**
 * @swagger
 * /admin/suggestions/{id}/approve:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Approve a content suggestion
 *     description: Creates the real city, event, or attraction from the suggestion payload.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Suggestion not found
 *       409:
 *         description: Suggestion already reviewed
 */
router.post(
  "/admin/suggestions/:id/approve",
  verifyToken,
  requirePermission("admin:access"),
  approveContentSuggestion,
);

/**
 * @swagger
 * /admin/suggestions/{id}/reject:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Reject a content suggestion
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggestion rejected
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Suggestion not found
 *       409:
 *         description: Suggestion already reviewed
 */
router.post(
  "/admin/suggestions/:id/reject",
  verifyToken,
  requirePermission("admin:access"),
  rejectContentSuggestion,
);

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
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Email address or username
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Authorization:
 *             description: JWT authentication token in Bearer format
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/user/login", loginUser);

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - User Routes
 *     summary: Get current authenticated user
 *     description: Returns the user linked to the provided JWT token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/me", verifyToken, getMe);
router.put("/user/me", verifyToken, updateMe);
router.patch("/user/me/restrict", verifyToken, restrictUser);

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
router.post(
  "/attractions",
  verifyToken,
  requirePermission("attraction:create"),
  createAttraction,
);

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
router.put(
  "/attractions/:id",
  verifyToken,
  requirePermission("attraction:update"),
  updateAttractionById,
);

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
router.delete(
  "/attractions/:id",
  verifyToken,
  requirePermission("attraction:delete"),
  deleteAttractionById,
);

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
router.get(
  "/attractions/query/:key/:value",
  verifyToken,
  requirePermission("attraction:read"),
  getAttractionsByQuery,
);

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
router.post(
  "/attractions/query",
  verifyToken,
  requirePermission("attraction:read"),
  getAttractionsByQueryGeneric,
);

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
router.post(
  "/events",
  verifyToken,
  requirePermission("event:create"),
  createEvent,
);

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
router.put(
  "/events/:id",
  verifyToken,
  requirePermission("event:update"),
  updateEventById,
);

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
router.delete(
  "/events/:id",
  verifyToken,
  requirePermission("event:delete"),
  deleteEventById,
);

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
router.get(
  "/events/query/:key/:value",
  verifyToken,
  requirePermission("event:read"),
  getEventByQuery,
);

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
router.post(
  "/events/query",
  verifyToken,
  requirePermission("event:read"),
  getEventByGenericQuery,
);

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
router.post("/city", verifyToken, requirePermission("city:create"), createCity);

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

// GET CITY BY NAME
router.get("/city/name/:cityName", getCityByName);

// GET CITY BY ID
/**
 * @swagger
 * /city/{id}:
 *   get:
 *     tags:
 *       - City Routes
 *     summary: Get a CITY by ID
 *     description: Retrieves a CITY from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CITY to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CITY found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */
router.get("/city/:id", getCityById);

// UPDATE CITY BY ID
/**
 * @swagger
 * /city/{id}:
 *   put:
 *     tags:
 *       - City Routes
 *     summary: Update a CITY by ID
 *     description: Updates an existing CITY in the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CITY to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: CITY updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */
router.put(
  "/city/:id",
  verifyToken,
  requirePermission("city:update"),
  updateCityById,
);

// DELETE CITY BY ID
/**
 * @swagger
 * /city/{id}:
 *   delete:
 *     tags:
 *       - City Routes
 *     summary: Delete a CITY by ID
 *     description: Deletes an existing CITY from the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the CITY to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: CITY deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/city/:id",
  verifyToken,
  requirePermission("city:delete"),
  deleteCityById,
);

// GET CITY BY QUERY
/**
 * @swagger
 * /city/query/{key}/{value}:
 *   get:
 *     tags:
 *       - City Routes
 *     summary: Get CITYs by query
 *     description: Retrieves CITYs from the database based on a key-value query. Requires authentication.
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         description: The field to query (e.g., name, country)
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
 *         description: A list of matching CITYs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get(
  "/city/query/:key/:value",
  verifyToken,
  requirePermission("city:read"),
  getCityByQuery,
);

// GET CITY BY GENERIC QUERY
/**
 * @swagger
 * /city/query:
 *   post:
 *     tags:
 *       - City Routes
 *     summary: Get CITYs by generic query
 *     description: Retrieves CITYs from the database based on a generic query object. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: A JSON object containing key-value pairs to query CITYs
 *     responses:
 *       200:
 *         description: A list of matching CITYs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post(
  "/city/query",
  verifyToken,
  requirePermission("city:read"),
  getCityByGenericQuery,
);

// REVIEW ROUTES
// CREATE REVIEW
/**
 * @swagger
 * /reviews:
 *   post:
 *     tags:
 *       - Review Routes
 *     summary: Create a new REVIEW
 *     description: Creates a new REVIEW in the database. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: REVIEW created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/reviews", verifyToken, requirePermission("review:create"), createReview);

router.get("/reviews/target/:targetId", getReviewsByTarget);

router.post("/reviews/:id/like", verifyToken, likeReview);

router.patch("/reviews/:id", verifyToken, editReview);

// GET ALL REVIEWS
/**
 * @swagger
 * /reviews:
 *   get:
 *     tags:
 *       - Review Routes
 *     summary: Get all REVIEWS
 *     description: Retrieves all REVIEWS from the database.
 *     responses:
 *       200:
 *         description: A list of all REVIEWS
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get("/reviews", getAllReviews);

// GET REVIEW BY ID
/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags:
 *       - Review Routes
 *     summary: Get a REVIEW by ID
 *     description: Retrieves a REVIEW from the database by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the REVIEW to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: REVIEW found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: REVIEW not found
 *       500:
 *         description: Server error
 */
router.get("/reviews/:id", getReviewById);

// UPDATE REVIEW BY ID
/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags:
 *       - Review Routes
 *     summary: Update a REVIEW by ID
 *     description: Updates an existing REVIEW in the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the REVIEW to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: REVIEW updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: REVIEW not found
 *       500:
 *         description: Server error
 */
router.put(
  "/reviews/:id",
  verifyToken,
  requirePermission("review:update"),
  updateReviewById,
);

// DELETE REVIEW BY ID
/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Review Routes
 *     summary: Delete a REVIEW by ID
 *     description: Deletes an existing REVIEW from the database by its ID. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the REVIEW to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: REVIEW deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: REVIEW not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/reviews/:id",
  verifyToken,
  requirePermission("review:delete"),
  deleteReviewById,
);

// GET REVIEW BY QUERY
/**
 * @swagger
 * /reviews/query/{key}/{value}:
 *   get:
 *     tags:
 *       - Review Routes
 *     summary: Get REVIEWs by query
 *     description: Retrieves REVIEWs from the database based on a key-value query. Requires authentication.
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
 *         description: A list of matching REVIEWs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get(
  "/reviews/query/:key/:value",
  verifyToken,
  requirePermission("review:read"),
  getReviewByQuery,
);

// GET REVIEW BY GENERIC QUERY
/**
 * @swagger
 * /reviews/query:
 *   post:
 *     tags:
 *       - Review Routes
 *     summary: Get REVIEWs by generic query
 *     description: Retrieves REVIEWs from the database based on a generic query object. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: A JSON object containing key-value pairs to query REVIEWs
 *     responses:
 *       200:
 *         description: A list of matching REVIEWs (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post(
  "/reviews/query",
  verifyToken,
  requirePermission("review:read"),
  getReviewByGenericQuery,
);

export default router;
