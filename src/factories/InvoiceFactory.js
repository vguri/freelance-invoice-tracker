import { RecordFactory } from "./RecordFactory.js";
import { Invoice } from "../models/Invoice.js";
import { billingFromData } from "../models/billing/billingFromData.js";

// Makes Invoice objects. It finds the project, and turns the billing type and
// rates from the form into a billing object (Hourly, Fixed or Retainer).
export class InvoiceFactory extends RecordFactory {
    constructor(store) {
        super(store, "invoices");
    }

    createRecord(id, form, data) {
        const project = data.projects.find(p => p.id === form.projectId);
        if (!project) {
            throw new Error("project not found");
        }
        const billing = billingFromData(form);
        return new Invoice(id, project, form.issueDate, form.dueDate, billing);
    }
}