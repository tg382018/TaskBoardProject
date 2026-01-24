import { getRedisClient } from "../config/redis.js";

/**
 * Basit bir Redis tabanlı Rate Limit Middleware.
 
 */
export function rateLimitMiddleware({ windowMs, max, keyPrefix = "rl:" }) {
    return async (req, res, next) => {
        const redis = getRedisClient();
        if (!redis) return next(); // Redis yoksa geç (fail-safe)

        // Key: Prefix + (UserId veya IP)
        const identifier = req.user ? String(req.user._id) : req.ip;
        const key = `${keyPrefix}${identifier}`;

        try {
            const current = await redis.get(key);
            const hits = parseInt(current || "0", 10);
            //her denemede redisi arttır
            if (hits >= max) {
                return res.status(429).json({ error: "Too many requests, please try again later." });
            }

            if (hits === 0) {
                await redis.set(key, 1, "PX", windowMs);
            } else {
                await redis.incr(key);
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}
