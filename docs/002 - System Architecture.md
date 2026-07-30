# 002 - System Architecture

**Project:** Infineo – Social Media Planner  
**Document Version:** 1.0  
**Status:** Draft

---

# 1. Purpose

This document defines the complete high-level architecture of the Social Media Planner application.

It explains how the system is structured, how different components interact, where data is stored, and the responsibilities of each layer.

This document intentionally does **not** describe implementation details, programming logic, or code structure. Those belong to later implementation documents.

---

# 2. System Overview

The application is an internal workflow management system used by the content production team to manage the complete lifecycle of social media content.

The system replaces manual Google Sheets tracking with a dedicated web application while continuing to use Google Sheets as the underlying database.

The application acts as the only interface used by employees.

Google Sheets are not intended to be edited directly by normal users.

---

# 3. High-Level Architecture

```
                     Employees

                          │

                          ▼

                Social Media Planner
                     Web Application

                          │

            ┌─────────────┴─────────────┐

            ▼                           ▼

      Application Logic          Authentication

            │

            ▼

        Google Sheets

            │

            ▼

      Email Notifications
```

---

# 4. Architectural Principles

The system follows these principles.

## 4.1 Single Source of Truth

All application data is stored in Google Sheets.

The web application never stores duplicate copies of business data.

---

## 4.2 Single Interface

Employees interact only with the web application.

Google Sheets function as the backend database.

Users should not perform normal work directly inside Sheets.

---

## 4.3 Role-Based Access

Every action inside the application is controlled by user roles.

The interface presented to each user depends on their assigned role.

---

## 4.4 Workflow Driven

Every Content Item moves through predefined workflow stages.

No manual workflow changes occur outside the allowed transitions.

---

## 4.5 One Content Item = One Record

Every reel, regardless of its series, is represented by exactly one Content Item.

A Content Item remains the same record throughout its complete lifecycle.

It is never duplicated when moving between workflow stages.

---

## 4.6 Configuration Over Hardcoding

Business configuration such as:

- Series
- Statuses
- Platform names
- User roles

should be maintained through configuration wherever practical rather than embedded into application logic.

---

# 5. System Components

The application consists of the following major components.

---

## 5.1 Authentication

Responsible for:

- Identifying users
- Determining user roles
- Granting application access
- Restricting unauthorized users

---

## 5.2 User Interface

Responsible for:

- Dashboards
- Navigation
- Forms
- Tables
- Search
- Filters
- Status actions
- Notifications
- User interaction

The interface adapts according to the logged-in user's permissions.

---

## 5.3 Workflow Engine

Responsible for:

- Status transitions
- Assignment changes
- Approval routing
- Validation of allowed actions

Every workflow change passes through the Workflow Engine.

---

## 5.4 Data Layer

Responsible for:

- Reading data
- Saving data
- Updating records
- Maintaining consistency

The Data Layer communicates exclusively with Google Sheets.

---

## 5.5 Notification System

Responsible for:

- Email notifications
- In-app notifications
- Assignment alerts
- Approval alerts
- Rejection alerts

---

## 5.6 Dashboard Engine

Responsible for generating:

- Status summaries
- Series summaries
- User task summaries
- Manager overviews
- Admin overviews

---

## 5.7 Activity Logging

Responsible for recording significant system events.

Examples include:

- Content creation
- Assignment changes
- Status changes
- Approvals
- Rejections
- Scheduling
- Upload completion

---

# 6. Core Business Entity

The application revolves around a single business entity.

## Content Item

A Content Item represents one social media reel.

A Content Item belongs to exactly one Series.

A Content Item may optionally belong to one Sub-Series.

Every Content Item moves through the complete production workflow.

Everything inside the application references the Content Item.

Examples include:

- Assignments
- Status
- Canva Links
- Metadata
- Scheduling
- Activity History

---

# 7. Data Flow

The standard lifecycle follows this flow.

```
User

↓

Application Interface

↓

Workflow Validation

↓

Business Rules

↓

Google Sheets

↓

Activity Log

↓

Notifications

↓

Updated Dashboard
```

Every user action follows this sequence.

---

# 8. Authentication Flow

```
User Opens Application

↓

Identity Verified

↓

User Record Retrieved

↓

Role Determined

↓

Permissions Loaded

↓

Dashboard Displayed
```

No business data is loaded until authentication completes successfully.

---

# 9. Content Lifecycle Flow

Every Content Item follows the same lifecycle.

```
Idea

↓

Script

↓

Reel

↓

Metadata

↓

Completed

↓

Scheduled

↓

Uploaded
```

Detailed workflow transitions are defined in **006 - Workflow Engine.md**.

---

# 10. Assignment Flow

Responsibility for a Content Item changes throughout the workflow.

Assignments may occur:

- Automatically
- Manually
- By user action

Assignment logic is defined separately in **010 - Task Management.md**.

---

# 11. Notification Flow

Whenever significant events occur:

```
User Action

↓

Workflow Updated

↓

Assignment Updated

↓

Notification Generated

↓

Recipient Notified
```

Notification rules are defined separately.

---

# 12. Dashboard Data Flow

Dashboards never store independent data.

Every dashboard is generated dynamically from the latest Content Item records.

Dashboard calculations always reflect the current application state.

---

# 13. Data Ownership

The application owns all business operations.

Google Sheets own all persistent business data.

Users never directly manipulate database records.

All changes occur through the application.

---

# 14. Record Identification

Every Content Item receives a unique internal identifier.

This identifier never changes throughout the lifetime of the Content Item.

The identifier is independent of:

- Episode Number
- Series
- Status
- Assignment

Changing any business field must never create a new record.

---

# 15. Separation of Responsibilities

## Authentication

Responsible only for user identity.

---

## Authorization

Responsible only for permissions.

---

## Workflow Engine

Responsible only for workflow transitions.

---

## Dashboard Engine

Responsible only for reporting and summaries.

---

## Notification System

Responsible only for communicating events.

---

## Data Layer

Responsible only for data persistence.

Each component performs one primary responsibility.

---

# 16. Scalability Principles

The architecture should support future expansion without structural redesign.

Examples include:

- Additional Series
- Additional Sub-Series
- New Workflow Statuses
- New Social Platforms
- Additional User Roles
- Additional Dashboard Widgets

These additions should not require changes to the overall architecture.

---

# 17. System Constraints

The application is intentionally designed with the following constraints.

- Internal use only.
- One organization.
- One shared data source.
- One workflow engine.
- No public access.
- No client-facing functionality.
- No deadline management.
- No project management features.
- No financial modules.
- No inventory management.

The application exists solely to manage the social media production workflow.

---

# 18. External Integrations

The application currently integrates with:

- Google Authentication
- Google Sheets
- Email Services

No other third-party integrations are part of Version 1.

---

# 19. Document Relationships

## Depends On

- 001 - Business Requirements.md

## Referenced By

- 003 - User Roles & Permissions.md
- 004 - Data Model.md
- 005 - Google Sheets Architecture.md
- 006 - Workflow Engine.md
- 008 - Screens & Navigation.md
- 009 - Dashboard Specifications.md
- 010 - Task Management.md
- 011 - Notifications.md
- 014 - Security & Access Control.md

---
End of Document