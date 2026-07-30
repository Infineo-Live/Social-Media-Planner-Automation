# 005 - Context Management

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Agent Instruction

---

# 1. Purpose

This document defines how the coding agent manages its working context throughout the implementation.

The objectives are to:

- Minimize token usage.
- Prevent context degradation.
- Avoid repeatedly reading the same documents.
- Enable reliable recovery after interruptions.
- Keep implementation deterministic.
- Maintain maximum productivity while using the fewest model credits.

This document governs **how the agent works**, not how the application works.

The project architecture, workflow, business rules, and implementation standards remain defined by the project source documents. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2}

---

# 2. Guiding Principles

The agent shall operate using the following principles.

1. Read only what is necessary.
2. Never repeatedly analyze unchanged documentation.
3. Persist implementation progress after every phase.
4. Keep working memory as small as possible.
5. Reload only the information required for the current phase.
6. Prefer deterministic execution over exploratory reasoning.
7. Never rely on conversation history as the source of truth.
8. Treat repository files as authoritative.

---

# 3. Context Hierarchy

The agent shall consider information in the following priority order.

1. Current repository state.
2. Project source documents.
3. Agent documents.
4. Project State document.
5. Human Input Register.
6. Current conversation.

Conversation history is the lowest-priority source because it may be truncated or lost.

---

# 4. Startup Context

At the beginning of the project, the agent shall:

- Read `000 - RUNNING.md`.
- Read every document referenced by RUNNING.
- Build an implementation plan.
- Begin Phase 1.

This is the only full-document loading pass expected during the project.

---

# 5. Working Context Per Phase

Before beginning any phase, the agent shall load only:

- Project State
- Current Phase Definition
- Coding Rules
- Configuration Rules
- Testing Rules
- Any project source documents required specifically for that phase

All unrelated documents shall remain unloaded.

---

# 6. End-of-Phase Context Reduction

After completing every phase, the agent shall immediately:

1. Run all required tests.
2. Resolve all test failures.
3. Commit the phase.
4. Update Project State.
5. Update Human Input Register (if needed).
6. Record a concise implementation summary.
7. End the current working context.

The implementation summary should contain only the information necessary to continue the project later.

---

# 7. Required Phase Summary

Before ending a phase, the agent shall produce a compact internal summary containing:

- Phase completed
- Major features implemented
- Files created
- Files modified
- Tests executed
- Test results
- Outstanding non-blocking items
- Blocking items (if any)
- Next phase

The summary should fit within approximately one page of text.

---

# 8. Conversation Reset

Immediately after finishing a phase, the agent shall intentionally discard the previous conversational working context.

If supported by the execution environment, the agent shall:

- Clear conversation memory.
- Start the next phase using only repository files and the Project State document.

If explicit memory clearing is unavailable, the agent shall behave as though the previous conversational context no longer exists.

The repository must remain the authoritative source of truth.

---

# 9. Reload Strategy

When starting a new phase after a reset, the agent shall reload only:

- RUNNING.md (if starting fresh)
- Project State
- Current Phase Definition
- Phase-specific project documents

The agent shall not reload the complete architecture unless required.

---

# 10. Repository First

The repository is always more trustworthy than memory.

If memory conflicts with repository contents:

The repository wins.

Never preserve outdated assumptions.

---

# 11. Avoid Re-analysis

The agent shall not repeatedly analyze documents whose contents have not changed.

Previously completed architectural analysis shall not be repeated.

Instead:

- Read.
- Implement.
- Test.
- Continue.

---

# 12. Incremental Knowledge

Knowledge should grow incrementally.

The agent should never rebuild the entire mental model after every phase.

Instead, each phase should extend the existing implementation using:

- Repository state
- Project State
- Phase Definition

---

# 13. Token Budget

The agent should minimize unnecessary token usage by avoiding:

- Re-reading entire documents.
- Explaining completed work repeatedly.
- Restating project goals.
- Repeating architectural summaries.
- Verbose reasoning that does not affect implementation.

Tokens should primarily be spent on implementation and validation.

---

# 14. Documentation Loading Rules

Large documents should only be reopened if:

- The current phase depends on them.
- They have changed since last read.
- Validation requires them.
- A conflict must be resolved.

Otherwise, rely on the implementation already completed.

---

# 15. Human Questions

The agent shall not interrupt implementation for non-blocking questions.

Instead:

- Record the requirement in the Human Input Register.
- Continue implementing all remaining work.

Only genuinely blocking issues may pause implementation.

---

# 16. Crash Recovery

If execution stops unexpectedly:

The next execution must begin by reading:

1. RUNNING.md
2. Project State
3. Current Phase Definition

The agent shall then:

- Verify repository contents.
- Verify latest completed commit.
- Resume from the first incomplete phase.

Previously completed phases must never be repeated unless corruption is detected.

---

# 17. Duplicate Prevention

Before generating code, the agent shall verify whether equivalent functionality already exists.

The agent shall avoid:

- Duplicate utilities
- Duplicate components
- Duplicate services
- Duplicate configuration
- Duplicate business logic

Existing implementations should be extended rather than recreated.

---

# 18. Reasoning Scope

The agent should reason only about the current implementation problem.

It should avoid speculative redesign unless:

- Required by the current phase.
- Required to fix a defect.
- Required to satisfy documented project requirements.

---

# 19. End-of-Project Context

When the final phase completes, the agent shall produce:

- Final implementation summary.
- Remaining manual setup checklist.
- Required environment variables.
- Required credentials.
- Required third-party configuration.
- Deployment instructions.
- Human testing checklist.
- Known limitations.
- Human Input Register (remaining items only).

No further implementation work should remain.

---

# 20. Success Criteria

Context management is considered successful when:

- The project can resume after any interruption.
- No completed phase is repeated unnecessarily.
- Context size remains small throughout execution.
- Repository files remain the single source of truth.
- Token usage remains efficient.
- Implementation quality is unaffected by conversation resets.
- The agent reaches the final handover with only deployment, configuration, credential setup, and manual UAT remaining.

---

**End of Document**