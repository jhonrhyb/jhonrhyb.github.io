/* =====================
   DESKTOP CHECK
===================== */
const isDesktop = () => window.innerWidth >= 768;

/* =====================
   THEME TOGGLE (FUTURISTIC SLIDER)
===================== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const heroImg = document.getElementById('hero-img'); // Select the image

// Function to change the image based on the theme (night or day)
const updateImage = () => {
  if (body.classList.contains('night-mode')) {
    heroImg.src = './image/developer/sleeping_image.png';  // Night mode image
  } else {
    heroImg.src = './image/developer/awake_image.png';  // Day mode image
  }
};

// Function to add hover effects only when night mode is active
const enableHoverEffects = () => {
  if (body.classList.contains('night-mode')) {
    heroImg.addEventListener('click', () => {
      heroImg.src = './image/developer/awake_image.png';
      heroImg.style.transform = 'scale(1.1)';
      heroImg.style.opacity = '1';
    });

    heroImg.addEventListener('mouseleave', () => {
      heroImg.src = './image/developer/sleeping_image.png';  // Night mode image
      heroImg.style.transform = 'scale(1)';
      heroImg.style.opacity = '1';
    });

    // Handle dragstart event to change image and style
    heroImg.addEventListener('dragstart', (event) => {
      // Prevent default browser drag behavior
      event.preventDefault(); // Prevent the image from being dragged in the default way

      // Change image and apply styles during the drag
      heroImg.src = './image/developer/awake_image.png';
      heroImg.style.transform = 'scale(1.1)';  // Apply transformation during dragging
      heroImg.style.opacity = '0.9';  // Slightly fade the image while dragging

      // Set a custom drag image (you can also use a separate image for drag if needed)
      const dragImage = new Image();
      dragImage.src = './image/developer/awake_image.png';  // Image for the drag ghost
      event.dataTransfer.setDragImage(dragImage, 0, 0);  // Set custom drag image at position (0, 0)
    });

    // Handle dragend event to reset image and styles
    heroImg.addEventListener('dragend', (event) => {
      // Reset the image and styles after dragging ends
      heroImg.src = './image/developer/sleeping_image.png';  // Default image in night mode
      heroImg.style.transform = 'scale(1)';
      heroImg.style.opacity = '1';  // Reset opacity
    });
  } else {
    // Remove hover effects when not in night mode
    heroImg.removeEventListener('mouseenter', () => { });
    heroImg.removeEventListener('mouseleave', () => { });

    // Reset styles
    heroImg.style.transform = 'scale(1)';
    heroImg.style.opacity = '1';
  }
};

// Toggle the theme and apply the correct image and hover effects
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    // Toggle day-mode and night-mode on the body
    body.classList.toggle('day-mode');
    body.classList.toggle('night-mode');

    // Update the image based on the current mode
    updateImage();

    // Enable hover effects if night mode is active
    enableHoverEffects();

    // Optional: Notify other parts of your app (like Three.js)
    window.dispatchEvent(new Event('themeChange'));
  });
}

/* =====================
   INFINITE TYPEWRITER
===================== */
setTimeout(() => {
  const words = ["Jhon Rhyb", "Full-Stack Developer", "UI/UX Enthusiast"];
  const el = document.getElementById("typewriter");
  const prefixEl = document.getElementById("prefix");

  if (!el || !prefixEl) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let lastTime = 0;

  function typeLoop(time) {
    if (time - lastTime < 100) {
      requestAnimationFrame(typeLoop);
      return;
    }
    lastTime = time;

    const word = words[wordIndex];

    if (!isDeleting) {
      el.textContent = word.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === word.length) {
        setTimeout(() => (isDeleting = true), 1200);
      }
    } else {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        prefixEl.textContent =
          words[wordIndex] === "Jhon Rhyb" ? "Hi, I'm " : "Hi, I'm a ";
      }
    }

    requestAnimationFrame(typeLoop);
  }

  requestAnimationFrame(typeLoop);
}, 4000);

/* =====================
   HERO MOUSE PARALLAX (DESKTOP ONLY)
===================== */
if (isDesktop()) {
  window.addEventListener("mousemove", e => {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const mx = (e.clientX / window.innerWidth - 0.5) * 20;
    const my = (e.clientY / window.innerHeight - 0.5) * 20;

    hero.style.setProperty("--mx", `${mx}px`);
    hero.style.setProperty("--my", `${my}px`);
  });
}

/* =====================
   SKILL GRID SETUP
===================== */
const skillGrid = document.getElementById('skill-grid');
const icons = Array.from(skillGrid.children);

const ICON_WIDTH = 60;
const ICON_HEIGHT = 60;
const GAP = isDesktop() ? 9 : 3;

let positions = [];
let iconMap = new Map();
let isDragging = false;
let draggedIcon = null;
let offsetX = 0;
let offsetY = 0;

let isHovering = false; // pause shuffle on hover

