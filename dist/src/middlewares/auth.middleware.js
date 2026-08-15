import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, _res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith("Bearer ")) {
            throw new AppError("Authentication token is required", 401);
        }
        const token = authorization.slice(7).trim();
        if (!token) {
            throw new AppError("Authentication token is required", 401);
        }
        req.user = verifyAccessToken(token);
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }
        next(new AppError("Invalid or expired token", 401));
    }
}
