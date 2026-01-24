import client from "@/app/api/client";

export const profileApi = {
    getProfile: () => client.get("/users/me").then((res) => res.data),
    updateProfile: (data) => client.patch("/users/me", data).then((res) => res.data),
    getSessions: () => client.get("/auth/sessions").then((res) => res.data),
    revokeSession: (id) => client.delete(`/auth/sessions/${id}`).then((res) => res.data),
};
