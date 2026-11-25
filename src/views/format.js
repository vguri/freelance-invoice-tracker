// Small helpers for showing things on the page.

// 1050 -> "€1,050"
export function euro(n) {
    return "€" + Number(n).toLocaleString("en", { maximumFractionDigits: 2 });
}

// Makes text safe to put inside the page, so a name like "<b>" is shown as text.
export function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
