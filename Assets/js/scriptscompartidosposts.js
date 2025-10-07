document.addEventListener('DOMContentLoaded', function() {

  // ===== RELOJ DEL BOSQUE =====
  function updateForestTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeDisplay = document.getElementById('forestTime');
    if (timeDisplay) {
      timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }

  updateForestTime();
  setInterval(updateForestTime, 1000);

  // ===== LUCIÉRNAGAS ALEATORIAS =====
  function createRandomFireflies() {
    const firefliesContainer = document.querySelector('.fireflies');
    if (!firefliesContainer) return;

    firefliesContainer.innerHTML = '';

    const numFireflies = Math.floor(Math.random() * 5) + 8;

    for (let i = 0; i < numFireflies; i++) {
      const firefly = document.createElement('div');
      firefly.classList.add('firefly');

      const left = Math.random() * 100;
      const top = Math.random() * 80 + 20;
      const duration = Math.random() * 4 + 5;
      const delay = Math.random() * 6;

      firefly.style.left = `${left}%`;
      firefly.style.top = `${top}%`;
      firefly.style.animationDuration = `${duration}s`;
      firefly.style.animationDelay = `${delay}s`;

      firefliesContainer.appendChild(firefly);
    }
  }

  createRandomFireflies();
  setInterval(createRandomFireflies, 10000);

  // ===== CONTADOR DE DÍAS =====
  const startDate = new Date('2025-10-01'); // fecha de inicio del blog
  const today = new Date();
  let days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  if (isNaN(days)) days = 0; // por si la fecha no parsea bien
  days = Math.max(0, days); // no negativos

  const counterElement = document.getElementById('daysSinceStart');

  if (counterElement) {
    if (days === 0) {
      counterElement.textContent = '0';
    } else {
      // animar en pasos enteros para evitar increment 0
      let currentNumber = 0;
      const steps = 50;
      const increment = Math.max(1, Math.ceil(days / steps));
      const intervalMs = 20;

      const animateCounter = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= days) {
          counterElement.textContent = String(days);
          clearInterval(animateCounter);
        } else {
          counterElement.textContent = String(currentNumber);
        }
      }, intervalMs);
    }
  }

}); // fin DOMContentLoaded