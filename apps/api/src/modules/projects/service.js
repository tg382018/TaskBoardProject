import * as repository from "./repository.js";

export async function createNewProject({ title, description, ownerId }) {
    return repository.createProject({
        title,
        description,
        ownerId,
        members: [ownerId], // Owner is automatically a member
    });
}

export async function getMyProjects(userId) {
    return repository.findProjectsByUserId(userId);
}

export async function getProjectDetail(id, userId) {
    const project = await repository.findProjectById(id);
    if (!project) throw new Error("Project not found");

    // Check if user is owner or member
    const isOwner = String(project.ownerId) === String(userId);
    const isMember = project.members.some((m) => String(m) === String(userId));

    if (!isOwner && !isMember) {
        throw new Error("Unauthorized: You do not have access to this project");
    }

    return project;
}

export async function updateExistingProject(id, userId, data) {
    const updated = await repository.updateProject(id, userId, data);
    if (!updated) throw new Error("Project not found or unauthorized");
    return updated;
}

export async function removeProject(id, userId) {
    const deleted = await repository.deleteProject(id, userId);
    if (!deleted) throw new Error("Project not found or unauthorized");
    return deleted;
}
