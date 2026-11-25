import { InvoiceState } from "./InvoiceState.js";

// The invoice is paid, so it is finished.
// No more moves, and no late fee or discount can be added anymore.
export class PaidState extends InvoiceState {
    constructor() {
        super("PAID");
    }

    canApplyDiscount() {
        return false;
    }
}
