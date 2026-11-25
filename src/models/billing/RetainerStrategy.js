import { BillingStrategy } from "./BillingStrategy.js";
import { money } from "./money.js";

// A monthly retainer: the same amount every month, times the number of months.
export class RetainerStrategy extends BillingStrategy {
    constructor(monthlyRate, months) {
        super("RETAINER");
        this.monthlyRate = monthlyRate;
        this.months = months;
    }

    calculateTotal() {
        return this.monthlyRate * this.months;
    }

    describe() {
        return "Retainer " + money(this.monthlyRate) + " × " + this.months + " months";
    }
}