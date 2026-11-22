import { LocalStorageHandler } from "../LocalStorageHandler.js";
import { Client } from "../models/Client.js";

// Handles what the clients page asks for: adding a client and listing them.
export class ClientController {
    constructor() {
        // For now this controller makes its own storage object.
        // Each controller does the same, which we want to change later (DIP).
        this.store = new LocalStorageHandler("freelance-invoice-tracker");
    }

    createClient(name, email) {
        // Both fields are required, otherwise we stop and the page shows the error.
        if (!name || !email) {
            throw new Error("name and email are required");
        }
        const data = this.store.load();
        // Each new client gets the next free id.
        const client = new Client(data.nextId++, name, email);
        data.clients.push(client);
        this.store.save(data);
        return client;
    }

    listClients() {
        return this.store.load().clients;
    }
}