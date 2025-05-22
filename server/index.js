import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Authroutes from "./routes/Authroutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setSocket from "./socket.js";
import messagesRoute from "./routes/MessagesRoute.js";

// Load environment variables
dotenv.config();

// Environment Variable Validation
if (!process.env.DATABASE_URL || !process.env.ORIGIN) {
    console.error("❌ Missing environment variables. Please check .env file.");
    process.exit(1); // Exit process if critical env vars are missing
}

// Initialize app
const app = express();
const port = process.env.PORT || 3001;

// Database connection with better error handling
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("✅ DB connection is successful"))
    .catch((err) => {
        console.error(`❌ Database connection error: ${err.message}`);
        process.exit(1); // Exit process on critical failure
    });

// Middleware for security and data parsing
app.use(
    cors({
        origin: process.env.ORIGIN.split(','), // Allow multiple origins via env
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true, // Allow cookies to be sent across origins
    })
);

app.use(express.json());
app.use(cookieParser()); 


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files",express.static("uploads/files"));


app.use("/api/auth", Authroutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages",messagesRoute)

// Error Handling Middleware for improved UX
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start the server
const server = app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});

setSocket(server)

// Graceful Shutdown (important in production)
process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down gracefully...");
    await mongoose.connection.close();
    server.close(() => {
        console.log("✅ Server closed successfully. Goodbye! 👋");
        process.exit(0);
    });
});
