import api from "@/app/api/client";

export const statsApi = {
    getMyStats: () => api.get("/stats/me").then((res) => res.data),
};
