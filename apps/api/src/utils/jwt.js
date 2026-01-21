import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function signAccessToken(payload) {
    return jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: config.jwtAccessExpiry,
    });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiry,
    });
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.jwtAccessSecret);
    } catch (err) {
        return null;
    }
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, config.jwtRefreshSecret);
    } catch (err) {
        return null;
    }
}

export function decodeToken(token) {
    return jwt.decode(token);
}
