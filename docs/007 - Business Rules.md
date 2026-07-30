# 007 - Business Rules

**Project:** Infineo - Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines all business rules that govern how the application behaves.

These rules are independent of implementation and must remain true regardless of the underlying technology.

Business rules take precedence over implementation decisions.

---

# 2. General Principles

## 2.1 Single Source of Truth

The application is the only source of truth.

Employees must never update the underlying Google Sheets directly.

---

## 2.2 One Content Item = One Reel

Every record in the system represents exactly one reel.

A reel cannot represent multiple ideas.

---

## 2.3 One Current Status

A Content Item can only have one workflow status at any given time.

Historical statuses are stored in the activity log.

---

## 2.4 One Current Assignee

A Content Item can only be assigned to one user at a time.

Shared ownership is not allowed.

---

## 2.5 Optional Assignment

Not every workflow stage requires an assigned user.

Some stages intentionally remain unassigned until claimed or manually assigned.

---

# 3. Series Rules

## 3.1 Primary Series

Every Content Item must belong to exactly one primary series.

The supported series are:

- Neo Ki Paathshala (NKPS)
- Ancient Traditions Modern Curiosity (ATMC)
- Fun Reel
- Ad Reel
- Prayer / Shloka

---

## 3.2 Sub-Series

A Content Item may optionally belong to a Sub-Series.

Examples:

- Janmashtami
- Ganpati
- Diwali

Sub-Series cannot exist without a parent Series.

---

## 3.3 Series Cannot Change

Once created, the primary Series cannot be changed.

If incorrect, the Content Item must be recreated.

(Sub-Series may be updated.)

---

# 4. Episode Number Rules

Episode Numbers are not assigned during idea creation.

---

## 4.1 Assignment Time

Episode Number is assigned only when content is scheduled.

---

## 4.2 Responsibility

Only Admin or Manager may assign Episode Numbers.

Employees cannot edit Episode Numbers.

---

## 4.3 Uniqueness

Episode Numbers must be unique within a Series.

Example:

NKPS

Episode 45

cannot exist twice.

---

## 4.4 Gaps

Episode numbers are allowed to have gaps.

Example:

45

46

49

This is valid.

---

## 4.5 Reordering

Episode Numbers may be changed before publishing.

This allows content to be released in a different order than it was created.

---

# 5. Workflow Rules

## 5.1 Sequential Workflow

Workflow must always follow the defined sequence.

Users cannot skip stages.

---

## 5.2 Status Changes

Workflow statuses may only change through application actions.

Manual editing of status values is not allowed.

---

## 5.3 Rejections

If content is rejected:

- workflow moves back to the previous working stage
- assignment changes according to workflow rules
- rejection reason becomes mandatory

---

## 5.4 Approval

Approval does not overwrite previous information.

It only advances workflow.

---

# 6. Assignment Rules

## 6.1 Single Assignee

Only one assigned user is allowed.

---

## 6.2 Automatic Assignment

Workflow automatically assigns users wherever defined.

---

## 6.3 Manual Assignment

Manager and Admin may manually assign work.

Employees cannot assign work to other users.

---

## 6.4 Claiming Work

Employees may claim unassigned work only when the workflow allows claiming.

Claiming immediately assigns the Content Item.

---

## 6.5 Reassignment

Admin and Manager may reassign work at any time.

---

# 7. Editing Rules

## 7.1 Editable Fields

Only fields relevant to the current workflow stage are editable.

All other fields remain read-only.

---

## 7.2 Ownership

Employees may edit only Content Items currently assigned to them.

---

## 7.3 Locked Records

Completed content becomes read-only except for scheduling information.

---

# 8. Canva Rules

## 8.1 Reel Canva Link

Reel WIP requires a Canva Link.

---

## 8.2 Final Canva Link

If the final reel changes after approval,

the employee must provide the updated Canva Link.

The latest Canva Link becomes the active version.

---

## 8.3 Multiple Links

The application stores only the latest Canva Link.

Older versions remain visible through Activity History if changed.

---

# 9. Metadata Rules

Metadata is collected only after:

Reel Approved by Admin

---

Required metadata includes:

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

---

All metadata fields must be completed before marking the Content Item as Completed.

---

# 10. Scheduling Rules

Scheduling happens only after workflow reaches Completed.

---

Scheduling is platform specific.

Supported platforms:

- YouTube
- Instagram
- LinkedIn
- Twitter

---

Each platform has its own scheduling status.

Example:

✓ YouTube

✓ Instagram

✗ LinkedIn

✓ Twitter

---

Scheduling one platform does not automatically schedule others.

---

Bulk scheduling is allowed.

Manager and Admin may mark multiple Content Items as scheduled simultaneously.

---

# 11. Upload Rules

Uploading is also platform specific.

Supported platforms:

- YouTube
- Instagram
- LinkedIn
- Twitter

---

Each platform has an independent upload status.

---

Bulk upload updates are allowed.

---

# 12. Completion Rules

Completed means:

- Reel approved
- Metadata completed

Completed does NOT mean published.

---

# 13. Search Rules

All Content Items remain searchable regardless of status.

Archived content is also searchable.

---

# 14. Notification Rules

Notifications are generated only for meaningful workflow events.

Examples:

- Assignment
- Approval
- Rejection
- Returned for changes
- Metadata requested

Routine edits do not generate notifications.

---

# 15. Dashboard Rules

Dashboard values are always calculated from live data.

No dashboard values are manually entered.

---

Series summaries must always display current counts.

---

# 16. Deletion Rules

Employees cannot delete Content Items.

Managers cannot permanently delete Content Items.

Only Admin may archive Content Items.

Permanent deletion is not supported.

---

# 17. Archive Rules

Archived Content Items:

- remain searchable
- remain in reports
- remain in activity history
- cannot re-enter workflow

---

# 18. Activity History Rules

Every significant action must be recorded.

Examples include:

- Created
- Assigned
- Claimed
- Approved
- Rejected
- Reassigned
- Scheduled
- Uploaded
- Archived

Each activity record stores:

- Timestamp
- User
- Action
- Previous Value (if applicable)
- New Value (if applicable)

Activity History cannot be edited.

---

# 19. Email Rules

Emails are sent only for workflow events requiring user action.

Examples:

- New Assignment
- Approval
- Rejection
- Returned for Changes

General edits do not send emails.

---

# 20. Data Integrity Rules

Required fields cannot be empty.

Invalid workflow transitions are blocked.

Duplicate IDs are not allowed.

Duplicate Episode Numbers within the same Series are not allowed.

Users cannot impersonate other users.

Application-generated values cannot be manually edited.

---

# 21. Performance Rules

Users should only see information relevant to their permissions.

Dashboards should summarize information instead of displaying entire datasets.

The application should minimize unnecessary reads and writes to the underlying data source.

---

# 22. Future Expansion Rules

The system must support:

- Additional Series
- Additional Sub-Series
- Additional Social Platforms
- Additional Workflow Statuses

without requiring changes to existing Content Items.

---

# Dependencies

## Depends On

- 001 - Business Requirements
- 002 - System Architecture
- 003 - User Roles & Permissions
- 004 - Data Model
- 005 - Google Sheets Architecture
- 006 - Workflow Engine

## Referenced By

- 008 - Screens & Navigation
- 009 - Dashboard Specifications
- 010 - Task Management
- 011 - Notifications
- 013 - Settings & Master Data
- 014 - Security & Access Control
- 017 - Error Handling & Edge Cases
```