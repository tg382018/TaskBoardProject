import {
    getOtp,
    deleteOtp,
    incrementAttempts,
    createSession,
    findSessionByToken,
    deleteSession,
    getSessionsByUser,
    deleteSessionById,
} from "./repository.js";
import { findUserByEmail, User } from "../users/repository.js";
import { publishOtpRequested } from "./events.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcrypt";

const MAX_ATTEMPTS = 5;

/**
 * Requests OTP generation via Worker (StubAuthProvider)
 * OTP is generated and stored in Redis by the Worker
 */
async function requestOtp(email, _ip) {
    await publishOtpRequested({
        channel: "email",
        to: email,
        requestedFromIp: _ip,
    });
}

export async function register({ email, password, name }) {
    let user = await findUserByEmail(email);

    // Eğer kullanıcı varsa ve zaten şifresi/ismi set edilmişse (tam kayıtlıysa) hata ver
    if (user && user.password) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
        // Yeni kullanıcı
        user = await User.create({
            email,
            password: hashedPassword,
            name,
            isVerified: true, // Hemen doğrulanmış sayıyoruz ki login flow'a geçebilsin
        });
    } else {
        // Shadow user güncelleme
        user.password = hashedPassword;
        user.name = name;
        user.isVerified = true;
        await user.save();
    }

    // Kayıt tamamlandı - OTP sadece login'de gönderilecek
    return { ok: true, message: "Registration successful. Please login." };
}

export async function login({ email, password, ip }) {
    const user = await findUserByEmail(email);
    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your account first");
    }

    await requestOtp(email, ip);
    return { ok: true, message: "OTP sent for login verification" };
}

export async function resendOtp({ email, ip }) {
    if (!email) throw new Error("Email is required");

    // Kullanıcı kontrolü: Var olmayan bir email için OTP gönderilmeli mi?
    // Güvenlik açısından (user enumeration) burada hata vermeyip "gönderildi" diyebiliriz
    // Ancak basitlik ve UX için şimdilik kullanıcıyı kontrol ediyoruz.
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    // Eğer kullanıcı varsa ama verify olmamışsa (register aşamasında) -> Gönder
    // Eğer kullanıcı verify olmuşsa (login aşamasında) -> Gönder

    await requestOtp(email, ip);
    return { ok: true, message: "OTP resent successfully" };
}

export async function verifyOtp({ email, code, userAgent, ip }) {
    if (!email || !code) throw new Error("email and code are required");

    const record = await getOtp({ identifier: email });
    if (!record) {
        throw new Error("OTP invalid or expired");
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        throw new Error("Too many attempts");
    }

    if (record.code !== code) {
        await incrementAttempts({ identifier: email });
        throw new Error("OTP invalid or expired");
    }

    await deleteOtp({ identifier: email });

    const user = await findUserByEmail(email);
    if (!user) throw new Error("User not found");

    // Onaylanmamışsa onayla (Register akışı için)
    if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
    }

    // Token'ları üret
    const accessToken = signAccessToken({ sub: user._id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    await createSession({
        userId: user._id,
        refreshToken,
        userAgent,
        ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
    });

    return { accessToken, refreshToken, user };
}

export async function refreshTokens({ refreshToken, userAgent = "Unknown", ip = "" }) {
    if (!refreshToken) throw new Error("Refresh token required");

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error("Invalid or expired refresh token");

    const session = await findSessionByToken({ refreshToken });
    if (!session) throw new Error("Session not found");

    // Eski session'ı sil (rotasyon)
    await deleteSession({ refreshToken });

    const user = session.userId;
    const newAccessToken = signAccessToken({ sub: user._id, email: user.email, role: user.role });
    const newRefreshToken = signRefreshToken({ sub: user._id });

    await createSession({
        userId: user._id,
        refreshToken: newRefreshToken,
        userAgent,
        ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
}

export async function logout({ refreshToken }) {
    if (!refreshToken) return;
    await deleteSession({ refreshToken });
}

export async function getUserSessions({ userId }) {
    return getSessionsByUser({ userId });
}

export async function revokeSession({ id, userId }) {
    return deleteSessionById({ id, userId });
}
