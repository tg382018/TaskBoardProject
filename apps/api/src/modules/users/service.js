import { findUserById } from "./repository.js";
import { deleteSession, deleteUserSessions } from "../auth/repository.js"; // Session silme auth repoda

export async function getMe(userId) {
    const user = await findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
}

// B1-T4: Sessions listeleme (ileride Profile UI için)
// Not: Gerçekte Session modelini buradan da query edebiliriz.
import { Session } from "../auth/repository.js"; // Repository export ediyorsa
export async function getUserSessions(userId) {
    return Session.find({ userId }).select("-refreshToken");
}

export async function clearSession(refreshToken) {
    return deleteSession({ refreshToken });
}

export async function clearAllSessions(userId) {
    return deleteUserSessions({ userId });
}
