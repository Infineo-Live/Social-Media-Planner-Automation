# 014 - Security & Access Control

**Project:** Infineo – Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines how the application secures data, controls user access, prevents unauthorized actions, and protects the integrity of the workflow.

The application is an internal company tool and is intended to be accessed only by authorized team members using their company Google accounts.

Security should remain simple, practical, and sufficient for an internal workflow application without introducing unnecessary complexity.

---

# 2. Security Principles

The application follows these principles:

- Every user has their own account.
- No shared logins.
- Every action is attributable to a specific user.
- Users only see and perform actions allowed by their role.
- Workflow integrity cannot be bypassed.
- Every important action is recorded.
- The Google Sheet acts as the data store and is never edited directly by employees.

---

# 3. Authentication

Authentication is handled using the user's Google account.

The application identifies the logged-in user through their authenticated Google Workspace email address.

Example:

```
user@company.com
```

No usernames are maintained.

No passwords are stored inside the application.

---

# 4. Authorized Users

Only users listed in the **Users** sheet may access the application.

If a user's email does not exist in the Users sheet:

- Login is denied.
- No application data is loaded.
- An access denied message is displayed.

---

# 5. Active / Inactive Users

Every user has an Active flag.

Values:

- Active
- Inactive

Inactive users:

- Cannot log in.
- Cannot receive new assignments.
- Remain visible in historical records.
- Continue to appear in activity logs for past actions.

No historical data is deleted.

---

# 6. User Identity

Every user record contains:

- User ID
- Full Name
- Email Address
- Role
- Active Status

The Email Address is the unique identifier.

Email addresses cannot be duplicated.

---

# 7. Role-Based Access Control

The application supports three roles.

- Admin
- Manager
- Employee

Permissions are determined entirely by role.

Users cannot change their own role.

---

# 8. Permission Matrix

| Action | Employee | Manager | Admin |
|---------|----------|----------|--------|
| Login | ✓ | ✓ | ✓ |
| View Dashboard | ✓ | ✓ | ✓ |
| View Assigned Tasks | ✓ | ✓ | ✓ |
| Create Idea | ✓ | ✓ | ✓ |
| Edit Own Draft | ✓ | ✓ | ✓ |
| Claim Available Work | ✓ | ✓ | ✓ |
| Submit for Review | ✓ | ✓ | ✓ |
| View Other Users' Tasks | No | ✓ | ✓ |
| Assign Work | No | ✓ | ✓ |
| Reassign Work | No | ✓ | ✓ |
| Approve Manager Review | No | ✓ | ✓ |
| Final Approval | No | No | ✓ |
| Reject Submission | No | ✓ | ✓ |
| Schedule Content | No | ✓ | ✓ |
| Mark Uploaded | No | ✓ | ✓ |
| Edit System Settings | No | No | ✓ |
| Manage Users | No | No | ✓ |

---

# 9. Visibility Rules

## Employee

Employees can view:

- Their own dashboard
- Their assigned work
- Available work
- Their submitted work
- Their completed work
- Their own notifications

Employees cannot browse every content item unless assigned or available for claiming.

---

## Manager

Managers can view:

- All content
- All series
- All dashboards
- All employees
- Pending approvals
- Assignment information
- Scheduling information

---

## Admin

Admins can access every screen and every record.

No restrictions apply.

---

# 10. Edit Permissions by Workflow Stage

Users may only edit information appropriate to the current workflow stage.

Example:

Idea stage:

- Idea creator may edit the idea until submission.

After submission:

- The creator can no longer edit the idea unless it is returned.

Script Check:

- Only the assigned reviewer may approve or reject.

Metadata stage:

- Only the assigned employee may edit metadata.

Scheduled:

- Metadata becomes read-only.

Uploaded:

- Content becomes fully read-only.

---

# 11. Record Ownership

Every Content Item stores:

- Created By
- Current Assigned User

These values serve different purposes.

Created By never changes.

Assigned User changes throughout the workflow.

---

# 12. Assignment Security

Only one user may be assigned to a Content Item at a time.

The application prevents multiple simultaneous assignments.

When work is reassigned:

- Previous assignment is removed.
- New assignment is created.
- Activity is logged.

---

# 13. Workflow Protection

Users cannot manually select arbitrary workflow statuses.

Workflow progression occurs only through application actions.

Examples:

Employee:

```
Submit Script
```

changes

```
Script WIP

↓

Script Check
```

Manager:

```
Approve Script
```

changes

```
Script Check

↓

Script Approved by Manager
```

The status cannot be manually edited.

---

# 14. Direct Spreadsheet Protection

Employees never interact directly with the Google Sheet.

The Google Sheet functions only as the application's data store.

All changes occur through the application.

Direct editing permissions should be restricted to authorized administrators only.

---

# 15. Data Validation

Before any record is saved, the application validates:

- Required fields
- Valid workflow transition
- User permissions
- Valid assignment
- Existing Content Item
- Existing User
- Required metadata (when applicable)

Invalid operations are rejected.

---

# 16. Duplicate Protection

The application prevents accidental duplicate operations where possible.

Examples:

- Double approval
- Double scheduling
- Duplicate assignment
- Duplicate upload confirmation

Repeated clicks should not create duplicate records or inconsistent states.

---

# 17. Session Security

Every request validates:

- Logged-in user
- Active status
- Authorized role

If validation fails:

- Request is rejected.
- No data is modified.

---

# 18. Activity Logging

The following actions are logged:

- Login
- Idea creation
- Assignment
- Reassignment
- Status changes
- Approval
- Rejection
- Scheduling
- Upload confirmation
- Metadata completion
- Settings changes
- User management actions

Each log entry records:

- Timestamp
- User
- Content Item
- Action
- Previous Value (if applicable)
- New Value (if applicable)

Activity logs are append-only.

They cannot be edited through the application.

---

# 19. Deletion Policy

Content Items are never permanently deleted through the application.

If removal is required:

- Record is marked as Archived.

Archived items:

- Do not appear in normal views.
- Continue to exist for reporting and audit purposes.

---

# 20. User Removal Policy

Users are never deleted.

Instead:

- Active Status is changed to Inactive.

Historical ownership remains intact.

---

# 21. Audit Integrity

Historical workflow records must always remain accurate.

Changing current assignments, roles, or names must not alter historical activity records.

Every recorded action represents the state of the system at the time the action occurred.

---

# 22. Security Assumptions

The application assumes:

- Users access the application using trusted company Google accounts.
- Company administrators manage Google account security.
- Users are responsible for protecting their own Google accounts.
- Physical device security is outside the scope of this application.

---

# 23. Out of Scope

The application does not implement:

- Multi-factor authentication (handled by Google)
- Password storage
- Password reset functionality
- IP restrictions
- Device management
- Advanced intrusion detection
- Encryption key management
- Public user access
- Anonymous access
- Guest accounts

These are intentionally excluded to keep the system aligned with its internal-use purpose.

---

# Dependencies

### Depends On

- 003 - User Roles & Permissions.md
- 004 - Data Model.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md

### Referenced By

- 015 - UI Design System.md
- 018 - Development Standards.md
- 019 - Testing Checklist.md
```