# 005 - Google Sheets Architecture

**Project:** Infineo - Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

Google Sheets acts as the application's persistent data store.

Users never directly interact with the sheets. All interaction happens through the Apps Script Web Application.

The spreadsheet is considered the database layer and must never contain business logic, formulas, workflows, or manual editing (except where explicitly mentioned).

---

# 2. Design Principles

The spreadsheet architecture follows these principles:

- Single source of truth
- No duplicated data
- No calculated business logic inside sheets
- No manual workflow changes directly in sheets
- Every record has a permanent unique ID
- Every lookup is performed using IDs rather than row numbers
- Every table has a fixed structure
- Column order must remain unchanged after deployment
- Hidden technical columns are allowed
- Business logic belongs in Apps Script, not Google Sheets

---

# 3. Spreadsheet Structure

A single Google Spreadsheet shall contain the following sheets.

| Sheet Name | Purpose |
|------------|---------|
| Users | User accounts and roles |
| Content | Master table containing every content item |
| Activity Log | Complete audit trail |
| Settings | Master configuration values |
| Email Queue | Pending email notifications |
| System | Internal application metadata |

---

# 4. Sheet Details

---

## 4.1 Users

Purpose:

Stores every application user.

This sheet is managed only by Administrators.

### Columns

| Column | Description |
|----------|-------------|
| User ID | Permanent unique identifier |
| Full Name | Employee name |
| Email | Google account email |
| Role | Admin / Manager / Employee |
| Active | TRUE / FALSE |
| Created At | Account creation timestamp |
| Updated At | Last modification timestamp |

### Rules

- Email addresses must be unique.
- User IDs never change.
- Deactivated users remain in the sheet.
- Historical assignments are never modified.

---

## 4.2 Content

Purpose:

- Master table containing every reel in the system.

- There are no separate sheets for each content series.

- Every reel exists as one row.

### Columns

| Column | Description |
|----------|-------------|
| Content ID | Permanent unique identifier |
| Series | Main content series |
| Sub Series | Optional subgroup |
| Working Title | Internal title |
| Real Life Problem | Problem statement |
| Mythology Story | Story reference (nullable) |
| Episode Number | Assigned during scheduling |
| Current Status | Workflow status |
| Assigned User ID | Current owner |
| Created By User ID | Creator |
| Current Canva Link | Latest Canva URL |
| YouTube Title | Metadata |
| YouTube Description | Metadata |
| YouTube Tags | Metadata |
| Instagram Caption | Metadata |
| Instagram Poll | Metadata |
| LinkedIn Caption | Metadata |
| Twitter Caption | Metadata |
| YouTube Scheduled | TRUE / FALSE |
| Instagram Scheduled | TRUE / FALSE |
| LinkedIn Scheduled | TRUE / FALSE |
| Twitter Scheduled | TRUE / FALSE |
| YouTube Uploaded | TRUE / FALSE |
| Instagram Uploaded | TRUE / FALSE |
| LinkedIn Uploaded | TRUE / FALSE |
| Twitter Uploaded | TRUE / FALSE |
| Created At | Timestamp |
| Updated At | Timestamp |

### Rules

- Every reel exists only once.
- Content ID never changes.
- Episode Number may remain blank until scheduling.
- Assigned User may be blank.
- Metadata fields may remain blank until required by workflow.
- Platform scheduling flags default to FALSE.
- Platform upload flags default to FALSE.

---

## 4.3 Activity Log

Purpose:

Stores every action performed inside the application.

Nothing is ever deleted.

### Columns

| Column | Description |
|----------|-------------|
| Activity ID | Permanent unique identifier |
| Timestamp | Action timestamp |
| Content ID | Related content |
| User ID | User performing action |
| Action Type | System action |
| Previous Status | Previous workflow state |
| New Status | New workflow state |
| Notes | Optional system notes |

### Rules

- Every workflow change creates a new record.
- Assignment changes create a new record.
- Approval actions create a new record.
- Rejections create a new record.
- Manual scheduling creates a new record.
- Upload confirmations create a new record.
- Records are append-only.

---

## 4.4 Settings

Purpose:

Stores editable application configuration.

Administrators may modify values where appropriate.

### Sections

- Series
- User Roles
- Workflow Statuses
- Social Platforms
- Email Templates
- System Configuration

### Rules

- Settings are read by the application.
- No workflow data is stored here.
- No user-specific information is stored here.

---

## 4.5 Email Queue

Purpose:

Temporary queue for outgoing emails.

The application processes pending emails automatically.

### Columns

| Column | Description |
|----------|-------------|
| Email ID | Unique identifier |
| Recipient | Email address |
| Subject | Email subject |
| Body | Email content |
| Status | Pending / Sent / Failed |
| Created At | Queue timestamp |
| Sent At | Delivery timestamp |

### Rules

- Emails are generated by workflow events.
- Sent emails remain for history.
- Failed emails may be retried.

---

## 4.6 System

Purpose:

Internal application metadata.

This sheet is never edited manually.

### Example Values

- Current database version
- Last maintenance timestamp
- Next Content ID
- Next Activity ID
- Application version
- Last deployment timestamp

---

# 5. Data Relationships

```
Users
   │
   │ User ID
   │
   ▼
Content
   │
   │ Content ID
   │
   ▼
Activity Log
```

Additional relationships

```
Settings
      │
      ├── Workflow Statuses
      ├── Series
      ├── Platforms
      └── Roles
```

```
Content
      │
      ▼
Email Queue
```

---

# 6. Hidden Columns

The following columns may be hidden from spreadsheet view but remain part of the database.

- Internal IDs
- Timestamp fields
- System synchronization values
- Future migration fields

Hidden columns must never be deleted.

---

# 7. Data Ownership

| Sheet | Editable by Admin | Editable by Manager | Editable by Employee | System |
|--------|-------------------|---------------------|----------------------|--------|
| Users | Yes | No | No | Yes |
| Content | Limited | Limited | Limited | Yes |
| Activity Log | No | No | No | Yes |
| Settings | Yes | No | No | Yes |
| Email Queue | No | No | No | Yes |
| System | No | No | No | Yes |

Users edit data only through the application interface.

No role directly edits Google Sheets during normal operation.

---

# 8. Data Integrity Rules

- Every Content ID must be unique.
- Every User ID must be unique.
- Every Activity ID must be unique.
- Email addresses must be unique.
- Content rows are never duplicated.
- IDs are immutable.
- Historical records are never modified.
- Activity Log is append-only.
- Empty rows are not permitted inside tables.
- Column names are fixed after deployment.

---

# 9. Backup Strategy

The Google Spreadsheet serves as the primary database.

Backups shall be maintained using Google Drive version history and periodic manual exports where required.

No secondary database exists.

---

# 10. Future Expansion

The sheet architecture is designed to support future additions without structural redesign.

Potential future additions include:

- Additional content series
- Additional social platforms
- Comments
- Attachments
- AI-generated content
- Analytics
- Publishing integrations
- Approval history enhancements

No existing sheet structure should require modification to support these additions.

---

# 11. Dependencies

### References

- 001 - Business Requirements.md
- 002 - System Architecture.md
- 003 - User Roles & Permissions.md
- 004 - Data Model.md

### Referenced By

- 006 - Workflow Engine.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md
- 010 - Task Management.md
- 011 - Notifications.md
```