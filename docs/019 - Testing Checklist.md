# 019 - Testing Checklist

**Project:** Infineo Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines the complete testing checklist for the application before every production deployment.

The objective is to ensure that every core workflow behaves correctly and that no user can accidentally break the production process.

This document focuses on functional verification only.

---

# 2. Testing Principles

The application shall be tested using the following principles:

- Test every role separately.
- Test every workflow stage.
- Test every permission.
- Test every automatic assignment.
- Test every notification.
- Test every dashboard.
- Test every search and filter.
- Test every status transition.
- Test both expected and invalid user actions.

---

# 3. Authentication Testing

## 3.1 Login

Verify:

- User can log in.
- Active users can access the application.
- Inactive users cannot access the application.
- User session loads correctly.
- Correct user profile is loaded.

---

## 3.2 Logout

Verify:

- User can log out.
- Session is destroyed.
- Protected pages cannot be accessed after logout.

---

# 4. Role Testing

## Employee

Verify employee can:

- View dashboard.
- View own tasks.
- View available work.
- Create ideas.
- Claim Script WIP.
- Claim Reel WIP.
- Edit assigned work.
- Submit work.
- Add Canva links.
- Fill metadata.
- View notifications.

Verify employee cannot:

- Approve ideas.
- Approve scripts.
- Approve reels.
- Schedule content.
- Upload content.
- Change user roles.
- Edit system settings.
- Delete content.

---

## Manager

Verify manager can:

- Perform all employee actions.
- Approve ideas.
- Reject ideas.
- Approve scripts.
- Reject scripts.
- Approve reels.
- Reject reels.
- Assign work.
- Reassign work.
- Schedule content.
- View manager dashboard.

Verify manager cannot:

- Change application configuration reserved for Admin.
- Delete system settings.

---

## Admin

Verify admin can:

- Perform every application action.
- Access every screen.
- Manage users.
- Manage settings.
- Manage master data.
- Final approvals.
- View all dashboards.

---

# 5. Content Creation Testing

Verify:

- New content item can be created.
- Mandatory fields are enforced.
- Optional fields remain optional.
- Content receives unique ID.
- Status becomes "Idea".
- Manager assignment occurs automatically.

---

# 6. Workflow Testing

Verify every workflow transition.

---

## Idea

Test:

Idea

↓

Idea Approved by Manager

↓

Idea Approved by Admin

---

## Script

Test:

Script WIP

↓

Script Check

↓

Script Approved by Manager

↓

Script Approved by Admin

---

## Reel

Test:

Reel WIP

↓

Reel Check

↓

Reel Approved by Manager

↓

Reel Approved by Admin

---

## Metadata

Test:

Reel Approved by Admin

↓

Metadata Completed

↓

Completed

---

## Scheduling

Verify:

Platform scheduling can be marked individually.

Verify:

- YouTube
- Instagram
- LinkedIn
- Twitter

Verify application correctly detects:

- Partially Scheduled
- Fully Scheduled

---

## Upload

Verify:

Platform upload can be marked individually.

Verify application correctly detects:

- Partially Uploaded
- Fully Uploaded

---

# 7. Status Validation

Verify user cannot:

- Skip workflow stages.
- Move backwards without rejection.
- Edit completed workflow incorrectly.
- Jump directly to final approval.

---

# 8. Assignment Testing

Verify automatic assignments.

---

## Idea

Employee creates

↓

Manager assigned automatically

---

## Manager Approval

Manager approves

↓

Admin assigned automatically

---

## Admin Approval

Admin approves

↓

No assignment

---

## Script Claim

Employee claims Script WIP

↓

Employee assigned

---

## Script Submission

Employee submits

↓

Manager assigned

---

## Reel Claim

Employee claims Reel WIP

↓

Employee assigned

---

## Reel Submission

Employee submits

↓

Manager assigned

---

## Reel Approval

Admin approves

↓

Assigned back to reel creator

---

## Metadata Completion

Employee submits metadata

↓

Assignment cleared

---

# 9. Rejection Testing

Verify:

Manager rejects idea.

Manager rejects script.

Manager rejects reel.

Admin rejects idea.

Admin rejects script.

Admin rejects reel.

Verify:

- Previous owner receives assignment.
- Status changes correctly.
- Notification generated.
- Activity log created.

