// === Infinite Typewriter ===
const words = ["Jhon Rhyb", "Web Developer", "Creative Coder", "UI Designer"];
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