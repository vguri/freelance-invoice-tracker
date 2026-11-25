// Handles what the clients page asks for: adding a client and listing them.
// The storage and the factory are passed in from main.js (Dependency Inversion),
// so this controller doesn't create its own storage and doesn't call "new Client" itself.
export class ClientController {
    constructor(store, factory) {
        this.store = store;
        this.factory = factory;
    }

    createClient(name, email) {
        return this.factory.add({ name, email });
    }

    listClients() {
        return this.store.load().clients;
    }
}