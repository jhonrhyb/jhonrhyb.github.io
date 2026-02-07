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

// Drag functionality variables
let isDragging = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let shuffleInterval;

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
  isDragging = true;
  draggedElement = e.target;
  const rect = draggedElement.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  draggedElement.style.transition = 'none'; // Disable transition during drag
  draggedElement.style.zIndex = 10; // Bring to front
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
}

function drag(e) {
  if (!isDragging || !draggedElement) return;
  const gridRect = skillGrid.getBoundingClientRect();
  let x = e.clientX - gridRect.left - offsetX;
  let y = e.clientY - gridRect.top - offsetY;
  // Constrain within grid bounds
  x = Math.max(0, Math.min(x, gridRect.width - cellWidth));
  y = Math.max(0, Math.min(y, gridRect.height - cellHeight));
  draggedElement.style.transform = `translate(${x}px, ${y}px)`;
}

function endDrag() {
  if (!draggedElement) return;
  isDragging = false;
  draggedElement.style.transition = 'transform 0.7s ease'; // Re-enable transition
  draggedElement.style.zIndex = ''; // Reset z-index
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
  document.removeEventListener('mouseup', endDrag);
}

// Attach drag listeners to skills
skills.forEach(skill => {
  skill.addEventListener('mousedown', startDrag);
});

// Pause shuffle on hover
skillGrid.addEventListener('mouseenter', () => {
  clearInterval(shuffleInterval);
});

skillGrid.addEventListener('mouseleave', () => {
  shuffleInterval = setInterval(shuffleSkills, 3000);
});

// Initialize
calculateGrid();
layoutSkills();

// Shuffle every 3 seconds
shuffleInterval = setInterval(shuffleSkills, 3000);

// Recalculate on resize
window.addEventListener('resize', () => {
  calculateGrid();
  layoutSkills();
});