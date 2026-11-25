import { InvoiceState } from "./InvoiceState.js";
import { SentState } from "./SentState.js";

// A new invoice that has not been sent to the client yet.
// The only move from here is sending it.
export class DraftState extends InvoiceState {
    constructor() {
        super("DRAFT");
    }

    send(invoice) {
        invoice.setState(new SentState());
    }
}
