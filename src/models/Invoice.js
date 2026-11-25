// An invoice the freelancer sends a client for one project.
// It keeps the dates, the status (DRAFT, SENT, PAID or OVERDUE), how the work is billed,
// and any late fee or discount, and it works out its own total.
export class Invoice {
    constructor(id, project, issueDate, dueDate, billingType,
        hourlyRate, hoursLogged, fixedAmount, monthlyRate, months) {
        this.id = id;
        this.project = project;
        this.issueDate = issueDate;
        this.dueDate = dueDate;

        // Every new invoice starts as a draft.
        this.status = "DRAFT";

        // billingType is "HOURLY", "FIXED" or "RETAINER".
        // Only the fields for that type are used, the others stay 0.
        this.billingType = billingType;
        this.hourlyRate = hourlyRate;
        this.hoursLogged = hoursLogged;
        this.fixedAmount = fixedAmount;
        this.monthlyRate = monthlyRate;
        this.months = months;

        // No fee or discount until the freelancer adds one.
        this.hasLateFee = false;
        this.lateFeeAmount = 0;
        this.hasDiscount = false;
        this.discountPercent = 0;
    }

    // Works out what the client has to pay.
    // First the amount for the billing type, then the late fee is added,
    // and last the discount is taken off the whole thing (so it also lowers the fee).
    calculateTotal() {
        let total = 0;
        switch (this.billingType) {
            case "HOURLY":
                total = this.hourlyRate * this.hoursLogged;
                break;
            case "FIXED":
                total = this.fixedAmount;
                break;
            case "RETAINER":
                total = this.monthlyRate * this.months;
                break;
        }
        if (this.hasLateFee) {
            total += this.lateFeeAmount;
        }
        if (this.hasDiscount) {
            total -= total * this.discountPercent / 100;
        }
        return total;
    }

    // Moves the invoice to a new status, if that move is allowed:
    //   DRAFT -> SENT, SENT -> PAID, OVERDUE -> PAID
    // Any other move (for example PAID -> SENT) throws an error and nothing changes.
    changeStatus(newStatus) {
        if (this.status === "DRAFT" && newStatus === "SENT") {
            this.status = "SENT";
        } else if ((this.status === "SENT" || this.status === "OVERDUE") && newStatus === "PAID") {
            this.status = "PAID";
        } else {
            throw new Error("illegal status change: " + this.status + " to " + newStatus);
        }
    }

    // If the invoice was sent and the due date has passed, it becomes overdue.
    // Drafts and paid invoices are left alone.
    checkOverdue(today) {
        if (today > new Date(this.dueDate) && this.status === "SENT") {
            this.status = "OVERDUE";
        }
    }

    // Adds a late fee to the total.
    // Note: this does not look at the status, so a fee can still be added
    // to an invoice that is already PAID.
    applyLateFee(amount) {
        this.hasLateFee = true;
        this.lateFeeAmount = amount;
    }

    // Takes a percentage off the total (the controller checks it is between 0 and 100).
    applyDiscount(percent) {
        this.hasDiscount = true;
        this.discountPercent = percent;
    }

    // Short text for the invoice, for example "Invoice #3 for Website redesign (DRAFT)".
    toDisplayString() {
        return "Invoice #" + this.id + " for " + this.project.name + " (" + this.status + ")";
    }
}