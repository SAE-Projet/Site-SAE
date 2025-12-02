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

// Compteurs animés
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

// Animation ligne séparatrice
const separator = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = 'scaleX(1)';
      separator.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.separator-line').forEach(line => {
  separator.observe(line);
});

// Carousel
const carousel = document.getElementById("carousel");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let index = 0;
let autoSlide;

if (carousel) {
  const avisCount = carousel.children.length;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % avisCount;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + avisCount) % avisCount;
    updateCarousel();
  }

  function resetAutoplay() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  }

  next.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  prev.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  let startX = 0;
  let isSwiping = false;

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    clearInterval(autoSlide);
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    let currentX = e.touches[0].clientX;
    let diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      isSwiping = false;
    }
  });

  carousel.addEventListener("touchend", () => {
    isSwiping = false;
    resetAutoplay();
  });

  resetAutoplay();
}

const heroText = document.querySelector('.hero-right');

if (heroText) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroText.style.transform = `translateY(${scrollY * 0.1}px)`;
    heroText.style.opacity = `${1 - scrollY / 1000}`;
  });
}
