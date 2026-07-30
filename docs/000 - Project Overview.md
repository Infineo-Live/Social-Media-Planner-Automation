# 000 - Project Overview

**Project:** Infineo Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

The Infineo Social Media Planner is an internal workflow management application designed to replace the team's spreadsheet-based content planning process with a structured web application.

The application manages the complete lifecycle of a social media content item (reel), from idea creation through scripting, production, approvals, scheduling, and final upload.

The application is intended exclusively for internal use by the Infineo content team.

---

# 2. Vision

The primary goal of the application is to provide a single, organized workspace where every team member always knows:

- What content exists
- What stage every content item is in
- What work is assigned to them
- What requires their approval
- Which content series require more attention
- What content is ready for publishing

The application should eliminate manual tracking, reduce communication overhead, and provide complete visibility into the production pipeline.

---

# 3. Objectives

The application should:

- Replace the current Google Sheet workflow.
- Ensure every employee has an individual login.
- Prevent shared accounts.
- Maintain a single source of truth for all content.
- Automatically route content through approval stages.
- Minimize manual status updates.
- Keep dashboards updated in real time.
- Reduce duplicate work.
- Provide accountability for every action performed.
- Allow the team to produce content ahead of publishing without affecting workflow.

---

# 4. Scope

The application covers the complete production workflow for social media reels, including:

- Idea management
- Script writing
- Script approvals
- Reel production
- Reel approvals
- Metadata creation
- Scheduling tracking
- Upload tracking
- Assignment management
- Team dashboards
- Notifications
- Search and filtering
- Activity history

---

# 5. Out of Scope

The following features are intentionally excluded from Version 1.

- Content calendar
- Due dates
- Deadlines
- Time tracking
- Employee productivity scoring
- Comment threads
- File uploads
- AI content generation
- Analytics dashboards
- Social media publishing
- External client access
- Multi-company support
- Mobile application
- Offline functionality

These may be considered in future versions if business requirements change.

---

# 6. Target Users

The application supports three user roles.

- Admin
- Manager
- Employee

Every user belongs to exactly one role.

---

# 7. Core Entity

The application revolves around a single primary entity.

## Content Item

A Content Item represents one social media reel.

Every Content Item progresses through the complete production workflow until it is uploaded.

Everything within the application is centered around managing Content Items.

---

# 8. Content Series

Version 1 supports five primary content series.

1. Neo Ki Paathshala (NKPS)
2. Ancient Traditions Modern Curiosity (ATMC)
3. Fun Reel
4. Ad Reel
5. Prayer / Shloka

Each Content Item belongs to exactly one primary series.

---

# 9. Sub-Series

A Content Item may optionally belong to a Sub-Series.

Examples include:

- Janmashtami
- Ganpati
- Diwali

Sub-Series exist only within a parent Series.

Not every Content Item requires a Sub-Series.

---

# 10. Production Philosophy

The application follows a workflow-first approach.

Content is not managed as spreadsheet rows.

Instead, every Content Item moves through a defined production pipeline.

Each stage determines:

- Current owner
- Available actions
- Editable fields
- Approval requirements
- Notifications
- Dashboard counts

---

# 11. Design Principles

The application should follow these principles throughout its architecture.

## 11.1 Simplicity

Only information required to complete work should be collected.

No unnecessary forms or fields should exist.

---

## 11.2 Single Source of Truth

Every piece of information should exist only once.

Duplicate data should be avoided wherever possible.

---

## 11.3 Workflow Driven

Users interact with tasks rather than manually editing status values.

The application manages workflow progression.

---

## 11.4 Accountability

Every important action performed within the application should be traceable to a user.

---

## 11.5 Minimal Manual Work

Routine actions such as assignment routing and notifications should happen automatically whenever possible.

---

## 11.6 Visibility

Every user should immediately understand:

- What requires action
- What is waiting for approval
- What is completed
- What is blocked

without searching through spreadsheets.

---

## 11.7 Scalability

The application should support additional:

- Series
- Sub-Series
- Employees
- Managers
- Platforms

without requiring architectural changes.

---

# 12. Workflow Summary

Every Content Item follows the same high-level lifecycle.

Idea

↓

Idea Approval

↓

Script Writing

↓

Script Approval

↓

Reel Production

↓

Reel Approval

↓

Metadata Completion

↓

Completed

↓

Scheduled

↓

Uploaded

Detailed workflow rules are defined in the Workflow Engine document.

---

# 13. Data Ownership

The application is the primary interface used by the team.

Google Sheets function as the underlying data store and are not intended for daily operational use by employees.

All business operations should occur through the web application.

---

# 14. Authentication

Every user accesses the application using their own Google account.

The application determines permissions based on the authenticated user's registered role.

No shared logins are permitted.

---

# 15. High-Level System Components

The application consists of the following major components.

- Authentication
- Dashboard
- Content Management
- Workflow Engine
- Task Management
- Notifications
- Search & Filters
- Settings
- Reporting
- Google Sheets Data Store

Each component is documented separately within this architecture.

---

# 16. Success Criteria

The project will be considered successful when:

- The existing spreadsheet is no longer used for daily operations.
- Every employee works exclusively through the web application.
- Every Content Item can be tracked from creation to upload.
- Managers always know what requires approval.
- Employees always know their assigned work.
- Admins always know what is ready for scheduling and publishing.
- The production status of every Series is visible at all times.
- Manual tracking effort is significantly reduced.

---

# 17. Document Conventions

Throughout this documentation:

- "Application" refers to the Infineo Social Media Planner.
- "Content Item" refers to one social media reel.
- "User" refers to any authenticated person.
- "Series" refers to one of the five primary content categories.
- "Sub-Series" refers to an optional grouping within a Series.
- "Workflow Status" refers to the current production stage of a Content Item.

These terms are used consistently across all architecture documents.

---

# Dependencies

## References

None

## Referenced By

All subsequent architecture documents.