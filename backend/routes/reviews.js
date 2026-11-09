
const express = require("express");
const router = express.Router();
const db = require("../database");

// Submit a new review
router.post("/", (req, res) => {
    try {
        const {
            name,
            email,
            company,
            designation,
            rating,
            review
        } = req.body;

        if (
            !name ||
            !email ||
            rating === undefined ||
            rating === null ||
            !review
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanReview = String(review).trim();
        const numericRating = Number(rating);

        if (
            cleanName.length > 80 ||
            cleanEmail.length > 150 ||
            cleanReview.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields are too long."
            });
        }

        if (
            !cleanName ||
            !cleanReview ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid details."
            });
        }

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Please select a rating between 1 and 5."
            });
        }

        const statement = db.prepare(`
            INSERT INTO reviews
            (name, email, company, designation, rating, review)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = statement.run(
            cleanName,
            cleanEmail,
            String(company || "").trim().slice(0, 100),
            String(designation || "").trim().slice(0, 100),
            numericRating,
            cleanReview
        );

        res.status(201).json({
            success: true,
            message: "Thank you! Your review has been submitted for approval.",
            reviewId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Review submission error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit your review."
        });
    }
});


// Get approved reviews
router.get("/", (req, res) => {
    try {
        const reviews = db.prepare(`
            SELECT
                id,
                name,
                company,
                designation,
                rating,
                review,
                created_at
            FROM reviews
            WHERE status = 'approved'
            ORDER BY created_at DESC
        `).all();

        res.json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error("Review fetching error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load reviews."
        });
    }
});


// Approve a review (admin only)
router.patch("/:id/approve", (req, res) => {
    try {
        const adminToken = process.env.ADMIN_TOKEN;

        if (
            !adminToken ||
            req.get("x-admin-token") !== adminToken
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID."
            });
        }

        const result = db.prepare(`
            UPDATE reviews
            SET status = 'approved'
            WHERE id = ? AND status = 'pending'
        `).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Pending review not found."
            });
        }

        res.json({
            success: true,
            message: "Review approved successfully."
        });

    } catch (error) {
        console.error("Review approval error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to approve review."
        });
    }
});

module.exports = router;