import { HourlyStrategy } from "./HourlyStrategy.js";
import { FixedStrategy } from "./FixedStrategy.js";
import { RetainerStrategy } from "./RetainerStrategy.js";
import { LateFeeDecorator } from "./LateFeeDecorator.js";
import { DiscountDecorator } from "./DiscountDecorator.js";

// Builds the right billing object from plain data.
// We use it in two places:
//   - when a new invoice is created from the form (billingType + the rate fields)
//   - when an invoice is loaded from localStorage, which only keeps plain data.
//     A decorator is saved with the billing it wraps inside "inner",
//     so we rebuild the inside first and wrap it again.
const builders = {
    HOURLY: d => new HourlyStrategy(d.hourlyRate, d.hoursLogged),
    FIXED: d => new FixedStrategy(d.fixedAmount),
    RETAINER: d => new RetainerStrategy(d.monthlyRate, d.months),
    LATE_FEE: d => new LateFeeDecorator(billingFromData(d.inner), d.amount),
    DISCOUNT: d => new DiscountDecorator(billingFromData(d.inner), d.percent)
};

export function billingFromData(data) {
    const build = builders[data.billingType];
    if (!build) {
        throw new Error("unknown billing type: " + data.billingType);
    }
    return build(data);
}