# 010 - Task Management

**Project:** Infineo Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines how work is assigned, claimed, transferred, completed, and tracked throughout the application.

The objective is to ensure that every Content Item always has a clear owner whenever action is required while eliminating confusion, duplicate work, and manual tracking.

This document only defines task ownership and task visibility. Workflow progression is defined in **006 - Workflow Engine.md**.

---

# 2. Definition

A **Task** is not a separate entity.

A task is automatically created whenever a Content Item reaches a workflow stage that requires action from a user.

Example:

```
Content Item

↓

Status = Script WIP

↓

Assigned User = Rohan

↓

Task for Rohan
```

There is no separate Tasks table.

Tasks are generated dynamically from:

- Current Workflow Status
- Assigned User

---

# 3. Task Ownership

Every active task has exactly one owner.

A task may also remain unassigned if the workflow allows employees to claim it.

A Content Item can never have multiple active owners simultaneously.

---

# 4. Task States

A task can exist in one of the following ownership states.

## 4.1 Unassigned

No user is responsible.

The Content Item appears in the Available Work list.

Example

- Script WIP
- Reel WIP

before anyone claims it.

---

## 4.2 Assigned

A specific user owns the task.

Only the assigned user can complete the task unless overridden by a Manager or Admin.

---

## 4.3 Waiting for Review

The assigned user has submitted their work.

Ownership has automatically transferred to the reviewer.

Example

Employee submits Script

↓

Manager becomes task owner.

---

## 4.4 Completed

The current task no longer requires action.

The workflow either:

- moves to another task
- becomes unassigned
- reaches a completed workflow stage

---

# 5. Available Work

Certain workflow stages allow employees to voluntarily pick work.

These Content Items appear in the Available Work page.

Examples include:

- Script WIP
- Reel WIP

Only unassigned Content Items appear here.

Once claimed, they immediately disappear from every other employee's Available Work list.

---

# 6. Claiming Work

Employees may claim work only when:

- the workflow stage supports claiming
- the Content Item is currently unassigned

Claiming work performs the following actions automatically.

- Assigned User becomes current employee
- Task appears in My Tasks
- Content Item disappears from Available Work

No additional confirmation is required.

---

# 7. Automatic Assignment

Some workflow stages automatically assign work.

Examples include:

Idea

↓

Manager

Script Check

↓

Manager

Script Approved by Manager

↓

Admin

Reel Check

↓

Manager

Reel Approved by Manager

↓

Admin

Reel Approved by Admin

↓

Original Reel Creator

Automatic assignment is handled by the workflow engine.

Users cannot disable these assignments.

---

# 8. Manual Assignment

Managers and Admins may manually assign supported workflow stages.

Manual assignment is primarily intended for:

- balancing workload
- vacation coverage
- specialization
- workload redistribution

Employees cannot assign work to other users.

---

# 9. Reassignment

Managers and Admins may reassign any active task.

Reassignment changes:

- Assigned User
- Task ownership

Workflow status does not change.

The previous owner immediately loses editing rights if the workflow restricts editing to assigned users.

---

# 10. Self Assignment

Employees may only self-assign Content Items that are available for claiming.

Employees cannot self-assign:

- Ideas awaiting approval
- Review stages
- Admin stages
- Completed items

---

# 11. My Tasks

Each employee has a dedicated My Tasks page.

Only tasks currently assigned to that employee appear here.

Tasks are grouped into:

- Active Work
- Waiting for Review
- Returned for Changes

Completed tasks are not shown by default.

---

# 12. Task Ordering

Tasks should be displayed in the following order.

1. Returned for Changes
2. Active Work
3. Waiting for Review

Within each group, oldest assignments appear first.

No priority system exists.

No due dates exist.

---

# 13. Returned Work

If a reviewer rejects submitted work:

- workflow moves to previous working stage
- ownership returns to previous contributor

Example

Script Check

↓

Rejected

↓

Script WIP

↓

Assigned back to original Script Writer

Employees never lose ownership after rejection.

---

# 14. Review Queue

Managers have a dedicated Review Queue.

This includes:

- Idea Check
- Script Check
- Reel Check

Admins also have their own approval queue.

Queues are automatically generated.

No manual maintenance is required.

---

# 15. Task Completion

A task is completed only when the assigned user performs the workflow action required for that stage.

Example

Script WIP

↓

Submit Script

↓

Task Completed

↓

New Manager Review Task Created

Completing a task does not necessarily mean the Content Item is complete.

---

# 16. Simultaneous Editing

Only one assigned user may actively own a task.

Managers and Admins retain override permissions.

Employees cannot simultaneously edit the same working task.

---

# 17. Editing Permissions

Employees may edit only tasks currently assigned to them.

Managers and Admins may edit any task.

Once submitted for review, the previous contributor loses edit access until the item is returned.

---

# 18. Task Visibility

## Employee

Can view:

- own tasks
- available work

Cannot view:

- other employees' task lists

---

## Manager

Can view:

- all employee tasks
- review queue
- available work
- unassigned work

---

## Admin

Can view every task in the system.

---

# 19. Workload Visibility

Managers and Admins can view current workload.

For each employee:

- Active Tasks
- Waiting Reviews
- Returned Tasks

This view is intended only for workload balancing.

No productivity metrics are calculated.

---

# 20. Notifications

Task ownership changes generate notifications.

Examples:

- Task Assigned
- Task Returned
- Task Approved
- Task Rejected

Notification rules are defined in:

**011 - Notifications.md**

---

# 21. No Task Priorities

The application does not support:

- Priority
- High Priority
- Urgent
- Low Priority

All Content Items are considered equal.

The team determines work order operationally.

---

# 22. No Due Dates

The application does not store:

- Due Dates
- Deadlines
- Estimated Time
- Completion Targets
- SLA

The application tracks workflow only.

---

# 23. No Time Tracking

The application does not record:

- Hours Worked
- Time Logs
- Time Sheets
- Productivity Scores

The objective is workflow management, not employee monitoring.

---

# 24. Business Rules Summary

- A task is generated from workflow status.
- Every active task has one owner.
- Employees may claim only claimable work.
- Managers and Admins may assign or reassign tasks.
- Review stages automatically assign reviewers.
- Rejected work returns to the previous contributor.
- No duplicate ownership is permitted.
- No priorities exist.
- No deadlines exist.
- No time tracking exists.

---

# Dependencies

## Depends On

- 003 - User Roles & Permissions.md
- 006 - Workflow Engine.md
- 007 - Business Rules.md

## Referenced By

- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md
- 011 - Notifications.md
- 014 - Security & Access Control.md