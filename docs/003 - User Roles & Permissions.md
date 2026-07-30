# 003 - User Roles & Permissions

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines every user role within the application, the permissions granted to each role, and the actions they are allowed to perform throughout the content production workflow.

The permission system is intentionally simple and consists of only three roles:

- Admin
- Manager
- Employee

No custom roles, permission groups, or granular permission editor will exist in Version 1.

---

# 2. Design Philosophy

The permission model is based on responsibility rather than hierarchy.

Each role has a clearly defined responsibility:

- Employees create content.
- Managers review content.
- Admins perform final approvals and publishing.

Every action within the application must have exactly one responsible role.

---

# 3. User Roles

## 3.1 Admin

The Admin has complete access to the application.

The Admin is responsible for:

- Final content approvals
- Content scheduling
- Content publishing
- User management
- Application settings
- System configuration

There may be multiple Admin users.

---

## 3.2 Manager

Managers supervise the production workflow.

Managers are responsible for:

- Reviewing ideas
- Reviewing scripts
- Reviewing reels
- Assigning work
- Monitoring production progress
- Scheduling completed content
- Upload confirmation

Managers cannot modify application settings.

There may be multiple Managers.

---

## 3.3 Employee

Employees perform production work.

Employees are responsible for:

- Creating ideas
- Writing scripts
- Creating reels
- Uploading Canva links
- Writing publishing metadata

Employees cannot approve work.

Employees cannot manage users.

Employees cannot access application settings.

---

# 4. Permission Matrix

| Feature | Admin | Manager | Employee |
|----------|:----:|:-------:|:--------:|
| Login | ✓ | ✓ | ✓ |
| View Dashboard | ✓ | ✓ | ✓ |
| View Assigned Tasks | ✓ | ✓ | ✓ |
| View All Content | ✓ | ✓ | ✓ |
| Search Content | ✓ | ✓ | ✓ |
| Filter Content | ✓ | ✓ | ✓ |
| Create Idea | ✓ | ✓ | ✓ |
| Edit Own Draft | ✓ | ✓ | ✓ |
| Claim Available Work | ✓ | ✓ | ✓ |
| Upload Canva Link | ✓ | ✓ | ✓ |
| Add Publishing Metadata | ✓ | ✓ | ✓ |
| Submit Work For Review | ✓ | ✓ | ✓ |
| Review Content | ✓ | ✓ | ✗ |
| Approve Content | ✓ | ✓ (Manager Approval Only) | ✗ |
| Final Approval | ✓ | ✗ | ✗ |
| Reject Content | ✓ | ✓ | ✗ |
| Assign Work | ✓ | ✓ | ✗ |
| Reassign Work | ✓ | ✓ | ✗ |
| Schedule Content | ✓ | ✓ | ✗ |
| Mark Uploaded | ✓ | ✓ | ✗ |
| Manage Users | ✓ | ✗ | ✗ |
| Manage Settings | ✓ | ✗ | ✗ |
| View Activity Log | ✓ | ✓ | Own Actions Only |

---

# 5. General Access Rules

## 5.1 Login

Every user has an individual account.

Shared accounts are not permitted.

Authentication is based on the user's Google account.

---

## 5.2 Account Status

Every user account has one of the following states:

- Active
- Inactive

Inactive users cannot log in.

---

## 5.3 User Identity

Each user has:

- Name
- Email Address
- Role
- Status

The email address is the unique identifier.

---

# 6. Employee Permissions

Employees can perform the following actions.

## Ideas

- Create new ideas
- Edit ideas before submission
- Submit ideas for review

Employees cannot approve ideas.

---

## Scripts

Employees can:

- Claim available script work
- Edit scripts assigned to them
- Save draft work
- Submit scripts for review

Employees cannot:

- Approve scripts
- Final approve scripts
- Approve their own work

---

## Reels

Employees can:

- Claim available reel work
- Add Canva links
- Replace Canva links
- Save work
- Submit reels for review

Employees cannot approve reels.

---

## Metadata

After Admin approval of a reel, the assigned employee can enter:

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

Once submitted, the workflow moves to Completed.

---

## Dashboard Access

Employees can only view:

- Their assigned work
- Available work
- Their completed work
- Their recent notifications

Employees do not have access to production summaries.

---

# 7. Manager Permissions

Managers supervise production.

Managers can access all content.

Managers may review content regardless of assignment.

---

## Idea Review

Managers may:

- Approve ideas
- Reject ideas

Approved ideas move to Admin Approval.

Rejected ideas return to the original creator.

---

## Script Review

Managers may:

- Approve scripts
- Reject scripts

Approved scripts move to Admin Approval.

Rejected scripts return to the assigned employee.

---

## Reel Review

Managers may:

- Approve reels
- Reject reels

Approved reels move to Admin Approval.

Rejected reels return to the assigned employee.

---

## Assignment

Managers may:

- Assign employees
- Reassign employees
- Remove assignments
- Assign themselves if required

---

## Scheduling

Managers may:

- Enter Episode Numbers
- Mark individual platforms as Scheduled
- Mark individual platforms as Uploaded

Managers cannot change application settings.

---

# 8. Admin Permissions

Admins have unrestricted access.

---

## Content Approval

Admins perform:

- Final Idea Approval
- Final Script Approval
- Final Reel Approval

Admin approval represents the final production approval.

---

## User Management

Admins may:

- Create users
- Edit users
- Disable users
- Change user roles

Deleting users is not supported.

Inactive users are retained for historical records.

---

## Application Settings

Admins manage:

- Series
- Sub-Series
- Master Lists
- Workflow Configuration
- System Settings

---

## Production Management

Admins may:

- Assign work
- Reassign work
- Schedule content
- Mark uploaded content
- Override workflow status if necessary

---

# 9. Ownership Rules

Every Content Item has exactly one assigned user or no assigned user.

A Content Item cannot be assigned to multiple users simultaneously.

Assignment always indicates who is responsible for the next action.

---

# 10. Approval Restrictions

Users cannot approve work they created if they hold multiple roles.

Example:

If an Admin personally creates a reel, another Admin should perform the final approval whenever reasonably possible.

This is a recommended operational practice rather than a system restriction.

---

# 11. Visibility Rules

## Employee

Can view:

- All content
- Own assignments
- Available work
- Workflow status
- Read-only production progress

Cannot edit content not assigned to them.

---

## Manager

Can view all content.

Can edit workflow-related fields.

Can assign work.

Can review submissions.

---

## Admin

Can view and edit every record.

No visibility restrictions apply.

---

# 12. Activity Logging

The following actions must be recorded in the Activity Log:

- User Login
- Idea Creation
- Assignment Changes
- Status Changes
- Approvals
- Rejections
- Scheduling
- Upload Confirmation
- Metadata Submission
- User Management Changes

Each log entry records:

- Timestamp
- User
- Action
- Content Item
- Previous Value (if applicable)
- New Value (if applicable)

---

# 13. Permission Principles

The application follows these principles:

- Every action has exactly one responsible role.
- Employees create content.
- Managers review content.
- Admins perform final approvals.
- Permissions remain simple and predictable.
- No custom permission system will exist.
- No feature-level permission editor will exist.
- Role changes are managed only by Admins.

---

# Dependencies

## Depends On

- 000 - Project Overview.md
- 001 - Business Requirements.md
- 002 - System Architecture.md

## Referenced By

- 004 - Data Model.md
- 005 - Google Sheets Architecture.md
- 006 - Workflow Engine.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md
- 010 - Task Management.md
- 011 - Notifications.md
- 014 - Security & Access Control.md