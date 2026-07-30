# 007 - Configuration Rules.md

# Purpose

This document defines the configuration philosophy for the coding agent.

The objective is to ensure that **all business decisions, environment-specific values, and operational choices are configurable rather than hardcoded**, while keeping the implementation simple and maintainable.

This document complements the project's architectural principle of "Configuration Over Hardcoding" and the existing Settings/Master Data design. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# Guiding Principle

The coding agent shall assume:

> Every business decision is expected to change in the future.

Therefore:

- Business values belong in configuration.
- Technical implementation belongs in code.
- Secrets belong in environment variables.
- User-provided values belong in documented setup instructions.

Never mix these responsibilities.

---

# Configuration Hierarchy

The project shall separate configuration into the following categories.

```
Environment Variables

↓

Application Config

↓

Master Data

↓

Business Rules

↓

Code
```

Only the bottom layer (code) should contain implementation logic.

Everything else should remain configurable.

---

# Rule 1 — Never Hardcode Business Values

The following values must never be embedded directly into application logic.

Examples include:

- Series
- Sub-Series
- Platform Names
- Company Name
- Application Name
- Branding
- Email Sender
- URLs
- Dashboard Labels
- Sheet Names
- Sheet IDs
- Workflow Labels
- Status Display Names
- Notification Templates
- Feature Toggles

If such a value appears inside implementation code, move it into configuration.

---

# Rule 2 — Business Rules vs Business Data

Business **data** is configurable.

Business **logic** is not.

Example

Good

```
Series

NKPS

ATMC

Prayer
```

loaded from configuration.

Bad

```
if series == "NKPS"
```

throughout the codebase.

Instead

```
if series == configuredSeries.NKPS
```

or equivalent.

---

# Rule 3 — Environment Variables

Anything specific to a deployment environment must use environment variables.

Examples include:

- Google OAuth Client ID
- Google OAuth Secret
- Session Secret
- API Keys
- SMTP Credentials
- Google Sheet ID
- Apps Script URL
- Base URL
- Production URL
- Development URL

Never commit secrets.

Never hardcode secrets.

Never invent placeholder credentials.

Provide a `.env.example` (or equivalent) documenting every required variable.

---

# Rule 4 — Application Configuration

Create a central configuration layer.

It should contain items such as:

- Application Name
- Company Name
- Logo Path
- Timezone
- Date Format
- Default Pagination
- Default Sorting
- Feature Flags
- Default Dashboard Behaviour

The application should read these values once and reuse them throughout the system.

---

# Rule 5 — Master Data

Business master data should be editable without changing application code wherever appropriate, consistent with the project's Settings module design. :contentReference[oaicite:2]{index=2}

Examples include:

- Series
- Sub-Series
- Social Platforms
- Branding
- Sender Name
- Reply-To Email

The implementation should support future additions without structural changes where the architecture already expects extensibility. :contentReference[oaicite:3]{index=3}

---

# Rule 6 — Feature Flags

Any feature likely to be enabled or disabled in the future should be controlled using configuration.

Examples:

```
Enable Email Notifications

Enable Activity Log

Enable Debug Logging

Enable Demo Mode

Enable Development Tools
```

Feature flags should never require editing multiple files.

---

# Rule 7 — Constants

Reusable constants should exist in a single location.

Examples

```
Workflow Statuses

Notification Types

Route Names

Permission Names

Role Names
```

Avoid duplicate string literals across the codebase.

---

# Rule 8 — UI Configuration

Visual constants should be centralized.

Examples:

- Theme
- Status Colors
- Badge Labels
- Navigation Labels
- Icons
- Table Defaults
- Pagination Defaults

The implementation should support changing these without searching the entire repository.

---

# Rule 9 — Email Configuration

Email behaviour should be configurable.

Examples:

- Sender Name
- Reply-To
- Footer
- Application Link
- Subject Prefix

Email templates themselves should exist as reusable template files rather than inline code, aligning with the project's email template specification. :contentReference[oaicite:4]{index=4}

---

# Rule 10 — Google Sheets Configuration

Nothing related to Google Sheets should be hardcoded.

Examples:

- Spreadsheet ID
- Sheet Names
- Column Mapping
- Apps Script URL

These values should be configurable so deployments do not require code changes.

---

# Rule 11 — Human-Supplied Values

Whenever the coding agent discovers information that only the project owner can provide, it shall:

1. Stop inventing values.
2. Record the requirement in:

```
011 - Human Input Register.md
```

3. Continue implementing everything else that is not blocked.

Examples include:

- OAuth Credentials
- Production URLs
- Company Logo
- Domain Name
- Google Workspace Configuration
- Deployment Account Details

---

# Rule 12 — Configuration Documentation

Every configuration item must be documented.

For each item include:

- Name
- Purpose
- Default Value (if applicable)
- Required?
- Environment Specific?
- Example Value

Nothing should exist as an undocumented configuration option.

---

# Rule 13 — Configuration Validation

Validate configuration during application startup where practical.

Examples:

- Missing required environment variables
- Invalid URLs
- Missing Sheet IDs
- Empty application name

Fail early with clear developer-facing errors rather than failing unpredictably later.

---

# Rule 14 — Sensible Defaults

Optional configuration should have reasonable defaults.

Required configuration must never silently fall back to incorrect values.

Example

Good

```
PAGE_SIZE=25
```

Bad

```
Missing Google Sheet ID

↓

Automatically create one
```

---

# Rule 15 — Avoid Over-Configuration

Not everything belongs in configuration.

Do NOT make configurable:

- Permission Model
- Workflow Logic
- Core Architecture
- Security Rules
- Data Integrity Rules

Those are implementation responsibilities defined by the project architecture and business rules. :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

# Rule 16 — Single Source of Configuration

Each configuration item must exist in exactly one place.

Avoid:

- Duplicate constants
- Duplicate environment variables
- Multiple definitions of the same setting

The application should always read from the authoritative configuration source.

---

# Rule 17 — Config Review Before Phase Completion

Before completing each implementation phase, verify:

- No new business values have been hardcoded.
- Newly discovered configurable items have been moved into configuration.
- Documentation has been updated.
- Required human inputs have been recorded if necessary.

---

# Completion Criteria

This document is considered satisfied when the coding agent consistently ensures that:

- Business values are configurable.
- Secrets use environment variables.
- Master data is centralized.
- Constants are not duplicated.
- Configuration is documented.
- Missing user-provided values are recorded instead of invented.
- The application can be adapted to a new deployment with configuration changes rather than code changes.

---
End of Document