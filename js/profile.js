
// ========================================
// ZYRA TECH - DYNAMIC FREELANCER PROFILES
// ========================================

const members = {

    nithya: {
        name: "Nithya Sri Dharmalingam",
        role: "Full Stack Developer | PPT Creator | Portfolio Creator",

        image: "assets/team/teamLeadprofile.jpeg",

        bio: "Team Lead at Zyra Tech, passionate about full stack development, creative presentations, and building professional portfolio websites.",

        about: "I am Nithya Sri Dharmalingam, the Team Lead of Zyra Tech. I am interested in developing creative and user-friendly digital experiences through technology.",

        aboutExtra: "I enjoy working on web development, creating professional presentations, and designing portfolio websites. I aim to combine creativity and technology to build meaningful digital solutions.",

        teamRole: "Team Lead",

        skills: [
            {
                name: "Full Stack Development",
                description: "Building responsive and functional web applications."
            },
            {
                name: "PPT Creation",
                description: "Creating professional and engaging presentations."
            },
            {
                name: "Portfolio Creation",
                description: "Designing modern and professional portfolio websites."
            }
        ]
    },

    shinee: {
        name: "R.J. Shinee",
        role: "UI/UX Designer | Presentation Maker | Frontend Developer",

        image: "assets/team/shinee.jpg",

        bio: "A creative designer and frontend developer interested in user-friendly designs, engaging presentations, and modern web experiences.",

        about: "I am R.J. Shinee, a member of the Zyra Tech team. I am interested in UI/UX design, frontend development, and creating visually appealing digital experiences.",

        aboutExtra: "I enjoy designing user-friendly interfaces, creating presentations, and developing attractive website layouts. I aim to make digital experiences both creative and easy to use.",

        teamRole: "Team Member",

        skills: [
            {
                name: "UI/UX Design",
                description: "Designing attractive and user-friendly interfaces."
            },
            {
                name: "Presentation Making",
                description: "Creating creative and well-organized presentations."
            },
            {
                name: "Frontend Development",
                description: "Building responsive and interactive website interfaces."
            }
        ]
    }

};


// ========================================
// LOAD SELECTED PROFILE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const memberId = params.get("id") || "nithya";

    const member = members[memberId];

    if (!member) {
        document.querySelector("main").innerHTML = `
            <section class="profile-section">
                <div class="profile-container">
                    <h2>Profile Not Found</h2>
                    <p>The requested freelancer profile is unavailable.</p>
                    <a href="index.html">Back to Home</a>
                </div>
            </section>
        `;
        return;
    }

    // Update page title
    document.title = `${member.name} | Zyra Tech`;

    // Update profile image
    const profileImage = document.getElementById("profile-image");
    profileImage.src = member.image;
    profileImage.alt = member.name;

    // Update profile details
    document.getElementById("profile-name").textContent = member.name;

    document.getElementById("profile-role").textContent = member.role;

    document.getElementById("profile-bio").textContent = member.bio;

    // Update About section
    document.getElementById("profile-about").textContent = member.about;

    document.getElementById("profile-about-extra").textContent =
        member.aboutExtra;

    // Update skills
    const skillsList = document.getElementById("skills-list");

    skillsList.innerHTML = member.skills.map((skill, index) => `
        <div class="skill-card">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${skill.name}</h3>
            <p>${skill.description}</p>
        </div>
    `).join("");

    // Update experience section
    const experienceList = document.getElementById("experience-list");

    experienceList.innerHTML = `
        <article class="experience-card">
            <span class="experience-label">ZYRA TECH</span>
            <h3>${member.teamRole}</h3>
            <p class="experience-period">Zyra Tech Community</p>
            <p>Contributing skills and creativity as part of the Zyra Tech team.</p>
        </article>
    `;

    // Projects will be added when project details are available
    // ========================================
// DISPLAY PROJECTS
// ========================================

const projectsList = document.getElementById("profile-projects");

if (member.projects && member.projects.length > 0) {

    projectsList.innerHTML = member.projects.map(project => `

        <article class="profile-project-card">

            <div class="project-details">

                <span class="project-label">FEATURED PROJECT</span>

                <h3>${project.name}</h3>

                <p>${project.description}</p>

                <p>
                    <strong>Technologies:</strong>
                    ${project.technologies}
                </p>

                <p>
                    <strong>My Role:</strong>
                    ${project.role}
                </p>

                <div class="project-buttons">

                    ${project.liveLink ? `
                        <a href="${project.liveLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="project-btn">
                            View Live Project →
                        </a>
                    ` : ""}

                    ${project.pdfLink ? `
                        <a href="${project.pdfLink}"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="project-btn">
                            View PPT / PDF →
                        </a>
                    ` : ""}

                </div>

            </div>

        </article>

    `).join("");

} else {

    projectsList.innerHTML = `
        <p>Projects will be updated soon.</p>
    `;

}

});
