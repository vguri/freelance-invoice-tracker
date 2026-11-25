import { DraftState } from "./states/DraftState.js";

// An invoice the freelancer sends a client for one project.
// It keeps the dates, how the work is billed, and any late fee or discount,
// and it works out its own total.
// The status rules are not in here anymore: each status is its own class
// in the states folder (State pattern), and the invoice just asks its current state.
export class Invoice {
    constructor(id, project, issueDate, dueDate, billingType,
        hourlyRate, hoursLogged, fixedAmount, monthlyRate, months) {
        this.id = id;
        this.project = project;
        this.issueDate = issueDate;
        this.dueDate = dueDate;

        // Every new invoice starts as a draft.
        this.setState(new DraftState());

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

    // The states call this to move the invoice to a new status.
    // We also keep the name in "status", so the page can show it and localStorage can save it.
    setState(state) {
        this.state = state;
        this.status = state.name;
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

    // The two buttons on the page. The current state decides if the move is allowed,
    // and throws an error if it is not (for example PAID -> SENT).
    send() {
        this.state.send(this);
    }

    pay() {
        this.state.pay(this);
    }

    // The page sends "SENT" or "PAID", so this picks the matching move.
    changeStatus(newStatus) {
        if (newStatus === "SENT") {
            this.send();
        } else if (newStatus === "PAID") {
            this.pay();
        } else {
            throw new Error("unknown status: " + newStatus);
        }
    }

    // If the due date has passed, we tell the state. Only a SENT invoice
    // actually becomes OVERDUE, the other states ignore it.
    checkOverdue(today) {
        if (today > new Date(this.dueDate)) {
            this.state.markOverdue(this);
        }
    }

    // Adds a late fee to the total, but only if the current state allows it
    // (only OVERDUE does). This fixes Risk 2: a PAID invoice can't get a fee anymore.
    applyLateFee(amount) {
        if (!this.state.canAddLateFee()) {
            throw new Error("a late fee can only be added to an OVERDUE invoice");
        }
        this.hasLateFee = true;
        this.lateFeeAmount = amount;
    }

    // Takes a percentage off the total (the controller checks it is between 0 and 100).
    // A PAID invoice can't get a discount anymore.
    applyDiscount(percent) {
        if (!this.state.canApplyDiscount()) {
            throw new Error("a " + this.status + " invoice can't get a discount");
        }
        this.hasDiscount = true;
        this.discountPercent = percent;
    }

    // Short text for the invoice, for example "Invoice #3 for Website redesign (DRAFT)".
    toDisplayString() {
        return "Invoice #" + this.id + " for " + this.project.name + " (" + this.status + ")";
    }
}
