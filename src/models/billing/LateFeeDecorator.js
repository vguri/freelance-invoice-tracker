import { BillingDecorator } from "./BillingDecorator.js";
import { money } from "./money.js";

// Adds a late fee on top of whatever it wraps.
export class LateFeeDecorator extends BillingDecorator {
    constructor(inner, amount) {
        super("LATE_FEE", inner);
        this.amount = amount;
    }

    calculateTotal() {
        return this.inner.calculateTotal() + this.amount;
    }

    describe() {
        return this.inner.describe() + " + late fee " + money(this.amount);
    }
}