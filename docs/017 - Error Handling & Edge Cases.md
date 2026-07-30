# 017 - Error Handling & Edge Cases

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines how the application should behave when unexpected situations, invalid user actions, missing data, or workflow conflicts occur.

The objective is to ensure that:

- Data is never corrupted.
- Workflow remains consistent.
- Users always receive meaningful feedback.
- Business rules cannot be bypassed.
- The application fails safely.

This document covers business-level error handling and edge cases only. Technical exception handling is implementation-specific.

---

# 2. General Principles

The application shall follow these principles for all errors.

- Never silently ignore an error.
- Never corrupt existing data.
- Never partially save a record.
- Always show a clear, human-readable error message.
- Never expose technical or system errors to end users.
- Preserve user-entered data whenever possible.
- Prevent invalid workflow transitions instead of correcting them later.

---

# 3. Validation Errors

Validation errors occur before any data is saved.

The application shall prevent saving until validation succeeds.

Examples include:

- Required field missing
- Invalid URL
- Invalid status transition
- Duplicate episode number
- Invalid email
- Empty mandatory metadata

---

# 4. Permission Errors

If a user attempts an action without sufficient permission:

The application shall:

- Block the action
- Display an access denied message
- Make no database changes
- Log the attempt

Example:

Employee attempts to approve a script.

Result:

Action blocked.

No changes made.

---

# 5. Workflow Transition Errors

A content item may only move through approved workflow transitions.

If a transition is invalid:

- Do not change status.
- Inform the user.
- Preserve current assignment.

Example:

Current Status

Script WIP

User attempts

Reel Check

Result

Action rejected.

---

# 6. Missing Required Information

Certain workflow stages require mandatory information.

Example

Cannot submit Reel Check if:

- Canva Link is empty

Cannot mark Completed if:

- YouTube Title missing
- YouTube Description missing
- YouTube Tags missing
- Instagram Caption missing
- Instagram Poll missing
- LinkedIn Caption missing
- Twitter Caption missing

The application shall display all missing fields together.

---

# 7. Invalid URL Handling

Fields containing URLs shall be validated.

Examples:

- Canva Link

Accepted:

- Valid HTTPS URL

Rejected:

- Plain text
- Invalid URL format
- Empty string (when required)

---

# 8. Duplicate Episode Numbers

Episode Numbers must be unique within the same Series.

Example

NKPS

Episode 25

cannot exist twice.

Different series may use identical episode numbers.

Example

NKPS Episode 12

ATMC Episode 12

Allowed.

---

# 9. Duplicate Content

Two content items may have identical titles or problems.

The system shall not automatically prevent this.

Duplicate detection is a business responsibility, not a system restriction.

---

# 10. Deleted Users

If a user leaves the organization:

The account becomes inactive.

Previously created content remains unchanged.

Assigned work shall remain assigned until manually reassigned.

Historical logs shall continue showing the original user's name.

---

# 11. Inactive Users

Inactive users:

- Cannot log in
- Cannot receive assignments
- Cannot claim work

Existing records remain unchanged.

---

# 12. Assignment Conflicts

If two employees attempt to claim the same unassigned work simultaneously:

The application shall:

- Assign the first successful request.
- Reject subsequent requests.
- Refresh the task list.

---

# 13. Reassignment Edge Cases

If an item is reassigned:

The previous assignee immediately loses edit permissions.

The new assignee gains edit permissions immediately.

Assignment history shall be logged.

---

# 14. Concurrent Editing

If two users open the same content item:

The first successful save updates the record.

If another user attempts to save outdated information:

The application shall notify the user that the record has changed.

The user must refresh before continuing.

No silent overwrites shall occur.

---

# 15. Browser Refresh

Refreshing the browser shall not:

- Change workflow
- Duplicate records
- Resend approvals
- Duplicate notifications

---

# 16. Double Click Protection

Buttons that perform workflow actions shall execute only once.

Examples:

- Submit
- Approve
- Reject
- Schedule
- Upload

Repeated clicks shall not duplicate actions.

---

# 17. Browser Back Button

Using the browser back button shall never:

