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

  let lastFocusedElement = null;

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
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  function handleEscapeKey(e) {
    if (e.key === "Escape" && isDrawerOpen()) {
      closeMobileMenu();
    }
  }

  function trapFocus(e) {
    if (!isDrawerOpen() || e.key !== "Tab" || !drawer) return;

    const focusableElements = drawer.querySelectorAll(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    const focusable = [...focusableElements].filter(
      el => !el.hasAttribute("disabled")
    );

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
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  if (menuBtn) menuBtn.addEventListener("click", toggleMobileMenu);
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMobileMenu);
  if (overlay) overlay.addEventListener("click", closeMobileMenu);
  if (shareBtn) shareBtn.addEventListener("click", sharePage);
  if (stickyShareBtn) stickyShareBtn.addEventListener("click", sharePage);

  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("keydown", trapFocus);
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  handleHeaderScroll();
  initRevealAnimation();

  if (drawer) {
    const drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });
  }
});