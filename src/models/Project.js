// A project always belongs to one client.
// Invoices are written for a project (see Invoice.js).
export class Project {
    constructor(id, name, client) {
        this.id = id;
        this.name = name;
        this.client = client;
    }
}