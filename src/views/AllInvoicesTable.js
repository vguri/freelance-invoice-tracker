import { euro, escapeHtml } from "./format.js";
// An observer: the main table with every invoice and the action buttons.
// update() is called by the InvoiceBook whenever the invoices change.
export class AllInvoicesTable {

    constructor(tbodyId) {

        this.tbody = document.getElementById(tbodyId);

    }

    update(invoices) {

        const rows = invoices.map(inv =>

            "<tr>" +

            "<td>" + inv.id + "</td>" +

            "<td>" + escapeHtml(inv.project.name) + '<br><span class="muted">' + escapeHtml(inv.project.client.name) + "</span></td>" +

            // The billing object describes itself, for example "Fixed €1,000 + late fee €50 − 10%".

            "<td>" + inv.billing.describe() + "</td>" +

            "<td>" + inv.dueDate + "</td>" +

            '<td><span class="status ' + inv.status + '">' + inv.status + "</span></td>" +

            "<td><b>" + euro(inv.calculateTotal()) + "</b></td>" +

            '<td><div class="actions">' +

            '<button data-act="SENT" data-id="' + inv.id + '">Send</button>' +

            '<button data-act="PAID" data-id="' + inv.id + '">Mark paid</button>' +

            '<input class="small" type="number" placeholder="€ fee" id="fee-' + inv.id + '">' +

            '<button class="light" data-act="fee" data-id="' + inv.id + '">Add late fee</button>' +

            '<input class="small" type="number" placeholder="%" id="disc-' + inv.id + '">' +

            '<button class="light" data-act="discount" data-id="' + inv.id + '">Apply discount</button>' +

            "</div></td></tr>");

        this.tbody.innerHTML = rows.join("") || '<tr><td colspan="7" class="muted">No invoices yet.</td></tr>';

    }
}
