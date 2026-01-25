import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../modules/users/repository.js";

export async function authMiddleware(req, res, next) {
    let token = null;

    // 1- Check Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    // 2- Check Cookie (Fallback)
    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    try {
        const user = await findUserById(payload.sub);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}
