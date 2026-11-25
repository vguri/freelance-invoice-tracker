import { RecordFactory } from "./RecordFactory.js";
import { Project } from "../models/Project.js";

// Makes Project objects. A project can only be made for a client that already exists.
export class ProjectFactory extends RecordFactory {
    constructor(store) {
        super(store, "projects");
    }

    createRecord(id, fields, data) {
        const client = data.clients.find(c => c.id === fields.clientId);
        if (!client) {
            throw new Error("client not found");
        }
        if (!fields.name) {
            throw new Error("project name is required");
        }
        return new Project(id, fields.name, client);
    }
}