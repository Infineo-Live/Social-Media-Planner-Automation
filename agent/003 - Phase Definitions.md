# 003 - Phase Definitions

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Audience:** AI Coding Agent  
**Status:** Mandatory Execution Document

---

# 1. Purpose

This document defines every implementation phase of the project.

The objective is to ensure that the AI agent:

- always knows what to build next,
- never skips work,
- always validates completed work,
- commits after every phase,
- updates project state,
- can recover from crashes,
- minimizes token usage by working phase-by-phase,
- reaches a fully deployable application without requiring human intervention except for final configuration and manual testing.

This document governs implementation only.

Business requirements remain defined by the project architecture documents. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# 2. General Phase Rules

Every phase MUST follow this sequence.

```
Read Project State

↓

Determine Current Phase

↓

Read ONLY documents required for this phase

↓

Implement

↓

Run Formatting

↓

Run Lint

↓

Run Type Checks

↓

Run Tests

↓

Fix Issues

↓

Commit

↓

Update Project State

↓

Write Resume Summary

↓

Flush Chat Context

↓

Continue With Next Phase
```

No phase may be skipped.

No phase may be partially completed.

---

# 3. Phase Completion Criteria

A phase is considered complete ONLY when ALL of the following are true.

- All objectives implemented.
- No placeholder implementations remain.
- No TODO comments remain unless explicitly allowed.
- Lint passes.
- Type checking passes.
- Tests pass.
- Build succeeds.
- Documentation updated if affected.
- Project State updated.
- Git commit created.

---

# 4. Required Deliverables Per Phase

Every phase must produce:

- Working code
- Updated tests
- Updated documentation (if required)
- Updated configuration (if required)
- Updated Project State
- Git commit

---

# 5. Reading Strategy

Before each phase, read ONLY:

- RUNNING.md
- Project State.md
- Agent Charter.md
- This document
- Documents required for the current phase

Do NOT reload the complete architecture unless required.

This minimizes token consumption.

---

# 6. Phase 1 — Repository Foundation

## Objective

Create a clean development foundation.

## Includes

- Repository validation
- Folder structure
- Package management
- Tooling
- Build system
- Environment handling
- Configuration framework
- Git ignore
- Editor configuration
- CI skeleton

## Required Reads

- Project Overview
- Business Requirements
- System Architecture
- Development Standards

## Tests

- Build
- Lint
- Type Check

## Commit

```
Phase 1 - Repository Foundation
```

---

# 7. Phase 2 — Core Architecture

## Objective

Build the application's internal architecture without implementing business features.

## Includes

- Routing
- Layout
- Authentication skeleton
- State management
- Service layer
- Repository layer
- Configuration loader
- Error framework
- Logging
- Shared utilities

No business workflows yet.

## Required Reads

- System Architecture
- Development Standards
- Security
- UI Design System

## Tests

- Architecture tests
- Build
- Lint
- Type Check

## Commit

```
Phase 2 - Core Architecture
```

---

# 8. Phase 3 — Authentication & Authorization

## Objective

Implement secure login and permission handling.

## Includes

- Google Authentication
- Session management
- User loading
- Role resolution
- Route protection
- Permission middleware
- Unauthorized handling

## Required Reads

- User Roles & Permissions
- Security
- Business Requirements

## Validation

Verify:

- Employee login
- Manager login
- Admin login
- Unauthorized user
- Inactive user

## Commit

```
Phase 3 - Authentication
```

---

# 9. Phase 4 — Data Layer

## Objective

Implement the complete persistence layer.

## Includes

- Google Sheets integration
- Data models
- Repository implementation
- Validation
- Mapping
- Error handling
- Transactions (where applicable)
- Configuration-driven sheet mapping

Business rules must NOT exist here.

## Required Reads

- Data Model
- Google Sheets Architecture
- System Architecture

## Tests

- CRUD
- Mapping
- Validation

## Commit

```
Phase 4 - Data Layer
```

---

# 10. Phase 5 — Workflow Engine

## Objective

