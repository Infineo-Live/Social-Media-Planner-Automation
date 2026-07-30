# 012 - Search, Filters & Views

**Project:** Infineo - Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

The application contains a growing library of content items across multiple series and production stages. As the number of reels increases, users must be able to quickly locate the content they need without manually browsing long lists.

This document defines:

- Global search behavior
- Filtering rules
- Sorting options
- Saved views
- Default views
- List presentation rules

This document only defines how information is displayed and located. It does not define workflow behavior.

---

# 2. Design Principles

The search and filtering system shall follow these principles:

- Fast
- Simple
- Consistent across all screens
- No unnecessary filters
- No advanced query language
- No hidden filtering logic

Every list in the application should behave consistently.

---

# 3. Screens Supporting Search

Search shall be available on:

- Content Library
- My Tasks
- Dashboard Drill-down Lists
- Manager Approval Lists
- Admin Approval Lists
- Completed Content
- Scheduled Content
- Uploaded Content

---

# 4. Global Search

Every content list shall include a single search box.

The search box performs a case-insensitive search.

Search begins after the user types.

No separate search button is required.

---

# 5. Searchable Fields

The global search shall search the following fields:

- Content ID
- Working Title
- Real Life Problem
- Mythology Story
- Series Name
- Sub-Series Name
- Episode Number
- Assigned User Name

Search does not require exact matches.

Partial matches shall be supported.

Example:

Searching

```
Krish
```

may return

```
Krishna and Sudama
```

Searching

```
anger
```

may return

```
How to Control Anger
```

---

# 6. Non-Searchable Fields

The following fields shall not be searched:

- Status History
- Activity Logs
- Created Date
- Updated Date
- Internal IDs
- Platform Statuses
- Metadata Fields
- Canva Links

---

# 7. Filters

Every major content list shall provide the following filters.

---

## 7.1 Series

Single-select.

Available values:

- Neo Ki Paathshala
- Ancient Traditions Modern Curiosity
- Fun Reel
- Ad Reel
- Prayer / Shloka

Default:

All Series

---

## 7.2 Sub-Series

Visible only after a series is selected.

Displays only sub-series belonging to that series.

If no sub-series exist, the filter remains empty.

Default:

All Sub-Series

---

## 7.3 Workflow Status

Single-select.

Available values:

- Idea
- Idea Check
- Idea Approved by Manager
- Idea Approved by Admin
- Script WIP
- Script Check
- Script Approved by Manager
- Script Approved by Admin
- Reel WIP
- Reel Check
- Reel Approved by Manager
- Reel Approved by Admin
- Completed
- Scheduled
- Uploaded

Default:

All Statuses

---

## 7.4 Assigned User

Single-select.

Displays all active users.

Default:

All Users

---

## 7.5 Created By

Single-select.

Displays all active users.

Default:

All Users

---

## 7.6 Platform Status

Visible only on Scheduled and Uploaded views.

Available values:

- YouTube
- Instagram
- LinkedIn
- Twitter

This filter is intended to quickly locate content that is partially scheduled or partially uploaded.

---

# 8. No Date Filters

The application intentionally does not support:

- Created Date
- Due Date
- Deadline
- Publish Date
- Last Updated

These are not part of the business workflow.

---

# 9. Sorting

Each list shall support sorting.

Available sort fields:

- Content ID
- Working Title
- Episode Number
- Assigned User
- Workflow Status

Users may sort in:

- Ascending
- Descending

---

# 10. Default Sorting

Unless otherwise specified, all lists shall sort by:

```
Newest Content ID First
```

Newest items appear at the top.

---

# 11. My Tasks View

The My Tasks page shall never display all content.

It shall display only items currently assigned to the logged-in user.

Search only searches within those assigned items.

---

# 12. Manager Approval Views

Approval lists display only content waiting for manager action.

Examples:

- Idea Check
- Script Check
- Reel Check

No completed items appear in these lists.

---

# 13. Admin Approval Views

Approval lists display only content waiting for admin approval.

Examples:

- Idea Approved by Manager
- Script Approved by Manager
- Reel Approved by Manager

---

# 14. Completed View

Displays only content with workflow status:

```
Completed
```

Platform scheduling is ignored.

---

# 15. Scheduled View

Displays only content where at least one platform has been scheduled.

Platform filter remains available.

---

# 16. Uploaded View

Displays only content where at least one platform has been uploaded.

Platform filter remains available.

---

# 17. Dashboard Drill-down

Every dashboard card shall support opening the matching content list.

Example:

Dashboard

```
Script Check

12
```

Clicking the card opens:

```
Content Library

Filter:

Status = Script Check
```

No additional filters are applied.

---

# 18. Empty States

If no records match the current search or filters, the application displays:

```
No content found.

Try clearing one or more filters.
```

No empty tables shall be displayed.

---

# 19. Filter Persistence

Filters remain active while navigating within the same page.

Changing to another module resets filters to their defaults.

Refreshing the page resets all filters.

The application shall not permanently remember filter selections.

---

# 20. Clearing Filters

A single action shall clear all filters.

After clearing:

- Search becomes empty
- All Series selected
- All Sub-Series selected
- All Statuses selected
- All Users selected

---

# 21. Views

The application shall provide predefined views.

---

## 21.1 All Content

Displays every content item.

---

## 21.2 My Tasks

Displays content assigned to the current user.

---

## 21.3 Ideas

Displays all idea-stage content.

---

## 21.4 Script Pipeline

Displays all script-related statuses.

---

## 21.5 Reel Pipeline

Displays all reel-related statuses.

---

## 21.6 Awaiting Manager Approval

Displays:

- Idea Check
- Script Check
- Reel Check

---

## 21.7 Awaiting Admin Approval

Displays:

- Idea Approved by Manager
- Script Approved by Manager
- Reel Approved by Manager

---

## 21.8 Completed

Displays completed content.

---

## 21.9 Scheduled

Displays scheduled content.

---

## 21.10 Uploaded

Displays uploaded content.

---

# 22. Table Columns

Unless a screen requires otherwise, the default content table shall display:

- Content ID
- Series
- Sub-Series
- Working Title
- Workflow Status
- Assigned User
- Episode Number

The table intentionally excludes long text fields such as:

- Mythology Story
- Descriptions
- Social Media Captions

These are visible only inside the content detail page.

---

# 23. Pagination

Lists shall support pagination.

Default page size:

```
25 Items
```

Users may optionally switch to:

- 50
- 100

---

# 24. Performance Expectations

Search and filtering shall operate without requiring manual page refreshes.

Applying filters should immediately update the displayed list.

---

# 25. Future Considerations

The following are intentionally excluded from Version 1:

- Saved custom views
- Advanced search syntax
- Multiple simultaneous status filters
- Tag filtering
- Full-text metadata search
- Archived content filters
- Date range filters
- Favorites
- Recently viewed items

These may be introduced in future versions if required.

---

# Dependencies

### Depends On

- 004 - Data Model.md
- 006 - Workflow Engine.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md

### Referenced By

- 015 - UI Design System.md
- 019 - Testing Checklist.md
```