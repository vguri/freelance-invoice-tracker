// The starting point of the app. It connects the three pages
// (clients.html, projects.html, invoices.html) to the controllers.
// Every page loads this same file, and each part below only runs on the page that has its form.
import { ClientController } from "./controllers/ClientController.js";
import { ProjectController } from "./controllers/ProjectController.js";
import { InvoiceController } from "./controllers/InvoiceController.js";
const clientController = new ClientController();
const projectController = new ProjectController();
const invoiceController = new InvoiceController();
// ---------- small helpers ----------
// Shows a green (ok) or red (error) message at the top of the page.
function showMessage(text, ok) {

    const box = document.getElementById("message");

    box.textContent = text;

    box.className = "message " + (ok ? "ok" : "error");
}
// Runs one user action. If the controller throws an error, it is shown on the page.
function run(action) {

    try {

        return action();

    } catch (e) {

        showMessage(e.message, false);

        return undefined;

    }
}
// 1050 -> "€1,050"
function euro(n) {

    return "€" + Number(n).toLocaleString("en", { maximumFractionDigits: 2 });
}
// Makes text safe to put inside the page, so a name like "<b>" is shown as text.
function escapeHtml(s) {

    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
// A date as "2026-11-22", the format the date fields use.
function dateText(date) {

    return date.toISOString().slice(0, 10);
}
// Reads a number field. An empty field counts as 0.
function num(id) {

    return Number(document.getElementById(id).value) || 0;
}
// ---------- clients.html ----------
const clientForm = document.getElementById("client-form");
if (clientForm) {

    // Redraws the client table from what is saved.

    function renderClients() {

        const rows = clientController.listClients().map(c =>

            "<tr><td>" + c.id + "</td><td>" + escapeHtml(c.name) + "</td><td>" + escapeHtml(c.email) + "</td></tr>");

        document.getElementById("client-list").innerHTML =

            rows.join("") || '<tr><td colspan="3" class="muted">No clients yet.</td></tr>';

    }

    clientForm.addEventListener("submit", e => {

        e.preventDefault();

        const name = document.getElementById("client-name").value.trim();

        const email = document.getElementById("client-email").value.trim();

        const client = run(() => clientController.createClient(name, email));

        if (client) {

            showMessage("Client \"" + client.name + "\" added.", true);

            clientForm.reset();

            renderClients();

        }

    });

    renderClients();
}
// ---------- projects.html ----------
const projectForm = document.getElementById("project-form");
if (projectForm) {

    // Fills the client dropdown and redraws the project table.

    function renderProjects() {

        const clients = clientController.listClients();

        document.getElementById("project-client").innerHTML = clients.length

            ? clients.map(c => '<option value="' + c.id + '">' + escapeHtml(c.name) + "</option>").join("")

            : '<option value="">Add a client first</option>';

        const rows = projectController.listProjects().map(p =>

            "<tr><td>" + p.id + "</td><td>" + escapeHtml(p.name) + "</td><td>" + escapeHtml(p.client.name) + "</td></tr>");

        document.getElementById("project-list").innerHTML =

            rows.join("") || '<tr><td colspan="3" class="muted">No projects yet.</td></tr>';

    }

    projectForm.addEventListener("submit", e => {

        e.preventDefault();

        const clientId = Number(document.getElementById("project-client").value);

        const name = document.getElementById("project-name").value.trim();

        const project = run(() => projectController.createProject(name, clientId));

        if (project) {

            showMessage("Project \"" + project.name + "\" added for " + project.client.name + ".", true);

            document.getElementById("project-name").value = "";

            renderProjects();

        }

    });

    renderProjects();
}
// ---------- invoices.html ----------
const invoiceForm = document.getElementById("invoice-form");
if (invoiceForm) {

    const typeSelect = document.getElementById("inv-type");

    // Default dates: issued today, due in 14 days.

    document.getElementById("inv-issue").value = dateText(new Date());

    document.getElementById("inv-due").value = dateText(new Date(Date.now() + 14 * 86400000));

    document.getElementById("today").value = dateText(new Date());

    // Show only the rate fields for the chosen billing type.

    typeSelect.addEventListener("change", () => {

        for (const type of ["HOURLY", "FIXED", "RETAINER"]) {

            document.getElementById("fields-" + type).classList.toggle("hidden", type !== typeSelect.value);

        }

    });

    // Short text for the Billing column, for example "Hourly €25 × 40h".

    function billingText(inv) {

        if (inv.billingType === "HOURLY") return "Hourly " + euro(inv.hourlyRate) + " × " + inv.hoursLogged + "h";

        if (inv.billingType === "FIXED") return "Fixed " + euro(inv.fixedAmount);

        return "Retainer " + euro(inv.monthlyRate) + " × " + inv.months + " months";

    }

    // Fills the project dropdown and redraws the invoice table.

    function renderInvoices() {

        const projects = projectController.listProjects();

        document.getElementById("inv-project").innerHTML = projects.length

            ? projects.map(p => '<option value="' + p.id + '">' + escapeHtml(p.name) +

                " (" + escapeHtml(p.client.name) + ")</option>").join("")

            : '<option value="">Add a project first</option>';

        const rows = invoiceController.listInvoices().map(inv => {

            const extras = [];

            if (inv.hasLateFee) extras.push("+ fee " + euro(inv.lateFeeAmount));

            if (inv.hasDiscount) extras.push("− " + inv.discountPercent + "%");

            return "<tr>" +

                "<td>" + inv.id + "</td>" +

                "<td>" + escapeHtml(inv.project.name) + '<br><span class="muted">' + escapeHtml(inv.project.client.name) + "</span></td>" +

                "<td>" + billingText(inv) + "</td>" +

                "<td>" + inv.dueDate + "</td>" +

                '<td><span class="status ' + inv.status + '">' + inv.status + "</span></td>" +

                "<td><b>" + euro(inv.calculateTotal()) + '</b><br><span class="muted">' + extras.join(" ") + "</span></td>" +

                '<td><div class="actions">' +

                '<button data-act="SENT" data-id="' + inv.id + '">Send</button>' +

                '<button data-act="PAID" data-id="' + inv.id + '">Mark paid</button>' +

                '<input class="small" type="number" placeholder="€ fee" id="fee-' + inv.id + '">' +

                '<button class="light" data-act="fee" data-id="' + inv.id + '">Add late fee</button>' +

                '<input class="small" type="number" placeholder="%" id="disc-' + inv.id + '">' +

                '<button class="light" data-act="discount" data-id="' + inv.id + '">Apply discount</button>' +

                "</div></td></tr>";

        });

        document.getElementById("invoice-list").innerHTML =

            rows.join("") || '<tr><td colspan="7" class="muted">No invoices yet.</td></tr>';

    }

    invoiceForm.addEventListener("submit", e => {

        e.preventDefault();

        const form = {

            projectId: Number(document.getElementById("inv-project").value),

            issueDate: document.getElementById("inv-issue").value,

            dueDate: document.getElementById("inv-due").value,

            billingType: typeSelect.value,

            hourlyRate: num("inv-rate"),

            hoursLogged: num("inv-hours"),

            fixedAmount: num("inv-fixed"),

            monthlyRate: num("inv-monthly"),

            months: num("inv-months")

        };

        const invoice = run(() => invoiceController.createInvoice(form));

        if (invoice) {

            showMessage("Invoice #" + invoice.id + " created as DRAFT.", true);

            renderInvoices();

        }

    });

    document.getElementById("overdue-form").addEventListener("submit", e => {

        e.preventDefault();

        const today = new Date(document.getElementById("today").value);

        run(() => invoiceController.runOverdueCheck(today));

        showMessage("Overdue check done.", true);

        renderInvoices();

    });

    // One click handler for every button in the table.

    document.getElementById("invoice-list").addEventListener("click", e => {

        const button = e.target.closest("button");

        if (!button) return;

        const id = Number(button.dataset.id);

        const act = button.dataset.act;

        if (act === "SENT" || act === "PAID") {

            const invoice = run(() => invoiceController.changeStatus(id, act));

            if (invoice) showMessage("Invoice #" + id + " is now " + invoice.status + ".", true);

        } else if (act === "fee") {

            const amount = Number(document.getElementById("fee-" + id).value);

            const total = run(() => invoiceController.applyLateFee(id, amount));

            if (total !== undefined) showMessage("Late fee added. New total: " + euro(total) + ".", true);

        } else if (act === "discount") {

            const raw = document.getElementById("disc-" + id).value;

            const percent = raw === "" ? NaN : Number(raw);

            const total = run(() => invoiceController.applyDiscount(id, percent));

            if (total !== undefined) showMessage("Discount applied. New total: " + euro(total) + ".", true);

        }

        renderInvoices();

    });

    renderInvoices();
}
