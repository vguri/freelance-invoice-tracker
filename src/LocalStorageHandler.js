// Saves and loads all our data in the browser's localStorage.
// Everything (clients, projects, invoices) is kept under one key as a JSON string.
export class LocalStorageHandler {
  constructor(key) {
    this.key = key; // the name our data is saved under
  }

  // Reads the saved data. The first time there is nothing saved yet, 
  // so we start with empty lists and id 1.
  load() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      return JSON.parse(raw);
    }
    return { nextId: 1, clients: [], projects: [], invoices: [] };
  }

  // Writes the whole data object back, so it is still there after a refresh.
  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}