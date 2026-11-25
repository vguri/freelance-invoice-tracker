// 1050 -> "€1,050". Used by the billing classes when they describe themselves.
export function money(n) {
    return "€" + Number(n).toLocaleString("en", { maximumFractionDigits: 2 });
}