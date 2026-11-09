
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Import API routes
const reviewRoutes = require("./routes/reviews");
const contactRoutes = require("./routes/contact");
const freelancerRoutes = require("./routes/freelancer");

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/freelancers", freelancerRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Zyra Tech API",
        status: "Server is running"
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(500).json({
        success: false,
        message: "Something went wrong on the server."
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Zyra Tech server running on port ${PORT}`);
});
