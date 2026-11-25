import { Invoice } from "../models/Invoice.js";
import { stateFromName } from "../models/states/stateFromName.js";
import { billingFromData } from "../models/billing/billingFromData.js";

// Handles everything the invoices page asks for: creating invoices, listing them,
// changing their status, the overdue check, and adding a late fee or a discount.
// The storage, the factory and the InvoiceBook are passed in from main.js.
// After every change it tells the InvoiceBook, and the book tells the tables (Observer).
export class InvoiceController {
    constructor(store, factory, book) {
        this.store = store;
        this.factory = factory;
        this.book = book;
    }

    // localStorage only gives back plain data, without the Invoice methods.
    // This turns a saved invoice back into a real Invoice object,
    // and gives it back its state object (from the saved status name)
    // and its billing object (with any fee or discount wrapped around it).
    toInvoice(plain) {
        const invoice = Object.assign(Object.create(Invoice.prototype), plain);
        invoice.setState(stateFromName(plain.status));
        // Invoices saved before Strategy have no "billing" yet, only the old rate fields,
        // so for those we build the billing from the invoice itself.
        invoice.billing = billingFromData(plain.billing || plain);
        return invoice;
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

    // Saves and then tells every table that the invoices changed.
    saveAndNotify(data) {
        this.store.save(data);
        this.book.changed(data.invoices);
    }

    // Tells the tables about the invoices without changing anything.
    // main.js calls this once when the page opens, so the tables are filled.
    refresh() {
        this.book.changed(this.listInvoices());
    }

    // "form" holds what the user filled in on the page. The InvoiceFactory
    // makes the Invoice (and its billing object) and saves it.
    createInvoice(form) {
        const invoice = this.factory.add(form);
        this.refresh();
        return invoice;
    }

    listInvoices() {
        return this.loadData().invoices;
    }

    // The invoice's current state decides if the move is allowed. If it is not,
    // it throws an error and we don't save anything.
    changeStatus(invoiceId, newStatus) {
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.changeStatus(newStatus);
        this.saveAndNotify(data);
        return invoice;
    }

    applyLateFee(invoiceId, amount) {
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.applyLateFee(amount);
        this.saveAndNotify(data);
        return invoice.calculateTotal();
    }

    applyDiscount(invoiceId, percent) {
        // A discount has to be a number from 0 to 100.
        if (isNaN(percent) || percent < 0 || percent > 100) {
            throw new Error("invalid discount");
        }
        const data = this.loadData();
        const invoice = this.findInvoice(data, invoiceId);
        invoice.applyDiscount(percent);
        this.saveAndNotify(data);
        return invoice.calculateTotal();
    }

    // Goes through every invoice and marks the late ones as overdue.
    // "today" comes from the date field on the page, so we can test with any date.
    runOverdueCheck(today) {
        const data = this.loadData();
        for (const invoice of data.invoices) {
            invoice.checkOverdue(today);
        }
        this.saveAndNotify(data);
        return data.invoices;
    }
}