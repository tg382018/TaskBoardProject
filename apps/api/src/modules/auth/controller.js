import {
    register,
    login,
    verifyOtp,
    refreshTokens,
    logout,
    getUserSessions,
    revokeSession,
    resendOtp,
} from "./service.js";
import { getOtp } from "./repository.js";
import { config } from "../../config/env.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax", // Better for cross-site if needed, strict is safer but lax is more compatible
    path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function registerController(req, res, next) {
    try {
        const result = await register({ ...req.body, ip: req.ip });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function loginController(req, res, next) {
    try {
        const result = await login({ ...req.body, ip: req.ip });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function verifyOtpController(req, res, next) {
    try {
        const { email, code } = req.body;
        const userAgent = req.get("User-Agent") || "Unknown";
        const result = await verifyOtp({ email, code, userAgent, ip: req.ip });

        const { accessToken, refreshToken } = result;

        res.cookie("accessToken", accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie("refreshToken", refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: "/api/auth", // Available for refresh and logout
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function refreshController(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
        const userAgent = req.get("User-Agent") || "Unknown";
        const result = await refreshTokens({ refreshToken, userAgent, ip: req.ip });

        const { accessToken, refreshToken: newRefreshToken } = result;

        res.cookie("accessToken", accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie("refreshToken", newRefreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_MAX_AGE,
            path: "/api/auth",
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function logoutController(req, res, next) {
    try {
        const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
        await logout({ refreshToken });

        res.clearCookie("accessToken", { ...COOKIE_OPTIONS, path: "/" });
        res.clearCookie("refreshToken", { ...COOKIE_OPTIONS, path: "/api/auth" });

        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function getSessionsController(req, res, next) {
    try {
        const userId = req.user._id;
        const sessions = await getUserSessions({ userId });
        res.json(sessions);
    } catch (err) {
        next(err);
    }
}

export async function revokeSessionController(req, res, next) {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        await revokeSession({ id, userId });
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function resendOtpController(req, res, next) {
    try {
        const { email } = req.body;
        const result = await resendOtp({ email, ip: req.ip });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

// Development-only: Peek at OTP for console notification
export async function getDevOtpController(req, res, next) {
    try {
        // Only allow in development
        if (config.env !== "development") {
            return res.status(404).json({ error: "Not found" });
        }

        const { email } = req.params;
        const record = await getOtp({ identifier: email });

        if (!record) {
            return res.status(404).json({ error: "OTP not found" });
        }

        res.json({ code: record.code });
    } catch (err) {
        next(err);
    }
}
