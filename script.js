// Typewriter Effect
const text = "Alex";
let index = 0;
const speed = 150;

function typeWriter() {
  if (index < text.length) {
    document.getElementById("typewriter").textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}

// THREE.JS MATRIX BACKGROUND
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 50;

// Matrix Characters
const characters = "01<>/{}[]#@$&";
const particlesCount = 1500;

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
}

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x00ff00,
  size: 0.6,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(20, 20, 20);
scene.add(light);

// Mouse Control
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.002;
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.0008;
  particles.rotation.x += 0.0003;

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
