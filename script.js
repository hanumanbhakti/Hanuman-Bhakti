/* =========================
   MOBILE DRAWER / SIDEBAR
========================= */

// Toggle mobile drawer + overlay
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (drawer && overlay) {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

// Desktop / sidebar open-close (future use safe)
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.add('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('active');
}

/* =========================
   THEME TOGGLE (DARK / LIGHT)
========================= */

const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  const icon = themeToggle.querySelector('i');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if (!icon) return;
    if (theme === 'dark') {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  }
}

/* =========================
   GLOBAL IMAGE OPTIMIZATION
   (NO MANUAL WORK NEEDED)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {

    // Lazy load all non-hero images
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }

    // Async decoding (render fast)
    if (!img.hasAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }

  });
});
