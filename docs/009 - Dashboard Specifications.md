# 009 - Dashboard Specifications

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

The dashboard is the primary landing page after login.

Its purpose is to:

- Give users an immediate overview of work.
- Reduce the need to open multiple pages.
- Show only information relevant to the logged-in user.
- Help distribute work evenly across all content series.
- Surface items requiring immediate action.
- Provide quick navigation into tasks.

The dashboard is informational only. Detailed editing is performed on dedicated pages.

---

# 2. Dashboard Types

The application contains three dashboards.

1. Admin Dashboard
2. Manager Dashboard
3. Employee Dashboard

Each dashboard displays different information based on user permissions.

---

# 3. General Dashboard Principles

## 3.1 No Clutter

Only display information that helps users make immediate decisions.

Avoid unnecessary charts, graphs, KPIs, or analytics.

---

## 3.2 Live Data

Dashboard data is always calculated from the current state of the application.

No manual refresh is required.

---

## 3.3 Card-Based Layout

The dashboard primarily consists of summary cards.

Each card represents:

- a workflow stage
- a content series
- a task queue
- a personal work summary

---

## 3.4 Clickable Cards

Every summary card acts as a shortcut.

Selecting a card opens the corresponding filtered view.

Example:

Ideas Awaiting Approval

↓

Content List

Filter:

Status = Idea Review

---

# 4. Common Dashboard Header

All dashboards contain:

- Application Logo
- Logged-in User Name
- User Role
- Notifications Button
- Profile Menu
- Logout Button

---

# 5. Employee Dashboard

The Employee Dashboard focuses only on work assigned to the employee.

Employees do not see organization-wide statistics.

---

# 6. Employee Dashboard Layout

Section order:

1. Welcome
2. My Work Summary
3. My Active Tasks
4. Available Work
5. Waiting for Review
6. Recently Completed

---

# 7. Welcome Section

Displays:

- Employee Name
- Greeting

Example:

Good Morning, Rahul

---

# 8. My Work Summary Cards

Cards displayed:

- Assigned Tasks
- Waiting for Review
- Returned Tasks
- Completed Today

Each card shows only the logged-in employee's data.

---

# 9. My Active Tasks

Displays all work currently assigned to the employee.

Columns:

- ID
- Series
- Sub-Series
- Working Title
- Current Status
- Last Updated

Selecting a row opens the Content Details page.

---

# 10. Available Work

Displays all unassigned work that employees are allowed to claim.

Examples:

- Script WIP
- Reel WIP

Each item includes a "Claim Task" action.

Once claimed:

- Assignment changes immediately.
- Item disappears from other employees' Available Work list.

---

# 11. Waiting for Review

Displays content submitted by the employee that is awaiting approval.

Possible statuses:

- Script Check
- Reel Check
- Idea Review

No editing is allowed.

---

# 12. Recently Completed

Displays recently completed work by the employee.

Purpose:

Provide confirmation that submitted work has been processed.

---

# 13. Manager Dashboard

Managers oversee workflow across all content.

Their dashboard focuses on approvals, workload balancing, and production progress.

---

# 14. Manager Dashboard Layout

Sections:

1. Workflow Summary
2. Series Summary
3. Approval Queue
4. Unassigned Work
5. Recently Updated Content

---

# 15. Workflow Summary

Cards displayed:

- Ideas Awaiting Review
- Scripts Awaiting Review
- Reels Awaiting Review
- Metadata Pending
- Ready for Scheduling
- Ready for Upload

Each card displays current item count.

---

# 16. Series Summary

Displays one card per primary series.

Series:

- Neo Ki Paathshala
- Ancient Traditions Modern Curiosity
- Fun Reel
- Ad Reel
- Prayer / Shloka

---

Each card contains:

- Total Content
- Ideas
- Script WIP
- Script Review
- Reel WIP
- Reel Review
- Metadata Pending
- Completed
- Scheduled
- Uploaded

Purpose:

Help managers balance production across all series.

Managers should immediately identify if one series is significantly ahead or behind others.

---

# 17. Approval Queue

Displays content requiring manager approval.

Includes:

- Idea Review
- Script Check
- Reel Check

Columns:

- ID
- Series
- Working Title
- Assigned Employee
- Submitted Time

Selecting a row opens the review page.

---

# 18. Unassigned Work

Displays all work available for assignment.

Managers may:

- Assign work
- Reassign work

---

# 19. Recently Updated Content

Displays recent workflow activity.

Examples:

- Script Submitted
- Reel Approved
- Metadata Completed
- Upload Completed

Purpose:

Provide awareness of current production progress.

---

# 20. Admin Dashboard

The Admin Dashboard provides a complete organizational overview.

Admins have visibility into every content item.

---

# 21. Admin Dashboard Layout

Sections:

1. Workflow Summary
2. Series Summary
3. Approval Queue
4. Scheduling Queue
5. Upload Queue
6. Recent Activity

---

# 22. Workflow Summary

Cards:

- Ideas Awaiting Approval
- Scripts Awaiting Approval
- Reels Awaiting Approval
- Metadata Pending
- Completed
- Scheduled
- Uploaded

Each card displays the total number of content items.

---

# 23. Series Summary

Same layout as Manager Dashboard.

Displays statistics for each primary series.

Purpose:

Track overall production balance.

---

# 24. Scheduling Queue

Displays all completed content awaiting scheduling.

Columns:

- Series
- Title
- Episode Number
- Platform Schedule Status

Admin may:

- Assign Episode Number
- Mark platforms as Scheduled

---

# 25. Upload Queue

Displays all scheduled content awaiting upload confirmation.

Columns:

- Series
- Episode
- Scheduled Platforms
- Uploaded Platforms

Admin may mark uploads complete.

---

# 26. Recent Activity

Displays latest workflow actions across the organization.

Examples:

- New Idea Created
- Script Approved
- Reel Rejected
- Metadata Submitted
- Episode Assigned
- Content Scheduled
- Content Uploaded

Newest activity appears first.

---

# 27. Series Summary Card Specification

Each primary series has exactly one dashboard card.

Card contents:

Series Name

Total Content

Idea

Idea Review

Script WIP

Script Review

Reel WIP

Reel Review

Metadata Pending

Completed

Scheduled

Uploaded

Selecting the card opens the Content List filtered by that series.

---

# 28. Dashboard Navigation

Every card opens a filtered content list.

Examples:

Ideas Awaiting Review

↓

Status Filter:

Idea Review

---

NKPS Card

↓

Series Filter:

Neo Ki Paathshala

---

Assigned Tasks

↓

Assigned User:

Current User

---

# 29. Empty States

If a section contains no items, display a friendly empty state.

Examples:

No tasks assigned.

No content awaiting approval.

No recent activity.

Avoid displaying blank tables.

---

# 30. Performance Expectations

Dashboard data should load in a single operation.

Summary values should be calculated efficiently.

Avoid multiple independent data requests for each card.

---

# 31. Dashboard Refresh

Dashboard reflects current application state.

After workflow actions:

- Approvals
- Assignments
- Scheduling
- Uploads

the dashboard updates automatically on the next refresh or page reload.

---

# 32. Future Expansion

Future versions may include:

- Productivity trends
- Monthly production statistics
- Platform-wise publishing summaries
- User productivity reports

These features are outside the scope of Version 1.

---

# Dependencies

## Depends On

- 003 - User Roles & Permissions
- 004 - Data Model
- 006 - Workflow Engine
- 007 - Business Rules
- 008 - Screens & Navigation

## Referenced By

- 010 - Task Management
- 011 - Notifications
- 015 - UI Design System
```