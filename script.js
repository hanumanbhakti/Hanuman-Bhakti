// Function to open the desktop sidebar (mostly used in mobile view per your HTML)
function openSidebar(){
  const sidebar = document.getElementById('sidebar');
  if(sidebar) {
    sidebar.classList.add('active');
  }
}

// Function to close the desktop sidebar
function closeSidebar(){
  const sidebar = document.getElementById('sidebar');
  if(sidebar) {
    sidebar.classList.remove('active');
  }
}

// Function to toggle the modern mobile drawer and overlay
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if(drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

/**
 * Mobile Drawer Menu ko toggle karne ke liye function
 */
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    if (drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Sidebar open/close functions agar future mein use karne ho
function openSidebar() {
    const drawer = document.getElementById('mobileDrawer');
    if(drawer) drawer.classList.add('active');
}

function closeSidebar() {
    const drawer = document.getElementById('mobileDrawer');
    if(drawer) drawer.classList.remove('active');
}
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// 1. Check saved theme on load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

// 2. Click Event
themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

// 3. Icon update function
function updateIcon(theme) {
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}
