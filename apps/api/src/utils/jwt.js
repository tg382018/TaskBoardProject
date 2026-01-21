import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

/**
 * Access token üret
 */
export function signAccessToken(payload) {
    return jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    });
}

/**
 * Refresh token üret
 */
export function signRefreshToken(payload) {
    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: REFRESH_TOKEN_EXPIRES,
    });
}

/**
 * Access token doğrula
 */
export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwtAccessSecret);
}

/**
 * Refresh token doğrula
 */
export function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwtRefreshSecret);
}

/**
 * Token'dan expiry süresini al (seconds)
 */
export function getTokenExpiry(token) {
    const decoded = jwt.decode(token);
    return decoded?.exp || 0;
}
