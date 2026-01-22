import { register, login, verifyOtp, refreshTokens, logout } from "./service.js";

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
        const result = await verifyOtp({ email, code, ip: req.ip });

        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function refreshController(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const result = await refreshTokens({ refreshToken });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function logoutController(req, res, next) {
    try {
        const { refreshToken } = req.body;
        await logout({ refreshToken });
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}