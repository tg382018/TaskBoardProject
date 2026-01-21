import { requestOtp, verifyOtp, refreshTokens, logout } from "./service.js";

export async function requestOtpController(req, res, next) {
    try {
        const { email } = req.body;
        await requestOtp({ email, ip: req.ip });
        res.json({ ok: true });
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