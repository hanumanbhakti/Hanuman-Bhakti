document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const menuBtn = document.getElementById("menuToggleBtn");
  const closeBtn = document.getElementById("drawerCloseBtn");
  const shareBtn = document.getElementById("shareBtn");
  const stickyShareBtn = document.querySelector(".sticky-share");
  const mobileMenuBtn = document.querySelector(".mobile-nav-menu-btn");
  const revealElements = document.querySelectorAll(".reveal");
  const siteLoader = document.getElementById("siteLoader");
  const backToTopBtn = document.getElementById("backToTopBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const dailyQuote = document.getElementById("dailyQuote");
  const navLinks = document.querySelectorAll(".nav-link");

  let lastFocusedElement = null;
  let lastSearchFocus = null;

  const quotes = [
    "“राम काज कीन्हे बिनु मोहि कहाँ विश्राम”",
    "“बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार”",
    "“संकट ते हनुमान छुड़ावै, मन क्रम वचन ध्यान जो लावै”",
    "“जय हनुमान ज्ञान गुन सागर”",
    "“सब सुख लहै तुम्हारी सरना, तुम रक्षक काहू को डरना”"
  ];

  function isDrawerOpen() {
    return drawer && drawer.classList.contains("active");
  }

  function openMobileMenu() {
    if (!drawer || !overlay) return;

    lastFocusedElement = document.activeElement;
    drawer.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "मेनू बंद करें");
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "true");
      mobileMenuBtn.setAttribute("aria-label", "मेनू बंद करें");
    }

    if (closeBtn) closeBtn.focus();
  }

  function closeMobileMenu() {
    if (!drawer || !overlay) return;

    drawer.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("drawer-open");
    drawer.setAttribute("aria-hidden", "true");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "मेनू खोलें");
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenuBtn.setAttribute("aria-label", "मेनू खोलें");
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function toggleMobileMenu() {
    isDrawerOpen() ? closeMobileMenu() : openMobileMenu();
  }

  async function sharePage() {
    const shareData = {
      title: document.title,
      text: "श्री हनुमान जी की भक्ति, चालीसा, कथा और आध्यात्मिक ज्ञान देखें।",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("पेज लिंक कॉपी हो गया है।");
      } else {
        fallbackCopyText(window.location.href);
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
      document.execCommand("copy");
      showToast("पेज लिंक कॉपी हो गया है।");
    } catch {
      alert("शेयरिंग समर्थित नहीं है। कृपया लिंक कॉपी करें: " + text);
    }

    document.body.removeChild(tempInput);
  }

  function showToast(message) {
    let toast = document.querySelector(".custom-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "custom-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
      toast.style.opacity = "0";
    }, 2200);
  }

  function handleHeaderScroll() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle("show", window.scrollY > 320);
    }

    updateActiveNav();
  }

  function handleEscapeKey(e) {
    if (e.key === "Escape" && isDrawerOpen()) {
      closeMobileMenu();
    }

    if (e.key === "Escape" && searchOverlay?.classList.contains("active")) {
      closeSearch();
    }
  }

  function trapFocus(e) {
    if (!isDrawerOpen() || e.key !== "Tab" || !drawer) return;

    const focusableElements = drawer.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const focusable = [...focusableElements].filter(el => !el.hasAttribute("disabled"));
    if (!focusable.length) return;

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  function initRevealAnimation() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  function initLoader() {
    window.addEventListener("load", () => {
      if (siteLoader) {
        setTimeout(() => {
          siteLoader.classList.add("hidden");
        }, 500);
      }
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("hb-theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      updateThemeIcon(true);
    } else {
      updateThemeIcon(false);
    }
  }

  function updateThemeIcon(isDark) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector("i");
    themeToggleBtn.setAttribute("aria-pressed", String(isDark));
    if (icon) {
      icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
    }
  }

  function toggleTheme() {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem("hb-theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  }

  function openSearch() {
    if (!searchOverlay) return;
    lastSearchFocus = document.activeElement;
    searchOverlay.classList.add("active");
    searchOverlay.setAttribute("aria-hidden", "false");
    body.classList.add("drawer-open");
    if (searchInput) searchInput.focus();
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("active");
    searchOverlay.setAttribute("aria-hidden", "true");
    body.classList.remove("drawer-open");
    if (lastSearchFocus && typeof lastSearchFocus.focus === "function") {
      lastSearchFocus.focus();
    }
  }

  function filterSearchResults() {
    if (!searchInput || !searchResults) return;
    const query = searchInput.value.trim().toLowerCase();
    const items = searchResults.querySelectorAll(".search-item");

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "block" : "none";
    });
  }

  function initQuotes() {
    if (!dailyQuote || !quotes.length) return;
    let current = 0;

    setInterval(() => {
      current = (current + 1) % quotes.length;
      dailyQuote.style.opacity = "0";

      setTimeout(() => {
        dailyQuote.textContent = quotes[current];
        dailyQuote.style.opacity = "1";
      }, 220);
    }, 4000);
  }

  function updateActiveNav() {
    if (!navLinks.length) return;

    const sections = [...navLinks]
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    let currentId = "";

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  if (menuBtn) menuBtn.addEventListener("click", toggleMobileMenu);
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileMenu);
  if (overlay) overlay.addEventListener("click", closeMobileMenu);
  if (shareBtn) shareBtn.addEventListener("click", sharePage);
  if (stickyShareBtn) stickyShareBtn.addEventListener("click", sharePage);
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (searchToggleBtn) searchToggleBtn.addEventListener("click", openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener("click", e => {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  if (searchInput) searchInput.addEventListener("input", filterSearchResults);

  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("keydown", trapFocus);
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  handleHeaderScroll();
  initRevealAnimation();
  initLoader();
  initTheme();
  initQuotes();

  if (drawer) {
    const drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });
  }
});
/* 🔥 SCROLL PERFORMANCE BOOST */
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleHeaderScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
/* 🔥 LAZY LOAD IMAGES */
const lazyImages = document.querySelectorAll("img");

if ("IntersectionObserver" in window) {
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imgObserver.observe(img));
}
/* 🔥 BUTTON CLICK EFFECT */
document.querySelectorAll(".btn, .nav-item, .icon-btn").forEach(el => {
  el.addEventListener("click", () => {
    el.style.transform = "scale(0.96)";
    setTimeout(() => {
      el.style.transform = "";
    }, 120);
  });
});
/* 🔥 AUTO CLOSE MENU ON SCROLL */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (isDrawerOpen() && currentScroll > lastScroll) {
    closeMobileMenu();
  }

  lastScroll = currentScroll;
});
/* 🔥 TOAST CONTROL */
let toastActive = false;

function showToastSafe(msg) {
  if (toastActive) return;
  toastActive = true;

  showToast(msg);

  setTimeout(() => {
    toastActive = false;
  }, 2500);
}
/* 🔥 INTERNET STATUS */
window.addEventListener("offline", () => {
  showToastSafe("⚠️ इंटरनेट कनेक्शन बंद है");
});

window.addEventListener("online", () => {
  showToastSafe("✅ इंटरनेट वापस आ गया");
});
/* 🔥 SCROLL PROGRESS */
const progressBar = document.createElement("div");
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.background = "linear-gradient(to right, #ff8a00, #ff5e00)";
progressBar.style.zIndex = "9999";
progressBar.style.width = "0%";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scroll = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (scroll / height) * 100;
  progressBar.style.width = progress + "%";
});
/* 🔥 DOUBLE TAP FIX */
let lastTap = 0;

document.addEventListener("touchend", e => {
  const now = new Date().getTime();
  if (now - lastTap < 300) {
    e.preventDefault();
  }
  lastTap = now;
}, { passive: false });


const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}