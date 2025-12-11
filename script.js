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

document.querySelectorAll('.compteur').forEach(compteur => {
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

document.querySelectorAll('.separator-line').forEach(line => separator.observe(line));


const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

if (carousel && prevBtn && nextBtn) {
  
  const slides = Array.from(carousel.children);
  const slideWidth = slides[0].offsetWidth;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.id = 'first-clone';
  lastClone.id = 'last-clone';
  
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, slides[0]);

  let currentIndex = 1;
  carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  const updateCarousel = () => {
    carousel.style.transition = 'transform 0.4s ease';
    carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  };

  const jumpWithoutAnimation = () => {
    carousel.style.transition = 'none';
    carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  };

  nextBtn.addEventListener('click', () => {
    if (currentIndex >= slides.length + 1) return;
    currentIndex++;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    updateCarousel();
  });

  let startX = 0;
  let isDragging = false;

  carousel.addEventListener('pointerdown', e => {
    isDragging = true;
    startX = e.clientX;
    carousel.setPointerCapture(e.pointerId);
    carousel.style.transition = 'none';
  });

  carousel.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    carousel.style.transform = `translateX(${-slideWidth * currentIndex + -dx}px)`;
  });

  const endDrag = e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - startX;
    carousel.style.transition = 'transform 0.4s ease';

    if (dx > 50) currentIndex--;
    else if (dx < -50) currentIndex++;

    updateCarousel();
  };

  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('pointerleave', endDrag);

  carousel.addEventListener('transitionend', () => {
    if (carousel.children[currentIndex].id === 'first-clone') {
      currentIndex = 1;
      jumpWithoutAnimation();
    }
    if (carousel.children[currentIndex].id === 'last-clone') {
      currentIndex = slides.length;
      jumpWithoutAnimation();
    }
  });

  let autoSlide = setInterval(() => {
    currentIndex++;
    updateCarousel();
  }, 5000);

  const resetAutoSlide = () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, 5000);
  };

  nextBtn.addEventListener('click', resetAutoSlide);
  prevBtn.addEventListener('click', resetAutoSlide);
  carousel.addEventListener('pointerup', resetAutoSlide);
  carousel.addEventListener('pointercancel', resetAutoSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

const donCarousel = document.getElementById("donCarousel");
const leftDon = document.getElementById("leftArrow");
const rightDon = document.getElementById("rightArrow");

rightDon.addEventListener("click", () => {
  donCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

leftDon.addEventListener("click", () => {
  donCarousel.scrollBy({ left: -300, behavior: "smooth" });
});

const logementCarousel = document.querySelector(".logement-carousel");
const logementArrows = document.querySelectorAll(".logement-arrow");

logementArrows[1].addEventListener("click", () => {
  logementCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

logementArrows[0].addEventListener("click", () => {
  logementCarousel.scrollBy({ left: -300, behavior: "smooth" });
});


const salesCarousel = document.querySelector(".sales-carousel");
const salesArrows = document.querySelectorAll(".sales-arrow");

salesArrows[1].addEventListener("click", () => {
  salesCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

salesArrows[0].addEventListener("click", () => {
  salesCarousel.scrollBy({ left: -300, behavior: "smooth" });
});


const donCards = document.querySelectorAll(".don-card");
const donModal = document.getElementById("donModal");
const closeDonModal = document.querySelector(".don-modal-close");

donCards.forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("modalImage").src = card.dataset.image;
    document.getElementById("modalTitle").innerText = card.dataset.title;
    document.getElementById("modalLocalisation").innerText = "📍 " + card.dataset.localisation;
    document.getElementById("modalDescription").innerHTML = card.dataset.description.replace(/\n/g, "<br>");
    document.getElementById("modalContact").innerText = "📞 Contact : " + card.dataset.contact;

    donModal.style.display = "flex";
  });
});

closeDonModal.addEventListener("click", () => {
  donModal.style.display = "none";
});

const serviceCards = document.querySelectorAll(".sales-card, .logement-card");
const serviceModal = document.getElementById("serviceModal");
const closeServiceModal = document.querySelector(".service-modal-close");

serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("serviceModalImage").src = card.dataset.image;
    document.getElementById("serviceModalTitle").innerText = card.dataset.title;
    document.getElementById("serviceModalLocalisation").innerText = "📍 " + card.dataset.localisation;
    document.getElementById("serviceModalDescription").innerHTML = card.dataset.description;
    document.getElementById("serviceModalContact").innerText = "📞 Contact : " +  card.dataset.contact || "";
    document.getElementById("serviceModalPrice").innerText = "💶 Prix : " +  card.dataset.price || "";

    serviceModal.style.display = "flex";
  });
});

closeServiceModal.addEventListener("click", () => {
  serviceModal.style.display = "none";
});


window.addEventListener("click", (e) => {
  if (e.target === donModal) donModal.style.display = "none";
  if (e.target === serviceModal) serviceModal.style.display = "none";
});


