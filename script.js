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

const separator = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "scaleX(1)";
      separator.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.separator-line').forEach(line => separator.observe(line));

const donCarousel = document.getElementById("donCarousel");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

if (donCarousel && leftArrow && rightArrow) {
  let index = 0;

  const updateDonCarousel = () => {
    const cardWidth = donCarousel.children[0].offsetWidth + 20;
    donCarousel.style.transform = `translateX(${-index * cardWidth}px)`;
  };

  rightArrow.addEventListener("click", () => {
    if (index < donCarousel.children.length - 1) {
      index++;
      updateDonCarousel();
    }
  });

  leftArrow.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateDonCarousel();
    }
  });
}

const donModal = document.getElementById("donModal");
const donModalClose = document.querySelector(".don-modal-close");

document.querySelectorAll(".don-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("modalImage").src = card.dataset.image;
    document.getElementById("modalTitle").textContent = card.dataset.title;
    document.getElementById("modalLocalisation").textContent = card.dataset.localisation;
    document.getElementById("modalDescription").textContent = card.dataset.description;
    document.getElementById("modalContact").textContent = card.dataset.contact;

    donModal.style.display = "flex";
  });
});

donModalClose.addEventListener("click", () => {
  donModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === donModal) donModal.style.display = "none";
});

const salesCarousel = document.querySelector(".sales-carousel");
const salesPrev = document.querySelector(".sales-arrow.left");
const salesNext = document.querySelector(".sales-arrow.right");

if (salesCarousel && salesPrev && salesNext) {
  let saleIndex = 0;

  const updateSales = () => {
    const cardWidth = salesCarousel.children[0].offsetWidth + 20;
    salesCarousel.style.transform = `translateX(${-saleIndex * cardWidth}px)`;
  };

  salesNext.addEventListener("click", () => {
    if (saleIndex < salesCarousel.children.length - 1) {
      saleIndex++;
      updateSales();
    }
  });

  salesPrev.addEventListener("click", () => {
    if (saleIndex > 0) {
      saleIndex--;
      updateSales();
    }
  });
}

const serviceModal = document.getElementById("serviceModal");
const serviceModalClose = document.querySelector(".service-modal-close");

document.querySelectorAll(".sales-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("serviceModalImage").src = card.dataset.image;
    document.getElementById("serviceModalTitle").textContent = card.dataset.title;
    document.getElementById("serviceModalLocalisation").textContent = card.dataset.localisation;
    document.getElementById("serviceModalDescription").innerHTML = card.dataset.description;
    document.getElementById("serviceModalContact").textContent = "Contact : " + card.dataset.contact;
    document.getElementById("serviceModalPrice").textContent = "Prix : " + card.dataset.price;

    serviceModal.style.display = "flex";
  });
});

serviceModalClose.addEventListener("click", () => {
  serviceModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === serviceModal) serviceModal.style.display = "none";
});

document.querySelectorAll(".logement-carousel-wrapper").forEach(wrapper => {
  const carousel = wrapper.querySelector(".logement-carousel");
  const nextBtn = wrapper.querySelector(".logement-arrow.right");
  const prevBtn = wrapper.querySelector(".logement-arrow.left");

  let index = 0;

  const update = () => {
    const width = carousel.children[0].offsetWidth + 20;
    carousel.style.transform = `translateX(${-index * width}px)`;
  };

  nextBtn?.addEventListener("click", () => {
    if (index < carousel.children.length - 1) {
      index++;
      update();
    }
  });

  prevBtn?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      update();
    }
  });
});
