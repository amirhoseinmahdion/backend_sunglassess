import { AppError } from "../utils/app-error.js";
export function notFoundHandler(req, _res, next) {
    next(new AppError(`Route ${req.method} ${req.originalUrl} was not found`, 404));
}
export function errorHandler(error, _req, res, _next) {
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
