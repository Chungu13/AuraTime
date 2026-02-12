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

//app config

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();


// CORS Config 
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

    // Allow localhost
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // Allow any vercel deployment of this project
    if (origin.includes("vercel.app")) {
      return callback(null, true);
    }

    // Allow your production frontend
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
  allowedHeaders: ["Content-Type", "Authorization", 'atoken', 'dtoken'],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//middlewares
app.use(express.json());

// Security Headers
app.use(helmet());

// Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Compression
app.use(compression());

// Logging
app.use(morgan("combined")); // Use 'combined' for standard Apache combined log format

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter); // Apply to API routes

//api end points
app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello I am working Dude 😎");
});

// Global Error Handler (Simple version)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`\nserver is running on ${port}`));
