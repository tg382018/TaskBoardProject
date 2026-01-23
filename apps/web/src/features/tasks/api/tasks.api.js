import client from "@/api/client";

export const tasksApi = {
    getAll: (projectId, params) => client.get("/tasks", { params: { projectId, ...params } }).then((res) => res.data),
    getById: (id) => client.get(`/tasks/${id}`).then((res) => res.data),
    create: (data) => client.post("/tasks", data).then((res) => res.data),
    update: (id, data) => client.patch(`/tasks/${id}`, data).then((res) => res.data),
    addComment: (taskId, content) =>
        client.post("/comments", { taskId, content }).then((res) => res.data),
    delete: (id) => client.delete(`/tasks/${id}`).then((res) => res.data),
};
