import { InvoiceState } from "./InvoiceState.js";
import { PaidState } from "./PaidState.js";

// The due date has passed and the client has not paid.
// It can still be paid, and this is the only status where a late fee is allowed.
export class OverdueState extends InvoiceState {
    constructor() {
        super("OVERDUE");
    }

    pay(invoice) {
        invoice.setState(new PaidState());
    }

    canAddLateFee() {
        return true;
    }
}
