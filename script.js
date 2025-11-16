const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
const overlay = document.getElementById('menu-overlay');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('active');
  burger.classList.toggle('open', isOpen);
  overlay.classList.toggle('active', isOpen);

  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

overlay.addEventListener('click', () => {
  if (navLinks.classList.contains('active')) toggleMenu();
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) toggleMenu();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    toggleMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
    toggleMenu();
  }
});

const compteurs = document.querySelectorAll('.compteur');

compteurs.forEach(compteur => {
  const target = +compteur.getAttribute('data-target'); // valeur finale
  let count = 0;

  const increment = Math.ceil(target / 200); // incrémentation pour que ce soit rapide et lisse

  const updateCounter = () => {
    count += increment;
    if (count > target) count = target;
    compteur.textContent = count;

    if (count < target) {
      requestAnimationFrame(updateCounter); // animation fluide
    }
  };

  updateCounter();
});

const separator = document.querySelector('.separator-line');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'scaleX(1)';  
      observer.unobserve(entry.target);            
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.separator-line').forEach(line => {
  observer.observe(line);
});
