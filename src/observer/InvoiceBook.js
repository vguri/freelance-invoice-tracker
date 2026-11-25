// The subject in the Observer pattern.
// Tables that show invoices subscribe to it. Every time the invoices change,
// the controller calls changed(), and the book tells every subscribed table,
// so each table redraws itself. main.js doesn't have to redraw anything by hand.
export class InvoiceBook {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    changed(invoices) {
        for (const observer of this.observers) {
            observer.update(invoices);
        }
    }
}