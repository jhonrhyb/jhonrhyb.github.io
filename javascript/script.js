/* =====================
   DESKTOP CHECK (>= 769px)
===================== */
const isDesktop = () => window.innerWidth >= 768;

/* =====================
   INFINITE TYPEWRITER
===================== */
setTimeout(() => {
  const words = ["Jhon Rhyb", "Web Developer", "UI/UX Designer"];
  const el = document.getElementById("typewriter");
  const prefixEl = document.getElementById("prefix");
  let wordIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0;

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
        setTimeout(() => isDeleting = true, 1200);
      }
    } else {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        // Update prefix based on new word
        if (words[wordIndex] === "Jhon Rhyb") {
          prefixEl.textContent = "Hi, I'm ";
        } else {
          prefixEl.textContent = "Hi, I'm a ";
        }
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
    const mx = (e.clientX / window.innerWidth - 0.5) * 20;
    const my = (e.clientY / window.innerHeight - 0.5) * 20;
    document.querySelector('.hero')?.style.setProperty('--mx', mx + 'px');
    document.querySelector('.hero')?.style.setProperty('--my', my + 'px');
  });
}

/* =====================
   SKILL GRID SETUP
===================== */
const skillGrid = document.querySelector('.skill-grid');
const gap = 15;
let skills = Array.from(skillGrid.children);
let cols = 0, cellWidth = 0, cellHeight = 0;

let isDragging = false;
let draggedElement = null;
let offsetX = 0, offsetY = 0;
let shuffleInterval;
let dragRAF = null;

function calculateGrid() {
  if (!skills.length) return;
  cellWidth = skills[0].offsetWidth;
  cellHeight = skills[0].offsetHeight;
  const width = skillGrid.clientWidth;

  cols = Math.floor((width + gap) / (cellWidth + gap));
  if (cols < 1) cols = 1;

  const rows = Math.ceil(skills.length / cols);
  skillGrid.style.height = rows * (cellHeight + gap) - gap + 'px';
}

function layoutSkills(arr = skills) {
  arr.forEach((skill, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    skill.style.transform =
      `translate(${col * (cellWidth + gap)}px, ${row * (cellHeight + gap)}px)`;
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleSkills() {
  if (isDragging) return;
  skills = shuffleArray(skills);
  layoutSkills();
}

/* =====================
   DRAG SUPPORT
===================== */
function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  draggedElement = e.target;

  const rect = draggedElement.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = x - rect.left;
  offsetY = y - rect.top;

  draggedElement.style.transition = 'none';
  draggedElement.style.zIndex = 10;

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
}

function drag(e) {
  e.preventDefault();
  if (!isDragging || !draggedElement) return;

  if (dragRAF) cancelAnimationFrame(dragRAF);

  dragRAF = requestAnimationFrame(() => {
    const grid = skillGrid.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - grid.left - offsetX;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - grid.top - offsetY;

    draggedElement.style.transform =
      `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
  });
}

function endDrag() {
  if (!draggedElement) return;
  isDragging = false;
  draggedElement.style.transition = 'transform 0.7s ease';
  draggedElement.style.zIndex = '';
  layoutSkills();
  draggedElement = null;

  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchend', endDrag);

  if (dragRAF) cancelAnimationFrame(dragRAF);
}

skills.forEach(skill => {
  skill.addEventListener('mousedown', startDrag);
  skill.addEventListener('touchstart', startDrag, { passive: false });
});

/* =====================
   SHUFFLE CONTROL
===================== */
skillGrid.addEventListener('mouseenter', () => clearInterval(shuffleInterval));
skillGrid.addEventListener('mouseleave', () =>
  shuffleInterval = setInterval(shuffleSkills, 3000)
);

/* =====================
   HAMBURGER MENU
===================== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

/* =====================
   INTERSECTION OBSERVER
===================== */
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry =>
    entry.target.classList.toggle('visible', entry.isIntersecting)
  );
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));

/* =====================
   SMOOTH SECTION SCROLL (>= 769px ONLY)
===================== */
const sectionsHero = document.querySelectorAll('header, section');
let currentSection = 0;
let isScrolling = false;

function scrollToSection(index) {
  if (index < 0 || index >= sectionsHero.length) return;
  isScrolling = true;
  sectionsHero[index].scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    isScrolling = false;
    currentSection = index;
  }, 600);
}

window.addEventListener('wheel', e => {
  if (!isDesktop()) return;   // 🔥 DISABLED BELOW 769px
  if (isScrolling) return;

  scrollToSection(e.deltaY > 0
    ? currentSection + 1
    : currentSection - 1
  );
});

/* =====================
   RESIZE (RESET STATE)
===================== */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    calculateGrid();
    layoutSkills();
    isScrolling = false;
  }, 100);
});

/* =====================
   INIT
===================== */
calculateGrid();
layoutSkills();
shuffleInterval = setInterval(shuffleSkills, 3000);

/* =====================
   FADE IN CONTENT
===================== */
setTimeout(() => {
  const content = document.querySelector('.content');
  if (content) {
    content.style.opacity = '1';
    content.style.visibility = 'visible';
  }
  document.documentElement.style.overflow = 'auto';
}, 2000);