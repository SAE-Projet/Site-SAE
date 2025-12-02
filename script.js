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

burger?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

overlay?.addEventListener('click', () => {
  if (navLinks.classList.contains('active')) toggleMenu();
});

navLinks?.querySelectorAll('a').forEach(link => {
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


/* ----------------- COMPTEURS ANIMÉS ----------------- */

const compteurs = document.querySelectorAll('.compteur');

compteurs.forEach(compteur => {
  const target = +compteur.dataset.target;
  let count = 0;
  const increment = Math.ceil(target / 200);

  const update = () => {
    count += increment;
    if (count >= target) count = target;
    compteur.textContent = count;
    if (count < target) requestAnimationFrame(update);
  };

  update();
});


/* ----------------- SEPARATOR ANIM ----------------- */

const separator = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "scaleX(1)";
      separator.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.separator-line').forEach(line => {
  separator.observe(line);
});

const donCarousel = document.getElementById('donCarousel');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');

leftArrow.onclick = () => {
  donCarousel.scrollBy({ left: -250, behavior: "smooth" });
};

rightArrow.onclick = () => {
  donCarousel.scrollBy({ left: 250, behavior: "smooth" });
};

const donCar = document.getElementById("donCarousel");
document.getElementById("leftArrow").onclick = () => {
  donCar.scrollBy({ left: -300, behavior: "smooth" });
};
document.getElementById("rightArrow").onclick = () => {
  donCar.scrollBy({ left: 300, behavior: "smooth" });
};

const donCards = document.querySelectorAll(".don-card");
const donModal = document.getElementById("donModal");
const closeModal = document.querySelector(".don-modal-close");

donCards.forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("modalImage").src = card.dataset.image;
    document.getElementById("modalTitle").textContent = card.dataset.title;
    document.getElementById("modalLocalisation").textContent = "📍 " + card.dataset.localisation;
    document.getElementById("modalDescription").textContent = card.dataset.description;
    document.getElementById("modalContact").textContent = card.dataset.contact;

    donModal.classList.add("active");
  });
});

closeModal.addEventListener("click", () => {
  donModal.classList.remove("active");
});

donModal.addEventListener("click", (e) => {
  if (e.target === donModal) donModal.classList.remove("active");
});
