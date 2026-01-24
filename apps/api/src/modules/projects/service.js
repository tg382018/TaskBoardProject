import * as repository from "./repository.js";
import { findOrCreateUser } from "../users/repository.js";
import { publishEvent } from "../../events/publisher.js";

export async function createNewProject({ title, description, ownerId }) {
    const project = await repository.createProject({
        title,
        description,
        ownerId,
        members: [ownerId], // Owner is automatically a member
    });

    // Publish project.created event for stats tracking
    await publishEvent("project.created", {
        type: "project.created",
        userId: ownerId,
        projectId: project._id.toString(),
        data: { title, description },
    });

    return project;
}

export async function getMyProjects(
    userId,
    { page = 1, limit = 10, skip = 0, search = "", sortBy = "createdAt", sortOrder = "desc" } = {}
) {
    const { data, total } = await repository.findProjectsByUserId(userId, {
        skip,
        limit,
        search,
        sortBy,
        sortOrder,
    });

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getProjectDetail(id, userId) {
    const project = await repository.findProjectById(id);
    if (!project) throw new Error("Project not found");

    // Check if user is owner or member - handle both populated objects and plain IDs
    const isOwner = String(project.ownerId?._id || project.ownerId) === String(userId);
    const isMember = project.members.some((m) => String(m?._id || m) === String(userId));

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

    // Publish project.deleted event for stats tracking
    await publishEvent("project.deleted", {
        type: "project.deleted",
        userId: userId,
        projectId: id,
        data: { title: deleted.title },
    });

    return deleted;
}

export async function inviteMemberToProject(id, ownerId, { email }) {
    const project = await repository.findProjectById(id);
    if (!project) throw new Error("Project not found");

    if (String(project.ownerId?._id || project.ownerId) !== String(ownerId)) {
        throw new Error("Unauthorized: Only owners can invite members");
    }

    const userToInvite = await findOrCreateUser({ email });
    // Note: We don't throw if user is not found anymore, as findOrCreateUser handles it.

    return repository.addMemberToProject(id, userToInvite._id);
}
