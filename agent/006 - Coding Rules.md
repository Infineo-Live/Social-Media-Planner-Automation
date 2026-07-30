# 006 - Coding Rules

# Purpose

This document defines the implementation rules that the AI Coding Agent MUST follow while building the project.

These rules govern **how code is written**, **how architectural decisions are made**, and **how implementation work is performed**.

This document complements the project architecture and business documentation. If a conflict exists, the project architecture and business documents always take precedence. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# Core Principle

The objective is **not** to write clever code.

The objective is to produce:

- predictable code
- maintainable code
- readable code
- production-ready code
- testable code
- deterministic code

The implementation should optimize for long-term maintenance rather than short-term convenience.

---

# General Rules

The agent SHALL:

- follow every architecture document
- follow every business rule
- follow every workflow rule
- follow every security rule
- follow every testing rule
- never intentionally violate documented requirements
- never invent undocumented business logic
- never silently ignore conflicting requirements

If ambiguity exists:

- search the documentation first
- if still unresolved, record the issue in **Human Input Register**
- continue with every non-blocking task

---

# Read Before Coding

Before writing any code, the agent shall understand:

- Project Overview
- Business Requirements
- System Architecture
- Workflow Engine
- Business Rules
- Development Standards
- Security
- Testing Checklist

These documents define the business truth.

Implementation must never contradict them. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

# Architecture First

Never begin implementation by creating UI.

Implementation order should always follow:

1. Configuration
2. Types / Models
3. Data layer
4. Business logic
5. Workflow engine
6. Services
7. Authentication
8. API layer
9. UI
10. Tests
11. Documentation

UI must always consume existing business logic.

Business logic must never live inside UI components.

---

# No Business Logic Inside UI

UI components may:

- render data
- collect user input
- invoke actions
- display validation
- display errors

UI components MUST NOT:

- calculate workflow transitions
- determine permissions
- assign users
- manipulate business rules
- validate workflow
- update Sheets directly

---

# Single Responsibility

Every module should have one responsibility.

Examples:

Authentication

→ authentication only

Workflow Engine

→ workflow only

Notifications

→ notifications only

Google Sheets layer

→ persistence only

Dashboard

→ presentation only

Avoid "utility" files that slowly become dumping grounds.

---

# File Size

Prefer smaller focused files.

Guidelines:

- avoid files exceeding ~500 lines where practical
- split large modules logically
- group related code together

Do not split code solely to reduce line count.

---

# Naming

Names must clearly communicate intent.

Good:

```
createContentItem()
```

```
approveScript()
```

```
assignTask()
```

Avoid:

```
process()
```

```
handle()
```

```
temp()
```

```
value2()
```

```
misc.ts
```

---

# Folder Organization

Organize code by responsibility.

Example:

```
authentication/

workflow/

dashboard/

notifications/

config/

types/

services/

repositories/

components/

pages/

hooks/

utils/
```

Avoid folders such as:

```
misc/

random/

new/

temp/
```

---

# Configuration First

Business values MUST NOT be hardcoded.

Examples include:

- workflow statuses
- platforms
- series
- email sender
- dashboard values
- labels
- application name
- feature toggles
- URLs
- limits
- environment values

If a value may reasonably change without requiring new application logic, it belongs in configuration. This follows the project's "configuration over hardcoding" architectural principle. :contentReference[oaicite:7]{index=7}

---

# Constants

Avoid repeating literals.

Use constants for:

- status names
- sheet names
- routes
- permissions
- notification types
- storage keys
- error codes

Never duplicate the same literal throughout the project.

---

# Type Safety

Use strong typing everywhere practical.

Avoid:

```
any
```

Prefer:

- explicit interfaces
- domain models
- enums
- discriminated unions
- typed configuration

Type assertions should be minimized.

---

# Validation

Validate all external input.

Examples:

- forms
- URL parameters
- query parameters
- Google Sheets data
- configuration
- environment variables

Never trust external data.

---

# Error Handling

Handle expected failures.

Examples:

- authentication failures
- missing records
- invalid workflow
- missing configuration
- network failures
- Google API failures

Never silently swallow errors.

Log enough information for debugging without exposing sensitive information to users. :contentReference[oaicite:8]{index=8}

---

# Logging

Log important events only.

Examples:

- authentication
- workflow changes
- failed API calls
- failed validation
- unexpected exceptions

Avoid excessive debug logging.

Production logs should remain meaningful.

---

# Comments

Prefer self-explanatory code.

Write comments only when explaining:

- business intent
- non-obvious reasoning
- architectural constraints

Avoid comments that merely restate code.

Bad:

```ts
// increment i
i++;
```

Good:

```ts
// Preserve original creator for future rejection routing.
```

---

# Duplication

Avoid duplicated logic.

If identical business logic appears more than once:

extract it.

Do not over-abstract prematurely.

---

# Dependencies

Prefer existing project dependencies.

Do not introduce a new library unless it provides significant value.

Before adding any dependency:

- verify existing tools cannot solve the problem
- prefer mature, actively maintained libraries
- avoid experimental packages

---

# Workflow Engine

Workflow rules must exactly match the documented workflow.

Never simplify workflow logic.

Never merge workflow stages.

Never invent workflow transitions.

Implementation must mirror the Workflow Engine documentation exactly. :contentReference[oaicite:9]{index=9}

---

# Permissions

Permissions must be enforced on the server/business layer.

Never rely solely on:

- hidden buttons
- disabled UI
- client-side checks

Every protected operation must verify authorization. :contentReference[oaicite:10]{index=10}

---

# Google Sheets

The application owns business operations.

Google Sheets are the persistence layer only.

Do not embed business rules into spreadsheet structure.

Avoid unnecessary reads and writes.

Prefer batching where appropriate.

Maintain consistency of records.

---

# Performance

Prefer:

- batching
- caching where safe
- minimal reads
- minimal writes
- lazy loading when appropriate

Avoid premature optimization.

Correctness always comes before optimization.

---

# Security

Never expose:

- secrets
- API keys
- tokens
- credentials

Secrets belong only in environment configuration.

Never commit secrets.

---

# Feature Development

Complete features vertically.

Example:

Configuration

↓

Types

↓

Repository

↓

Business Logic

↓

API

↓

UI

↓

Tests

↓

Documentation

Do not partially implement features.

---

# Refactoring

Refactor whenever it significantly improves:

- readability
- maintainability
- duplication
- modularity

Do not refactor unrelated code simply because it could be improved.

---

# Technical Debt

Do not knowingly introduce technical debt.

If a compromise is unavoidable:

- document it
- explain why
- record it in Project State if future work is required

---

# Testing During Development

Every completed feature should be verified before proceeding.

Minimum verification:

- build succeeds
- lint succeeds
- type checking succeeds
- feature tests succeed
- existing tests remain green

No phase is complete with failing tests. :contentReference[oaicite:11]{index=11}

---

# Documentation

Whenever implementation changes architecture, configuration, setup, or developer workflow:

update the corresponding documentation within the same phase.

Documentation is part of the deliverable.

---

# Commit Readiness

Do not commit code unless:

- implementation is complete
- tests pass
- lint passes
- build passes
- documentation updated
- Project State updated

---

# Completion Standard

Implementation is considered complete only when:

- code is production-ready
- configuration is externalized
- tests pass
- documentation is updated
- no placeholder code remains
- no TODO comments remain
- no mocked business logic remains unless explicitly required by the architecture

The Coding Agent must leave the repository in a deployable, deterministic state at the end of every completed phase.