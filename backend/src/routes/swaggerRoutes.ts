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
 *       400:
 *         description: Bad request - Invalid input
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Invalid email or password
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

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
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

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
 *       500:
 *         description: Server error
 */

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
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /attractions/{id}:
 *   delete:
 *     tags:
 *       - Attraction Routes
 *     summary: Hide an ATTRACTION by ID
 *     description: Soft-deletes an existing ATTRACTION by hiding it. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: ATTRACTION hidden successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: ATTRACTION not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Event Routes
 *     summary: Create a new EVENT
 *     description: Creates a new EVENT in the database. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: EVENT created successfully
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

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
 *       500:
 *         description: Server error
 */

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: EVENT found
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Event Routes
 *     summary: Hide an EVENT by ID
 *     description: Soft-deletes an existing EVENT by hiding it. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: EVENT hidden successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: EVENT not found
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

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
 *       500:
 *         description: Server error
 */

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CITY found
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CITY updated successfully
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /city/{id}:
 *   delete:
 *     tags:
 *       - City Routes
 *     summary: Hide a CITY by ID
 *     description: Soft-deletes an existing CITY by hiding it. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: CITY hidden successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: CITY not found
 *       500:
 *         description: Server error
 */

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
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags:
 *       - Review Routes
 *     summary: Get all REVIEWs
 *     description: Retrieves all REVIEWs from the database.
 *     responses:
 *       200:
 *         description: A list of all REVIEWs
 *       500:
 *         description: Server error
 */

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: REVIEW updated successfully
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: REVIEW not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Review Routes
 *     summary: Hide a REVIEW by ID
 *     description: Soft-deletes an existing REVIEW by hiding it. Requires authentication.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: REVIEW hidden successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: REVIEW not found
 *       500:
 *         description: Server error
 */

export {};
