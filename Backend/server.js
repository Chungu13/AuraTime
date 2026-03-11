import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";

import staffRouter from "./routes/staffRoute.js";
import userRouter from "./routes/usersRoute.js";
import { initCronJobs } from "./cronJobs.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();
initCronJobs();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://aura-time-blond.vercel.app",
  "https://aura-time-admin.vercel.app"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    if (origin === process.env.ADMIN_URL) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", 'atoken', 'dtoken', 'token'],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50000, // Allow 50,000 requests for testing
  message: "Too many requests...",
});

app.use("/api", limiter);

app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello I am working Dude 😎");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`\nserver is running on ${port}`));
