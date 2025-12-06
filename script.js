/* ============================
        MENU BURGER
============================ */
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


/* ============================
      COMPTEURS ANIMÉS
============================ */
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


/* ============================
   ANIMATION LIGNES SÉPARATEUR
============================ */
const separator = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transform = "scaleX(1)";
      separator.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.separator-line').forEach(line => separator.observe(line));


/* ============================
   CAROUSEL PAGE ACCUEIL
============================ */
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

  /* Swipe */
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

  /* Boucle infinie */
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

  /* Auto-slide */
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


/* ============================
   FONCTION GÉNÉRIQUE CAROUSELS
============================ */
function initCarousel(wrapperSelector, carouselSelector, prevSelector, nextSelector) {
  document.querySelectorAll(wrapperSelector).forEach(wrapper => {
    const carousel = wrapper.querySelector(carouselSelector);
    const prevBtn = wrapper.querySelector(prevSelector);
    const nextBtn = wrapper.querySelector(nextSelector);

    if (!carousel || !prevBtn || !nextBtn) return;

    let index = 0;

    const update = () => {
      const width = carousel.children[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(carousel).columnGap || 20);
      carousel.style.transform = `translateX(${-index * (width + gap)}px)`;
    };

    nextBtn.onclick = () => {
      if (index < carousel.children.length - 1) {
        index++;
        update();
      }
    };

    prevBtn.onclick = () => {
      if (index > 0) {
        index--;
        update();
      }
    };

    window.addEventListener("resize", update);
  });
}

/* ====== Initialisation des 3 carousels Services ====== */
initCarousel(".don-carousel-wrapper", ".don-carousel", ".don-arrow.left", ".don-arrow.right");
initCarousel(".logement-carousel-wrapper", ".logement-carousel", ".logement-arrow.left", ".logement-arrow.right");
initCarousel(".sales-carousel-wrapper", ".sales-carousel", ".sales-arrow.left", ".sales-arrow.right");


/* ============================
      MODAL DONS
============================ */
const donModal = document.getElementById("donModal");
const donModalClose = document.querySelector(".don-modal-close");

document.querySelectorAll(".don-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("modalImage").src = card.dataset.image;
    document.getElementById("modalTitle").textContent = card.dataset.title;
    document.getElementById("modalLocalisation").textContent = "📍 " + card.dataset.localisation;
    document.getElementById("modalDescription").textContent = card.dataset.description;
    document.getElementById("modalContact").textContent = card.dataset.contact;
    donModal.style.display = "flex";
  });
});

donModalClose?.addEventListener("click", () => {
  donModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === donModal) donModal.style.display = "none";
});


/* ============================
      MODAL VENTES
============================ */
const serviceModal = document.getElementById("serviceModal");
const serviceModalClose = document.querySelector(".service-modal-close");

document.querySelectorAll(".sales-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("serviceModalImage").src = card.dataset.image;
    document.getElementById("serviceModalTitle").textContent = card.dataset.title;
    document.getElementById("serviceModalLocalisation").textContent = "📍 " + card.dataset.localisation;
    document.getElementById("serviceModalDescription").innerHTML = card.dataset.description;
    document.getElementById("serviceModalContact").textContent = "📞 Contact : " + card.dataset.contact;
    document.getElementById("serviceModalPrice").textContent = "💶 Prix : " + card.dataset.price;
    serviceModal.style.display = "flex";
  });
});


/* ============================
      MODAL LOGEMENTS
============================ */
document.querySelectorAll(".logement-card").forEach(card => {
  card.addEventListener("click", () => {
    document.getElementById("serviceModalImage").src = card.dataset.image;
    document.getElementById("serviceModalTitle").textContent = card.dataset.title;
    document.getElementById("serviceModalLocalisation").textContent = "📍 " + card.dataset.localisation;
    document.getElementById("serviceModalDescription").innerHTML = card.dataset.description;
    document.getElementById("serviceModalContact").textContent = "📞 Contact : " + (card.dataset.contact || "Non renseigné");
    document.getElementById("serviceModalPrice").textContent = "";
    serviceModal.style.display = "flex";
  });
});

serviceModalClose?.addEventListener("click", () => {
  serviceModal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === serviceModal) serviceModal.style.display = "none";
});
