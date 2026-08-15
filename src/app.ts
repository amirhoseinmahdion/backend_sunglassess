import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { swaggerDocument } from "./config/swagger.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { productRouter } from "./routes/product.routes.js";

export const app = express();

app.disable("x-powered-by");

/**
 * CORS
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * Request body parsers
 */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health route
 */
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Lunaro API is working",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Swagger JSON
 */
app.get("/api/docs.json", (_req, res) => {
  res.status(200).json(swaggerDocument);
});

/**
 * Swagger UI
 */
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customSiteTitle: "Lunaro API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);

/**
 * API routes
 */
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

/**
 * Error handlers must be last
 */
app.use(notFoundHandler);
app.use(errorHandler);