---

# 10. Dashboard Testing

## Employee Dashboard

Verify:

- Pending tasks count.
- Completed tasks.
- Waiting approvals.
- Available work.

---

## Manager Dashboard

Verify:

Each series card displays correct counts.

Verify:

- Ideas
- Scripts
- Reels
- Completed
- Scheduled
- Uploaded

---

## Admin Dashboard

Verify:

Global statistics.

Series summaries.

Pending approvals.

Scheduling summaries.

---

# 11. Search Testing

Verify searching by:

- Working Title
- Real Life Problem
- Mythology Story
- Episode Number

---

# 12. Filter Testing

Verify filters:

- Series
- Sub-Series
- Status
- Assigned User
- Created By
- Platform Status

Verify combinations of multiple filters.

---

# 13. Sorting Testing

Verify sorting by:

- Created Date
- Updated Date
- Episode Number
- Status
- Assigned User

---

# 14. Content Editing Testing

Verify:

Correct users can edit.

Incorrect users cannot edit.

Read-only fields remain read-only.

Locked stages cannot be modified.

---

# 15. Canva Link Testing

Verify:

Employee can add Canva link.

Manager can view.

Admin can view.

Link updates correctly.

Latest link is always displayed.

---

# 16. Metadata Testing

Verify required fields:

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

Verify completion cannot occur until required metadata exists.

---

# 17. Episode Number Testing

Verify:

Episode Number remains empty until scheduling.

Verify:

Only Manager/Admin can assign.

Verify:

Episode Number can be edited before publishing.

---

# 18. Notification Testing

Verify notifications for:

- New assignment
- Approval
- Rejection
- Metadata request
- Scheduling updates

Verify:

Email sent.

In-app notification created.

No duplicate notifications.

---

# 19. Activity Log Testing

Verify every action creates history.

Verify history includes:

- Timestamp
- User
- Previous Status
- New Status
- Action

Verify activity log cannot be edited.

---

# 20. Security Testing

Verify:

Employee cannot access manager pages.

Employee cannot access admin pages.

Manager cannot access admin-only settings.

Direct URL access is blocked.

Unauthorized actions are rejected.

---

# 21. Data Integrity Testing

Verify:

No duplicate IDs.

No duplicate assignments.

No orphaned records.

No invalid status values.

No invalid role values.

No broken references.

---

# 22. Performance Testing

Verify application remains responsive with:

- 100 content items
- 500 content items
- 1,000 content items
- Multiple concurrent users

Verify dashboard loads within acceptable time.

Verify searches return promptly.

---

# 23. Browser Testing

Verify application functions correctly on:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari (latest supported version)

---

# 24. Mobile Responsiveness Testing

Verify usability on:

- Desktop
- Laptop
- Tablet
- Mobile browser

Verify:

- Navigation
- Tables
- Forms
- Buttons
- Cards

remain usable.

---

# 25. Regression Testing

Before every production release verify:

- Existing workflows still function.
- Permissions remain unchanged.
- Notifications still trigger correctly.
- Dashboards display accurate data.
- Filters work correctly.
- Search works correctly.
- Activity log remains intact.

---

# 26. User Acceptance Testing (UAT)

The application shall be tested by representatives of each role.

Required participants:

- Admin
- Manager
- Employee

Each participant shall complete their full workflow using the application before deployment approval.

---

# 27. Production Readiness Checklist

Before deployment confirm:

- All critical defects resolved.
- No blocking issues remain.
- User permissions verified.
- Notifications verified.
- Dashboard verified.
- Workflow verified.
- Google Sheets structure verified.
- Master data verified.
- Activity logging verified.
- Backup of production data completed.

Deployment shall proceed only after all checklist items have been completed successfully.

---

# Dependencies

## References

- 003 - User Roles & Permissions.md
- 004 - Data Model.md
- 005 - Google Sheets Architecture.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md
- 010 - Task Management.md
- 011 - Notifications.md
- 012 - Search, Filters & Views.md
- 013 - Settings & Master Data.md
- 014 - Security & Access Control.md
- 016 - Email Templates.md
- 017 - Error Handling & Edge Cases.md
- 018 - Development Standards.md

## Referenced By

- 020 - Migration Plan.md