# 009 - Git Workflow

# Purpose

This document defines the mandatory Git workflow that the implementation agent shall follow while building the project.

The objectives are:

- Maintain a recoverable repository state.
- Ensure every completed phase is independently restorable.
- Avoid large unreviewable commits.
- Support seamless crash recovery.
- Preserve a clean and understandable project history.
- Prevent loss of work.

This workflow is mandatory throughout the implementation.

---

# Guiding Principles

The repository is the authoritative implementation history.

Every completed phase must result in:

- A working codebase.
- Passing validation checks.
- Updated project state.
- A Git commit.

No completed work may exist only inside the AI conversation.

---

# General Rules

The agent shall:

- Commit only after completing an entire phase.
- Never commit partially completed phases.
- Never skip commits.
- Never rewrite previous commits.
- Never squash commits during implementation.
- Never force-push.
- Never delete history.

Every commit should represent a stable checkpoint.

---

# Phase Completion Sequence

Every phase must follow the exact sequence below.

```
Complete implementation

↓

Run validation

↓

Run tests

↓

Fix failures

↓

Run tests again

↓

Update Project State

↓

Update Human Input Register

↓

Update Deliverables Checklist

↓

Commit

↓

Generate implementation summary

↓

Flush conversation/context

↓

Begin next phase
```

No step may be skipped.

---

# Commit Requirements

A phase is considered complete only if:

- All planned work for the phase is finished.
- The project builds successfully.
- All required tests pass.
- No known breaking issues remain.
- Documentation has been updated where required.
- Project State has been updated.
- Human Input Register has been updated.
- Deliverables Checklist has been updated.

Only then may the phase be committed.

---

# Commit Message Format

Every commit shall use the following format.

```
Phase <Number>: <Short Description>
```

Examples

```
Phase 1: Initialize project structure

Phase 2: Implement authentication

Phase 3: Implement workflow engine

Phase 4: Build dashboard module

Phase 5: Complete notification system
```

Commit messages should describe the completed phase rather than individual code changes.

---

# One Commit Per Phase

Exactly one primary implementation commit shall exist for each completed phase.

Avoid creating multiple commits for the same phase unless absolutely necessary to recover from an unexpected interruption.

The goal is a clean, readable implementation history.

---

# Emergency Recovery Commits

If an interruption is unavoidable (IDE crash, environment failure, repository corruption risk, etc.), the agent may create an intermediate recovery commit.

Recovery commits shall use the format:

```
WIP Recovery: <Short Description>
```

Example

```
WIP Recovery: Workflow engine checkpoint
```

Rules:

- Recovery commits exist only to preserve work.
- Resume implementation immediately afterward.
- The final phase commit remains mandatory.
- Recovery commits should be rare.

---

# Commit Contents

Each phase commit should include:

- Source code.
- Configuration changes.
- Tests.
- Documentation updates.
- Generated files that belong in version control.
- Migration scripts (if applicable).

Do not omit related changes from the commit.

---

# Files That Must Be Updated Before Commit

Before every phase commit, verify that the following documents are updated:

- Project State
- Human Input Register
- Deliverables Checklist

If any of these files require changes, update them before committing.

---

# Validation Before Commit

Before creating a commit, the agent shall verify:

- Project builds successfully.
- Linting passes.
- Formatting passes.
- Type checking passes.
- Unit tests pass.
- Integration tests pass (if applicable).
- No intentionally failing tests remain.
- No temporary debugging code remains.
- No placeholder implementations remain.
- No unfinished TODOs remain unless explicitly tracked for a later phase.

If any validation fails:

Do not commit.

Fix the issue first.

---

# Generated Files

Do not commit:

- Temporary files.
- Cache directories.
- Local environment files.
- Personal IDE settings.
- Local secrets.
- Build artifacts that should be ignored.

Respect the repository's ignore rules.

---

# Configuration Files

Configuration templates required by the project should be committed.

Examples:

- example environment files
- sample configuration
- default configuration

Sensitive values must never be committed.

All environment-specific values must remain configurable, consistent with the project's architecture and development standards. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# Documentation Synchronization

Whenever implementation changes affect architecture or developer-facing behavior, update the relevant project documentation before committing.

The repository should remain internally consistent.

Implementation should never permanently diverge from documented behavior.

---

# Git Tags (Optional)

If repository policy allows tags, create lightweight milestone tags after major milestones.

Example:

```
phase-01

phase-02

phase-03
```

Tags are optional.

Commits are mandatory.

---

# Branch Policy

Implementation should occur on the assigned working branch.

Do not create additional branches unless explicitly instructed.

Do not merge into the main branch.

Do not rebase shared branches.

Leave merge operations to the human maintainer.

---

# Commit Integrity Checklist

Before every commit confirm:

- Phase completed.
- Tests passed.
- Build passed.
- Documentation updated.
- Project State updated.
- Human Input Register updated.
- Deliverables Checklist updated.
- Repository is in a clean state.
- No temporary code remains.

Only then create the commit.

---

# Post-Commit Actions

Immediately after committing:

1. Record the commit hash inside Project State.
2. Record the completed phase.
3. Record the completion timestamp.
4. Summarize work completed during the phase.
5. Record any remaining non-blocking items.
6. Flush the current chat/context.
7. Start the next phase by reloading only the documents required by:
   - RUNNING.md
   - Project State
   - The next phase definition
   - Any referenced implementation documents

This minimizes token usage while ensuring deterministic recovery.

---

# Crash Recovery

If implementation resumes after interruption:

1. Read `000 - RUNNING.md`.
2. Read the current `Project State`.
3. Verify the latest commit.
4. Verify repository status.
5. Resume from the first incomplete phase.
6. Never repeat completed work unless verification proves it is incomplete.

The Git history and Project State together form the single source of truth for implementation progress.

---

# Final Repository State

At project completion:

The repository should contain:

- Complete implementation.
- Passing tests.
- Clean Git history.
- One completed commit per phase.
- Updated documentation.
- Final Project State.
- Completed Deliverables Checklist.
- Final Handover document.
- No known blocking defects.

The only remaining work should be human-controlled deployment configuration, credential setup, environment configuration, and manual acceptance testing, consistent with the project's workflow-first architecture and operational goals. :contentReference[oaicite:2]{index=2}