import api from "@/api/client";

export const statsApi = {
    getMyStats: () => api.get("/stats/me").then((res) => res.data),
};
