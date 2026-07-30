# 011 - Notifications

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

The notification system ensures that every user is informed whenever an action requires their attention, without requiring them to constantly monitor the application.

Notifications should only be generated for meaningful workflow events.

The system must avoid unnecessary or repetitive notifications.

---

# 2. Notification Channels

The application supports the following notification channels.

## 2.1 In-App Notifications

Displayed inside the application after login.

These remain visible until marked as read.

Used for:

- New task assignments
- Approval requests
- Rejections
- Content returned for corrections
- Important workflow updates

---

## 2.2 Email Notifications

Email notifications are sent for actions that require user attention outside the application.

Emails are transactional only.

The application must not send promotional or reminder emails.

---

# 3. Notification Principles

The notification system follows these principles.

- Notify only the users involved.
- Never notify every employee.
- Avoid duplicate notifications.
- One workflow action generates at most one notification per recipient.
- Notifications should clearly state what happened and what action is required.
- Clicking a notification opens the relevant Content Item.

---

# 4. Notification Events

## 4.1 Idea Created

Trigger

A new idea is submitted.

Recipients

- Assigned Manager

Notification

```
New Idea Submitted

A new content idea has been submitted and is awaiting your review.
```

---

## 4.2 Idea Approved by Manager

Trigger

Manager approves the idea.

Recipients

- Admin

Notification

```
Idea Awaiting Final Approval

A manager has approved a new content idea.
```

---

## 4.3 Idea Rejected by Manager

Trigger

Manager rejects the idea.

Recipients

- Original Creator

Notification

```
Idea Rejected

Your idea requires changes before it can continue.
```

---

## 4.4 Idea Approved by Admin

Trigger

Admin approves the idea.

Recipients

None.

The content becomes available for Script WIP.

---

## 4.5 Script Claimed

Trigger

Employee claims a script.

Recipients

None.

---

## 4.6 Script Submitted for Review

Trigger

Employee submits the script.

Recipients

- Assigned Manager

Notification

```
Script Ready for Review

A script has been submitted for approval.
```

---

## 4.7 Script Approved by Manager

Trigger

Manager approves the script.

Recipients

- Admin

Notification

```
Script Awaiting Final Approval

A script has been approved by the manager.
```

---

## 4.8 Script Rejected by Manager

Trigger

Manager rejects the script.

Recipients

- Assigned Employee

Notification

```
Script Returned

Your script requires revisions.
```

---

## 4.9 Script Approved by Admin

Trigger

Admin approves the script.

Recipients

None.

The content becomes available for Reel WIP.

---

## 4.10 Reel Claimed

Trigger

Employee claims a reel.

Recipients

None.

---

## 4.11 Reel Submitted for Review

Trigger

Employee submits the reel.

Recipients

- Assigned Manager

Notification

```
Reel Ready for Review

A reel has been submitted for approval.
```

---

## 4.12 Reel Approved by Manager

Trigger

Manager approves the reel.

Recipients

- Admin

Notification

```
Reel Awaiting Final Approval

A reel has been approved by the manager.
```

---

## 4.13 Reel Rejected by Manager

Trigger

Manager rejects the reel.

Recipients

- Assigned Employee

Notification

```
Reel Returned

Your reel requires revisions.
```

---

## 4.14 Reel Approved by Admin

Trigger

Admin approves the reel.

Recipients

- Employee who created the reel

Notification

```
Metadata Required

Your reel has been approved.

Please complete the publishing metadata.
```

---

## 4.15 Metadata Submitted

Trigger

Employee completes all required metadata.

Recipients

None.

Content moves to Completed.

---

## 4.16 Content Scheduled

Trigger

Manager or Admin marks one or more platforms as scheduled.

Recipients

None.

---

## 4.17 Content Uploaded

Trigger

Manager or Admin marks content as uploaded.

Recipients

None.

---

## 4.18 Manual Assignment

Trigger

Manager or Admin assigns a Content Item to an employee.

Recipients

Assigned Employee

Notification

```
New Task Assigned

A new task has been assigned to you.
```

---

## 4.19 Reassignment

Trigger

Task ownership changes.

Recipients

New Assignee

Notification

```
Task Assigned

A content item has been assigned to you.
```

Previous assignee receives no notification.

---

# 5. Events That Do NOT Generate Notifications

The following actions intentionally do not generate notifications.

- Viewing content
- Editing content
- Saving draft changes
- Opening a page
- Updating episode number
- Updating Canva link
- Updating metadata before submission
- Platform scheduling checkbox changes
- Platform upload checkbox changes
- Searching or filtering
- Dashboard activity

---

# 6. In-App Notification Structure

Each notification contains:

- Notification ID
- User
- Content Item
- Title
- Message
- Timestamp
- Read Status
- Link to Content Item

---

# 7. Notification States

Each notification has one of the following states.

- Unread
- Read

Notifications are never deleted automatically.

Old notifications remain available for reference.

---

# 8. Notification Center

Every logged-in user has a Notification Center.

The Notification Center displays notifications in reverse chronological order.

Each notification includes:

- Icon
- Title
- Short message
- Timestamp
- Read indicator

Users can:

- Open notification
- Mark individual notification as read
- Mark all notifications as read

Users cannot delete notifications.

---

# 9. Email Structure

Every email follows the same format.

Subject

```
[Infineo Planner] <Notification Title>
```

Body

```
Hello <User Name>,

<Notification Message>

Content:
<Working Title>

Series:
<Series>

Status:
<Current Status>

Open the application to continue.

Thank you,
Infineo Planner
```

---

# 10. Notification Timing

Notifications are generated immediately after the triggering action completes successfully.

If an action fails, no notification is generated.

Notifications must never be created before database updates are successfully saved.

---

# 11. Duplicate Prevention

The application must prevent duplicate notifications caused by repeated user actions.

Examples:

- Double-clicking Approve
- Refreshing the page during submission
- Network retries

Only one notification may exist for a single completed workflow action.

---

# 12. Notification History

Notifications form part of the application's historical record.

Read status may change.

Notification content must never be edited after creation.

---

# 13. Future Enhancements

The following notification channels are outside the scope of Version 1.

- Push notifications
- Mobile notifications
- SMS
- WhatsApp
- Slack
- Microsoft Teams
- Browser notifications
- Daily summaries
- Weekly summaries
- Reminder notifications
- Escalation notifications

---

# 14. Dependencies

## References

- 003 - User Roles & Permissions
- 004 - Data Model
- 006 - Workflow Engine
- 007 - Business Rules
- 010 - Task Management

## Referenced By

- 017 - Error Handling & Edge Cases
- 018 - Development Standards
- 019 - Testing Checklist