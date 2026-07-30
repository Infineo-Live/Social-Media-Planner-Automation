# 001 - Business Requirements

**Project:** Infineo Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

The Infineo Social Media Planner is an internal workflow management application built to manage the complete lifecycle of short-form social media content (reels) from idea generation to final publishing.

The application replaces the current Google Sheet based workflow with a structured web application while continuing to use Google Sheets as the primary data storage layer.

The objective is to provide a centralized system where every employee knows exactly what to work on, managers have visibility into production, and administrators can efficiently review, schedule, and publish content.

---

# 2. Business Problem

The current workflow is managed manually using multiple Google Sheets.

As the volume of content has increased, several operational issues have emerged.

These include:

- Difficulty tracking content across multiple series.
- Manual assignment of work.
- No centralized task list for employees.
- Difficult approval workflow.
- Lack of visibility into production bottlenecks.
- Repeated manual status updates.
- Difficulty identifying which content requires action.
- No audit trail.
- No notification system.
- Multiple people opening and editing the same spreadsheet simultaneously.
- Limited reporting and progress visibility.

The current spreadsheet has become a storage system rather than a workflow management system.

---

# 3. Business Objectives

The application shall:

- Provide a structured workflow for every content item.
- Eliminate dependency on manually editing spreadsheets.
- Assign work automatically wherever possible.
- Clearly define ownership of every content item.
- Prevent duplicate work.
- Centralize all production information.
- Provide role-specific dashboards.
- Maintain complete history of every workflow action.
- Simplify scheduling and publishing.
- Reduce manual communication between team members.

---

# 4. Scope

The application covers the complete production workflow for all social media content created by the organization.

The scope includes:

- Idea management
- Script writing
- Script approvals
- Reel creation
- Reel approvals
- Metadata creation
- Scheduling
- Upload tracking
- Assignment management
- Notifications
- Dashboards
- Reporting
- Search and filtering
- User management

---

# 5. Out of Scope

The application will not include:

- Video editing
- Canva integration
- AI content generation
- Calendar planning
- Due dates
- Deadlines
- Time tracking
- Employee attendance
- Payroll
- Leave management
- Asset storage
- File hosting
- Social media publishing automation
- Analytics from social media platforms
- Public access
- Client portals
- Mobile application

These features may be considered in future versions but are intentionally excluded from Version 1.

---

# 6. Primary Business Entity

The primary entity managed by the application is a **Content Item**.

A Content Item represents one social media reel throughout its complete production lifecycle.

Every Content Item belongs to exactly one primary series.

A Content Item may optionally belong to one sub-series.

Every workflow action performed within the application operates on a Content Item.

---

# 7. Primary Content Series

The application shall support the following primary content series.

1. Neo Ki Paathshala (NKPS)
2. Ancient Traditions Modern Curiosity (ATMC)
3. Fun Reel
4. Ad Reel
5. Prayer / Shloka

The system shall allow additional series to be added in the future without requiring structural changes.

---

# 8. Sub-Series

A primary series may optionally contain sub-series.

Examples include:

- Janmashtami
- Ganpati
- Ram Navami
- Diwali

Sub-series are organizational groupings only.

They do not create separate workflows.

Every Content Item continues to belong to one primary series regardless of whether a sub-series exists.

---

# 9. Users

The application shall support authenticated individual users.

Every user shall have their own login.

Shared accounts are not permitted.

Every action performed within the application shall be associated with the authenticated user.

---

# 10. User Roles

The application supports three user roles.

- Admin
- Manager
- Employee

Every authenticated user belongs to exactly one role.

Permissions are determined by the assigned role.

---

# 11. Workflow Philosophy

A Content Item moves through a predefined production workflow.

At any given time:

- A Content Item has exactly one workflow status.
- A Content Item has zero or one assigned user.
- A Content Item has one current owner responsible for the next action.

The workflow is designed to ensure that work progresses in a consistent, traceable manner.

---

# 12. Assignment Philosophy

Assignments exist to clearly indicate ownership.

The application shall minimize manual assignment wherever automatic assignment is possible.

Assignment shall always reflect the person responsible for the next required action.

When no user action is required, a Content Item may remain unassigned.

---

