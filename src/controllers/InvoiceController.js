import { LocalStorageHandler } from "../LocalStorageHandler.js";
import { Invoice } from "../models/Invoice.js";

// Handles everything the invoices page asks for: creating invoices, listing them,
// changing their status, the overdue check, and adding a late fee or a discount.
export class InvoiceController {
    constructor() {
        this.store = new LocalStorageHandler("freelance-invoice-tracker");
    }

    // localStorage only gives back plain data, without the Invoice methods.
    // This turns a saved invoice back into a real Invoice object.
    toInvoice(plain) {
        return Object.assign(Object.create(Invoice.prototype), plain);
    }

    // Loads everything and turns the saved invoices back into Invoice objects.
    loadData() {
        const data = this.store.load();
        data.invoices = data.invoices.map(i => this.toInvoice(i));
        return data;
    }

    findInvoice(data, invoiceId) {
        const invoice = data.invoices.find(i => i.id === invoiceId);
        if (!invoice) {
            throw new Error("invoice not found");
        }
        return invoice;
    }

    // "form" holds what the user filled in on the page: the project, the dates,
    // the billing type and the rates.
    createInvoice(form) {
        const data = this.loadData();
        const project = data.projects.find(p => p.id === form.projectId);
        if (!project) {
            throw new Error("project not found");
        }
        const invoice = new Invoice(data.nextId++, project, form.issueDate, form.dueDate, form.billingType,
            form.hourlyRate, form.hoursLogged, form.fixedAmount, form.monthlyRate, form.months);
        invoice.calculateTotal();
        invoice.toDisplayString();
        data.invoices.push(invoice);
        this.store.save(data);
        return invoice;
    }

    listInvoices() {
        return this.loadData().invoices;
    }

    // The invoice itself decides if the move is allowed. If it is not,
    // it throws an error and we don't save anything.
    changeStatus(invoiceId, newStatus) {
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.changeStatus(newStatus);
        this.store.save(data);
        return invoice;
    }

    applyLateFee(invoiceId, amount) {
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.applyLateFee(amount);
        const total = invoice.calculateTotal();
        this.store.save(data);
        return total;
    }

    applyDiscount(invoiceId, percent) {
        // A discount has to be a number from 0 to 100.
        if (isNaN(percent) || percent < 0 || percent > 100) {
            throw new Error("invalid discount");
        }
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.applyDiscount(percent);
        const total = invoice.calculateTotal();
        this.store.save(data);
        return total;
    }

    // Goes through every invoice and marks the late ones as overdue.
    // "today" comes from the date field on the page, so we can test with any date.
    runOverdueCheck(today) {
        const data = this.loadData();
        for (const invoice of data.invoices) {
            invoice.checkOverdue(today);
        }
        this.store.save(data);
        return data.invoices;
    }
}
