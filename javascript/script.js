// === Infinite Typewriter ===
const words = ["?@!#$%^&*()_+-=", "Web Developer", "UI/UX Designer"];
const el = document.getElementById("typewriter");
let wordIndex = 0, charIndex = 0, isDeleting = false;
function typeLoop() {
  const currentWord = words[wordIndex];
  if (!isDeleting) {
    el.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) setTimeout(() => isDeleting = true, 1200);
  } else {
    el.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
  }
  const speed = isDeleting ? 70 : 120;
  setTimeout(typeLoop, speed);
}

typeLoop();

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

// Calculate grid layout
function calculateGrid() {
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
  skills = shuffleArray(skills);

  skills.forEach((skill, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (cellWidth + gap);
    const y = row * (cellHeight + gap);

    skill.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Initialize
calculateGrid();
layoutSkills();

// Shuffle every 3 seconds
setInterval(shuffleSkills, 3000);

// Recalculate on resize
window.addEventListener('resize', () => {
  calculateGrid();
  layoutSkills();
});