# 13. Approval Philosophy

The production process contains multiple approval stages.

These approval stages ensure quality before work progresses to the next phase.

Approvals occur in sequence.

Employee → Manager → Admin

Each approval stage represents a business checkpoint rather than simply a status update.

---

# 14. Dashboard Philosophy

Every role shall receive a dashboard designed specifically for their responsibilities.

Employees focus on:

- Their assigned work
- Their pending actions
- Recent notifications

Managers focus on:

- Team workload
- Workflow bottlenecks
- Pending approvals
- Production balance across series

Administrators focus on:

- Organization-wide production
- Final approvals
- Scheduling
- Publishing progress

---

# 15. Content Lifecycle

Every Content Item progresses through the complete production lifecycle.

The lifecycle begins with an idea.

It concludes only after the content has been uploaded to all intended platforms.

The application exists to ensure that every Content Item progresses through this lifecycle in a structured and traceable manner.

---

# 16. Episode Number Philosophy

Episode numbers are **not** assigned when ideas are created.

Episode numbers are assigned only when content is scheduled for publishing.

This allows production to occur ahead of schedule while preserving flexibility to reorder publication sequence.

Episode numbers therefore represent publishing order rather than creation order.

---

# 17. Platform Tracking

Scheduling and uploading are tracked independently for each supported platform.

The initial supported platforms are:

- YouTube
- Instagram
- LinkedIn
- Twitter (X)

The application shall maintain independent scheduling and upload status for each platform.

This allows production teams to identify incomplete publishing even after content has been scheduled.

---

# 18. Metadata Philosophy

Social media metadata is created only after the reel has received final creative approval.

Metadata includes platform-specific publishing information such as:

- Titles
- Descriptions
- Tags
- Captions
- Polls

Metadata creation is treated as a production stage rather than an afterthought.

---

# 19. Notification Philosophy

The application shall notify users whenever action is required from them.

Notifications shall be meaningful.

The application shall avoid excessive or repetitive notifications.

Notifications exist to reduce manual communication between team members.

---

# 20. Audit Philosophy

Every meaningful workflow action shall be recorded.

Examples include:

- Status changes
- Assignment changes
- Approvals
- Rejections
- Scheduling
- Upload confirmation

The audit history provides accountability and production traceability.

---

# 21. Reporting Philosophy

Reporting shall focus on operational visibility rather than analytics.

The application shall help answer questions such as:

- Which series has the most pending work?
- Which stage is currently blocked?
- Which employee is currently assigned what work?
- How many reels are awaiting approval?
- Which content has been scheduled?
- Which platforms still require publishing?

The application is not intended to provide social media performance analytics.

---

# 22. Non-Functional Requirements

The application shall:

- Be simple to use with minimal training.
- Minimize manual data entry.
- Prevent duplicate work.
- Be responsive for desktop browsers.
- Support concurrent users.
- Maintain data integrity.
- Record workflow history.
- Use Google authentication.
- Continue using Google Sheets as the primary data store.
- Be maintainable without major architectural complexity.

---

# 23. Success Criteria

The application shall be considered successful when:

- Employees always know what they should work on.
- Managers can identify workflow bottlenecks immediately.
- Administrators can efficiently review, schedule, and publish content.
- Manual spreadsheet editing is eliminated from day-to-day operations.
- Every Content Item has a clear owner.
- Every workflow action is traceable.
- Production visibility improves across all content series.
- The team can scale content production without increasing operational complexity.

---

# 24. Guiding Principles

The following principles govern all future architectural and implementation decisions.

1. Simplicity over complexity.
2. Workflow over spreadsheet management.
3. Clear ownership of every Content Item.
4. Minimize manual work.
5. Automate repetitive actions where appropriate.
6. Preserve flexibility for future content series.
7. Maintain complete production visibility.
8. Every workflow action must be traceable.
9. Avoid unnecessary data collection.
10. Design for operational efficiency rather than feature richness.

---

# Dependencies

## Depends On

- 000 - Project Overview.md

## Referenced By

- 002 - System Architecture.md
- 003 - User Roles & Permissions.md
- 004 - Data Model.md
- 005 - Google Sheets Architecture.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md
- 008 - Screens & Navigation.md