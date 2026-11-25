import { euro, escapeHtml } from "./format.js";
// An observer: a table that only shows the invoices with one status,
// for example only OVERDUE or only PAID. No buttons, it is just a list.
// We use it twice on the invoices page. A table for another status
// (for example SENT) would just be one more StatusTable in main.js.
export class StatusTable {

    constructor(tbodyId, status) {

        this.tbody = document.getElementById(tbodyId);

        this.status = status;

    }

    update(invoices) {

        const rows = invoices

            .filter(inv => inv.status === this.status)

            .map(inv =>

                "<tr>" +

                "<td>" + inv.id + "</td>" +

                "<td>" + escapeHtml(inv.project.name) + '<br><span class="muted">' + escapeHtml(inv.project.client.name) + "</span></td>" +

                "<td>" + inv.billing.describe() + "</td>" +

                "<td>" + inv.dueDate + "</td>" +

                "<td><b>" + euro(inv.calculateTotal()) + "</b></td>" +

                "</tr>");

        this.tbody.innerHTML = rows.join("") ||

            '<tr><td colspan="5" class="muted">No ' + this.status.toLowerCase() + " invoices.</td></tr>";

    }
}
