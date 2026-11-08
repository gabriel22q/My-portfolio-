// Portfolio interactions: theme, mobile navigation, typing and scroll reveal.
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // Restore the visitor's selected theme.
  const savedTheme = localStorage.getItem("portfolioTheme");
  if (savedTheme === "dark") body.classList.add("dark-theme");
  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    localStorage.setItem("portfolioTheme", body.classList.contains("dark-theme") ? "dark" : "light");
    updateThemeButton();
  });

  function updateThemeButton() {
    const dark = body.classList.contains("dark-theme");
    if (!themeToggle) return;
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  // Mobile navigation.
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) {
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  });

  // Subtle name typing effect.
  const nameElement = document.getElementById("typing-name");
  if (nameElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const fullName = "John Gabriel";
    nameElement.textContent = "";
    let position = 0;
    const typeNext = () => {
      if (position < fullName.length) {
        nameElement.textContent += fullName.charAt(position++);
        window.setTimeout(typeNext, 105);
      }
    };
    window.setTimeout(typeNext, 350);
  }

  // Reveal content as it enters the viewport.
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-story, .profile-panel, .qualities > div, .timeline-item, .family-card, .closing-content, .contact-links a"
  );
  revealTargets.forEach(element => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("visible"));
  }



  // Add a subtle 3D perspective to visual cards and the main portrait.
  const tiltTargets = document.querySelectorAll(
    ".photo-frame, .profile-panel, .timeline-card, .family-card, .qualities > div, .contact-links a"
  );
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer && !reduceMotion) {
    tiltTargets.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const maxTilt = card.classList.contains("photo-frame") ? 8 : 4;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        const lift = card.classList.contains("photo-frame") ? -5 : -3;
        card.style.transform = `perspective(1000px) translateY(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Ripple feedback for buttons and clickable controls.
  document.querySelectorAll(".button, .theme-toggle, .menu-toggle").forEach(control => {
    control.addEventListener("click", event => {
      if (reduceMotion) return;
      const rect = control.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.25;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      control.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });

  // Header depth and active section indicator while scrolling.
  const header = document.querySelector(".site-header");
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const pageSections = sectionLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateScrollState = () => {
    header?.classList.toggle("scrolled", window.scrollY > 12);
    const marker = window.scrollY + 140;
    let activeSection = pageSections[0];
    pageSections.forEach(section => {
      if (section.offsetTop <= marker) activeSection = section;
    });
    sectionLinks.forEach(link => {
      const isActive = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
      link.classList.toggle("active", Boolean(isActive));
    });
  };
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  // Keep the footer year current.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// Smooth click animation for all portfolio images
document.querySelectorAll("img").forEach((image) => {

    image.addEventListener("click", () => {

        // Restart the animation if clicked repeatedly
        image.classList.remove("photo-clicked");

        void image.offsetWidth;

        image.classList.add("photo-clicked");

        image.addEventListener("animationend", () => {
            image.classList.remove("photo-clicked");
        }, { once: true });

    });

});

