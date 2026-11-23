import { LocalStorageHandler } from "../LocalStorageHandler.js";
import { Project } from "../models/Project.js";

// Handles what the projects page asks for: adding a project and listing them.
export class ProjectController {
    constructor() {
        this.store = new LocalStorageHandler("freelance-invoice-tracker");
    }

    createProject(name, clientId) {
        const data = this.store.load();
        // A project can only be added for a client that already exists.
        const client = data.clients.find(c => c.id === clientId);
        if (!client) {
            throw new Error("client not found");
        }
        if (!name) {
            throw new Error("project name is required");
        }
        const project = new Project(data.nextId++, name, client);
        data.projects.push(project);
        this.store.save(data);
        return project;
    }

    listProjects() {
        return this.store.load().projects;
    }
}