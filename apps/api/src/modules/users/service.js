import { findUserById, updateUser } from "./repository.js";

export async function getMe(userId) {
    const user = await findUserById(userId);
    if (!user) throw new Error("User not found");
    return user;
}

// Sessions yönetimi auth modülünde

export async function updateUserProfile(userId, data) {
    return updateUser(userId, data);
}
