import crypto from "crypto";

/**
 * Refresh token'ı hash'le (DB'de saklamak için)
 * Plain text refresh token client'a gider, hash'i DB'de tutarız
 */
export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Rastgele token üret (refresh token base)
 */
export function generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
}

/**
 * İki token hash'ini güvenli karşılaştır (timing attack koruması)
 */
export function compareTokens(token1, token2) {
    const hash1 = hashToken(token1);
    const hash2 = hashToken(token2);
    return crypto.timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2));
}
