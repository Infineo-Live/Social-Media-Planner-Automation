# 020 - Migration Plan

**Project:** Infineo Social Media Planner  
**Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines the migration strategy for moving from the existing Google Sheets-based planning process to the new Social Media Planner application.

The migration must:

- Preserve all existing content records.
- Avoid disruption to the team's daily workflow.
- Prevent duplicate or lost data.
- Require minimal manual work.
- Be completed once before the application becomes the primary production system.

This is a one-time migration.

---

# 2. Migration Goals

The migration process shall:

- Preserve all existing ideas and content.
- Preserve current workflow status.
- Preserve current assignments.
- Preserve existing episode numbers.
- Preserve Canva links wherever available.
- Preserve platform scheduling information wherever available.
- Preserve all historical content that is still relevant.

The migration shall not attempt to recreate historical approval logs or notification history.

---

# 3. Current Data Source

The current planning system consists of multiple Google Sheets containing content for different series.

Current primary series:

- Neo Ki Paathshala
- Ancient Traditions Modern Curiosity
- Fun Reel
- Ad Reel
- Prayer / Shloka

Each sheet currently contains planning information including:

- Serial Number
- Problem
- Story (where applicable)
- Episode Number
- Status
- Assigned Employee

---

# 4. Migration Scope

The following data shall be migrated.

## Content

- Series
- Sub-Series (where identifiable)
- Working Title (if available)
- Real Life Problem
- Mythology Story (where applicable)
- Episode Number
- Current Status
- Assigned User
- Canva Link (if present)
- Platform Metadata (if already created)

---

## Users

The application shall create user records for:

- Admins
- Managers
- Employees

User roles shall be configured before migration begins.

---

## Master Data

The following master data shall be created before importing content:

- Series
- Status List
- Platform List
- Roles
- Settings

---

# 5. Data That Will Not Be Migrated

The following information will not be imported.

- Old email notifications
- Spreadsheet formatting
- Cell colors
- Conditional formatting
- Old comments
- Historical edits
- Version history
- Manual notes outside defined columns
- Duplicate draft rows
- Empty placeholder rows

---

# 6. Data Cleanup Before Migration

Before importing data, the existing spreadsheet shall be reviewed.

The following should be cleaned.

## Duplicate Ideas

Duplicate content records shall be removed.

---

## Empty Rows

Blank rows shall be deleted.

---

## Invalid Statuses

Any status values that do not exist in the application's workflow shall be corrected.

---

## Invalid Assignments

Rows assigned to users who no longer exist shall be reassigned or left unassigned.

---

## Episode Numbers

Episode numbers shall be verified.

Missing episode numbers are acceptable.

---

## Series Validation

Every content item must belong to exactly one primary series.

---

# 7. Status Mapping

Existing spreadsheet statuses shall be mapped to application statuses.

If an existing status cannot be mapped exactly, the closest valid workflow status shall be selected manually.

No custom migration-only statuses shall exist.

---

# 8. User Mapping

Assignments in the spreadsheet shall be matched to users using email or predefined user mapping.

Example:

Old Spreadsheet Name

```
Mayukha
```

Application User

```
mayukha@company.com
```

If a matching user cannot be found:

- Assignment becomes Unassigned.
- Content remains in its existing workflow stage.

---

# 9. ID Generation

Every imported content item shall receive a new unique internal Content ID.

Spreadsheet serial numbers shall not be used as application identifiers.

They may optionally be stored for reference during migration.

---

# 10. Episode Numbers

Episode numbers shall be migrated exactly as they exist.

Rules:

- Empty remains empty.
- Existing values remain unchanged.
- No automatic renumbering.
- No validation against publishing order.

Episode numbers continue to be managed manually after migration.

---

# 11. Sub-Series Migration

Where sub-series information already exists, it shall be migrated.

Where it does not exist:

- Sub-Series remains empty.

Sub-Series is always optional.

---

# 12. Metadata Migration

If content already contains publishing metadata, it shall be imported.

Supported fields include:

- YouTube Title
- YouTube Description
- YouTube Tags
- Instagram Caption
- Instagram Poll
- LinkedIn Caption
- Twitter Caption

Missing metadata fields remain empty.

---

# 13. Canva Links

Existing Canva links shall be preserved.

Invalid or inaccessible links shall still be migrated as-is.

The application shall not verify Canva URLs during migration.

---

# 14. Scheduling Information

If scheduling information already exists, it shall be migrated.

Supported values include:

- YouTube Scheduled
- Instagram Scheduled
- LinkedIn Scheduled
- Twitter Scheduled

Missing platform values remain unchecked.

---

# 15. Uploaded Status

Uploaded platform information shall also be migrated where available.

The application shall not assume uploaded status from scheduling status.

Each platform remains independent.

---

# 16. Activity History

Historical workflow activity shall not be reconstructed.

Every imported content item begins with a clean application activity log.

The first activity entry shall indicate:

```
Imported during system migration.
```

---

# 17. Migration Order

Migration shall occur in the following sequence.

1. Configure application.
2. Create user accounts.
3. Configure master data.
4. Validate spreadsheet.
5. Import content.
6. Verify imported records.
7. Verify assignments.
8. Verify statuses.
9. Verify episode numbers.
10. Verify metadata.
11. Freeze spreadsheet editing.
12. Go Live.

---

# 18. Spreadsheet Freeze

Once migration verification is complete:

- Existing planning sheets become Read Only.
- No further editing is permitted.
- All future work occurs inside the application.

The spreadsheet becomes an archive only.

---

# 19. Verification Checklist

The following shall be verified before launch.

## Users

- All users created.
- Correct roles assigned.

---

## Content

- Total content count matches spreadsheet.
- No missing rows.
- No duplicate imports.

---

## Assignments

- Assigned users match expected values.
- Unassigned items verified.

---

## Workflow

- Every imported status is valid.
- No invalid workflow stage exists.

---

## Episodes

- Episode numbers preserved.
- Blank episode numbers remain blank.

---

## Metadata

- Existing metadata preserved.
- Canva links preserved.

---

## Dashboards

- Dashboard counts match imported data.

---

# 20. Rollback Plan

If migration issues are discovered before Go Live:

- Delete imported application data.
- Correct source spreadsheet.
- Repeat migration.

If Go Live has already occurred:

- Restore the latest application backup.
- Correct migration issue.
- Re-import affected records if necessary.

---

# 21. Go Live Criteria

The application shall become the primary planning system only after all of the following conditions are met.

- User accounts created.
- Permissions verified.
- All content imported.
- Dashboard counts verified.
- Assignments verified.
- Workflow verified.
- Metadata verified.
- Managers approve migrated data.
- Admin approves final verification.

---

# 22. Post-Migration

After Go Live:

- The spreadsheet is retained only as historical backup.
- New content is created exclusively within the application.
- All approvals occur within the application.
- All assignments occur within the application.
- All workflow tracking occurs within the application.

The spreadsheet shall no longer be used as an operational planning tool.

---

# Dependencies

## Depends On

- 002 - System Architecture
- 004 - Data Model
- 005 - Google Sheets Architecture
- 006 - Workflow Engine
- 007 - Business Rules
- 013 - Settings & Master Data

## Referenced By

- Implementation Phase
- Initial Application Setup
- Production Deployment
```