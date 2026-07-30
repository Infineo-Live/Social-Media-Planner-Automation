# 015 - UI Design System

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines the complete visual design system for the application.

The objective is to create an interface that is:

- Clean
- Fast
- Consistent
- Easy to learn
- Focused on productivity

The application is an internal production tool, not a marketing website. Every design decision should prioritize efficiency over visual decoration.

---

# 2. Design Principles

The application shall follow these principles throughout every screen.

## 2.1 Simplicity

Only display information required for the current task.

Avoid unnecessary statistics, decorative graphics, or excessive controls.

---

## 2.2 Consistency

Every page shall use the same:

- Layout
- Typography
- Colors
- Buttons
- Form controls
- Tables
- Icons
- Status indicators

---

## 2.3 Predictability

Buttons performing similar actions shall always appear in the same position.

Examples:

- Save
- Cancel
- Approve
- Reject
- Submit
- Assign

Users should never need to search for common actions.

---

## 2.4 Readability

Content production involves large amounts of text.

Therefore:

- generous spacing
- readable fonts
- clear hierarchy
- minimal visual noise

---

## 2.5 Desktop First

The application is intended primarily for desktop usage.

Responsive support for tablets and mobile devices is desirable but secondary.

---

# 3. Overall Layout

Every authenticated screen follows the same layout.

```
+------------------------------------------------------+
| Header                                               |
+------------+-----------------------------------------+
|            |                                         |
| Sidebar    | Main Content                            |
|            |                                         |
|            |                                         |
|            |                                         |
+------------+-----------------------------------------+
```

---

# 4. Header

The header remains visible throughout the application.

Contains:

- Application logo
- Application name
- Search button (future)
- Logged-in user's name
- User role
- Notifications button
- Profile menu
- Logout

Height should remain consistent across all pages.

---

# 5. Sidebar

The sidebar is the primary navigation.

Visible options depend on user role.

Standard navigation order:

- Dashboard
- Content
- My Tasks
- Notifications
- Settings (if permitted)

Admin-specific options:

- Users
- Reports
- Configuration

---

# 6. Page Structure

Every page follows the same structure.

```
Page Title

Optional Description

--------------------------------

Primary Actions

--------------------------------

Filters

--------------------------------

Main Content
```

---

# 7. Spacing System

Use consistent spacing throughout the application.

Standard spacing units:

- Extra Small
- Small
- Medium
- Large
- Extra Large

Spacing must remain consistent between:

- cards
- buttons
- form fields
- tables
- sections

---

# 8. Typography

Use a single font family throughout the application.

Typography hierarchy:

## Page Title

Largest text.

Used only once per page.

---

## Section Heading

Used for:

- Dashboard sections
- Forms
- Tables
- Cards

---

## Card Title

Slightly smaller than section heading.

---

## Body Text

Default application text.

---

## Secondary Text

Used for:

- helper text
- timestamps
- optional descriptions

---

## Labels

Used above form fields.

---

# 9. Color Philosophy

The interface should remain neutral.

Color is reserved primarily for:

- workflow status
- warnings
- errors
- success messages

Avoid excessive use of bright colors.

---

# 10. Status Colors

Each workflow status shall have a consistent color throughout the application.

Examples:

| Status Type | Color Intent |
|--------------|--------------|
| Idea | Neutral |
| Script | Blue |
| Review | Orange |
| Approved | Green |
| Completed | Teal |
| Scheduled | Purple |
| Uploaded | Dark Green |
| Rejected | Red |

Exact color values are implementation-specific.

---

# 11. Buttons

Buttons shall have consistent hierarchy.

## Primary Button

Used for:

- Save
- Submit
- Create
- Approve

Only one primary button should exist within a major action area.

---

## Secondary Button

Used for:

- Cancel
- Edit
- Assign
- Back

---

## Danger Button

Used only for destructive actions.

Examples:

- Delete
- Remove
- Archive

---

