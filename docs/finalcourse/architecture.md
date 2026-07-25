# Architecture Context Strategy Comparison

This comparison uses only the three supplied architecture drafts.

| Strategy | What it got right | What it got wrong, missed, or invented | Best suited task shape |
| --- | --- | --- | --- |
| A — minimal context | Covers the full app narrative: task rules, browser-to-API create flow, key backend/frontend files, and explicit unknowns. It also preserves important constraints such as `done` → `todo` being forbidden. | It presents several detailed frontend and route claims without showing `Board.tsx` among its inspected files, including client-side filtering behavior and board grouping. Its statement that `crud.py` computes overdue status during creation is more specific than its evidence summary establishes. | A quick first-pass architecture sketch when completeness matters more than strict evidence traceability. |
| B — structured context | Produces the most balanced architecture draft: clear scope, complete request flow, concrete key-file map, data rules, storage behavior, and explicit unconfirmed areas. It identifies the business-rules section of `AGENTS.md` as useful context and says those rules were verified against backend files. | It still makes implementation-specific claims that are not independently evidenced inside the supplied output, including HTTP 201, `Column.tsx` drag-and-drop behavior, and API errors being converted to JavaScript errors. These should be retained only if the supporting summaries or files were checked. | A repo-wide architecture document requiring both cross-layer coverage and consistent treatment of business rules. |
| C — targeted context | Is the most disciplined about evidence boundaries. It limits conclusions to the visible backend anchors, labels router/frontend behavior as unknown, and avoids filling gaps with assumptions. | It is too narrow for a final application architecture document: it omits the route layer, frontend, endpoint contract, and browser-to-API flow. The leading `T` before the heading is also a formatting error. | A narrowly scoped, evidence-bound backend or storage-layer analysis where avoiding unsupported claims is the priority. |

## Verdict

Strategy B is the chosen approach for the final architecture document. It has the best coverage of the application architecture while using structured rules and file-level context to keep the narrative coherent; before relying on its detailed implementation claims, verify or soften the statements about HTTP 201, drag-and-drop, and frontend error conversion. Strategy C's caution is valuable, but its deliberate scope leaves too much of the application undocumented, while A is less explicit about the support for some of its detailed claims.

## Context-engineering rule

For repo-wide architecture documentation that must describe shared rules and backend-to-frontend flows, I use Strategy B because structured constraints and file summaries provide broad coverage with consistent terminology.

For a narrow, evidence-bound analysis of a subsystem, I use Strategy C because its anchor-file limits make unsupported conclusions easy to avoid.
