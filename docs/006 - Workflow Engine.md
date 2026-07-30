# 006 - Workflow Engine

**Project:** Infineo - Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines the complete workflow engine of the application.

The workflow engine controls:

- Lifecycle of every Content Item
- Status transitions
- Assignment rules
- Approval flow
- Rejections
- Editable fields at each stage
- Automatic actions
- Completion rules

This document is the single source of truth for how a Content Item moves through the production pipeline.

---

# 2. Overview

Every Content Item moves through a predefined sequence of workflow statuses.

The workflow is linear with controlled approval gates.

No user may freely change statuses.

Statuses are changed only through application actions (buttons) or authorized manual actions.

---

# 3. Workflow Overview

```
Idea
    ↓
Idea Review (Manager)
    ↓
Idea Review (Admin)
    ↓
Script WIP
    ↓
Script Review (Manager)
    ↓
Script Review (Admin)
    ↓
Reel WIP
    ↓
Reel Review (Manager)
    ↓
Reel Review (Admin)
    ↓
Metadata Completion
    ↓
Completed
    ↓
Scheduled
    ↓
Uploaded
```

---

# 4. Workflow Statuses

## 4.1 Idea

### Purpose

Initial content concept.

### Created By

- Employee
- Manager
- Admin

### Assigned To

Automatically assigned to a Manager.

### Editable Fields

- Series
- Sub-Series
- Real Life Problem
- Mythology Story (if applicable)

### Allowed Actions

- Submit Idea

---

## 4.2 Idea Review (Manager)

### Purpose

Manager reviews submitted idea.

### Assigned To

Manager

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Idea Review (Admin)
```

Assignment automatically changes to Admin.

---

### If Rejected

Status returns to

```
Idea
```

Assignment returns to creator.

---

# 4.3 Idea Review (Admin)

### Purpose

Final approval before scripting.

### Assigned To

Admin

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Script WIP
```

Assignment removed.

No employee is automatically assigned.

---

### If Rejected

Status returns to

```
Idea
```

Assignment returns to creator.

---

# 4.4 Script WIP

### Purpose

Script writing stage.

### Assigned To

Initially unassigned.

An Employee may claim the task.

A Manager or Admin may manually assign the task.

---

### Editable Fields

- Script

---

### Available Actions

- Save Draft
- Submit Script

---

### On Submission

Status becomes

```
Script Review (Manager)
```

Assignment automatically changes to Manager.

---

# 4.5 Script Review (Manager)

### Purpose

Manager reviews script.

### Assigned To

Manager

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Script Review (Admin)
```

Assignment changes to Admin.

---

### If Rejected

Status becomes

```
Script WIP
```

Assignment returns to previous script owner.

---

# 4.6 Script Review (Admin)

### Purpose

Final script approval.

### Assigned To

Admin

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Reel WIP
```

Assignment removed.

---

### If Rejected

Status becomes

```
Script WIP
```

Assignment returns to previous script owner.

---

# 4.7 Reel WIP

### Purpose

Video production stage.

### Assigned To

Initially unassigned.

Employee may claim.

Manager/Admin may assign manually.

---

### Editable Fields

- Canva Link

---

### Available Actions

- Save Draft
- Submit Reel

---

### On Submission

Status becomes

```
Reel Review (Manager)
```

Assignment changes to Manager.

---

# 4.8 Reel Review (Manager)

### Purpose

Manager reviews completed reel.

### Assigned To

Manager

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Reel Review (Admin)
```

Assignment changes to Admin.

---

### If Rejected

Status becomes

```
Reel WIP
```

Assignment returns to reel creator.

---

# 4.9 Reel Review (Admin)

### Purpose

Final reel approval.

### Assigned To

Admin

### Available Actions

- Approve
- Reject

---

### If Approved

Status becomes

```
Metadata Completion
```

Assignment automatically returns to the employee who created the reel.

---

### If Rejected

Status becomes

```
Reel WIP
```

Assignment returns to reel creator.

---

# 4.10 Metadata Completion

### Purpose

Employee prepares publishing metadata.

### Assigned To

Reel creator.

---

### Required Fields

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption
- Final Canva Link

---

### Available Actions

- Save Draft
- Complete Metadata

---

### Validation

Metadata cannot be completed unless all required fields are filled.

---

### On Completion

Status becomes

```
Completed
```

Assignment removed.

---

# 4.11 Completed

### Purpose

Content production is finished.

Publishing has not yet started.

### Assigned To

None

### Editable Fields

None.

Only Manager/Admin may proceed to scheduling.

---

# 4.12 Scheduled

### Purpose

Tracks scheduling on each platform.

Scheduling is independent for every platform.

---

## Platforms

- YouTube
- Instagram
- LinkedIn
- Twitter

---

Each platform has its own checkbox.

Example

```
YouTube      ✓

Instagram    ✓

LinkedIn     ✗

Twitter      ✓
```

---

### Status Rule

If at least one platform has been scheduled,

overall workflow status becomes

```
Scheduled
```

---

### Permissions

Only Manager and Admin.

---

# 4.13 Uploaded

### Purpose

Tracks publishing completion.

---

Each platform has its own upload checkbox.

Example

```
YouTube      ✓

Instagram    ✓

LinkedIn     ✓

Twitter      ✗
```

---

### Status Rule

If at least one platform has been uploaded,

overall workflow status becomes

```
Uploaded
```

---

### Permissions

Manager

Admin

---

# 5. Assignment Rules

## Automatic Assignments

| Event | Assigned To |
|---------|-------------|
| Idea Created | Manager |
| Manager Approves Idea | Admin |
| Admin Approves Idea | None |
| Script Submitted | Manager |
| Manager Approves Script | Admin |
| Admin Approves Script | None |
| Reel Submitted | Manager |
| Manager Approves Reel | Admin |
| Admin Approves Reel | Reel Creator |
| Metadata Completed | None |

---

## Manual Assignment

The following statuses support manual assignment.

- Script WIP
- Reel WIP

Managers and Admins may manually assign work.

Employees may claim unassigned work.

---

# 6. Rejections

Every approval stage supports rejection.

Rejecting returns the Content Item to the previous production stage.

Assignments are restored to the previous owner whenever possible.

---

# 7. Claiming Work

Only unassigned work may be claimed.

Once claimed,

the task immediately disappears from every other employee's available work list.

Only one employee may own a task at a time.

---

# 8. Workflow Validation Rules

The application shall prevent invalid transitions.

Examples

- Metadata cannot be completed before Reel Approval.
- Reel cannot begin before Script Approval.
- Scheduling cannot begin before Completion.
- Upload cannot begin before Scheduling.
- Episode Number may only be assigned during Scheduling.
- Final Canva Link is required before Completion.

---

# 9. Workflow History

Every workflow action shall be recorded.

Each history entry contains:

- Timestamp
- User
- Previous Status
- New Status
- Action Performed

The history log is immutable.

---

# 10. Workflow Buttons

The application shall never expose status dropdowns.

Users interact using action buttons.

Examples include:

- Submit Idea
- Approve
- Reject
- Claim Task
- Save Draft
- Submit Script
- Submit Reel
- Complete Metadata
- Mark Scheduled
- Mark Uploaded

The application determines the resulting workflow status.

---

# 11. Future Workflow Extensions

The workflow engine is designed to support future additions without structural changes.

Possible future extensions include:

- Additional approval levels
- Platform-specific review workflows
- AI-assisted workflow stages
- Multi-language production pipelines
- Archive workflow
- Soft deletion workflow

These extensions are outside the scope of Version 1.0.

---

# End of Document