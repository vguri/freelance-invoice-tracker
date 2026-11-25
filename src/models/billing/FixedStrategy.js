import { BillingStrategy } from "./BillingStrategy.js";
import { money } from "./money.js";

// One fixed price for the whole project.
export class FixedStrategy extends BillingStrategy {
    constructor(fixedAmount) {
        super("FIXED");
        this.fixedAmount = fixedAmount;
    }

    calculateTotal() {
        return this.fixedAmount;
    }

    describe() {
        return "Fixed " + money(this.fixedAmount);
    }
}
