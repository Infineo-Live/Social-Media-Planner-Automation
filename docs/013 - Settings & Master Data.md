# 013 - Settings & Master Data

**Project:** Infineo - Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines all configurable values ("master data") used by the application.

Master Data exists to ensure that administrators can manage business-specific values without requiring code changes.

This document only covers configurable application data. It does not define workflow logic or business rules.

---

# 2. Design Principles

The Settings module should remain intentionally small.

Only values that are reasonably expected to change over time should be configurable.

Core workflow logic, permissions, and application behavior must never be configurable from the Settings module.

---

# 3. Settings Module

The application contains a single **Settings** section.

Only **Admin** users can access it.

Managers and Employees cannot view or modify application settings.

---

# 4. Master Data

The following master data exists within the application.

---

# 4.1 Series

Represents the primary content categories.

Default values:

- Neo Ki Paathshala (NKPS)
- Ancient Traditions Modern Curiosity (ATMC)
- Fun Reel
- Ad Reel
- Prayer / Shloka

Each Series contains:

| Field | Description |
|----------|-------------|
| Name | Full display name |
| Short Code | Internal short name (NKPS, ATMC, etc.) |
| Active | Whether the Series can be used for new content |

Series should never be deleted.

If no longer required, it should simply be marked as inactive.

Inactive Series remain visible for historical content.

---

# 4.2 Sub-Series

Sub-Series belong to a single Series.

Examples:

ATMC

- Janmashtami
- Ganpati
- Diwali
- Navratri

NKPS

- Childhood Values
- Relationships

Sub-Series are optional.

A Content Item may exist without belonging to any Sub-Series.

Each Sub-Series contains:

| Field | Description |
|----------|-------------|
| Name | Display Name |
| Parent Series | Associated Series |
| Active | Active / Inactive |

Deleting a Sub-Series is not permitted if existing Content Items reference it.

---

# 4.3 Social Platforms

Supported publishing platforms.

Default values:

- YouTube
- Instagram
- LinkedIn
- Twitter (X)

Each platform contains:

| Field | Description |
|----------|-------------|
| Platform Name | Display Name |
| Active | Enabled for scheduling |

Platform names should remain editable.

However, removing a platform should only deactivate it.

Historical records must remain intact.

---

# 4.4 User Roles

The application supports exactly three user roles.

- Admin
- Manager
- Employee

These roles are fixed.

No custom roles are supported.

No additional permission levels exist.

---

# 4.5 User Status

Each user has an account status.

Available values:

- Active
- Inactive

Inactive users:

- Cannot log in
- Cannot receive assignments
- Remain visible in historical records

---

# 4.6 Notification Types

Notification types are predefined.

Examples include:

- Task Assigned
- Task Reassigned
- Script Submitted
- Script Approved
- Script Rejected
- Reel Submitted
- Reel Approved
- Reel Rejected
- Metadata Required
- Metadata Completed

Notification types are fixed.

Only enable/disable preferences may change in future versions.

---

# 4.7 Email Sender Information

Administrator can configure:

- Sender Name
- Reply-To Email

The actual sending mechanism is defined elsewhere.

---

# 4.8 Application Name

Configurable values:

- Application Name
- Company Name

Used for:

- Header
- Emails
- Browser Title

---

# 4.9 Branding

Configurable branding includes:

- Logo
- Favicon

Branding updates must not affect application functionality.

---

# 4.10 Default Landing Page

Each role has a predefined landing page.

Employee

Dashboard

Manager

Dashboard

Admin

Dashboard

This setting is system controlled.

Not user configurable.

---

# 4.11 Theme

Version 1 supports a single application theme.

No user-selectable themes exist.

No dark mode configuration exists.

---

# 4.12 Date & Time Format

Application uses a single date format throughout.

Format:

DD MMM YYYY

Example:

15 Aug 2026

Time format:

24-hour

Example:

17:30

This is system controlled.

---

# 4.13 Time Zone

Single application timezone.

Configured once.

Used for:

- Activity Logs
- Notifications
- Emails
- Audit History

All users share the same timezone.

---

# 4.14 Default Sorting

Content tables are sorted by:

Newest Created → Oldest

Users may temporarily change sorting while browsing.

The application always restores the default sorting when reopening the page.

---

# 4.15 Search Configuration

Search is enabled for:

- Working Title
- Real Life Problem
- Mythology Story
- Episode Number

No additional searchable fields exist.

---

# 4.16 Dashboard Refresh

Dashboard data refreshes automatically whenever the page is loaded.

No manual refresh interval exists.

---

# 4.17 Episode Number Configuration

Episode Numbers are:

- Optional
- Assigned only during scheduling
- Unique within a Series

The numbering sequence is managed manually by Admin or Manager.

The application does not auto-generate Episode Numbers.

---

# 4.18 Canva Link Configuration

Each Content Item stores:

- One active Canva Link

When a Reel is approved and Metadata work begins, the employee may replace the Canva link with the final version.

The latest Canva link always replaces the previous value.

Previous links are not retained.

---

# 4.19 Platform Scheduling Checklist

Each platform maintains its own scheduling state.

Supported values:

- Not Scheduled
- Scheduled

Each platform is tracked independently.

---

# 4.20 Platform Upload Checklist

Each platform maintains its own upload state.

Supported values:

- Not Uploaded
- Uploaded

Each platform is tracked independently.

---

# 4.21 Activity Log Retention

Activity Logs are permanent.

They are never automatically deleted.

---

# 4.22 Master Data Validation

The application validates that:

- Series names are unique.
- Sub-Series names are unique within a Series.
- User email addresses are unique.
- Platform names are unique.
- Short Codes are unique.

---

# 5. Non-Configurable Items

The following are intentionally fixed and cannot be modified from Settings.

- Workflow statuses
- Workflow sequence
- User roles
- Permission matrix
- Approval flow
- Assignment rules
- Dashboard structure
- Screen navigation
- System pages

Changing these requires application updates.

---

# 6. Future Expansion

Future versions may allow configuration of:

- Additional social platforms
- Custom notification preferences
- Multiple branding profiles
- Multiple organizations
- Multiple business units

These features are outside the scope of Version 1.

---

# 7. Dependencies

This document should be read alongside:

- 003 - User Roles & Permissions
- 004 - Data Model
- 005 - Google Sheets Architecture
- 007 - Business Rules
- 009 - Dashboard Specifications
- 011 - Notifications

---
End of Document