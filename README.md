# AuraTime — Appointment Management for Beauty & Wellness

> A full-stack booking platform that helps beauty and wellness SMEs replace manual scheduling with automated online appointment management.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Customer%20Portal-brightgreen)](https://aura-time-blond.vercel.app/)
[![Admin Portal](https://img.shields.io/badge/Live%20Demo-Admin%20Portal-blue)](https://aura-time-admin.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://mongodb.com/)

---

## 🔗 Live Demo

| Portal | URL |
|---|---|
| 🧖 Customer Portal | https://aura-time-blond.vercel.app/ |
| 🛠️ Admin / Staff Portal | https://aura-time-admin.vercel.app/ |
| ⚙️ Backend API | https://auratime.onrender.com |

**Demo Credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@auratime.com | SuperSecure!1 |
| Staff | staff@auratime.com | Passowrd@1234 |
| Customer | customer@auratime.com | Customer@1234! |

---

## 🎥 Demo

[![AuraTime Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

> Covers the full customer booking flow and how real-time availability prevents double bookings across concurrent sessions.

*Replace `YOUR_VIDEO_ID` with your YouTube/Loom video ID before publishing.*

---

## 🧩 Problem & Solution

Beauty and wellness SMEs often lose bookings and revenue to manual scheduling — phone calls, paper diaries, double bookings, and no visibility into business performance.

AuraTime solves this with a three-portal system: customers book online in real time, staff manage their own schedules, and admins get full oversight of the business — all in one platform.

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) |
| Auth | JWT (role-based: Admin / Staff / Customer) |
| Payments | Stripe |
| File Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🔑 Key Engineering Decisions

- **Role-based JWT authentication** — three distinct user roles (Admin, Staff, Customer) with protected routes and scoped access at the API level.
- **Real-time availability engine** — booking slots update dynamically based on staff schedules, preventing double bookings without manual intervention.
- **Stripe payment integration** — end-to-end checkout flow with server-side payment intent creation for secure transaction handling.
- **Cloudinary for media** — offloaded image management entirely to Cloudinary to keep the backend stateless and storage-agnostic.
- **Separated frontend architecture** — Customer and Admin portals are deployed as independent Vite apps, sharing a single Express API, making both easier to maintain and scale independently.

---

## ✨ Features

> Access is controlled via JWT-based RBAC. Each role sees only what's relevant to their function.

### 🧖 Customer — Self-service booking
- Browse services and book appointments with live availability
- Secure registration and JWT-authenticated sessions
- View, reschedule, and cancel upcoming appointments
- Stripe-powered payment checkout
- Leave ratings and reviews for completed services

### 🗂️ Front Desk Staff — Day-to-day operations
- View and manage all upcoming appointments
- Create walk-in bookings for in-person customers
- Handle reschedules and cancellations on behalf of customers
- Send appointment reminders

### 👑 Admin (Business Owner) — Full oversight
- Everything front desk staff can do, plus:
- Manage staff accounts and role assignments
- Configure and price services
- Monitor all bookings and system-wide activity
- Access revenue dashboards and business performance reports

---

## 🏗️ Architecture

```
AuraTime/
├── Backend/        # Node.js + Express REST API
├── Frontend/       # React + Vite — Customer Portal
└── Admin/          # React + Vite — Admin & Staff Portal
```

**Production Infrastructure:**
- **Frontend/Admin** — Vercel with automatic Git deployments
- **Backend** — Render with environment variable configuration
- **Database** — MongoDB Atlas (cloud-hosted)
- **Security** — Helmet headers, rate limiting, Gzip compression, SSL/TLS via Vercel & Render

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account

### 1. Clone

```bash
git clone https://github.com/Chungu13/AuraTime.git
cd AuraTime
```

### 2. Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
PORT=4000
```

```bash
npm run server
```

### 3. Customer Portal

```bash
cd Frontend
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
```

```bash
npm run dev
```

### 4. Admin Portal

```bash
cd Admin
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
```

```bash
npm run dev
```

### 5. Access

| Service | URL |
|---|---|
| Customer Portal | http://localhost:3000 |
| Admin Portal | http://localhost:5174 |
| Backend API | http://localhost:4000 |

---

## 📌 About

Developed as a final year project to explore full-stack development, role-based authentication patterns, third-party API integration (Stripe, Cloudinary), and deployment of multi-service web applications.
