# 010 - Recovery & Resume

**Project:** Infineo – Social Media Planner  
**Purpose:** Allow the coding agent to resume implementation deterministically after any interruption, crash, context loss, model restart, IDE restart, or token limit without redoing completed work.

---

# 1. Philosophy

The implementation process must be fully resumable.

The agent must assume that interruptions are normal and expected.

A crash must never require restarting the project from Phase 1.

The repository itself is the source of truth.

The conversation is **not** the source of truth.

---

# 2. Never Trust Conversation Memory

The agent must never rely on:

- Previous chat messages
- Model memory
- Conversation history
- Assumptions about completed work

Instead, every resume starts from project artifacts.

---

# 3. Resume Order

Whenever starting a new conversation or resuming after interruption, the agent shall follow this exact sequence.

```
Read

↓

000 - RUNNING.md

↓

004 - Project State.md

↓

Current Phase Definition

↓

Relevant Architecture Documents

↓

Repository State

↓

Continue Implementation
```

No other workflow is permitted.

---

# 4. Mandatory Resume Checklist

Before writing any code, verify:

- Current implementation phase
- Last successful phase
- Last successful commit
- Pending work
- Pending human inputs
- Pending configuration items
- Pending known issues

Only after verification may implementation continue.

---

# 5. Project State Is Authoritative

The following file is the authoritative implementation tracker.

```
agent/

004 - Project State.md
```

The agent must never guess progress from repository contents alone.

The Project State document always overrides assumptions.

---

# 6. Validate Repository State

After reading Project State, verify that the repository matches the recorded state.

Example checks:

- Expected directories exist
- Expected modules exist
- Previous phase tests passed
- Previous phase commit exists
- Expected generated files exist

If everything matches:

Continue.

If not:

Follow the recovery procedure.

---

# 7. Recovery Decision Tree

```
Project State Exists?

↓

Yes

↓

Repository Matches?

↓

Yes

↓

Continue Current Phase


---------------------------


Project State Exists?

↓

Yes

↓

Repository Does Not Match

↓

Investigate

↓

Repair State

↓

Continue


---------------------------


Project State Missing

↓

Inspect Git

↓

Determine Last Completed Phase

↓

Recreate Project State

↓

Continue
```

---

# 8. Interrupted Phase

If interruption occurred during a phase:

The agent must:

1. Inspect repository.
2. Compare implementation against phase completion criteria.
3. Determine incomplete work.
4. Resume only remaining tasks.

Never restart the entire phase unless absolutely necessary.

---

# 9. Never Repeat Completed Work

Completed work shall never be regenerated simply because the context was lost.

Instead:

- Verify implementation.
- Continue forward.

Repeated implementation wastes tokens and risks introducing regressions.

---

# 10. Phase Completion Validation

A phase is considered complete only when ALL conditions are satisfied.

- Implementation finished
- Tests passed
- Build successful
- Lint successful
- Type checking successful
- Documentation updated
- Project State updated
- Commit created

Missing any requirement means the phase remains incomplete.

---

# 11. Commit Recovery

If Project State indicates a completed phase but no matching commit exists:

Treat the phase as incomplete.

Re-run validation.

Create the missing commit.

Update Project State.

Continue.

---

# 12. Failed Tests During Resume

If previously completed code now fails tests:

Do not continue implementing new features.

Instead:

- Identify regression
- Repair regression
- Re-run tests
- Update documentation if required
- Create recovery commit

Only then continue.

---

# 13. Merge Conflicts

If merge conflicts exist:

Resolve them before continuing implementation.

Never continue coding on an inconsistent repository.

---

# 14. Pending Human Inputs

The agent shall never stop implementation merely because optional information is missing.

Instead:

Append requests to

```
agent/

011 - Human Input Register.md
```

Examples include:

- OAuth Client ID
- Deployment URL
- Google Sheet ID
- Production domain
- Email sender address
- Branding assets

Continue implementation whenever reasonable defaults or placeholders can be used.

Only stop if the missing information makes further implementation technically impossible.

---

# 15. Configuration Recovery

Business decisions must never be recreated from memory.

If configuration already exists:

Use it.

If configuration is missing:

Create it.

If configuration is incomplete:

Document the missing values in the Human Input Register.

Never hardcode business rules into application logic. This aligns with the project's architecture and development standards that require configuration over hardcoding wherever practical. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# 16. Documentation Recovery

Before continuing implementation, verify that documentation remains synchronized.

At minimum verify:

- Project State
- Human Input Register
- Deliverables Checklist

If documentation is outdated:

Update it before continuing.

---

# 17. Token Optimization During Resume

To minimize token usage, do not reload every project document.

Load only:

- RUNNING.md
- Project State.md
- Current Phase Definition
- Files required for the active phase
- Files directly referenced by those documents

Do not reload completed phase documents unless required.

---

# 18. Context Reset Between Phases

After successfully completing a phase:

1. Update Project State.
2. Commit changes.
3. Verify commit.
4. Write a concise implementation summary.
5. End the current chat session.
6. Start a fresh session.
7. Resume using this recovery procedure.

This minimizes context growth and reduces implementation cost.

---

# 19. Recovery Priority

When multiple recovery actions are possible, follow this priority order:

1. Preserve completed work.
2. Preserve repository consistency.
3. Preserve passing tests.
4. Preserve documentation accuracy.
5. Minimize duplicated implementation.
6. Minimize token consumption.

---

# 20. Repository Is the Truth

The implementation state is determined by:

1. Git history
2. Repository contents
3. Project State document

Never infer progress from conversation history.

---

# 21. Crash Recovery Summary

Whenever interrupted:

```
Crash Recovery Algorithm

1. Read RUNNING.md
2. Read Project State.md
3. Determine Current Phase.
4. Read ONLY the definition for that phase.
5. Verify the repository satisfies every previously completed phase.
6. Resume the first incomplete task.
7. Never repeat completed work.
8. Continue normal execution.

↓

Verify Current Phase

↓

Complete Remaining Work

↓

Run Tests

↓

Update Documentation

↓

Commit

↓

Proceed To Next Phase
```

No manual intervention should be required unless a true blocking dependency is encountered.

---

# 22. Success Criteria

Recovery is considered successful when:

- No completed work is repeated.
- No completed work is lost.
- Repository remains consistent.
- Tests continue passing.
- Documentation accurately reflects implementation.
- The agent resumes from the exact interruption point.
- Implementation proceeds without requiring the user to restate context.

The ultimate objective is that the project reaches final handover with only deployment configuration, environment setup, external credentials, and human acceptance testing remaining. This recovery process exists solely to ensure interruptions do not affect that outcome. :contentReference[oaicite:2]{index=2}

---
End of Document