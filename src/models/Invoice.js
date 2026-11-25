import { DraftState } from "./states/DraftState.js";
import { LateFeeDecorator } from "./billing/LateFeeDecorator.js";
import { DiscountDecorator } from "./billing/DiscountDecorator.js";

// An invoice the freelancer sends a client for one project.
// Invoice now only keeps its own data and asks two helper objects:
//   - its state (states folder, State pattern) for the status rules
//   - its billing (billing folder, Strategy pattern) for the total,
//     which can be wrapped in a late fee or a discount (Decorator pattern)
export class Invoice {
    // Only 5 parameters now: the rates and hours live inside the billing object.
    constructor(id, project, issueDate, dueDate, billing) {
        this.id = id;
        this.project = project;
        this.issueDate = issueDate;
        this.dueDate = dueDate;

        // Hourly, Fixed or Retainer (a BillingStrategy).
        this.billing = billing;

        // Every new invoice starts as a draft.
        this.setState(new DraftState());
    }

    // The states call this to move the invoice to a new status.
    // We also keep the name in "status", so the page can show it and localStorage can save it.
    setState(state) {
        this.state = state;
        this.status = state.name;
    }

    // No switch and no flags anymore: the billing object works out the total,
    // including any late fee or discount wrapped around it.
    calculateTotal() {
        return this.billing.calculateTotal();
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

    // The state decides if a late fee is allowed (only OVERDUE, Risk 2).
    // If it is, we wrap the billing in a LateFeeDecorator.
    applyLateFee(amount) {
        if (!this.state.canAddLateFee()) {
            throw new Error("a late fee can only be added to an OVERDUE invoice");
        }
        this.billing = new LateFeeDecorator(this.billing, amount);
    }

    // The state decides if a discount is allowed (not when PAID).
    // If it is, we wrap the billing in a DiscountDecorator.
    // The controller checks the percent is between 0 and 100.
    applyDiscount(percent) {
        if (!this.state.canApplyDiscount()) {
            throw new Error("a " + this.status + " invoice can't get a discount");
        }
        this.billing = new DiscountDecorator(this.billing, percent);
    }

    // Short text for the invoice, for example "Invoice #3 for Website redesign (DRAFT)".
    toDisplayString() {
        return "Invoice #" + this.id + " for " + this.project.name + " (" + this.status + ")";
    }
}