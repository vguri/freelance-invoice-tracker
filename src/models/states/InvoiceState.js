// The parent class for every invoice status (State pattern).
// Each status is its own class and decides two things:
//   1. which moves are allowed from it (send, pay, mark overdue)
//   2. if a late fee or a discount can be added while the invoice is in it
// By default a move is not allowed, so each status only writes the moves it allows.
export class InvoiceState {
    constructor(name) {
        // "DRAFT", "SENT", "PAID" or "OVERDUE". Saved with the invoice and shown on the page.
        this.name = name;
    }

    send(invoice) {
        throw new Error("illegal status change: " + this.name + " to SENT");
    }

    pay(invoice) {
        throw new Error("illegal status change: " + this.name + " to PAID");
    }

    // Called by the overdue check. Only a SENT invoice can become overdue,
    // so for the other statuses nothing happens.
    markOverdue(invoice) {
    }

    // Risk 2 from Part 1: the status decides which fees are allowed.
    canAddLateFee() {
        return false;
    }

    canApplyDiscount() {
        return true;
    }
}
