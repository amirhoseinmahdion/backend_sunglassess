import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../utils/app-error.js";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} was not found`,
      404,
    ),
  );
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}