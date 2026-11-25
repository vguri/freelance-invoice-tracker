import { RecordFactory } from "./RecordFactory.js";
import { Client } from "../models/Client.js";

// Makes Client objects.
export class ClientFactory extends RecordFactory {
    constructor(store) {
        super(store, "clients");
    }

    createRecord(id, fields) {
        // Both fields are required, otherwise we stop and the page shows the error.
        if (!fields.name || !fields.email) {
            throw new Error("name and email are required");
        }
        return new Client(id, fields.name, fields.email);
    }
}