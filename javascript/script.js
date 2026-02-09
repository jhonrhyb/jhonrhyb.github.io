/* =====================
   DESKTOP CHECK
===================== */
const isDesktop = () => window.innerWidth >= 768;

/* =====================
   THEME TOGGLE (FUTURISTIC SLIDER)
===================== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('day-mode');
    body.classList.toggle('night-mode');

    // Notify Three.js scene to update textures
    window.dispatchEvent(new Event('themeChange'));
  });
}

/* =====================
   INFINITE TYPEWRITER
===================== */
setTimeout(() => {
  const words = ["Jhon Rhyb", "Web Developer", "UI/UX Designer"];
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
const skillGrid = document.querySelector(".skill-grid");
if (skillGrid) {
  const gap = 15;
  let skills = Array.from(skillGrid.children);
  let cols = 0;
  let cellWidth = 0;
  let cellHeight = 0;

  let isDragging = false;
  let draggedElement = null;
  let offsetX = 0;
  let offsetY = 0;
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
    skillGrid.style.height =
      rows * (cellHeight + gap) - gap + "px";
  }

  function layoutSkills(arr = skills) {
    arr.forEach((skill, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;

      skill.style.transform = `translate(
        ${col * (cellWidth + gap)}px,
        ${row * (cellHeight + gap)}px
      )`;
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

  /* ===== Drag Support ===== */
  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    draggedElement = e.target;

    const rect = draggedElement.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = x - rect.left;
    offsetY = y - rect.top;

    draggedElement.style.transition = "none";
    draggedElement.style.zIndex = 10;

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function drag(e) {
    e.preventDefault();
    if (!isDragging || !draggedElement) return;

    if (dragRAF) cancelAnimationFrame(dragRAF);

    dragRAF = requestAnimationFrame(() => {
      const grid = skillGrid.getBoundingClientRect();
      const x =
        (e.touches ? e.touches[0].clientX : e.clientX) -
        grid.left -
        offsetX;
      const y =
        (e.touches ? e.touches[0].clientY : e.clientY) -
        grid.top -
        offsetY;

      draggedElement.style.transform = `translate(
        ${Math.max(0, x)}px,
        ${Math.max(0, y)}px
      )`;
    });
  }

  function endDrag() {
    if (!draggedElement) return;

    isDragging = false;
    draggedElement.style.transition = "transform 0.7s ease";
    draggedElement.style.zIndex = "";

    layoutSkills();
    draggedElement = null;

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);

    if (dragRAF) cancelAnimationFrame(dragRAF);
  }

  skills.forEach(skill => {
    skill.addEventListener("mousedown", startDrag);
    skill.addEventListener("touchstart", startDrag, { passive: false });
  });

  skillGrid.addEventListener("mouseenter", () =>
    clearInterval(shuffleInterval)
  );
  skillGrid.addEventListener("mouseleave", () =>
    (shuffleInterval = setInterval(shuffleSkills, 3000))
  );

  calculateGrid();
  layoutSkills();
  shuffleInterval = setInterval(shuffleSkills, 3000);

  window.addEventListener("resize", () => {
    calculateGrid();
    layoutSkills();
  });
}

/* =====================
   HAMBURGER MENU
===================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
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
  { threshold: 0.3 }
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