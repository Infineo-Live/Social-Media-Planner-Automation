# Infineo - Social Media Planner Automation

**Version:** 1.0  
**Architecture:** React + TypeScript + Vite Web Application & Google Sheets / Apps Script Persistent Storage  
**Status:** Production Ready  

---

## 1. Overview

The **Infineo Social Media Planner** is a workflow-driven web application designed to automate, track, and streamline social media content production (specifically Instagram Reels, YouTube Shorts, LinkedIn, and Twitter content) across multiple content series:
- **NKPS** (Neo Ki Paathshala)
- **ATMC** (Ancient Traditions Modern Curiosity)
- **FUN** (Fun Reels)
- **AD** (Ad Reels)
- **PS** (Prayer / Shloka)

It replaces chaotic group messages and ad-hoc spreadsheets with a single, role-based workflow engine enforcing strict approval gates, task assignments, metadata validation, scheduling, and upload tracking.

---

## 2. Core Features & Architecture

- **Linear 13-Stage Workflow Engine:**  
  `Idea` → `Idea Review (Manager)` → `Idea Review (Admin)` → `Script WIP` → `Script Review (Manager)` → `Script Review (Admin)` → `Reel WIP` → `Reel Review (Manager)` → `Reel Review (Admin)` → `Metadata Completion` → `Completed` → `Scheduled` → `Uploaded`
- **Role-Based Access Control (RBAC):**
  - **Employee:** Create ideas, claim unassigned script/reel tasks, submit work, complete publishing metadata.
  - **Manager:** Stage 1 approvals, task assignment/reassignment, team workload monitoring, platform scheduling, upload tracking.
  - **Admin:** Final stage approvals (Stage 2 gates), full settings & user management, platform scheduling, upload tracking.
- **Single Source of Truth:** Google Sheets via Google Apps Script web backend or in-memory fallback layer.
- **Notification Engine:** In-app notification alerts with duplicate prevention and HTML/Plaintext email notifications.
- **Configuration-Over-Hardcoding:** Zero hardcoded business rules (Series, Sub-Series, Platforms, Timezone, Branding, Feature Flags).

---

## 3. Technology Stack

- **Frontend Framework:** React 18 + TypeScript 5 + Vite 5
- **Icons:** Lucide React
- **Testing & Tooling:** Vitest + @testing-library/react + ESLint + TypeScript `tsc`
- **Backend / Data Store:** Google Sheets & Google Apps Script REST API / In-Memory Mock Repository

---

## 4. Setup & Local Development

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### Installation
```bash
# Clone the repository
git clone https://github.com/Infineo-Live/Social-Media-Planner-Automation.git
cd "Social Media Planner Automation"

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Development Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Compile TypeScript and build production bundle
- `npm run lint`: Run ESLint check
- `npm run typecheck`: Run TypeScript type-checking without emitting files
- `npm run test`: Run Vitest automated test suite

---

## 6. Environment Configuration

Edit `.env` or environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application Title | `Infineo Social Media Planner` |
| `VITE_COMPANY_NAME` | Organization Name | `Infineo` |
| `VITE_TIMEZONE` | System Timezone | `Asia/Kolkata` |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID | `YOUR_GOOGLE_CLIENT_ID` |
| `VITE_GOOGLE_SHEET_ID` | Google Spreadsheet ID | `YOUR_GOOGLE_SHEET_ID` |
| `VITE_APPS_SCRIPT_URL` | Google Apps Script URL | `YOUR_APPS_SCRIPT_URL` |
| `VITE_ENABLE_EMAIL_NOTIFICATIONS` | Enable/Disable Email | `true` |
| `VITE_ENABLE_MOCK_DATA` | Mock Storage Mode | `true` |

---

## 7. Production Deployment

### Building for Production
```bash
npm run build
```
Output files will be generated in the `dist/` directory.

### Deploying Frontend
Deploy the static `dist/` folder to any host (Netlify, Vercel, AWS S3, Cloudflare Pages, Firebase Hosting).

---

## 8. License

Internal Proprietary Application — **Infineo**
