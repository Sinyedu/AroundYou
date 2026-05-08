import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import routes from "./routes/routes";
import { setupDocs } from "./utils/swaggerDocumentation";
import { connectDB } from "./repository/database";
import { ensureDefaultAdminUser } from "./services/admin.service";

dotenvFlow.config();

const app: Application = express();

function getAllowedCorsOrigins(): string[] {
  const configuredOrigins = [
    process.env.FRONTEND_ORIGIN,
    ...(process.env.CORS_ORIGINS ?? "").split(","),
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));

  return configuredOrigins.length
    ? configuredOrigins
    : ["http://localhost:5173", "http://127.0.0.1:5173"];
}

/**
 * CORS configuration
 */
function setupCors() {
  const allowedOrigins = new Set(getAllowedCorsOrigins());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
      optionsSuccessStatus: 204,
    }),
  );
}

/**
 * Middleware setup
 */
function setupMiddleware() {
  app.use(express.json({ limit: "2mb" }));
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
  await ensureDefaultAdminUser();

  const PORT: number = Number(process.env.PORT as string) || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
