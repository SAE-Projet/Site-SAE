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
