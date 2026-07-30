# 008 - Testing Rules

**Document Version:** 1.0

---

# Purpose

This document defines the mandatory testing process the coding agent must follow throughout implementation.

Testing is **not** a final phase.

Testing is part of every implementation phase.

A phase is considered complete only when:

- Implementation is complete.
- The project builds successfully.
- All applicable automated tests pass.
- No regressions are introduced.
- The repository is committed.
- Project State has been updated.

The objective is to prevent defects from accumulating until the end of the project.

These rules complement the project's functional testing checklist and development standards but define the agent's execution behavior during implementation. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# Core Principles

The agent shall follow these principles without exception.

1. Test continuously.
2. Never postpone testing until the end.
3. Prefer catching failures immediately after implementation.
4. Never commit code that knowingly fails tests.
5. Never ignore failing tests.
6. Never disable tests simply to make the build pass.
7. Never reduce test coverage to hide failures.
8. Every regression must be investigated before continuing.
9. The application must remain in a working state after every completed phase.
10. If a test reveals an architectural issue, fix the implementation instead of weakening the test.

---

# Testing Responsibilities

The agent is responsible for verifying:

- Code correctness
- Build correctness
- Type correctness
- Lint correctness
- Module integration
- Existing feature stability
- Newly implemented functionality

The agent is **not** responsible for final human acceptance testing.

Human testing occurs only after the entire implementation has finished.

---

# Testing Frequency

Testing is mandatory:

- Before committing a phase.
- After significant architectural changes.
- After introducing new modules.
- After modifying shared utilities.
- Before beginning the next phase.

Testing is **not** optional.

---

# Required Verification Order

After completing implementation work for a phase, the agent shall execute verification in the following order.

## Step 1

Run formatting checks (if configured).

---

## Step 2

Run static analysis.

Examples include:

- Type checking
- Static validation
- Schema validation

---

## Step 3

Run linting.

There shall be:

- no lint errors
- no ignored failures

Warnings may remain only if intentionally documented.

---

## Step 4

Run project build.

The build must complete successfully.

No compilation failures are permitted.

---

## Step 5

Run automated tests.

This includes every relevant automated test suite available in the project.

Examples include:

- Unit Tests
- Integration Tests
- Component Tests
- API Tests

The exact commands depend on the technology stack.

---

## Step 6

Run phase-specific smoke tests.

The agent shall manually verify the feature(s) implemented during the current phase.

Smoke tests should confirm that:

- application starts
- affected pages load
- primary workflows execute
- no obvious regressions exist

---

## Step 7

If all verification succeeds:

- update Project State
- create Git commit
- continue to next phase

---

# Phase Completion Rule

A phase is complete only if **all** of the following are true.

- Code implemented.
- Build successful.
- Tests passed.
- Smoke tests passed.
- Documentation updated (if required).
- Project State updated.
- Git commit created.

Otherwise:

Phase remains **Incomplete**.

---

# Handling Test Failures

If any test fails:

The agent shall:

1. Stop progressing to the next phase.
2. Diagnose the failure.
3. Determine whether:
   - implementation caused the failure,
   - previous code contained the defect,
   - configuration is incorrect,
   - the test itself is invalid.
4. Apply the smallest correct fix.
5. Re-run the entire verification sequence.

The agent must never assume a failure is unrelated.

---

# Regression Policy

Whenever existing behavior fails after new implementation:

The regression must be fixed immediately.

The agent must never defer regression fixes to a later phase.

---

# New Feature Testing

Every newly implemented feature should receive appropriate automated tests where practical.

Examples include:

- Business logic
- Workflow transitions
- Permission checks
- Validation rules
- Utility functions
- Data transformations

Avoid writing brittle tests for implementation details.

Test observable behavior instead.

---

# Business Rule Validation

Where applicable, tests should verify business behavior defined by the project architecture.

Examples include:

- Valid workflow transitions only.
- One active assignee per content item.
- Role-based permissions.
- Metadata validation before completion.
- Episode numbering constraints.
- Activity logging.
- Notification triggers.

These behaviors are fundamental to the application and should not regress. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}

---

# Configuration Testing

Whenever configuration is added or modified, verify:

- defaults load correctly
- invalid configuration fails safely
- optional values behave correctly
- documented examples remain valid

Business configuration should remain externalized rather than hardcoded. :contentReference[oaicite:5]{index=5}

---

# UI Verification

When UI is modified, verify at minimum:

- application loads
- navigation works
- affected screens render
- forms submit
- validation displays correctly
- permissions behave correctly
- obvious layout breakage is absent

Visual perfection is not required during implementation.

Functional correctness is.

---

# API Verification

If backend APIs exist, verify:

- successful responses
- validation failures
- authorization failures
- expected error responses
- response formats

---

# Database Verification

Whenever persistence logic changes:

Verify:

- records save correctly
- updates succeed
- reads return expected data
- no duplicate records created
- required constraints enforced

---

# Logging Verification

Where logging exists, verify:

- expected events are recorded
- sensitive information is not logged
- duplicate log entries are not generated

---

# Error Handling Verification

Verify common failure paths.

Examples:

- invalid input
- unauthorized actions
- missing records
- invalid workflow transitions
- configuration errors

The application should fail safely and preserve data integrity. :contentReference[oaicite:6]{index=6}

---

# Performance Sanity Check

The agent is not expected to perform full benchmarking.

However, obvious performance regressions should be avoided.

Examples include:

- unnecessary repeated reads
- duplicate API requests
- excessive rendering
- avoidable loops
- unnecessary database writes

---

# Before Every Commit

Before creating a commit, confirm:

- Build passes.
- Tests pass.
- Lint passes.
- No debugging code remains.
- No temporary files remain.
- No commented-out experimental code remains.
- No placeholder implementations remain.
- No unresolved merge conflicts exist.

---

# Before Starting Next Phase

Before beginning the next phase:

1. Ensure current phase passed verification.
2. Update Project State.
3. Record any unresolved non-blocking issues.
4. Commit current work.
5. Generate a concise implementation summary.
6. Clear conversation context as defined in **005 - Context Management.md**.
7. Reload only the required documents for the next phase.

---

# Final Project Verification

After all implementation phases are complete:

Execute one complete verification cycle covering the entire project.

This includes:

- Full build
- Full automated test suite
- Full lint
- Full type checking
- Final smoke test
- Verification against the project architecture
- Verification against the functional testing checklist before handover. :contentReference[oaicite:7]{index=7}

---

# Human Acceptance Testing

The coding agent shall **not** attempt to simulate human acceptance testing.

Instead, the final handover shall provide:

- deployment steps
- environment variables
- external services requiring setup
- configuration checklist
- manual testing checklist
- known limitations (if any)

Only after this handover is the project considered ready for human validation.

---

# Success Criteria

Testing has been performed correctly when:

- Every phase completed with passing verification.
- No failing automated tests remain.
- No known regressions remain.
- Every phase is independently buildable.
- Final verification succeeds.
- Human testers receive a stable project requiring only configuration and acceptance testing.