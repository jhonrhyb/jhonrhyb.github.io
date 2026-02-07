// === Infinite Typewriter ===
setTimeout(() => {
  const words = ["Jhon Rhyb", "Web Developer", "UI/UX Designer"];
  const el = document.getElementById("typewriter");
  let wordIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0;

  function typeLoop(currentTime) {
    if (currentTime - lastTime < 100) { // Throttle to ~10 FPS for smoother typing
      requestAnimationFrame(typeLoop);
      return;
    }
    lastTime = currentTime;

    const currentWord = words[wordIndex];
    if (!isDeleting) {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        setTimeout(() => isDeleting = true, 1200);
      }
    } else {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    requestAnimationFrame(typeLoop);
  }
  requestAnimationFrame(typeLoop);
}, 4000);

window.addEventListener("mousemove", e => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 20;
  const my = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelector('.hero').style.setProperty('--mx', mx + 'px');
  document.querySelector('.hero').style.setProperty('--my', my + 'px');
});

const skillGrid = document.querySelector('.skill-grid');
let skills = Array.from(skillGrid.children);

const gap = 15;
let cols = 0;
let cellWidth = 0;
let cellHeight = 0;

// Drag functionality variables
let isDragging = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let shuffleInterval;
let dragRAF = null; // For requestAnimationFrame in drag

// Calculate grid layout
function calculateGrid() {
  if (skills.length === 0) return;
  cellWidth = skills[0].offsetWidth;
  cellHeight = skills[0].offsetHeight;
  const containerWidth = skillGrid.clientWidth;

  // number of columns that fit
  cols = Math.floor((containerWidth + gap) / (cellWidth + gap));
  if (cols < 1) cols = 1;

  // calculate rows
  const rows = Math.ceil(skills.length / cols);
  skillGrid.style.height = rows * (cellHeight + gap) - gap + 'px';
}

// Position skills in grid
function layoutSkills(array = skills) {
  array.forEach((skill, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (cellWidth + gap);
    const y = row * (cellHeight + gap);
    skill.dataset.targetX = x;
    skill.dataset.targetY = y;
    skill.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Animate shuffle
function shuffleSkills() {
  if (isDragging) return; // Skip shuffle if dragging
  skills = shuffleArray(skills);

  skills.forEach((skill, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (cellWidth + gap);
    const y = row * (cellHeight + gap);

    skill.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Drag event handlers
function startDrag(e) {
  e.preventDefault(); // Prevent default touch behavior
  isDragging = true;
  draggedElement = e.target;
  const rect = draggedElement.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;
  draggedElement.style.transition = 'none'; // Disable transition during drag
  draggedElement.style.zIndex = 10; // Bring to front
  draggedElement.style.willChange = 'transform'; // Optimize for animation
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
}

function drag(e) {
  e.preventDefault(); // Prevent scrolling during drag
  if (!isDragging || !draggedElement) return;

  if (dragRAF) cancelAnimationFrame(dragRAF);
  dragRAF = requestAnimationFrame(() => {
    const gridRect = skillGrid.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let x = clientX - gridRect.left - offsetX;
    let y = clientY - gridRect.top - offsetY;
    // Constrain within grid bounds
    x = Math.max(0, Math.min(x, gridRect.width - cellWidth));
    y = Math.max(0, Math.min(y, gridRect.height - cellHeight));
    draggedElement.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function endDrag() {
  if (!draggedElement) return;
  isDragging = false;
  draggedElement.style.transition = 'transform 0.7s ease'; // Re-enable transition
  draggedElement.style.zIndex = ''; // Reset z-index
  draggedElement.style.willChange = ''; // Reset optimization
  // Snap to nearest grid position
  const rect = draggedElement.getBoundingClientRect();
  const gridRect = skillGrid.getBoundingClientRect();
  const x = rect.left - gridRect.left;
  const y = rect.top - gridRect.top;
  const col = Math.round(x / (cellWidth + gap));
  const row = Math.round(y / (cellHeight + gap));
  const snapX = col * (cellWidth + gap);
  const snapY = row * (cellHeight + gap);
  draggedElement.style.transform = `translate(${snapX}px, ${snapY}px)`;
  // Update skills array order based on new position (swap with the item at new position)
  const index = skills.indexOf(draggedElement);
  const newIndex = row * cols + col;
  if (newIndex !== index && newIndex < skills.length) {
    [skills[index], skills[newIndex]] = [skills[newIndex], skills[index]];
  }
  // Reposition all skills after swap
  layoutSkills();
  draggedElement = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchend', endDrag);
  if (dragRAF) cancelAnimationFrame(dragRAF);
}

// Attach drag listeners to skills (both mouse and touch)
skills.forEach(skill => {
  skill.addEventListener('mousedown', startDrag);
  skill.addEventListener('touchstart', startDrag, { passive: false });
});

// Pause shuffle on hover
skillGrid.addEventListener('mouseenter', () => {
  clearInterval(shuffleInterval);
});

skillGrid.addEventListener('mouseleave', () => {
  shuffleInterval = setInterval(shuffleSkills, 3000);
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Debounce resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    calculateGrid();
    layoutSkills();
  }, 100);
});

// Initialize
calculateGrid();
layoutSkills();

// Shuffle every 3 seconds
shuffleInterval = setInterval(shuffleSkills, 3000);

const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        entry.target.classList.add('visible');   // section comes into view
      else
        entry.target.classList.remove('visible'); // section goes out of view
    });
  },
  {
    threshold: 0.5 // triggers when 50% of section is visible
  }
);

sections.forEach(section => observer.observe(section));

/* Smooth scrolling for header and section */
let sectionsHero = document.querySelectorAll('header, section');
let currentSection = 0;
let isScrolling = false;

function scrollToSection(index) {
  if (index < 0 || index >= sectionsHero.length) return;
  isScrolling = true;
  sectionsHero[index].scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    isScrolling = false;
    currentSection = index;
  }, 600); // match CSS transition duration
}

window.addEventListener('wheel', (e) => {
  if (isScrolling) return;

  if (e.deltaY > 0) {
    scrollToSection(currentSection + 1);
  } else {
    scrollToSection(currentSection - 1);
  }
});

// Fade in content after 1 second and show scrollbar
setTimeout(() => {
  document.querySelector('.content').style.opacity = '1';
  document.querySelector('.content').style.visibility = 'visible';
  document.documentElement.style.overflow = 'auto'; // Show scrollbar
}, 2000);