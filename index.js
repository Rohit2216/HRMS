const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("./logger/errorHandler");
const { connection } = require("./config/db");
// const route = require("./routes/routes");
require("dotenv").config();
const roleRoutes = require('./routes/roleRoutes');

const app = express();

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

// Set security headers
app.use(helmet());

// Enable CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        status: false,
        message: "Too many requests, please try again later.",
    },
});
app.use(limiter);

// HTTP request logging
app.use(morgan("dev"));

// Body parser
app.use(express.json({ limit: "20gb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// app.use("/api", route);
app.use('/api/roles', roleRoutes);


app.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({
        status: true,
        msg: "Welcome to homepage",
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// ─────────────────────────────────────────────
// Server
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 8786;

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("✅ Database connected!");
        console.log(`🚀 Server is running on port: ${PORT}`);
    } catch (error) {
        console.error("❌ Database not connected!");
        console.error(error);
    }
});
