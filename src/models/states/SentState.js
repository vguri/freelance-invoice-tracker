import { InvoiceState } from "./InvoiceState.js";
import { PaidState } from "./PaidState.js";
import { OverdueState } from "./OverdueState.js";

// The client has the invoice and we are waiting for the money.
// From here it can be paid, or become overdue when the due date passes.
export class SentState extends InvoiceState {
    constructor() {
        super("SENT");
    }

    pay(invoice) {
        invoice.setState(new PaidState());
    }

    markOverdue(invoice) {
        invoice.setState(new OverdueState());
    }
}
