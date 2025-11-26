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
  const target = +compteur.getAttribute('data-target');
  let count = 0;

  const increment = Math.ceil(target / 200);

  const updateCounter = () => {
    count += increment;
    if (count > target) count = target;
    compteur.textContent = count;

    if (count < target) {
      requestAnimationFrame(updateCounter);
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

const carousel = document.getElementById("carousel");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0;
if (carousel) {
  const avisCount = carousel.children.length;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener("click", () => {
    index = (index + 1) % avisCount;
    updateCarousel();
  });

  prev.addEventListener("click", () => {
    index = (index - 1 + avisCount) % avisCount;
    updateCarousel();
  });
}
