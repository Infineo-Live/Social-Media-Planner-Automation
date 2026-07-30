# 008 - Screens & Navigation

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines every screen of the application, the navigation between them, and the functionality available on each screen.

This document specifies **what the user sees and can do**, not how it is implemented.

---

# 2. Design Principles

The application UI shall follow these principles:

- Minimal clicks to complete work.
- No unnecessary screens.
- Every user should immediately know what requires their attention.
- Every action should be obvious.
- Important actions should always be available from the current page.
- The interface should remain clean even as thousands of content items are created.
- Mobile responsiveness is desirable but desktop is the primary experience.

---

# 3. Navigation Structure

The application contains the following primary screens.

```
Login

↓

Dashboard

├── My Tasks
├── Content Library
├── Notifications
└── Settings (Role Dependent)
```

Additional screens are opened from these pages.

---

# 4. Employee Navigation

```
Login

↓

Dashboard

├── My Tasks
├── Available Work
├── Content Library
├── Notifications
└── Profile
```

---

# 5. Manager Navigation

```
Login

↓

Dashboard

├── My Tasks
├── Approvals
├── Content Library
├── Notifications
├── Team Overview
└── Profile
```

---

# 6. Admin Navigation

```
Login

↓

Dashboard

├── My Tasks
├── Approvals
├── Content Library
├── Notifications
├── Users
├── Settings
└── Profile
```

---

# 7. Login Screen

## Purpose

Authenticate users using their Google account.

---

## Components

- Application Logo
- Application Name
- Sign In button
- Loading indicator
- Unauthorized access message

---

## Behaviour

After successful login:

Employee → Employee Dashboard

Manager → Manager Dashboard

Admin → Admin Dashboard

---

# 8. Dashboard

The Dashboard is the application's home page.

Each role sees different information.

---

## Common Components

Top Navigation Bar

Sidebar Navigation

Notification Icon

Logged-in User

Logout Button

---

# 9. Employee Dashboard

## Sections

### My Pending Tasks

Displays all tasks currently assigned to the employee.

---

### Available Work

Displays work that is currently unassigned.

Examples:

- Script WIP
- Reel WIP

Employee can claim work from this section.

---

### Waiting For Approval

Shows submitted work currently awaiting review.

---

### Recent Activity

Shows recent changes related to the employee's work.

---

# 10. Manager Dashboard

## Sections

### Series Summary Cards

One card per series.

Displays:

- Total Content
- Ideas
- Script WIP
- Script Check
- Reel WIP
- Reel Check
- Completed
- Scheduled
- Uploaded

---

### Approval Queue

Displays all content awaiting manager approval.

Examples:

- Idea Check
- Script Check
- Reel Check

---

### Team Workload

Displays:

Employee Name

Assigned Tasks

Waiting Review

Completed

---

### Recent Activity

Recent approvals

Recent submissions

Recent rejections

---

# 11. Admin Dashboard

Includes everything visible to Managers.

Additional sections:

- User Management Summary
- Platform Scheduling Summary
- Upload Summary
- System Statistics

---

# 12. My Tasks Screen

Purpose:

Display only work assigned to the logged-in user.

---

## Columns

Content ID

Series

Sub-Series

Title

Current Status

Assigned Date

Action Button

---

## Filters

Series

Status

Search

---

## Actions

Open Content

Continue Work

Submit

---

# 13. Available Work Screen

Purpose

Allow employees to claim unassigned work.

---

## Sections

Available Scripts

Available Reels

---

## Columns

Series

Sub-Series

Title

Current Status

Created By

Claim Button

---

# 14. Approval Queue Screen

Visible to:

Manager

Admin

---

Displays all content waiting for approval.

---

## Columns

Content ID

Series

Title

Submitted By

Submitted On

Current Status

Action

---

## Actions

Approve

Reject

Open Details

---

# 15. Content Library

Purpose

Master repository of every content item.

---

Displays every content item regardless of status.

---

## Default Columns

ID

Series

Sub-Series

Working Title

Real Life Problem

Episode Number

Status

Assigned User

Last Updated

---

## Filters

Series

Sub-Series

Status

Assigned User

Created By

Platform Status

Search

---

## Actions

Open

Create New

Duplicate (Admin Only)

Archive (Future)

---

# 16. Content Details Screen

The primary working screen.

Every content item opens into this page.

---

## Section 1

Basic Information

Fields

- Series
- Sub-Series
- Working Title
- Real Life Problem
- Mythology Story
- Episode Number
- Status
- Assigned User

---

## Section 2

Production

Displays fields depending on workflow stage.

Example

Idea

Script

Canva Link

Metadata

---

## Section 3

Platform Metadata

Visible only after:

Reel Approved by Admin

Fields

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

---

## Section 4

Scheduling

Visible only to Manager and Admin.

Platform Checkboxes

- YouTube Scheduled
- Instagram Scheduled
- LinkedIn Scheduled
- Twitter Scheduled

---

## Section 5

Upload Tracking

Visible only to Manager and Admin.

Platform Checkboxes

- YouTube Uploaded
- Instagram Uploaded
- LinkedIn Uploaded
- Twitter Uploaded

---

## Section 6

Activity History

Chronological history.

Displays:

Timestamp

User

Action

Old Status

New Status

---

# 17. Create Content Screen

Purpose

Create a new content item.

---

## Fields

Series

Sub-Series

Working Title

Real Life Problem

Mythology Story (Optional)

---

## Buttons

Create

Cancel

---

# 18. Notifications Screen

Displays all notifications for the logged-in user.

---

## Columns

Date

Notification

Related Content

Status

---

## Filters

Unread

Read

All

---

# 19. Team Overview Screen

Manager and Admin only.

Displays team workload.

---

## Columns

Employee

Current Tasks

Scripts

Reels

Waiting Review

Completed

---

# 20. Users Screen

Admin only.

Displays all registered users.

---

## Columns

Name

Email

Role

Status

Last Login

---

## Actions

Edit Role

Activate

Deactivate

---

# 21. Settings Screen

Admin only.

Contains configurable application settings.

Examples:

- Series
- Sub-Series
- Platform Names
- Email Settings

No workflow logic shall be modified from this screen.

---

# 22. Profile Screen

Displays:

Name

Email

Role

Last Login

Notification Preferences (Future)

---

# 23. Navigation Rules

Every page shall contain:

- Header
- Sidebar
- Page Title
- Breadcrumb (Optional)
- User Menu

The active page shall always be highlighted.

---

# 24. Screen Behaviour

Tables shall support:

- Sorting
- Filtering
- Searching
- Pagination (if required)

---

Forms shall:

- Validate required fields.
- Prevent invalid submissions.
- Display clear error messages.
- Preserve entered data until submission.

---

Buttons shall only appear when the logged-in user has permission to perform the associated action.

---

# 25. Future Screens (Not Included in Version 1)

The following screens are intentionally excluded from Version 1:

- Calendar View
- Kanban Board
- Analytics Dashboard
- Bulk Import
- Comments
- Attachments
- File Upload Manager
- AI Content Generation
- Mobile Application
- Public Sharing
- API Management

These may be introduced in future versions if business requirements evolve.

---

# Dependencies

## Depends On

- 003 - User Roles & Permissions.md
- 004 - Data Model.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md

---

## Referenced By

- 009 - Dashboard Specifications.md
- 010 - Task Management.md
- 014 - Security & Access Control.md
- 015 - UI Design System.md
- 018 - Development Standards.md
```