
/* ========================================
   ZYRA TECH - MAIN JAVASCRIPT
======================================== */

const API_BASE = "http://localhost:5000";

/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        const isOpen = navLinks.classList.contains("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* ========================================
   PORTFOLIO FILTER
======================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        portfolioCards.forEach(card => {
            card.hidden =
                selectedCategory !== "all" &&
                card.dataset.category !== selectedCategory;
        });
    });
});

/* ========================================
   FAQ ACCORDION
======================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    answer.hidden = true;

    question.addEventListener("click", () => {
        const isExpanded =
            question.getAttribute("aria-expanded") === "true";

        faqItems.forEach(otherItem => {
            const otherQuestion = otherItem.querySelector(".faq-question");
            const otherAnswer = otherItem.querySelector(".faq-answer");

            if (otherQuestion && otherAnswer) {
                otherQuestion.setAttribute("aria-expanded", "false");
                otherAnswer.hidden = true;
            }
        });

        if (!isExpanded) {
            question.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }
    });
});

/* ========================================
   CONTACT FORM
======================================== */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = document.getElementById("clientName")?.value.trim();
        const email = document.getElementById("clientEmail")?.value.trim();
        const phone = document.getElementById("clientPhone")?.value.trim();
        const service = document.getElementById("service")?.value;
        const budget = document.getElementById("budget")?.value;
        const details = document.getElementById("projectDetails")?.value.trim();

        if (!name || !email || !service || !details) {
            showContactMessage("Please complete all required fields.", true);
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showContactMessage("Please enter a valid email address.", true);
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    service,
                    budget,
                    details
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to send your request.");
            }

            showContactMessage(result.message);
            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            showContactMessage(
                "Unable to submit your inquiry. Please try again later.",
                true
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        }
    });
}

function showContactMessage(message, isError = false) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.style.color = isError ? "#ff7777" : "#bd91ff";
}

/* ========================================
   CLIENT REVIEWS
======================================== */

let clientReviews = [];
let currentReviewIndex = 0;

const testimonialText = document.getElementById("testimonial-text");
const clientNameDisplay = document.getElementById("client-name");
const clientRole = document.getElementById("client-role");
const clientCompany = document.getElementById("client-company");
const clientAvatar = document.getElementById("client-avatar");

async function loadClientReviews() {
    try {
        const response = await fetch(`${API_BASE}/api/reviews`);

        if (!response.ok) {
            throw new Error("Unable to load reviews.");
        }

        const result = await response.json();

        clientReviews = Array.isArray(result)
            ? result
            : result.reviews || [];

        if (clientReviews.length > 0) {
            currentReviewIndex = 0;
            displayReview(currentReviewIndex);
        } else if (testimonialText) {
            testimonialText.textContent =
                "Client feedback will appear here once reviews are approved.";
        }

    } catch (error) {
        console.error("Review loading error:", error);

        if (testimonialText) {
            testimonialText.textContent =
                "Client feedback will appear here once reviews are approved.";
        }
    }
}

function displayReview(index) {
    if (!clientReviews.length) return;

    const review = clientReviews[index];

    if (testimonialText) {
        testimonialText.textContent = review.review || "";
    }

    if (clientNameDisplay) {
        clientNameDisplay.textContent = review.name || "Client";
    }

    if (clientRole) {
        clientRole.textContent = review.designation || "";
    }

    if (clientCompany) {
        clientCompany.textContent = review.company || "";
    }

    if (clientAvatar) {
        clientAvatar.hidden = true;
    }
}

const previousReview = document.getElementById("prev-testimonial");
const nextReview = document.getElementById("next-testimonial");

if (previousReview) {
    previousReview.addEventListener("click", () => {
        if (!clientReviews.length) return;

        currentReviewIndex =
            (currentReviewIndex - 1 + clientReviews.length) %
            clientReviews.length;

        displayReview(currentReviewIndex);
    });
}

if (nextReview) {
    nextReview.addEventListener("click", () => {
        if (!clientReviews.length) return;

        currentReviewIndex =
            (currentReviewIndex + 1) % clientReviews.length;

        displayReview(currentReviewIndex);
    });
}

/* ========================================
   REVIEW SUBMISSION
======================================== */

const reviewForm = document.getElementById("client-review-form");
const reviewStatus = document.getElementById("review-status");

if (reviewForm) {
    reviewForm.addEventListener("submit", async event => {
        event.preventDefault();

        const name = document.getElementById("review-name")?.value.trim();
        const email = document.getElementById("review-email")?.value.trim();
        const company = document.getElementById("review-company")?.value.trim();
        const designation = document.getElementById("review-designation")?.value.trim();
        const message = document.getElementById("review-message")?.value.trim();

        const rating = reviewForm.querySelector(
            'input[name="rating"]:checked'
        )?.value;

        if (!name || !email || !message || !rating) {
            showReviewStatus("Please complete the required fields.", true);
            return;
        }

        const submitButton = reviewForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            const response = await fetch(`${API_BASE}/api/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    company,
                    designation,
                    review: message,
                    rating: Number(rating)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to submit review.");
            }

            showReviewStatus(result.message);
            reviewForm.reset();

        } catch (error) {
            console.error("Review submission error:", error);

            showReviewStatus(
                "Unable to submit your review. Please try again.",
                true
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Review";
            }
        }
    });
}

function showReviewStatus(message, isError = false) {
    if (!reviewStatus) return;

    reviewStatus.textContent = message;
    reviewStatus.style.color = isError ? "#ff7777" : "#bd91ff";
}

/* ========================================
   INITIALIZE
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    loadClientReviews();
});
// Automatic Client Feedback Slider
const nextTestimonial = document.getElementById("next-testimonial");

if (nextTestimonial) {
    setInterval(() => {
        nextTestimonial.click();
    }, 5000);
}

// ========================================
// ZYRA TECH - ANIMATED PARTICLE BACKGROUND
// ========================================

const canvas = document.getElementById("particle-background");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];

    const count = Math.min(
        100,
        Math.floor((canvas.width * canvas.height) / 12000)
    );

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw glowing particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(170, 110, 255, 0.8)";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#9b5cff";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];

            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);

                ctx.strokeStyle =
                    `rgba(130, 100, 255, ${1 - distance / 130})`;

                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateParticles();
