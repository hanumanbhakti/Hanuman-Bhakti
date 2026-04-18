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

  // Year inject
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let lastFocusedElement = null;
  let lastSearchFocus = null;
  let lastScroll = 0;
  let toastActive = false;

  const quotes = [
    "\u201c\u0930\u093e\u092e \u0915\u093e\u091c \u0915\u0940\u0928\u094d\u0939\u0947 \u092c\u093f\u0928\u0941 \u092e\u094b\u0939\u093f \u0915\u0939\u093e\u0901 \u0935\u093f\u0936\u094d\u0930\u093e\u092e\u201d",
    "\u201c\u092c\u0941\u0926\u094d\u0927\u093f\u0939\u0940\u0928 \u0924\u0928\u0941 \u091c\u093e\u0928\u093f\u0915\u0947, \u0938\u0941\u092e\u093f\u0930\u094c\u0902 \u092a\u0935\u0928-\u0915\u0941\u092e\u093e\u0930\u201d",
    "\u201c\u0938\u0902\u0915\u091f \u0924\u0947 \u0939\u0928\u0941\u092e\u093e\u0928 \u091b\u0941\u0921\u093c\u093e\u0935\u0948, \u092e\u0928 \u0915\u094d\u0930\u092e \u0935\u091a\u0928 \u0927\u094d\u092f\u093e\u0928 \u091c\u094b \u0932\u093e\u0935\u0948\u201d",
    "\u201c\u091c\u092f \u0939\u0928\u0941\u092e\u093e\u0928 \u091c\u094d\u091e\u093e\u0928 \u0917\u0941\u0928 \u0938\u093e\u0917\u0930\u201d",
    "\u201c\u0938\u092c \u0938\u0941\u0916 \u0932\u0939\u0948 \u0924\u0941\u092e\u094d\u0939\u093e\u0930\u0940 \u0938\u0930\u0928\u093e, \u0924\u0941\u092e \u0930\u0915\u094d\u0937\u0915 \u0915\u093e\u0939\u0942 \u0915\u094b \u0921\u0930\u0928\u093e\u201d"
  ];

  // ===== Drawer =====
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
      menuBtn.setAttribute("aria-label", "\u092e\u0947\u0928\u0942 \u092c\u0902\u0926 \u0915\u0930\u0947\u0902");
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "true");
      mobileMenuBtn.setAttribute("aria-label", "\u092e\u0947\u0928\u0942 \u092c\u0902\u0926 \u0915\u0930\u0947\u0902");
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
      menuBtn.setAttribute("aria-label", "\u092e\u0947\u0928\u0942 \u0916\u094b\u0932\u0947\u0902");
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      mobileMenuBtn.setAttribute("aria-label", "\u092e\u0947\u0928\u0942 \u0916\u094b\u0932\u0947\u0902");
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function toggleMobileMenu() {
    isDrawerOpen() ? closeMobileMenu() : openMobileMenu();
  }

  // ===== Share =====
  async function sharePage() {
    const shareData = {
      title: document.title,
      text: "\u0936\u094d\u0930\u0940 \u0939\u0928\u0941\u092e\u093e\u0928 \u091c\u0940 \u0915\u0940 \u092d\u0915\u094d\u0924\u093f, \u091a\u093e\u0932\u0940\u0938\u093e, \u0915\u0925\u093e \u0914\u0930 \u0906\u0927\u094d\u092f\u093e\u0924\u094d\u092e\u093f\u0915 \u091c\u094d\u091e\u093e\u0928 \u0926\u0947\u0916\u0947\u0902\u0964",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("\u092a\u0947\u091c \u0932\u093f\u0902\u0915 \u0915\u0949\u092a\u0940 \u0939\u094b \u0917\u092f\u093e \u0939\u0948\u0964");
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
      showToast("\u092a\u0947\u091c \u0932\u093f\u0902\u0915 \u0915\u0949\u092a\u0940 \u0939\u094b \u0917\u092f\u093e \u0939\u0948\u0964");
    } catch {
      alert("\u0936\u0947\u092f\u0930\u093f\u0902\u0917 \u0938\u092e\u0930\u094d\u0925\u093f\u0924 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e \u0932\u093f\u0902\u0915 \u0915\u0949\u092a\u0940 \u0915\u0930\u0947\u0902: " + text);
    }
    document.body.removeChild(tempInput);
  }

  // ===== Toast (single, safe) =====
  function showToast(message) {
    if (toastActive) return;
    toastActive = true;

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
      toastActive = false;
    }, 2200);
  }

  // ===== Scroll Progress Bar =====
  const progressBar = document.createElement("div");
  progressBar.style.cssText =
    "position:fixed;top:0;left:0;height:3px;background:linear-gradient(to right,#ff8a00,#ff5e00);z-index:9999;width:0%;pointer-events:none;";
  document.body.appendChild(progressBar);

  // ===== Single unified scroll handler =====
  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    // Header scrolled class
    if (header) header.classList.toggle("scrolled", scrollY > 20);

    // Back to top button
    if (backToTopBtn) backToTopBtn.classList.toggle("show", scrollY > 320);

    // Active nav
    updateActiveNav();

    // Auto close drawer on scroll down
    if (isDrawerOpen() && scrollY > lastScroll) closeMobileMenu();
    lastScroll = scrollY;

    // Scroll progress bar
    const height = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = height > 0 ? (scrollY / height) * 100 + "%" : "0%";
  }

  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      if (isDrawerOpen()) closeMobileMenu();
      if (searchOverlay?.classList.contains("active")) closeSearch();
    }
  }

  function trapFocus(e) {
    if (!isDrawerOpen() || e.key !== "Tab" || !drawer) return;
    const focusable = [...drawer.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hasAttribute("disabled"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  // ===== Reveal (IntersectionObserver only) =====
  function initRevealAnimation() {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(el => el.classList.add("is-visible", "active"));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach(el => observer.observe(el));
  }

  function initLoader() {
  // window.load ka wait karne ke bajaye jaldi hide karein
  const hideLoader = () => {
    if (siteLoader) {
      siteLoader.classList.add("hidden");
      setTimeout(() => {
        siteLoader.style.display = "none";
      }, 500);
    }
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }
  
  // Safety timeout: 3 second baad loader apne aap hat jaye
  setTimeout(hideLoader, 3000); 
}

  // ===== Theme =====
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
    if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  }

  function toggleTheme() {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem("hb-theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
  }

  // ===== Search =====
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
    searchResults.querySelectorAll(".search-item").forEach(item => {
      item.style.display = item.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
  }

  // ===== Quotes =====
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

  // ===== Active Nav =====
  function updateActiveNav() {
    if (!navLinks.length) return;
    const sections = [...navLinks]
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    let currentId = "";
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top && window.scrollY < top + section.offsetHeight) {
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

  // ===== Button click effect =====
  document.querySelectorAll(".btn, .nav-item, .icon-btn").forEach(el => {
    el.addEventListener("click", () => {
      el.style.transform = "scale(0.96)";
      setTimeout(() => { el.style.transform = ""; }, 120);
    });
  });

  // ===== Lazy load images =====
  if ("IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll("img[data-src]").forEach(img => imgObserver.observe(img));
  }

  // ===== Internet status =====
  window.addEventListener("offline", () => showToast("\u26a0\ufe0f \u0907\u0902\u091f\u0930\u0928\u0947\u091f \u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u092c\u0902\u0926 \u0939\u0948"));
  window.addEventListener("online", () => showToast("\u2705 \u0907\u0902\u091f\u0930\u0928\u0947\u091f \u0935\u093e\u092a\u0938 \u0906 \u0917\u092f\u093e"));

  // ===== Event listeners =====
  if (menuBtn) menuBtn.addEventListener("click", toggleMobileMenu);
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileMenu);
  if (overlay) overlay.addEventListener("click", closeMobileMenu);
  if (shareBtn) shareBtn.addEventListener("click", sharePage);
  if (stickyShareBtn) stickyShareBtn.addEventListener("click", sharePage);
  if (backToTopBtn) backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);
  if (searchToggleBtn) searchToggleBtn.addEventListener("click", openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
  if (searchOverlay) searchOverlay.addEventListener("click", e => {
    if (e.target === searchOverlay) closeSearch();
  });
  if (searchInput) searchInput.addEventListener("input", filterSearchResults);

  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("keydown", trapFocus);

  // Single scroll listener (replaces all 4 duplicate scroll listeners)
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  if (drawer) {
    drawer.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileMenu));
  }

  // ===== Init =====
  handleHeaderScroll();
  initRevealAnimation();
  initLoader();
  initTheme();
  initQuotes();
});
