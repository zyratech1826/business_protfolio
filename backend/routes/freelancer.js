
const express = require("express");
const router = express.Router();
const db = require("../database");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Create uploads folder if it does not exist
const uploadDirectory = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure photo storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }[file.mimetype];

        callback(
            null,
            `${crypto.randomUUID()}${extension}`
        );
    }
});

// Configure upload validation
const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only JPG, PNG, and WEBP images are allowed.")
            );
        }

        callback(null, true);
    }
});

// Handle photo upload errors
const handlePhotoUpload = (req, res, next) => {
    upload.single("profilePhoto")(req, res, (error) => {
        if (error) {
            const isSizeError = error instanceof multer.MulterError &&
                error.code === "LIMIT_FILE_SIZE";

            return res.status(400).json({
                success: false,
                message: isSizeError
                    ? "Profile photo must be smaller than 5 MB."
                    : error.message
            });
        }

        next();
    });
};

// Freelancer registration
router.post("/", handlePhotoUpload, (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            location,
            profession,
            experience,
            skills,
            bio,
            portfolio,
            github,
            linkedin,
            workSamples,
            availability,
            workMode
        } = req.body;

        // Required field validation
        if (
            !fullName ||
            !email ||
            !phone ||
            !profession ||
            !skills ||
            !bio
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // Clean input values
        const cleanName = String(fullName).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPhone = String(phone).trim();
        const cleanProfession = String(profession).trim();
        const cleanSkills = String(skills).trim();
        const cleanBio = String(bio).trim();

        const cleanLocation = String(location || "").trim();
        const cleanExperience = String(experience || "").trim();
        const cleanPortfolio = String(portfolio || "").trim();
        const cleanGithub = String(github || "").trim();
        const cleanLinkedin = String(linkedin || "").trim();
        const cleanWorkSamples = String(workSamples || "").trim();
        const cleanAvailability = String(availability || "").trim();
        const cleanWorkMode = String(workMode || "").trim();

        // Length validation
        if (
            cleanName.length > 100 ||
            cleanEmail.length > 150 ||
            cleanPhone.length > 20 ||
            cleanLocation.length > 150 ||
            cleanProfession.length > 100 ||
            cleanExperience.length > 100 ||
            cleanSkills.length > 1000 ||
            cleanBio.length > 2000 ||
            cleanPortfolio.length > 500 ||
            cleanGithub.length > 500 ||
            cleanLinkedin.length > 500 ||
            cleanWorkSamples.length > 2000 ||
            cleanAvailability.length > 100 ||
            cleanWorkMode.length > 100
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

        // Phone validation
        if (!/^[0-9+\-\s()]{7,20}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number."
            });
        }

        // Save application
        const statement = db.prepare(`
            INSERT INTO freelancers (
                full_name,
                email,
                phone,
                location,
                profile_photo,
                profession,
                experience,
                skills,
                bio,
                portfolio,
                github,
                linkedin,
                work_samples,
                availability,
                work_mode
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = statement.run(
            cleanName,
            cleanEmail,
            cleanPhone,
            cleanLocation,
            req.file ? req.file.filename : null,
            cleanProfession,
            cleanExperience,
            cleanSkills,
            cleanBio,
            cleanPortfolio,
            cleanGithub,
            cleanLinkedin,
            cleanWorkSamples,
            cleanAvailability,
            cleanWorkMode
        );

        res.status(201).json({
            success: true,
            message: "Your freelancer application has been submitted successfully!",
            applicationId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Freelancer registration error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit your application. Please try again."
        });
    }
});

module.exports = router;
