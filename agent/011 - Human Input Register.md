# 011 - Human Input Register

**Purpose**

This document is the single source of truth for every piece of information that must be provided by the human project owner.

The implementation agent must **NOT interrupt implementation** whenever a missing business decision, credential, configuration value, deployment setting, or environment-specific value is encountered unless it is absolutely impossible to continue.

Instead, the agent shall record the requirement in this document and continue implementing everything else.

The objective is to ensure the project reaches a production-ready state with only final configuration and human testing remaining.

---

# 1. Guiding Principles

The Human Input Register exists to maximize uninterrupted implementation.

The implementation agent shall always prefer one of the following:

1. Continue with sensible placeholders.
2. Continue with configurable defaults.
3. Continue with feature flags disabled.
4. Record the missing information here.
5. Proceed to the next task.

The implementation agent shall stop only if implementation is technically impossible without the missing information.

---

# 2. Inputs That Must Be Recorded

The following categories belong in this register.

- Environment variables
- API credentials
- OAuth configuration
- Deployment configuration
- Production URLs
- Google Workspace configuration
- Google Sheets IDs
- Domain names
- Email sender configuration
- Branding assets
- Business-specific configurable values
- Production secrets
- Any decision intentionally deferred to the project owner

Anything that cannot reasonably be hardcoded into Version 1 shall be documented here instead of blocking implementation.

---

# 3. Inputs That Must NOT Be Recorded

Do not record:

- Questions already answered by the architecture documents.
- Implementation choices.
- Coding decisions.
- Framework decisions.
- Library choices.
- Internal TODOs.
- Bugs.
- Technical debt.

Those belong elsewhere.

---

# 4. Register Format

Every pending item shall follow exactly this structure.

```text
ID:
HI-001

Title:
Google OAuth Client ID

Reason:
Required for Google Authentication.

Required During:
Deployment

Blocking:
No

Temporary Placeholder:
USE_CONFIG_VALUE

Configuration Location:
/config/auth.ts

Status:
Pending

Resolved Value:
<empty>

Notes:
Obtain from Google Cloud Console.
```

Every field is mandatory.

---

# 5. Blocking Levels

Every request must be classified.

## Blocking

Implementation cannot continue.

This should be extremely rare.

Examples:

- Required external API specification unavailable
- Required architecture document missing

---

## High

Needed before deployment.

Implementation should continue using placeholders.

Examples:

- OAuth Client ID
- OAuth Secret
- Production Domain
- Google Sheet ID

---

## Medium

Needed before production rollout.

Examples:

- Company Logo
- Email Sender Name
- Branding
- Company Name

---

## Low

Optional enhancements.

Examples:

- Default welcome message
- Optional branding assets
- Analytics configuration

---

# 6. Placeholder Rules

Whenever possible, implementation shall continue using placeholders.

Examples

```text
YOUR_GOOGLE_CLIENT_ID

YOUR_GOOGLE_CLIENT_SECRET

YOUR_SHEET_ID

YOUR_DOMAIN

YOUR_COMPANY_NAME
```

Hardcoded production values are never permitted.

All placeholders must come from configuration.

---

# 7. Configuration Rule

Every item recorded here must ultimately map to configuration.

The implementation agent must never hardcode business values inside application logic.

If a new configurable business decision is discovered during implementation, the agent shall:

1. Move it into the configuration system.
2. Add documentation.
3. Record it here if human input is required.

This aligns with the project's configuration-over-hardcoding architecture and development standards. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

---

# 8. Discovery Rules

During implementation, the agent must actively detect missing information.

Examples include:

- OAuth credentials
- Environment variables
- Deployment URLs
- Production email sender
- Google Workspace settings
- Google Sheet IDs
- External service credentials
- Production branding assets

Whenever discovered:

- Continue implementation.
- Record the item.
- Do not stop the project.

---

# 9. Updating Existing Entries

If additional information about an existing item becomes available:

- Update the existing record.
- Never create duplicate entries.
- Preserve the original ID.

---

# 10. Completion Rule

When an item has been supplied by the project owner:

Update:

```text
Status:
Completed
```

Populate:

```text
Resolved Value:
```

Remove any placeholder references where appropriate.

---

# 11. Final Validation

Before declaring the project complete, verify:

- Every required human input has been recorded.
- Every required configuration item exists.
- Every placeholder is documented.
- Every unresolved production dependency appears in this register.
- No business values remain hardcoded.

---

# 12. End-of-Project Output

During the final handover, generate a concise checklist for the project owner using only unresolved items from this register.

The checklist should answer:

- What must be created?
- Where should it be created?
- Where should the value be placed?
- Which configuration file or environment variable requires it?
- Whether the application can run without it.

No additional implementation work should remain beyond:

- Providing the requested values
- Deploying the application
- Performing manual UAT

---

# 13. Initial Register

## HI-001

**Title**

None

**Reason**

No human input currently required.

**Required During**

N/A

**Blocking**

No

**Temporary Placeholder**

N/A

**Configuration Location**

N/A

**Status**

Pending Discovery

**Resolved Value**

N/A

**Notes**

This register starts empty. The implementation agent shall populate it incrementally as genuine human inputs are discovered during development. Avoid speculative entries.