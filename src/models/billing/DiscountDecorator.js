import { BillingDecorator } from "./BillingDecorator.js";

// Takes a percentage off whatever it wraps.
// If it wraps a late fee, the discount lowers the fee too.
export class DiscountDecorator extends BillingDecorator {
    constructor(inner, percent) {
        super("DISCOUNT", inner);
        this.percent = percent;
    }

    calculateTotal() {
        const total = this.inner.calculateTotal();
        return total - total * this.percent / 100;
    }

    describe() {
        return this.inner.describe() + " − " + this.percent + "%";
    }
}