# 000 - RUNNING.md

# Project Execution Entry Point

**Project:** Infineo – Social Media Planner  
**Audience:** AI Coding Agent  
**Purpose:** This is the ONLY document that should be provided to the coding agent at the beginning of implementation.

---

# 1. Mission

Your objective is to build the complete application from the provided documentation with **zero manual intervention during implementation**.

You are expected to:

- Read all required documentation.
- Plan internally.
- Implement the project in multiple deterministic phases.
- Complete every phase in a single overall run.
- Commit after every completed phase.
- Run all required tests after every phase.
- Maintain project state so execution can resume after interruption.
- Reach the end of implementation with only:
  - environment configuration,
  - external credentials,
  - deployment,
  - and human UAT remaining.

Do **not** stop after completing a single phase.

Continue automatically until the entire implementation has been completed.

---

# 2. Primary Objectives

Your goals, in order of priority, are:

1. Correctness
2. Deterministic implementation
3. Recoverability
4. Low token usage
5. Maintainability
6. Clean architecture
7. Full completion

Speed is secondary to correctness.

---

# 3. Mandatory Reading Order

Read documents in the exact order below.

## Phase A — Project Understanding

Read:

- 000 - Project Overview
- 001 - Business Requirements
- 002 - System Architecture

Understand the business before reading implementation details.

---

## Phase B — Functional Requirements

Read:

- 003 - User Roles & Permissions
- 004 - Data Model
- 005 - Google Sheets Architecture
- 006 - Workflow Engine
- 007 - Business Rules

These documents define system behavior.

They override implementation assumptions.

---

## Phase C — User Experience

Read:

- 008 - Screens & Navigation
- 009 - Dashboard Specifications
- 010 - Task Management
- 011 - Notifications
- 012 - Search, Filters & Views
- 013 - Settings & Master Data
- 014 - Security & Access Control
- 015 - UI Design System

---

## Phase D — Implementation Standards

Read:

- 016 - Email Templates
- 017 - Error Handling & Edge Cases
- 018 - Development Standards
- 019 - Testing Checklist
- 020 - Migration Plan
- 021 - Future Enhancements

Future Enhancements are informational only.

Do NOT implement them unless explicitly required by Version 1.

The architecture, workflow, configuration philosophy, and implementation standards defined in the project documentation are authoritative and must be followed throughout implementation. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1} :contentReference[oaicite:2]{index=2}

---

# 4. Then Read The Agent Documents

After reading the project documentation, read the following agent documents in order.

1. 001 - Agent Charter.md
2. 002 - Project Execution Plan.md
3. 003 - Phase Definitions.md
4. 004 - Project State.md
5. 005 - Context Management.md
6. 006 - Coding Rules.md
7. 007 - Configuration Rules.md
8. 008 - Testing Rules.md
9. 009 - Git Workflow.md
10. 010 - Recovery & Resume.md
11. 011 - Human Input Register.md
12. 012 - Deliverables Checklist.md
13. 013 - Final Handover.md

---

# 5. First Action

Immediately inspect:

```
004 - Project State.md
```

Determine:

- current phase
- completed phases
- failed phases
- pending phases
- current implementation status

If implementation has already started,

resume from the recorded phase.

Never restart the project.

---

# 6. Never Rebuild Completed Work

If Project State indicates a phase is complete:

- do not repeat it
- do not refactor it unless required
- continue from the next unfinished phase

---

# 7. Execution Loop

For every phase perform exactly this sequence.

```
Read required documents

↓

Plan

↓

Implement

↓

Run tests

↓

Fix failures

↓

Run tests again

↓

Commit

↓

Update Project State

↓

Update Deliverables

↓

Update Human Input Register

↓

Generate Phase Summary

↓

Clear conversation context

↓

Start next phase
```

Repeat until every phase has been completed.

Never skip any step.

---

# 8. Phase Completion Requirements

A phase is complete only when all of the following are true.

- Code implemented.
- No TODO placeholders remain.
- Tests pass.
- Lint passes.
- Type checking passes.
- Build succeeds.
- Documentation updated (if required).
- Project State updated.
- Commit created.

Otherwise the phase remains incomplete.

---

# 9. Configuration Philosophy

Business decisions must never be hardcoded.

If something is business-configurable,

place it into configuration.

Examples include (but are not limited to):

- Series
- Platform names
- Status display metadata
- Email settings
- Application branding
- Workflow configuration values intended to be configurable
- Feature flags
- Environment-specific settings

If a configurable business value is discovered during implementation,

move it into configuration rather than embedding it in code, consistent with the project's configuration-over-hardcoding principle. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}

---

# 10. Missing Information

If information is missing but implementation can continue,

continue.

Record the requirement inside:

```
011 - Human Input Register.md
```

Do not stop.

Only stop if implementation is impossible.

---

# 11. Human Questions

Do not interrupt implementation for:

- branding
- colors
- deployment
- OAuth credentials
- API keys
- environment variables
- production URLs
- DNS
- email sender configuration

Record all of them for the final handover.

---

# 12. Commit Policy

Every completed phase requires exactly one commit.

Never combine multiple phases into one commit.

---

# 13. Crash Recovery

If execution stops unexpectedly,

on restart:

Read

```
004 - Project State.md
```

Resume from the first unfinished phase.

Do not re-analyze the whole repository.

Do not restart.

---

# 14. Context Optimization

To minimize token usage:

At the end of every completed phase:

- generate a concise implementation summary
- write required progress into Project State
- persist any required metadata
- end the current conversation/session
- start the next phase using only:
  - Project State
  - relevant project documents
  - relevant agent documents

Do not carry unnecessary conversational history between phases.

---

# 15. Forbidden Behaviour

Never:

- restart the project
- ignore Project State
- skip tests
- skip commits
- hardcode business configuration
- invent business rules
- modify completed phases without reason
- implement Version 2 features
- leave unfinished TODOs
- silently ignore failing tests

---

# 16. Final Deliverable

When all phases are complete, provide:

1. Completed repository
2. Passing test suite
3. Build verification
4. Deployment instructions
5. Environment variables required
6. External credentials required
7. Configuration checklist
8. Remaining manual setup steps
9. Manual User Acceptance Testing checklist
10. Confirmation that implementation is complete

At that point, implementation ends.

No further coding should remain.