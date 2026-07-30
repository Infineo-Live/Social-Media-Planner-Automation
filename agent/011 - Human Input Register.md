# 011 - Human Input Register

**Purpose**

This document is the single source of truth for every piece of information that must be provided by the human project owner before production deployment.

---

# 1. Human Input Checklist for Production

| ID | Title | Required For | Configuration Location | Status |
|----|-------|--------------|------------------------|--------|
| HI-001 | Google OAuth Client ID | Production User Authentication | `.env` / `VITE_GOOGLE_CLIENT_ID` | Pending Configuration |
| HI-002 | Google Sheet ID | Production Data Persistence | `.env` / `VITE_GOOGLE_SHEET_ID` | Pending Configuration |
| HI-003 | Google Apps Script Web App URL | Production API Backend | `.env` / `VITE_APPS_SCRIPT_URL` | Pending Configuration |

---

# 2. Detailed Item Register

## HI-001

**Title**  
Google OAuth Client ID  

**Reason**  
Required for Google OAuth user authentication in production deployment.  

**Required During**  
Production Deployment  

**Blocking**  
No (Local development & UAT functions via mock role switcher).  

**Temporary Placeholder**  
`YOUR_GOOGLE_CLIENT_ID`  

**Configuration Location**  
`.env` / `VITE_GOOGLE_CLIENT_ID`  

**Status**  
Pending Configuration  

---

## HI-002

**Title**  
Google Sheet ID  

**Reason**  
Target Google Spreadsheet for persistent data storage across Users, Content, Activity Log, and Settings sheets.  

**Required During**  
Production Deployment  

**Blocking**  
No (Application operates using local memory data repository during testing).  

**Temporary Placeholder**  
`YOUR_GOOGLE_SHEET_ID`  

**Configuration Location**  
`.env` / `VITE_GOOGLE_SHEET_ID`  

**Status**  
Pending Configuration  

---

## HI-003

**Title**  
Google Apps Script Web App URL  

**Reason**  
API endpoint URL for executing Google Apps Script web application backend calls.  

**Required During**  
Production Deployment  

**Blocking**  
No  

**Temporary Placeholder**  
`YOUR_APPS_SCRIPT_URL`  

**Configuration Location**  
`.env` / `VITE_APPS_SCRIPT_URL`  

**Status**  
Pending Configuration  