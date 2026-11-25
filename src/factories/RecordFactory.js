// The parent class for creating clients, projects and invoices (Factory Method pattern).
// add() does the steps that are the same for all three: load the data, give the new
// record the next free id, put it in the right list and save.
// The one step that is different, actually making the object, is the factory method
// createRecord(). Each subclass writes its own version of it.
export class RecordFactory {
    constructor(store, listName) {
        this.store = store;        // the shared LocalStorageHandler, passed in from main.js
        this.listName = listName;  // "clients", "projects" or "invoices"
    }

    add(fields) {
        const data = this.store.load();
        const record = this.createRecord(data.nextId, fields, data);
        data.nextId++;
        data[this.listName].push(record);
        this.store.save(data);
        return record;
    }

    // The factory method. "data" is everything saved, for subclasses that need to
    // look something up first (a project needs its client, an invoice its project).
    createRecord(id, fields, data) {
        throw new Error("createRecord() is not written for " + this.listName);
    }
}