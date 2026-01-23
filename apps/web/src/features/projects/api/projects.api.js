import client from "@/api/client";

export const projectsApi = {
    getAll: () => client.get("/projects").then((res) => res.data),
    getById: (id) => client.get(`/projects/${id}`).then((res) => res.data),
    create: (data) => client.post("/projects", data).then((res) => res.data),
    addMember: (projectId, email) =>
        client.post(`/projects/${projectId}/members`, { email }).then((res) => res.data),
    delete: (id) => client.delete(`/projects/${id}`).then((res) => res.data),
};
