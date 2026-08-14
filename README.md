# 🏛️ CitySeva — Smart City Issue Reporting & Resolution Platform

> **HackInMotion Hackathon Project | Team RICR-HIM-1192**  
> *A robust, full-stack municipal grievance redressal system empowering citizens to report civic infrastructure issues and enabling city administrators to track, route, and resolve grievances with real-time transparency.*

---

## 🌟 Overview

**CitySeva** bridges the gap between citizens and municipal authorities. Citizens can effortlessly report infrastructure faults (potholes, open drains, water leakage, streetlight failures, sanitation hazards) with live GPS geolocation and photo evidence. City administrators manage grievances through an automated department-dispatch pipeline, deterministic status lifecycle engine, resolution workflows, and real-time density cluster analytics.

---

## ✨ Key Features

### 👤 Citizen Experience
* **Dual Login Intent UX**: Seamless role-enforced authentication for Citizens and Municipal Administrators.
* **Smart Issue Reporting**:
  * 📷 **Camera / Photo Evidence**: Direct photo capture or gallery selection with preview, size verification, and unsigned Cloudinary cloud storage.
  * 📍 **One-Click Geolocation**: Device-based GPS coordinate retrieval via browser Geolocation API.
  * 🗂️ **Categorization**: 7 core municipal domains (Roads, Sanitation, Electricity, Water, Public Property, Drainage, Other).
* **Live Issue Tracking**: Real-time visibility into civic issue status progression, assigned department details, admin notes, and resolution confirmation.

### 🛡️ Municipal Operations & Admin Center
* **Deterministic Status Lifecycle Engine**:
  $$\text{REPORTED} \longrightarrow \text{ACKNOWLEDGED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{RESOLVED} \longrightarrow \text{CLOSED}$$
* **Atomic Status History & Audit Trail**: Full timeline logging who changed status, previous/new states, timestamps, and notes with automated rollback protection.
* **Resolution Workflow**: Dedicated workflow requiring resolution proof notes before closing issues.
* **Automated Department Routing**: Server-side automatic department assignment based on issue category without citizen tampering.
* **Civic Hotspots & Density Analysis**: Deterministic geospatial clustering algorithm grouping reports within $\approx 1.1\text{ km}$ grid cells to highlight critical urban density zones.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Shadcn UI Primitives |
| **Backend** | Node.js, Express.js (v5), JavaScript |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Validation & Security** | Zod, JWT (JSON Web Tokens), Role-Based Access Control (RBAC), Helmet, Express Rate Limit, bcryptjs |
| **Media Storage** | Cloudinary (Unsigned client-side direct upload) |

---

## 📁 Repository Structure

```text
HackInMotion-RICR-HIM-1192/
├── backend/
│   ├── server.js                      # Express server entrypoint & route mounting
│   └── src/
│       ├── controllers/
│       │   ├── adminController.js     # Admin issue management & resolution logic
│       │   ├── authController.js      # User registration & login endpoints
│       │   └── issueController.js     # Citizen issue reporting & querying
│       ├── middleware/
│       │   ├── authMiddleware.js      # JWT verification middleware
│       │   └── roleMiddleware.js      # RBAC permission guard (CITIZEN / ADMIN)
│       ├── models/
│       │   ├── Department.js          # Municipal department schema
│       │   ├── Issue.js               # Core civic grievance schema
│       │   ├── StatusHistory.js       # Audit trail for status changes
│       │   └── User.js                # User accounts & role model
│       ├── routes/                    # API route definitions
│       ├── scripts/
│       │   ├── seedAdmin.js           # Admin bootstrap script
│       │   └── seedDepartments.js     # Active departments bootstrap script
│       ├── services/
│       │   └── departmentRoutingService.js # Category-to-Department routing
│       └── utils/
│           ├── statusTransition.js    # Strict lifecycle transition validator
│           └── validators.js          # Zod request validation schemas
└── frontend/
    ├── app/
    │   ├── (auth)/login/page.jsx      # Dual role login interface
    │   ├── admin/
    │   │   ├── dashboard/page.jsx     # Admin Operations Center & Hotspots
    │   │   └── issues/                # Admin issue management & detail pages
    │   └── citizen/
    │       ├── dashboard/page.jsx     # Citizen home & reporting hub
    │       ├── issues/                # Citizen issue tracking & timeline
    │       └── report/page.jsx        # Issue reporting with GPS & Cloudinary
    ├── components/
    │   ├── auth/                      # AuthProvider & ProtectedRoute wrappers
    │   └── issues/                    # StatusBadge, CategoryBadge, PriorityBadge
    └── lib/
        ├── api.js                     # Unified API client
        └── auth.js                    # Local storage token utilities
```

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Seed initial administrator and municipal departments:
```bash
node src/scripts/seedAdmin.js
node src/scripts/seedDepartments.js
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Start the frontend application:
```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@cityseva.gov.in` | `admin123` |
| **Citizen (Default)** | `citizen@cityseva.gov.in` | `citizen123` *(or register a new citizen)* |

---

## 🔌 API Reference

### 🔐 Authentication
* `POST /api/auth/register` — Register a new citizen account
* `POST /api/auth/login` — Authenticate citizen or administrator
* `GET /api/auth/me` — Retrieve current authenticated session user

### 📝 Citizen Issues
* `POST /api/issues` — Report a new civic issue *(GPS, category, photo URL)*
* `GET /api/issues/my` — List all issues reported by authenticated citizen
* `GET /api/issues/:id` — Retrieve issue details with status history timeline

### 🛡️ Admin Operations
* `GET /api/admin/issues` — Retrieve all civic issues across the municipality
* `GET /api/admin/issues/:id` — Retrieve issue details, department reference, and history
* `PATCH /api/admin/issues/:id/status` — Advance issue lifecycle (`ACKNOWLEDGED`, `IN_PROGRESS`, `CLOSED`)
* `PATCH /api/admin/issues/:id/resolve` — Resolve issue with required resolution notes

---

## 👥 Team RICR-HIM-1192
* **CitySeva Platform** built for **HackInMotion Hackathon**.
