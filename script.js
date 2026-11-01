// ===== DARK AND LIGHT MODE =====

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem("portfolioTheme");

    // Apply saved theme on initial load
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        document.body.classList.remove("dark-theme");
        themeToggle.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }

    // Toggle theme when clicked
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        if (document.body.classList.contains("dark-theme")) {
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute("aria-label", "Switch to light mode");
            localStorage.setItem("portfolioTheme", "dark");
        } else {
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Switch to dark mode");
            localStorage.setItem("portfolioTheme", "light");
        }
    });
}

// ===== TYPING EFFECT =====

document.addEventListener("DOMContentLoaded", function () {
    const typingElement = document.getElementById("typing-name");

    if (!typingElement) return;

    const text = "John Gabriel";
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 150);
        }
    }

    // Start typing when the website loads
    typeWriter();
});