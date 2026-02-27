import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Sets up Swagger documentation for the API.
 * @param app
 */
export function setupDocs(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Rubber Ducks API",
      version: "1.0.0",
      description: "API documentation for the Rubber Ducks project",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth-token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            userID: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            userName: { type: "string" },
            userAvatar: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            country: { type: "string" },
            city: { type: "string" },
            street: { type: "string" },
            streetNumber: { type: "string" },
            postalCode: { type: "string" },
            isRestricted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Attraction: {
          type: "object",
          properties: {
            attractionID: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            heroImage: { type: "string" },
            imageArray: { type: "array", items: { type: "string" } },
            price: { type: "number" },
            link: { type: "string" },
            gpsPosition: { type: "string" },
            rating: { type: "number" },
            slugArray: { type: "array", items: { type: "string" } },
            updateAt: { type: "string", format: "date-time" },
            openingHours: { type: "array", items: { type: "string" } },
          },
        },
        City: {
          type: "object",
          properties: {
            cityID: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            heroImage: { type: "string" },
            commune: { type: "string" },
            region: { type: "string" },
            country: { type: "string" },
            gpsPosition: { type: "string" },
            population: { type: "number" },
            visitorCenter: { type: "string" },
            rating: { type: "number" },
          },
        },
        Event: {
          type: "object",
          properties: {
            eventID: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            heroImage: { type: "string" },
            imageArray: { type: "array", items: { type: "string" } },
            price: { type: "number" },
            link: { type: "string" },
            gpsPosition: { type: "string" },
            rating: { type: "number" },
            slugArray: { type: "array", items: { type: "string" } },
            updateAt: { type: "string", format: "date-time" },
            isAnnual: { type: "boolean" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            openingHours: { type: "array", items: { type: "string" } },
          },
        },
        Review: {
          type: "object",
          properties: {
            reviewID: { type: "string" },
            author: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            rating: { type: "number" },
            likes: { type: "number" },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["**/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
