# 001 - Agent Charter

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Approved  
**Audience:** Autonomous Coding Agent (Claude Code / Codex / Cursor Agent / Similar)

---

# 1. Purpose

This document defines the permanent operating rules for the coding agent.

These rules govern **how** the project is implemented.

The architecture documents define **what** should be built.

This document defines **how the implementation process must be executed.**

This charter takes precedence over implementation convenience.

---

# 2. Primary Objective

Your objective is to deliver a complete, production-ready implementation of the Infineo Social Media Planner with minimal human intervention.

When the project is complete, the human should only need to:

- Configure environment variables
- Provide external credentials
- Perform manual User Acceptance Testing (UAT)
- Deploy (if deployment is intentionally manual)

Everything else should already be completed.

---

# 3. Source of Truth

Implementation decisions shall follow this order of precedence.

1. Architecture Documents
2. Agent Documents
3. Existing Project Code
4. Existing Project Configuration

Never invent business rules that conflict with the architecture documentation.

The architecture documents remain the authoritative definition of business behaviour. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# 4. Implementation Philosophy

Implement the project as if no further coding sessions will occur.

Avoid leaving:

- TODOs
- Placeholder implementations
- Mock business logic
- Half-finished modules
- Stub services

If something cannot be completed because external information is unavailable, record it in the Human Input Register and continue with everything else.

---

# 5. Autonomous Execution

Execute every implementation phase automatically.

Do not stop after completing a phase.

Continue until:

- every phase is complete
- or a genuine blocking dependency exists.

Do not ask for confirmation between phases.

---

# 6. Business Logic

Business rules are never guessed.

If documentation defines behaviour:

Implement exactly that behaviour.

If documentation is silent:

Use the simplest implementation consistent with the overall architecture.

Never introduce unnecessary features.

---

# 7. Configuration First

Business decisions must never be hardcoded.

Whenever practical, place configurable values into configuration.

Examples include:

- application name
- company name
- URLs
- feature flags
- email sender details
- branding
- environment-specific values
- external service configuration
- deployment configuration

If additional business configuration is discovered during implementation, move it into configuration unless doing so would violate documented architecture.

This aligns with the project's architectural principle of configuration over hardcoding. :contentReference[oaicite:2]{index=2}

---

# 8. Respect Existing Architecture

Do not redesign documented architecture.

Do not replace technologies merely because alternatives exist.

Do not introduce additional architectural layers unless they solve an actual implementation problem.

Prefer straightforward implementation over architectural creativity.

---

# 9. Keep It Simple

Prefer:

- simple code
- readable code
- maintainable code
- deterministic behaviour

Avoid:

- unnecessary abstractions
- speculative extensibility
- premature optimization
- over-engineering

The project is an internal workflow application and should remain simple to maintain. :contentReference[oaicite:3]{index=3}

---

# 10. Production Quality

Everything written should be production quality.

Avoid:

- dead code
- duplicate code
- experimental code
- temporary hacks

All code should be suitable for long-term maintenance.

---

# 11. Deterministic Behaviour

Implementation should produce identical behaviour every time.

Avoid:

- hidden randomness
- implicit behaviour
- undocumented side effects

Business actions should always produce predictable results.

---

# 12. Fail Safely

Whenever an operation fails:

- preserve data integrity
- avoid partial writes
- return meaningful errors
- log useful information

Never silently ignore failures.

---

# 13. Testing Is Mandatory

Every phase must end with testing.

Where applicable execute:

- lint
- formatting verification
- type checking
- unit tests
- integration tests
- build verification
- smoke tests

Never intentionally leave the repository in a failing state.

If failures exist:

Fix them before proceeding.

---

# 14. Git Discipline

Each implementation phase shall end with:

1. passing tests
2. Project State update
3. git commit

Commits should be small, meaningful, and represent a completed unit of work.

Never create one massive commit containing the entire project.

---

# 15. Progress Tracking

Project progress must always be recoverable.

After every completed phase:

Update:

- Project State
- Human Input Register (if necessary)
- Deliverables Checklist

Never rely on conversation history to determine project status.

---

# 16. Human Interaction

Interrupt the human only when absolutely necessary.

Acceptable reasons include:

- missing credentials
- missing repository access
- missing external resources
- contradictory requirements
- missing legal or licensing information

Everything else should be solved autonomously.

---

# 17. Human Input Register

Do not interrupt implementation for information that is only required later.

Instead:

Record the requirement in the Human Input Register.

Examples:

- OAuth Client ID
- Google Sheet ID
- SMTP configuration
- Production domain
- Company logo

Continue implementing everything else.

---

# 18. Recovery

Assume the execution may terminate unexpectedly.

Never rely solely on chat history.

All required execution state must exist inside repository documentation.

A newly started agent should be able to resume solely by reading the prescribed agent documents.

---

# 19. Context Efficiency

Conversation history is expensive.

At the completion of every implementation phase:

- write persistent progress into repository documents
- finish all required commits
- summarize work
- clear conversation context (or start a fresh session if supported)
- reload only the minimum required documentation for the next phase

Never carry unnecessary implementation history across multiple phases.

---

# 20. Existing Code

Before modifying existing code:

Understand it first.

Avoid rewriting working implementations without clear justification.

Prefer incremental improvement over replacement.

---

# 21. Dependencies

Before introducing a dependency:

Verify that it provides meaningful value.

Avoid dependencies that solve trivial problems.

Minimize dependency count where practical.

---

# 22. Documentation

Whenever implementation changes architecture, configuration, setup, or developer workflow:

Update the relevant documentation before marking the phase complete.

Documentation and implementation must remain synchronized.

---

# 23. Security

Never:

- expose secrets
- commit credentials
- hardcode API keys
- hardcode passwords
- disable security checks for convenience

Use environment configuration for sensitive information.

---

# 24. Performance

Avoid unnecessary:

- network requests
- database operations
- repeated calculations
- duplicate reads
- duplicate writes

Prefer efficient but readable implementations.

Do not optimize prematurely.

---

# 25. Completion Criteria

The project is considered complete only when all of the following are true:

- Every implementation phase has been completed.
- All planned functionality exists.
- Tests pass.
- The application builds successfully.
- Configuration is documented.
- Human Input Register contains only unavoidable manual setup.
- Final handover documentation is complete.
- The repository is in a clean, commit-ready state.

---

# 26. Non-Goals

Do not add features simply because they might be useful.

Do not implement future enhancements unless explicitly required by the architecture.

Do not redesign business workflows.

Do not introduce speculative capabilities.

Version 1 should faithfully implement Version 1 requirements.

---

# 27. Guiding Principle

For every implementation decision, ask:

> Does this decision make the application simpler, more reliable, more maintainable, or more faithful to the documented business requirements?

If the answer is **no**, choose a simpler approach.

---

# End of Document