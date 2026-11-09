// Multipage portfolio interactions: theme, click navigation, typing, and card effects.
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Restore the visitor's selected theme across all pages.
  try {
    if (localStorage.getItem("portfolioTheme") === "dark") body.classList.add("dark-theme");
  } catch (error) {
    // The theme still works for this page when browser storage is unavailable.
  }
  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    try {
      localStorage.setItem("portfolioTheme", body.classList.contains("dark-theme") ? "dark" : "light");
    } catch (error) {
      // Ignore storage restrictions; do not block the theme toggle.
    }
    updateThemeButton();
  });

  function updateThemeButton() {
    if (!themeToggle) return;
    const dark = body.classList.contains("dark-theme");
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }

  // Mobile navigation is opened by pressing the menu button.
  menuToggle?.addEventListener("click", () => {
    if (!navLinks) return;
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  // Set the active navigation item using the current page, not scroll position.
  const currentPage = body.dataset.page;
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === currentPage) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Click-to-navigate transition. There are no scroll or scroll-position listeners.
  document.querySelectorAll("a[data-nav]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const isModifiedClick = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
      if (!href || href.startsWith("#") || isModifiedClick || link.target === "_blank") return;
      event.preventDefault();
      navLinks?.classList.remove("open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      }
      if (reduceMotion) {
        window.location.href = href;
        return;
      }
      body.classList.add("page-leaving");
      window.setTimeout(() => { window.location.href = href; }, 180);
    });
  });

  // Name typing effect on the homepage only.
  const nameElement = document.getElementById("typing-name");
  if (nameElement && !reduceMotion) {
    const fullName = "John Gabriel";
    nameElement.textContent = "";
    let position = 0;
    const typeNext = () => {
      if (position < fullName.length) {
        nameElement.textContent += fullName.charAt(position++);
        window.setTimeout(typeNext, 95);
      }
    };
    window.setTimeout(typeNext, 300);
  }

  // Subtle 3D tilt on desktop cards. This responds to pointer movement, not scrolling.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const maxTilt = 4;
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        card.style.transform = `perspective(900px) translateY(-3px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  // Small press ripple on buttons, nav items, cards, and clickable images.
  document.querySelectorAll(".pressable, .button, .contact-card").forEach((control) => {
    control.addEventListener("click", (event) => {
      if (reduceMotion) return;
      const rect = control.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 1.15;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      const hasPointerPosition = event.clientX !== 0 || event.clientY !== 0;
      const x = hasPointerPosition ? event.clientX - rect.left : rect.width / 2;
      const y = hasPointerPosition ? event.clientY - rect.top : rect.height / 2;
      ripple.style.left = `${x - diameter / 2}px`;
      ripple.style.top = `${y - diameter / 2}px`;
      control.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });

  // Image press animation, including the profile and family photos.
  document.querySelectorAll(".photo-placeholder img, .family-image img").forEach((image) => {
    image.addEventListener("click", () => {
      if (reduceMotion) return;
      image.classList.remove("photo-clicked");
      void image.offsetWidth;
      image.classList.add("photo-clicked");
      image.addEventListener("animationend", () => image.classList.remove("photo-clicked"), { once: true });
    });
  });

  // Keep the footer year current.
  document.querySelectorAll(".current-year").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });
});