// Initialize grid positions
function setInitialPositions() {
  const cols = Math.floor(skillGrid.clientWidth / (ICON_WIDTH + GAP));
  const rows = Math.ceil(icons.length / cols);
  skillGrid.style.height = (rows * (ICON_HEIGHT + GAP)) + 'px';

  positions = [];
  icons.forEach((icon, i) => {
    const x = (i % cols) * (ICON_WIDTH + GAP);
    const y = Math.floor(i / cols) * (ICON_HEIGHT + GAP);
    positions.push({ x, y });
    icon.style.left = x + 'px';
    icon.style.top = y + 'px';
    iconMap.set(icon, i);
  });
}

// Dragging logic
icons.forEach(icon => {
  icon.addEventListener('mousedown', startDrag);
  icon.addEventListener('touchstart', startDrag);
});

function startDrag(e) {
  e.preventDefault();
  draggedIcon = e.target;
  isDragging = true;

  const clientX = e.clientX ?? e.touches[0].clientX;
  const clientY = e.clientY ?? e.touches[0].clientY;

  offsetX = clientX - draggedIcon.offsetLeft;
  offsetY = clientY - draggedIcon.offsetTop;

  draggedIcon.classList.add('dragging');

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);
}

function onDrag(e) {
  if (!isDragging || !draggedIcon) return;

  e.preventDefault();
  const clientX = e.clientX ?? e.touches[0].clientX;
  const clientY = e.clientY ?? e.touches[0].clientY;

  draggedIcon.style.left = clientX - offsetX + 'px';
  draggedIcon.style.top = clientY - offsetY + 'px';
}

function stopDrag(e) {
  if (!isDragging || !draggedIcon) return;

  isDragging = false;
  draggedIcon.classList.remove('dragging');

  // Snap to nearest grid cell
  let nearestIndex = 0;
  let minDist = Infinity;
  positions.forEach((pos, i) => {
    const dx = pos.x - draggedIcon.offsetLeft;
    const dy = pos.y - draggedIcon.offsetTop;
    const dist = dx * dx + dy * dy;
    if (dist < minDist) {
      minDist = dist;
      nearestIndex = i;
    }
  });

  // Swap if needed
  const occupiedIcon = Array.from(iconMap.entries()).find(([ic, idx]) => idx === nearestIndex)[0];
  const currentIndex = iconMap.get(draggedIcon);

  if (occupiedIcon !== draggedIcon) {
    const currentPos = positions[currentIndex];
    occupiedIcon.style.left = currentPos.x + 'px';
    occupiedIcon.style.top = currentPos.y + 'px';
    iconMap.set(occupiedIcon, currentIndex);
  }

  const targetPos = positions[nearestIndex];
  draggedIcon.style.left = targetPos.x + 'px';
  draggedIcon.style.top = targetPos.y + 'px';
  iconMap.set(draggedIcon, nearestIndex);

  draggedIcon = null;

  // Remove event listeners
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', stopDrag);
}

// Shuffle icons every 3 seconds
function shuffleIcons() {
  if (isHovering) return; // skip shuffle if mouse is hovering

  const shuffledIndexes = [...Array(icons.length).keys()];
  for (let i = shuffledIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledIndexes[i], shuffledIndexes[j]] = [shuffledIndexes[j], shuffledIndexes[i]];
  }

  icons.forEach((icon, i) => {
    const pos = positions[shuffledIndexes[i]];
    icon.style.left = pos.x + 'px';
    icon.style.top = pos.y + 'px';
    iconMap.set(icon, shuffledIndexes[i]);
  });
}

// Pause shuffle on hover
skillGrid.addEventListener('mouseenter', () => isHovering = true);
skillGrid.addEventListener('mouseleave', () => isHovering = false);

// Initialize
setInitialPositions();
setInterval(shuffleIcons, 5000);
window.addEventListener('resize', setInitialPositions);

// Select all skill icons with data-tooltip
const skillIcons = document.querySelectorAll('#skill-grid img[data-tooltip]');

// Create a floating tooltip element
const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
document.body.appendChild(tooltip);

// Show tooltip on hover
skillIcons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    tooltip.textContent = icon.dataset.tooltip;
    tooltip.style.opacity = '1';
  });

  icon.addEventListener('mousemove', e => {
    tooltip.style.left = e.clientX + 12 + 'px'; // slight offset from cursor
    tooltip.style.top = e.clientY - 28 + 'px'; // above the cursor
  });

  icon.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
});

/* =====================
   HAMBURGER MENU
===================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    console.log('ham');
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

if (navLinks) {
  navLinks.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    hamburger.classList.toggle("inactive");
    navLinks.classList.toggle("inactive");
  });
}

/* =====================
   INTERSECTION OBSERVER
===================== */
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  },
  { threshold: 0.5 }
);

sections.forEach(section => observer.observe(section));

/* =====================
   FADE IN CONTENT
===================== */
setTimeout(() => {
  const content = document.querySelector(".content");
  if (content) {
    content.style.opacity = "1";
    content.style.visibility = "visible";
  }
  document.documentElement.style.overflow = "auto";
}, 2000);