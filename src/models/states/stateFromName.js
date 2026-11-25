import { DraftState } from "./DraftState.js";
import { SentState } from "./SentState.js";
import { PaidState } from "./PaidState.js";
import { OverdueState } from "./OverdueState.js";

// localStorage only keeps the status name (for example "SENT"), not the state object.
// When an invoice is loaded again, this turns the name back into the right state class.
const statesByName = {
    DRAFT: DraftState,
    SENT: SentState,
    PAID: PaidState,
    OVERDUE: OverdueState
};

export function stateFromName(name) {
    const StateClass = statesByName[name] || DraftState;
    return new StateClass();
}
