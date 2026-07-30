# 004 - Data Model

**Project:** Infineo – Social Media Planner Automation

**Version:** 1.0

**Status:** Draft

---

# 1. Purpose

This document defines the complete logical data model of the application.

It specifies:

- Every entity in the system
- Every field
- Field types
- Validation rules
- Relationships between entities
- Ownership of data

This document is technology-independent and represents the business data model only.

---

# 2. Design Principles

The data model follows these principles:

- Every Reel (Content Item) exists exactly once.
- A single Content table stores content from all Series.
- No duplicate data should exist.
- IDs are never reused.
- Relationships are maintained using IDs rather than names.
- Nullable fields are used only when business logic requires them.
- Data required only at later workflow stages remains empty until needed.

---

# 3. Primary Entities

The application consists of the following entities:

1. Users
2. Series
3. Sub-Series
4. Content Items
5. Activity Log

No additional entities are required for Version 1.

---

# 4. Entity: Users

Represents every person who can log into the application.

---

## Fields

| Field | Type | Required | Editable | Notes |
|---------|------|----------|----------|------|
| User ID | Auto Number | Yes | No | Internal unique ID |
| Full Name | Text | Yes | Admin | Display name |
| Email Address | Email | Yes | Admin | Must be unique |
| Role | Enum | Yes | Admin | Admin, Manager, Employee |
| Active | Boolean | Yes | Admin | Active / Inactive |
| Created At | DateTime | Yes | System | Record creation timestamp |

---

## Constraints

- Email must be unique.
- Email cannot be blank.
- User ID never changes.
- Deleted users are marked inactive instead of removed.

---

# 5. Entity: Series

Represents one of the five primary content categories.

---

## Fields

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Series ID | Auto Number | Yes | No |
| Name | Text | Yes | Admin |
| Short Code | Text | Yes | Admin |
| Active | Boolean | Yes | Admin |

---

## Initial Records

| Name | Code |
|------|------|
| Neo Ki Paathshala | NKPS |
| Ancient Traditions Modern Curiosity | ATMC |
| Fun Reel | FUN |
| Ad Reel | AD |
| Prayer / Shloka | PS |

---

## Constraints

- Series names must be unique.
- Short Codes must be unique.

---

# 6. Entity: Sub-Series

Represents optional groupings within a Series.

Examples:

- Janmashtami
- Ganpati
- Mahabharata
- Ramayana

A Content Item may belong to one Sub-Series or none.

---

## Fields

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Sub-Series ID | Auto Number | Yes | No |
| Series ID | Reference | Yes | Admin |
| Name | Text | Yes | Admin |
| Active | Boolean | Yes | Admin |

---

## Constraints

- Every Sub-Series belongs to exactly one Series.
- Name does not need to be globally unique.
- Name must be unique within its Series.

---

# 7. Entity: Content Item

Represents a single Reel.

This is the core entity of the application.

Every Reel exists as exactly one Content Item.

---

## Basic Information

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Content ID | Auto Number | Yes | No |
| Series ID | Reference | Yes | Creator |
| Sub-Series ID | Reference | No | Creator |
| Working Title | Text | No | Creator |
| Real Life Problem | Long Text | Yes | Creator |
| Mythology Story | Long Text | No | Creator |

---

## Workflow

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Current Status | Enum | Yes | System |
| Assigned User ID | Reference | No | System / Manager / Admin |
| Created By | Reference | Yes | System |
| Created At | DateTime | Yes | System |
| Updated At | DateTime | Yes | System |

---

## Episode Information

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Episode Number | Integer | No | Manager / Admin |

---

## Production Assets

| Field | Type | Required | Editable |
|---------|------|----------|----------|
| Canva Link | URL | No | Assigned Employee |

---

## Publishing Metadata

These fields become editable only after the Reel is approved by Admin.

