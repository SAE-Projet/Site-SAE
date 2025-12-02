const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
const overlay = document.getElementById('menu-overlay');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('active');
  burger.classList.toggle('open', isOpen);
  overlay.classList.toggle('active', isOpen);
}

burger?.addEventListener('click', e => {
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

const donCarousel = document.getElementById("donCarousel");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

leftArrow.onclick = () => {
  donCarousel.scrollBy({ left: -260, behavior: "smooth" });
};

rightArrow.onclick = () => {
  donCarousel.scrollBy({ left: 260, behavior: "smooth" });
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

donModal.addEventListener("click", e => {
  if (e.target === donModal) donModal.classList.remove("active");
});



