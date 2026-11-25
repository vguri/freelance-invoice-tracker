// The parent class for every way of billing an invoice (Strategy pattern).
// Invoice only knows it has "a BillingStrategy" and calls calculateTotal() on it,
// so it doesn't need a switch on the billing type anymore.
// The fee and discount decorators are BillingStrategy objects too (Decorator pattern),
// so Invoice can't tell if its billing is wrapped or not.
export class BillingStrategy {
    constructor(billingType) {
        // "HOURLY", "FIXED", "RETAINER", "LATE_FEE" or "DISCOUNT".
        // Saved with the invoice, so we know which class to rebuild when it is loaded.
        this.billingType = billingType;
    }

    // Every subclass must write its own version of these two.
    calculateTotal() {
        throw new Error("calculateTotal() is not written for " + this.billingType);
    }

    // Short text for the Billing column on the invoices page.
    describe() {
        throw new Error("describe() is not written for " + this.billingType);
    }
}
