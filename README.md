# AuraTime - Premium Appointment Booking System

Welcome to AuraTime! This is a complete solution for managing appointment bookings, featuring a dedicated Admin panel, a customer-facing Frontend, and a robust Backend API.

## Project Structure

- **Backend**: Node.js + Express API with MongoDB.
- **Frontend**: React + Vite customer portal.
- **Admin**: React + Vite administration dashboard.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas or local instance)
- Cloudinary Account (for image uploads)
- Stripe Account (for payments)

## Installation & Setup

### 1. Backend Setup

Navigate to the `Backend` directory:
```bash
cd Backend
npm install
```

Create a `.env` file based on the example:
```bash
cp .env.example .env
```
Update the `.env` file with your credentials (MongoDB URI, Cloudinary, Stripe, etc.).

Start the server:
- Development: `npm run server` (requires nodemon)
- Production: `node server.js` or via PM2: `pm2 start server.js --name "auratime-backend"`

### 2. Frontend Setup

Navigate to the `Frontend` directory:
```bash
cd Frontend
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```
Ensure `VITE_BACKEND_URL` points to your backend (e.g., `http://localhost:4000`).

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
Serve the `dist` folder using a static server (e.g., `serve -s dist` or Nginx).

### 3. Admin Setup

Navigate to the `Admin` directory:
```bash
cd Admin
npm install
```

Create a `.env` file:
```bash
cp .env.example .env
```
Ensure `VITE_BACKEND_URL` points to your backend.

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Production Deployment Checklist

1.  **Environment Variables**: Ensure all `.env` files are populated with live credentials.
2.  **Security**:
    -   The backend is configured with `helmet`, `cors` (restricted origins), and `rate-limit`.
    -   Ensure your database is secured with strong passwords and network access lists.
3.  **Performance**:
    -   Frontend and Admin are configured to split vendor chunks for optimized loading.
    -   Backend uses `compression` (Gzip) for faster responses.
4.  **Logging**:
    -   Backend uses `morgan` for request logging. Consider setting up a log rotation strategy for production logs.
5.  **Process Management**:
    -   Use **PM2** to keep the backend running and auto-restart on failure.
    ```bash
    npm install pm2 -g
    pm2 start Backend/server.js --name "api"
    ```

## License

Private Project.
