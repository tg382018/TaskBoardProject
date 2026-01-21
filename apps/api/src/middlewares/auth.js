import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../modules/users/repository.js";

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
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
