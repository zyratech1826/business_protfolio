
const express = require("express");
const router = express.Router();
const db = require("../database");

// Submit a project inquiry
router.post("/", (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            service,
            budget,
            details
        } = req.body;

        // Required field validation
        if (!name || !email || !service || !details) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Clean input values
        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPhone = String(phone || "").trim();
        const cleanService = String(service).trim();
        const cleanBudget = String(budget || "").trim();
        const cleanDetails = String(details).trim();

        // Length validation
        if (
            cleanName.length > 100 ||
            cleanEmail.length > 150 ||
            cleanPhone.length > 20 ||
            cleanService.length > 100 ||
            cleanBudget.length > 50 ||
            cleanDetails.length > 3000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields are too long."
            });
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Save inquiry
        const statement = db.prepare(`
            INSERT INTO contacts
            (name, email, phone, service, budget, details)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = statement.run(
            cleanName,
            cleanEmail,
            cleanPhone,
            cleanService,
            cleanBudget,
            cleanDetails
        );

        res.status(201).json({
            success: true,
            message: "Your project inquiry has been submitted successfully!",
            contactId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Contact submission error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit your inquiry. Please try again."
        });
    }
});

module.exports = router;
