
/* ========================================
   ZYRA TECH - FREELANCER REGISTRATION
======================================== */

const API_BASE = "http://localhost:5000";

const freelancerForm = document.getElementById("freelancerForm");
const profilePhoto = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("photoPreview");
const registrationMessage = document.getElementById("registrationMessage");

/* ========================================
   PROFILE PHOTO PREVIEW
======================================== */

if (profilePhoto && photoPreview) {
    profilePhoto.addEventListener("change", () => {
        const file = profilePhoto.files[0];

        if (!file) {
            photoPreview.src = "";
            photoPreview.hidden = true;
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showMessage(
                "Please select a JPG, PNG, or WEBP image.",
                true
            );

            profilePhoto.value = "";
            photoPreview.src = "";
            photoPreview.hidden = true;
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            showMessage(
                "Profile photo must be smaller than 5 MB.",
                true
            );

            profilePhoto.value = "";
            photoPreview.src = "";
            photoPreview.hidden = true;
            return;
        }

        const imageURL = URL.createObjectURL(file);

        photoPreview.src = imageURL;
        photoPreview.hidden = false;

        photoPreview.onload = () => {
            URL.revokeObjectURL(imageURL);
        };

        clearMessage();
    });
}

/* ========================================
   FORM SUBMISSION
======================================== */

if (freelancerForm) {
    freelancerForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!freelancerForm.reportValidity()) {
            return;
        }

        const email = document.getElementById("email")?.value.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address.", true);
            return;
        }

        const phone = document.getElementById("phone")?.value.trim();

        if (!/^[+]?[\d\s()-]{7,20}$/.test(phone)) {
            showMessage("Please enter a valid phone number.", true);
            return;
        }

        const submitButton = freelancerForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            const formData = new FormData(freelancerForm);

            const response = await fetch(
                `${API_BASE}/api/freelancers`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Registration failed."
                );
            }

            showMessage(
                "Your application has been submitted successfully! Thank you for joining Zyra Tech."
            );

            freelancerForm.reset();

            if (photoPreview) {
                photoPreview.src = "";
                photoPreview.hidden = true;
            }

        } catch (error) {
            console.error("Freelancer registration error:", error);

            showMessage(
                error.message || "Unable to submit your application. Please try again.",
                true
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Application →";
            }
        }
    });
}

/* ========================================
   MESSAGE DISPLAY
======================================== */

function showMessage(message, isError = false) {
    if (!registrationMessage) return;

    registrationMessage.textContent = message;

    registrationMessage.style.color = isError
        ? "#ff7777"
        : "#bd91ff";
}

function clearMessage() {
    if (registrationMessage) {
        registrationMessage.textContent = "";
    }
}
