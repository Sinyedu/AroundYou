import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";

import routes from "./routes/routes";
import { setupDocs } from "./utils/swaggerDocumentation";
import cors from "cors";

dotenvFlow.config();

// Create Express application
const app: Application = express();

/**
 * Sets up CORS handling.
 */
function setupCors() {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  );
}

export function startServer() {
  setupCors();

  app.use(express.json());

  app.use("/api", routes);

  setupDocs(app);

  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function() {
    console.log("Server is running on port:" + PORT);
  });
}
