# Freelance Invoice Tracker

Team Momentum: Viola Guri, Vesa Sylqa, Kleti Zekaj
SWEN-383 Software Design Principles and Patterns, RIT Kosovo, Fall 2026

A freelancer usually keeps track of who owes them money in a spreadsheet, or in their head. This app replaces that. You add your clients, add projects under each client, and write invoices for a project. Each invoice is billed hourly, at a fixed price or as a monthly retainer, and the app works out the total. You can add a late fee or a discount, and the invoice moves from Draft to Sent to Paid, or to Overdue if the due date passes first.

## Who uses it

One freelancer, in their own browser. There are no other users and no login.

## Scope

What the app does:
- add and list clients and projects
- create an invoice with hourly, fixed or retainer billing
- compute one total per invoice
- add a late fee or a discount to that total
- change the status by hand (Draft, Sent, Paid) and run an overdue check
- show all of this on simple, styled web pages, one for clients, one for projects and one for invoices

What it does not do:
- accounts, login or more than one user
- real payments (marking an invoice as paid is just a button)
- line items on an invoice
- PDF export (only if we have time left at the end)

## How it is built

Plain HTML, CSS and JavaScript (ES modules) that run in the browser, the same setup as the Todo App from the labs. It is a web app with its own pages and styling, not a command-line program. Data is saved in the browser's localStorage, so it is still there after a page reload. There is no server.

## Diagrams

The diagrams are in [`diagrams`](diagrams), written in PlantUML. Every `.puml` file has a `.png` next to it so you can look at it on GitHub.

| Diagram | File |
|---|---|
| Class diagram | [class-diagram.png](diagrams/class-diagram.png) |
| Add a client and a project | [sequence-add-client-project.png](diagrams/sequence-add-client-project.png) |
| Create an invoice and compute its total | [sequence-create-invoice.png](diagrams/sequence-create-invoice.png) |
| Send an invoice, mark it as paid | [sequence-state-transition.png](diagrams/sequence-state-transition.png) |
| Overdue check and late fee | [sequence-overdue-late-fee.png](diagrams/sequence-overdue-late-fee.png) |
| Apply a discount | [sequence-apply-discount.png](diagrams/sequence-apply-discount.png) |

After editing a `.puml` file, regenerate its picture with the PlantUML extension in VS Code, or with `java -jar plantuml.jar diagrams/<file>.puml`.

## Our first design, and what we plan to change

The diagrams show our first design. It covers everything above, but after we finished it we reviewed it and found the same kinds of problems we saw in the Todo App. The patterns below are how we plan to fix them.

| Problem | Principle it breaks | What we plan to use |
|---|---|---|
| `Invoice` holds the status rules, the billing math, the fees and the display text (a God Object) | SRP, GRASP High Cohesion | the patterns below split it up |
| `changeStatus()` is one long if/else over every status | SRP, OCP | State |
| `calculateTotal()` has a switch on `billingType` | OCP | Strategy |
| Late fee and discount are flags with if checks, and nothing looks at the status | OCP | Decorator, with the current state deciding what is allowed |
| The controllers call `new Client()`, `new Project()` and `new Invoice()` themselves | GRASP Creator, Low Coupling | Factory Method |
| Each controller creates its own `LocalStorageHandler` | DIP | create storage once in `main.js` and pass it in, like the Todo App does |
| The `Invoice` constructor takes 10 parameters in a fixed order | easy to mix values up (telescoping constructor) | Builder, if we have time |

## Risks we expect

1. The status rules will get messy. Every allowed move sits in one if/else inside `Invoice`, so adding a status means editing that block and maybe breaking the moves that already work. We plan to use State, with one class per status, and to write down the full table of allowed moves before we code it.
2. Fees and discounts can clash with the status. Right now nothing stops a late fee from going onto an invoice that is already paid (the overdue sequence diagram shows this). We plan to use Decorator for fees and discounts and let the current state decide which ones it accepts.

## More detail

The scope, risks, who does what, and the timeline are in [PROJECT_PLAN.md](PROJECT_PLAN.md).
