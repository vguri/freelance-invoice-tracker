// Handles what the projects page asks for: adding a project and listing them.
// The storage and the factory are passed in from main.js (Dependency Inversion).
export class ProjectController {
    constructor(store, factory) {
        this.store = store;
        this.factory = factory;
    }

    createProject(name, clientId) {
        return this.factory.add({ name, clientId });
    }

    listProjects() {
        return this.store.load().projects;
    }
}