- Re-submit forms
- Repeat approvals
- Duplicate records

---

# 18. Network Failure During Save

If communication fails before confirmation:

The application shall inform the user that the save could not be confirmed.

Users may safely retry.

Duplicate records shall not be created.

---

# 19. Email Delivery Failure

Workflow actions shall never depend on successful email delivery.

If email fails:

- Workflow continues.
- Assignment continues.
- Activity Log records the action.
- Email failure may be logged separately.

---

# 20. Notification Failure

Failure to generate an in-app notification shall not prevent workflow progression.

---

# 21. Missing Assigned User

If a workflow expects an assigned user but none exists:

The application shall display:

"Unassigned"

No automatic assumptions shall be made.

---

# 22. Missing Manager

If no active Manager exists:

Workflow requiring manager approval cannot continue.

Admin shall resolve the staffing issue.

---

# 23. Missing Admin

If no active Admin exists:

Admin approval stages cannot proceed.

Workflow remains pending.

---

# 24. Empty Dashboards

If no content exists:

Dashboards shall display:

"No content available."

No errors shall be shown.

---

# 25. Empty Task Lists

If a user has no assigned tasks:

Display

"No tasks assigned."

instead of an empty table.

---

# 26. Empty Search Results

Searches returning no matches shall display:

"No matching content found."

---

# 27. Empty Filters

Filters producing no results are valid.

No warning shall be shown.

---

# 28. Invalid Search Input

Search input shall safely accept:

- Special characters
- Numbers
- Unicode
- Emoji

The application shall never crash because of search input.

---

# 29. Status Already Updated

If another user already completed the requested action:

Example

Manager approves.

Admin also attempts approval.

The application shall detect that the status has changed and prevent duplicate processing.

---

# 30. Scheduling Edge Cases

Scheduling may occur for individual platforms.

Example

✓ YouTube

✓ Instagram

✗ LinkedIn

✗ Twitter

This is valid.

Scheduling status shall reflect actual platform selections.

---

# 31. Upload Edge Cases

Upload tracking behaves independently per platform.

Example

Uploaded

✓ YouTube

✓ Instagram

✗ LinkedIn

✗ Twitter

This is valid.

---

# 32. Missing Episode Number

Content may exist without an Episode Number.

Episode Number becomes mandatory only when scheduling.

---

# 33. Missing Sub-Series

Sub-Series is optional.

Content without a Sub-Series remains valid.

---

# 34. Activity Log Failures

If Activity Log recording fails:

Workflow should not continue silently.

The action shall be rejected to preserve audit integrity.

---

# 35. Browser Session Expired

If the user's session expires:

- Current action is cancelled.
- User is redirected to login.
- Unsaved changes are discarded.

---

# 36. Unauthorized Direct URL Access

If a user manually enters the URL of a restricted page:

The application shall:

- Verify permissions.
- Deny access if unauthorized.
- Redirect to the appropriate dashboard.

---

# 37. Invalid Content ID

If a requested Content Item does not exist:

Display

"Content not found."

No application error shall be shown.

---

# 38. Data Integrity Rules

The application shall never allow:

- Multiple active assignees
- Invalid status values
- Duplicate Content IDs
- Duplicate User IDs
- Empty primary keys
- Invalid role values
- Missing workflow status

---

# 39. Recovery Principles

Whenever possible:

- Preserve user input.
- Prevent duplicate actions.
- Allow safe retry.
- Keep workflow consistent.
- Maintain complete audit history.

---

# 40. Error Message Guidelines

All user-facing messages shall:

- Clearly describe the problem.
- Explain what the user should do next.
- Avoid technical terminology.
- Avoid exposing internal system details.

Example

Good:

"Please enter a valid Canva link before submitting the reel."

Bad:

"HTTP 500: Null reference exception."

---

# 41. Dependencies

## Depends On

- 003 - User Roles & Permissions
- 004 - Data Model
- 006 - Workflow Engine
- 007 - Business Rules
- 010 - Task Management
- 011 - Notifications
- 014 - Security & Access Control

## Referenced By

- 018 - Development Standards
- 019 - Testing Checklist

---
```