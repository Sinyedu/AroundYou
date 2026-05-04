import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import routes from "./routes/routes";
import { setupDocs } from "./utils/swaggerDocumentation";
import { connectDB } from "./repository/database";

dotenvFlow.config();

const app: Application = express();

/**
 * CORS configuration
 */
function setupCors() {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  );
}

/**
 * Middleware setup
 */
function setupMiddleware() {
  app.use(express.json());
}

/**
 * Routes setup
 */
function setupRoutes() {
  app.use("/api", routes);
}

/**
 * Server bootstrap
 */
export async function startServer() {
  setupCors();
  setupMiddleware();
  setupRoutes();

  setupDocs(app);

  await connectDB();

  const PORT: number = Number(process.env.PORT as string) || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
