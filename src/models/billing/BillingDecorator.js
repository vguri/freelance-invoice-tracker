import { BillingStrategy } from "./BillingStrategy.js";

// The parent class for anything that changes a total on top of the billing (Decorator pattern).
// It wraps another BillingStrategy ("inner") and is a BillingStrategy itself,
// so decorators can be stacked: a discount can wrap a late fee that wraps the hourly billing.
export class BillingDecorator extends BillingStrategy {
    constructor(billingType, inner) {
        super(billingType);
        this.inner = inner;
    }

    // By default a decorator changes nothing. The subclasses change the total.
    calculateTotal() {
        return this.inner.calculateTotal();
    }

    describe() {
        return this.inner.describe();
    }
}