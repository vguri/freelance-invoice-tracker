import { BillingStrategy } from "./BillingStrategy.js";
import { money } from "./money.js";

// Billing by the hour: rate times hours worked.
export class HourlyStrategy extends BillingStrategy {
    constructor(hourlyRate, hoursLogged) {
        super("HOURLY");
        this.hourlyRate = hourlyRate;
        this.hoursLogged = hoursLogged;
    }

    calculateTotal() {
        return this.hourlyRate * this.hoursLogged;
    }

    describe() {
        return "Hourly " + money(this.hourlyRate) + " × " + this.hoursLogged + "h";
    }
}