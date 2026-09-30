# Freelance Invoice Tracker: Project Plan

Team: Momentum
Members: Viola Guri, Vesa Sylqa, Kleti Zekaj
Course: SWEN-383, Software Design Principles and Patterns, RIT Kosovo, Fall 2026

## What we are building

A freelancer's own invoice tracker. A freelancer adds clients and projects, creates invoices against a project, picks a billing method (hourly, fixed, or retainer), the invoice computes a total, late fees or discounts can be applied on top, and the invoice moves through a status lifecycle (Draft, Sent, Paid, Overdue).

No login or multi-user accounts. No real payment processing, status changes by hand. No itemized line items, one computed total per invoice. No PDF export, that stays a stretch goal, not required.

## Patterns and why

Factory creates the Client and Project objects. It keeps creation logic out of the calling code and satisfies OCP, since new entity types can be added later without touching existing code.

State handles the invoice lifecycle: Draft, Sent, Paid, Overdue. Each state knows which transitions are legal from it, so the transition rules live outside the Invoice class itself. That is an SRP argument more than an OCP one.

Strategy handles the billing calculation: hourly, fixed, retainer. Invoice just holds a strategy and calls it, so a new billing type can be added without modifying Invoice. This one is OCP.

Decorator stacks late fees and discounts on top of the invoice total. It layers behavior onto the total instead of branching inside one class, which is where the ISP/DIP argument comes from.

Two anticipated risks for Part 1:
1. State-transition rules getting messy as more statuses or edge cases get added. Mitigated by defining the full transition table before writing any state code.
2. Decorator/State conflicts, like a late fee landing on an invoice that is already paid. Mitigated by having each state restrict which decorators are allowed to apply while an invoice is in it.

## Tech stack

- Backend: Node.js + Express (REST API)
- Frontend: plain HTML/CSS/vanilla JS, no framework, UI design is not graded
- Storage: a JSON file read and written by the server. No DB setup, survives a server restart during a live demo.
- Diagrams: PlantUML, text files committed to the repo under `/diagrams`
- Version control: Git/GitHub, this repo

## Folder structure

```
/diagrams          → PlantUML source files (class + sequence diagrams)
/server
  server.js
  /models           → Client, Project, Invoice
  /patterns         → factory, states, strategies, decorators
  /routes           → REST endpoints
  data.json         → persisted data
/public
  clients.html
  projects.html
  invoices.html
  /css
  /js
PROJECT_PLAN.md
README.md
```

## Pattern implementation notes

Factory: one `EntityFactory` (or `ClientFactory` + `ProjectFactory`) with methods like `createClient(...)` and `createProject(...)`. Keep it to one file.

State: one class per status, `DraftState`, `SentState`, `PaidState`, `OverdueState`, each exposing which transitions are legal. Invoice holds a reference to its current state object and delegates transition checks to it instead of branching on a status string.

Strategy: a `BillingStrategy` interface with `HourlyStrategy`, `FixedStrategy`, `RetainerStrategy`, each implementing `calculateTotal()`. Invoice holds a strategy instance and calls it.

Decorator: a base total getter on Invoice, then `LateFeeDecorator` and `DiscountDecorator` that wrap it and adjust the number. Each decorator checks the invoice's current state before applying, so no late fee lands on a Paid invoice.

## Team split

Vesa takes Client and Project plus Factory, along with the basic add/list pages for both. Lightest part of the three, does not depend on anything else being done first.

Kleti takes Invoice plus State: the transition table, state classes, invoice pages. This is the piece everything else builds on, so it needs to be solid early.

Viola takes Billing Strategy plus Decorator plus the total computation. Toughest split of the three, two patterns stacked plus the actual math, and Decorator cannot really start until State is done.

## Build order

**Phase 1, now through Oct 26 (Part 1, design only)**
Whole team together, not split by person, since the class diagram has to be consistent across all three domains.
1. Repo setup, `/diagrams` folder, README
2. Class diagram covering the full domain: Client, Project, Invoice, billing strategy interface, decorator chain, state classes
3. Sequence diagram(s): "create invoice and compute total", "invoice status transition"
4. Write description/scope, the two risks and their mitigating patterns
5. Prepare the 5-minute presentation

**Phase 2, Oct 26 through Dec 4 (Part 2, build)**
1. Shared setup session: Express skeleton, basic HTML shells for all three pages, JSON storage wired up. Done together so nobody is blocked.
2. Vesa: Client/Project + Factory
3. Kleti: Invoice + State (can run in parallel with step 4)
4. Viola: Billing Strategy (can start immediately, no dependency on State)
5. Viola: Decorator, once State exists, since it needs to check invoice status
6. Wire everything into the frontend pages
7. Refine UML to match what actually got built
8. Write the 4-5 page report
9. Rehearse the 10-minute presentation

## Deliverable checklist

**Part 1 (due Oct 26, presented Oct 28)**
- [ ] Project description and scope
- [ ] Draft class diagram (PlantUML, in `/diagrams`)
- [ ] Draft sequence diagram (PlantUML, in `/diagrams`)
- [ ] 2 anticipated risks + patterns planned against them
- [ ] 5-minute presentation ready

**Part 2 (due Dec 4, presented Dec 7/9)**
- [ ] Refined UML diagrams
- [ ] 3+ patterns demonstrated, with before/after evidence of how they addressed the risks
- [ ] Final UML diagrams
- [ ] 4-5 page written report
- [ ] GitHub repo with commit history from all members
- [ ] 10-minute presentation ready