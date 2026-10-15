# Freelance Invoice Tracker: project plan

Team Momentum: Viola Guri, Vesa Sylqa, Kleti Zekaj
SWEN-383 Software Design Principles and Patterns, RIT Kosovo, Fall 2026

## What we are building

An invoice tracker for one freelancer. They add clients and projects, create invoices for a project, and pick how each invoice is billed: hourly, fixed price or monthly retainer. The invoice works out its own total, a late fee or discount can go on top, and the invoice moves through Draft, Sent, Paid and Overdue.

We kept it small on purpose. No login and no other users. No real payments, so "paid" is a button. No line items, just one total per invoice. PDF export is a maybe, only if there is time at the end.

## How we are approaching the design

Part 1 shows our first design. It covers every feature above, but after we finished it we reviewed it and found real problems: `Invoice` does almost everything, the status rules and the billing math are long if/else and switch blocks, and the controllers create their own objects and their own storage. Part 2 is about fixing them with patterns.

## Patterns we plan to use

State, for the invoice status. Each status (Draft, Sent, Paid, Overdue) becomes its own class that knows which moves are allowed from it. The rules leave `Invoice`, which helps SRP, and a new status is a new class instead of another branch (OCP).

Strategy, for billing. `HourlyStrategy`, `FixedStrategy` and `RetainerStrategy` each have a `calculateTotal()`. `Invoice` just holds one and calls it, so a new billing type does not touch `Invoice` (OCP).

Decorator, for late fees and discounts. `LateFeeDecorator` and `DiscountDecorator` wrap the invoice total and change it, instead of flags and if checks inside `Invoice`. A new kind of fee is a new decorator (OCP).

Factory Method, for creating clients, projects and invoices. Right now the controllers call `new` themselves (GRASP Creator, Low Coupling).

Builder, maybe. The `Invoice` constructor takes 10 parameters, which is the telescoping constructor problem from the Week 6 lecture.

We will also do what we did in the Todo App: create the `LocalStorageHandler` once in `main.js` and pass it into the controllers (DIP), instead of each controller making its own.

## Risks

1. The status rules get messy. With every move in one if/else, adding a status or an edge case means editing code that already works. Before writing any State code, we will write down the full table of allowed moves.
2. Fees clash with the status. In the first design, nothing stops a late fee on an invoice that is already paid. With Decorator plus State, each state decides which fees and discounts it allows.

## Tech

- HTML, CSS and JavaScript (ES modules) in the browser, the same setup as the Todo App
- simple styled pages for clients, projects and invoices, not a command-line program
- localStorage for saving data, so it survives a page reload
- PlantUML for the diagrams, kept in `/diagrams` with a PNG next to each one
- Git and GitHub, with everyone committing from their own account

## Folders (when we start coding)

```
/diagrams        PlantUML files and their PNGs
/src
  /models        Client.js, Project.js, Invoice.js
  /controllers   ClientController.js, ProjectController.js, InvoiceController.js
  LocalStorageHandler.js
  main.js
/css
clients.html
projects.html
invoices.html
README.md
PROJECT_PLAN.md
```

## Who does what

Vesa: clients and projects, and Factory Method later.
Kleti: invoice status, and State later.
Viola: billing and totals, fees and discounts, so Strategy and Decorator later.

For Part 1, each of us pushes our own files from our own account:

| Person | Files |
|---|---|
| Viola | `README.md`, `PROJECT_PLAN.md`, `diagrams/sequence-create-invoice`, `diagrams/sequence-apply-discount` |
| Vesa | `diagrams/class-diagram`, `diagrams/sequence-add-client-project` |
| Kleti | `diagrams/sequence-state-transition`, `diagrams/sequence-overdue-late-fee` |

Each diagram means both the `.puml` and the `.png`.

## Timeline

Part 1, due Monday 26 October:
- by 18 Oct: Vesa and Kleti added as collaborators, everyone has cloned the repo and set up git with their own email
- by 22 Oct: everyone has pushed their files
- 23 to 25 Oct: PDF and slides, one practice run with a timer
- 26 Oct: upload the PDF and the repo link to myCourses
- 28 or 29 Oct: 5-minute presentation

Part 2, due Friday 4 December: build the app, apply the patterns, update the diagrams, write the report, present on 7 or 9 December.

## Part 1 checklist

- [x] Description and scope
- [x] Class diagram
- [x] Sequence diagrams
- [x] Two risks and the patterns we plan for them
- [ ] Everyone has pushed their own files
- [x] Repo is public
- [ ] PDF (SWEN383_P1_Momentum.pdf)
- [ ] 5-minute presentation
