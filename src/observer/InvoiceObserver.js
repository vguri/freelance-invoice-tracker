// The Observer role in the Observer pattern.
// Every table that wants to hear about invoice changes extends this class
// and writes its own update(). The InvoiceBook only calls update(),
// so it doesn't need to know which kind of table it is talking to.
export class InvoiceObserver {
    update(invoices) {
        throw new Error("update() is not written for this observer");
    }
}