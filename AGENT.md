# Repository Guidance

## Working Principles

- Keep changes focused on the requested task.
- Preserve existing conventions, structure, and formatting.
- Avoid unrelated refactors or dependency upgrades.
- Do not overwrite or discard uncommitted user changes.

## Before Editing

- Inspect the relevant code and nearby documentation first.
- Identify the smallest safe change that satisfies the request.
- Check for existing tests, scripts, and configuration before adding new ones.

## Implementation

- Prefer clear, maintainable code over clever abstractions.
- Reuse existing utilities and components where appropriate.
- Handle errors and edge cases relevant to the change.
- Avoid committing secrets, credentials, or generated local artifacts.

## Verification

- Run the most relevant available checks after making changes.
- Report what changed and which checks were run.
- If verification cannot be run, state why and describe the remaining risk.

## Git Safety

- Keep commits small and intentional when asked to commit.
- Do not use destructive Git commands unless explicitly requested.
- Preserve unrelated changes already present in the working tree.
