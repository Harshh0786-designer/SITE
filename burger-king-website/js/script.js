document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Menu filter tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      menuCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // Locate form (demo only — no backend)
  const locateForm = document.getElementById("locate-form");
  if (locateForm) {
    locateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = locateForm.querySelector("input");
      if (input && input.value.trim()) {
        alert(`Searching restaurants near "${input.value.trim()}"...`);
        locateForm.reset();
      }
    });
  }

  // Contact form (demo only — no backend)
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "Thanks! Your message has been sent.";
      contactForm.reset();
    });
  }

  // Sticky header shadow on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow =
        window.scrollY > 10
          ? "0 4px 16px rgba(0,0,0,0.12)"
          : "0 2px 12px rgba(0,0,0,0.08)";
    });
  }
});