Implement every workflow rule.

## Includes

- Status transitions
- Assignment rules
- Approval routing
- Validation
- Rejections
- Workflow actions

Workflow implementation must exactly match documentation.

No custom workflow logic.

## Required Reads

- Workflow Engine
- Business Rules
- Task Management

## Tests

Test every workflow path.

Including:

- approvals
- rejections
- invalid transitions
- reassignment
- metadata completion
- scheduling
- upload

## Commit

```
Phase 5 - Workflow Engine
```

---

# 11. Phase 6 — User Interface

## Objective

Build every application screen.

## Includes

- Layout
- Navigation
- Dashboards
- Forms
- Tables
- Detail screens
- Responsive behavior
- Empty states
- Loading states

No screen should be skipped.

## Required Reads

- Screens & Navigation
- Dashboard Specifications
- UI Design System
- Search & Filters

## Validation

Every documented screen exists.

## Commit

```
Phase 6 - User Interface
```

---

# 12. Phase 7 — Business Features

## Objective

Connect UI with workflow.

## Includes

- Content management
- Assignment
- Search
- Filters
- Notifications
- Activity log
- Settings
- User management

Business behavior must match documentation.

## Required Reads

All business documents.

## Tests

Complete workflow integration.

## Commit

```
Phase 7 - Business Features
```

---

# 13. Phase 8 — Notifications

## Objective

Implement all notifications.

## Includes

- Email generation
- Notification generation
- Notification persistence
- Duplicate prevention

Email templates must match documentation.

## Required Reads

- Notifications
- Email Templates

## Tests

Every notification trigger.

## Commit

```
Phase 8 - Notifications
```

---

# 14. Phase 9 — Configuration

## Objective

Remove every hardcoded business decision.

Everything business-specific must be configurable.

Examples include:

- Series
- Platforms
- Sheet names
- Environment values
- Branding
- URLs
- Feature flags
- Application metadata

If additional configurable items are discovered during implementation, move them into configuration.

Do not leave business constants in application logic.

This aligns with the project's architectural principle of configuration over hardcoding. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}

## Tests

Configuration loading.

Environment switching.

Missing configuration validation.

## Commit

```
Phase 9 - Configuration
```

---

# 15. Phase 10 — Hardening

## Objective

Improve robustness.

## Includes

- Error handling
- Edge cases
- Validation
- Logging
- Retry handling
- Defensive programming

## Required Reads

- Error Handling & Edge Cases
- Security

## Tests

Edge-case testing.

Permission testing.

Concurrency testing.

## Commit

```
Phase 10 - Hardening
```

---

# 16. Phase 11 — Testing

## Objective

Validate the entire application.

## Includes

- Unit tests
- Integration tests
- Workflow tests
- Permission tests
- Regression tests

Testing coverage should be expanded wherever missing.

The goal is confidence, not an arbitrary coverage percentage.

## Required Reads

- Testing Checklist

## Commit

```
Phase 11 - Testing
```

---

# 17. Phase 12 — Production Readiness

## Objective

Prepare the project for handover.

## Includes

- Production configuration
- Environment example
- README updates
- Setup guide
- Deployment guide
- Configuration documentation
- Human Input Register updates
- Final Deliverables checklist
- Final Handover document

The application should now require only:

- credentials,
- environment variables,
- external service configuration,
- manual UAT.

No coding work should remain.

## Commit

```
Phase 12 - Production Ready
```

---

# 18. Crash Recovery

If execution stops unexpectedly:

1. Read RUNNING.md.
2. Read Project State.md.
3. Verify latest commit.
4. Determine completed phases.
5. Resume from the first incomplete phase.
6. Never restart completed phases unless corruption is detected.

---

# 19. Phase Exit Checklist

Before leaving ANY phase verify:

- Phase objectives complete.
- No incomplete implementation.
- No failing tests.
- No lint errors.
- No build errors.
- Project State updated.
- Resume Summary updated.
- Commit created.
- Chat context can safely be discarded.

Only then proceed to the next phase.

---

# End of Document