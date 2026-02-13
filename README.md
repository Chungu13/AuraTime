
# AuraTime - Appointment Management for Beauty & Wellness SMEs

Developed as my final year project, **AuraTime** is a comprehensive appointment management system designed to help small and medium businesses in the beauty and wellness industry transition from manual scheduling to efficient online booking. The platform reduces administrative overhead while improving customer experience through real-time availability tracking and automated management across three role-based portals.

## Problem Statement

Beauty and wellness SMEs often struggle with:
- Manual scheduling leading to double bookings and errors
- Time-consuming phone-based appointment management
- Lack of visibility into business performance and revenue trends
- Difficulty managing staff schedules and availability

AuraTime addresses these challenges through an integrated digital solution.

## Key Features

### Customer Portal
- **Seamless Booking Experience:** Browse services and book appointments with real-time availability
- **Account Management:** Secure registration, authentication, and profile management
- **Appointment Control:** View, reschedule, or cancel upcoming appointments
- **Secure Payments:** Integrated Stripe payment processing
- **Service Feedback:** Rate and review services to help improve quality

### Staff Portal
- **Personalized Dashboard:** Daily schedule overview and upcoming session notifications
- **Interactive Calendar:** Manage personal availability and view bookings at a glance
- **Walk-in Support:** Create manual appointments for customers without online access
- **Smart Reminders:** Automated notifications for upcoming appointments
- **Performance Insights:** Access customer feedback and ratings

### Admin Portal
- **Centralized Management:** Oversee users, staff, and role assignments
- **Service Configuration:** Define, categorize, and price services
- **Booking Oversight:** Monitor all appointments, cancellations, and system activity
- **Business Intelligence:** Generate reports on revenue, booking trends, and staff performance
- **Revenue Dashboard:** Real-time financial tracking and analytics

## Project Structure

AuraTime is built as a full-stack application with the following components:

- **Backend**: Node.js + Express API with MongoDB.
- **Frontend**: React + Vite customer portal.
- **Admin**: React + Vite administration dashboard for both admins and staff.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas or local instance)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

## Live Demo
**[View Live Application]((https://aura-time-blond.vercel.app/))**

The application is fully deployed and accessible:
- **Frontend (Customer Portal):** Vercel - [https://aura-time-blond.vercel.app/]
- **Admin Portal:** Vercel - [https://aura-time-admin.vercel.app/]
- **Backend API:** Render - [https://auratime.onrender.com]
- **Database:** MongoDB Atlas

**Demo Credentials:**
```
Admin Login:
Email: admin@auratime.com
Password: SuperSecure!1

Staff Login:
Email: staff@auratime.com
Password: Passowrd@1234

Customer Login:
Email: customer@auratime.com
Password: Customer@1234!
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- Stripe account (for payment processing)
- Cloudinary account (for image uploads)
- Git

### Clone the Repository
```bash
git clone https://github.com/Chungu13/AuraTime.git
cd AuraTime
```

### 1. Backend Setup

Navigate to the `Backend` directory:
```bash
cd Backend
npm install
```

Create a `.env` file 

Update the `.env` file with your credentials:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
PORT=4000
```

Start the server:
```bash
# Development (requires nodemon)
npm run server

### 2. Frontend Setup (Customer Portal)

Navigate to the `Frontend` directory (from project root):
```bash
cd Frontend
npm install
```

Create a `.env` file:


Configure the backend URL:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```


### 3. Admin Portal Setup

Navigate to the `Admin` directory (from project root):
```bash
cd Admin
npm install
```

Create a `.env` file:


Configure the backend URL:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```


### 4. Access the Application

Once all services are running:
- **Customer Portal:** http://localhost:3000 (or your Vite dev port)
- **Admin Portal:** http://localhost:5174 (or your Vite dev port)
- **Backend API:** http://localhost:4000

---

## 📦 Deployment Architecture

**Current Production Stack:**
- **Frontend/Admin:** Deployed on Vercel with automatic deployments from Git
- **Backend:** Hosted on Render with environment variables configured
- **Database:** MongoDB Atlas (cloud-hosted)
- **File Storage:** Cloudinary for images
- **Payments:** Stripe (live/test mode)

**Key Production Configurations:**
- CORS configured for Vercel frontend origins
- Rate limiting enabled on API endpoints
- Helmet security headers active
- Gzip compression enabled
- SSL/TLS via Vercel and Render

---


 
