import * as service from "./service.js";

export async function createProjectController(req, res, next) {
    try {
        const { title, description } = req.body;
        const project = await service.createNewProject({
            title,
            description,
            ownerId: req.user._id,
        });
        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
}

import { getPagination } from "../../utils/pagination.js";

export async function listProjectsController(req, res, next) {
    try {
        const { search, sortBy, sortOrder } = req.query;
        const { page, limit, skip } = getPagination(req.query);
        const projects = await service.getMyProjects(req.user._id, {
            page,
            limit,
            skip,
            search: search || "",
            sortBy: sortBy || "createdAt",
            sortOrder: sortOrder || "desc"
        });
        res.json(projects);
    } catch (err) {
        next(err);
    }
}

export async function getProjectController(req, res, next) {
    try {
        const project = await service.getProjectDetail(req.params.id, req.user._id);
        res.json(project);
    } catch (err) {
        next(err);
    }
}

export async function updateProjectController(req, res, next) {
    try {
        const project = await service.updateExistingProject(
            req.params.id,
            req.user._id,
            req.body
        );
        res.json(project);
    } catch (err) {
        next(err);
    }
}

export async function deleteProjectController(req, res, next) {
    try {
        await service.removeProject(req.params.id, req.user._id);
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

export async function addMemberController(req, res, next) {
    try {
        const project = await service.inviteMemberToProject(
            req.params.id,
            req.user._id,
            req.body
        );
        res.json(project);
    } catch (err) {
        next(err);
    }
}
