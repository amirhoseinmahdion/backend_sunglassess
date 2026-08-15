import { AppError } from "../utils/app-error.js";
export function requireAdmin(req, _res, next) {
    if (!req.user) {
        next(new AppError("Authentication is required", 401));
        return;
    }
    if (req.user.role !== "ADMIN") {
        next(new AppError("Only administrators can perform this action", 403));
        return;
    }
    next();
}