## Text Button

Used for low-priority actions.

Examples:

- View
- Open
- Copy Link

---

# 12. Form Design

All forms follow identical rules.

Every field includes:

- Label
- Input
- Validation message (if required)

Avoid placeholder text as the primary label.

---

# 13. Input Controls

Supported controls include:

- Text Box
- Multi-line Text Area
- Dropdown
- Searchable Dropdown
- Checkbox
- Toggle
- URL Input
- Read-only Field

No unnecessary control types should be introduced.

---

# 14. Required Fields

Required fields shall display a visual indicator.

Validation occurs before submission.

---

# 15. Read-Only Fields

Fields that cannot currently be edited shall appear visually distinct.

Examples:

- ID
- Creator
- Current Status
- Assigned User (where applicable)

---

# 16. Tables

Tables are the primary content display.

Standard features:

- Sorting
- Filtering
- Search
- Pagination (if required)
- Row click to open details

Avoid inline editing wherever possible.

---

# 17. Table Columns

Every table shall support:

- consistent alignment
- fixed header
- alternating row hover
- clear status indicator

---

# 18. Cards

Dashboard cards summarize information.

Each card contains:

- Title
- Count
- Optional secondary information

Cards should never become overcrowded.

---

# 19. Status Badges

Workflow status is displayed using badges.

Each badge contains:

- Status Name
- Consistent Color

Badges appear in:

- tables
- reel details
- dashboards
- search results

---

# 20. Avatars

Assigned users are displayed using:

- Name
- Initial avatar (optional)

Profile photos are optional.

---

# 21. Icons

Icons supplement text.

Icons must never replace text labels entirely.

Use icons consistently for:

- Edit
- Delete
- Search
- Filter
- Notification
- Settings
- User
- Email
- Link

---

# 22. Links

Links should appear visually distinct from body text.

External links:

- Canva
- Google Docs
- Other resources

should open in a new browser tab.

---

# 23. Modals

Use modal dialogs only for:

- confirmations
- assignment
- approvals
- rejection reason
- delete confirmation

Avoid large forms inside modals.

---

# 24. Confirmation Dialogs

Confirmation dialogs are required for:

- Delete
- Reject
- Remove Assignment
- Reset Configuration

Not required for standard save operations.

---

# 25. Notifications

Notifications should appear consistently.

Types:

- Success
- Warning
- Error
- Information

Notifications disappear automatically after a reasonable duration unless user interaction is required.

---

# 26. Loading States

Every data request shall display a loading state.

Examples:

- Loading spinner
- Skeleton placeholders

Avoid blank pages during loading.

---

# 27. Empty States

Every empty list shall display:

- Friendly message
- Optional action button

Example:

"No content items found."

---

# 28. Error States

Errors should explain:

- What happened
- What the user can do next

Avoid technical messages.

---

# 29. Accessibility

The interface shall support:

- keyboard navigation
- visible focus states
- sufficient color contrast
- readable font sizes

Color alone must never communicate important information.

---

# 30. Responsive Behaviour

Priority order:

1. Desktop
2. Laptop
3. Tablet
4. Mobile

Tables may become horizontally scrollable on smaller devices.

---

# 31. Dark Mode

Dark mode is not included in Version 1.

The design system should allow future support without redesigning components.

---

# 32. Component Consistency

Every reusable component should have one standard appearance.

Examples:

- Buttons
- Inputs
- Tables
- Cards
- Badges
- Modals
- Notifications
- Dropdowns

Duplicate component styles should be avoided.

---

# 33. UI Philosophy Summary

The interface should feel:

- Professional
- Calm
- Fast
- Organized
- Predictable
- Minimal

The design should help users complete work quickly rather than impress them visually.

---

# Dependencies

## Depends On

- 003 - User Roles & Permissions
- 006 - Workflow Engine
- 008 - Screens & Navigation

## Referenced By

- 018 - Development Standards
- Future implementation documentation