| Field | Type |
|---------|------|
| YouTube Title | Long Text |
| YouTube Description | Long Text |
| YouTube Tags | Long Text |
| Instagram Caption | Long Text |
| Instagram Poll | Long Text |
| LinkedIn Caption | Long Text |
| Twitter Caption | Long Text |

---

## Scheduling

Platform scheduling is tracked individually.

| Field | Type |
|---------|------|
| YouTube Scheduled | Boolean |
| Instagram Scheduled | Boolean |
| LinkedIn Scheduled | Boolean |
| Twitter Scheduled | Boolean |

---

## Upload Tracking

Platform uploads are tracked individually.

| Field | Type |
|---------|------|
| YouTube Uploaded | Boolean |
| Instagram Uploaded | Boolean |
| LinkedIn Uploaded | Boolean |
| Twitter Uploaded | Boolean |

---

# 8. Entity: Activity Log

Stores a chronological history of important actions.

This table exists only for auditing and history.

It is never edited manually.

---

## Fields

| Field | Type |
|---------|------|
| Activity ID | Auto Number |
| Timestamp | DateTime |
| Content ID | Reference |
| User ID | Reference |
| Action | Text |
| Previous Status | Text |
| New Status | Text |

---

## Example Actions

- Idea Created
- Idea Approved
- Idea Rejected
- Script Submitted
- Script Approved
- Script Rejected
- Reel Submitted
- Reel Approved
- Metadata Completed
- Scheduled
- Uploaded
- Assignment Changed

---

# 9. Relationships

## Users

One User can create many Content Items.

```
User
  |
  | 1
  |
  |----< Many
Content Item
```

---

## Users

One User can be assigned many Content Items.

```
User
  |
  | 1
  |
  |----< Many
Assigned Content
```

---

## Series

One Series contains many Content Items.

```
Series
   |
   | 1
   |
   |----< Many
Content Items
```

---

## Series

One Series contains many Sub-Series.

```
Series
   |
   | 1
   |
   |----< Many
Sub-Series
```

---

## Sub-Series

One Sub-Series contains many Content Items.

```
Sub-Series
      |
      | 1
      |
      |----< Many
Content Items
```

---

## Content Items

One Content Item has many Activity Log records.

```
Content Item
      |
      | 1
      |
      |----< Many
Activity
```

---

# 10. Enumerations

## User Roles

- Admin
- Manager
- Employee

---

## Workflow Status

The complete list of workflow statuses is defined in **006 - Workflow Engine.md**.

The Current Status field must always contain exactly one valid workflow status.

---

# 11. Required Fields by Workflow Stage

## Idea Creation

Required

- Series
- Real Life Problem

Optional

- Sub-Series
- Mythology Story
- Working Title

---

## Script Stage

No additional required fields.

---

## Reel Stage

Required

- Canva Link

---

## Metadata Stage

Required

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

---

## Scheduling Stage

Episode Number becomes available for editing.

Scheduling checkboxes become editable.

---

# 12. Data Ownership

| Field | Owner |
|---------|-------|
| Series | Admin |
| Sub-Series | Admin |
| Users | Admin |
| Workflow Status | System |
| Assignment | System / Manager / Admin |
| Canva Link | Assigned Employee |
| Publishing Metadata | Assigned Employee |
| Scheduling | Manager / Admin |
| Upload Tracking | Manager / Admin |

---

# 13. Deletion Policy

To preserve audit history:

- Users are never deleted.
- Series are never deleted.
- Sub-Series are never deleted.
- Content Items are never deleted.
- Activity Logs are never deleted.

Inactive records should be marked using the Active field where applicable.

---

# 14. Future Extensibility

The data model intentionally allows future additions without structural changes, including:

- Additional social media platforms
- Additional content series
- New sub-series
- New metadata fields
- New workflow statuses
- Attachments
- Internal comments

These additions should extend existing entities rather than introduce duplicate structures.

---

# 15. Dependencies

## Depends On

- 001 - Business Requirements.md

## Referenced By

- 005 - Google Sheets Architecture.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md