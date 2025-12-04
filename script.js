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

document.querySelectorAll('.separator-line').forEach(line => separator.observe(line));

(function() {
  const wrappers = document.querySelectorAll('.don-carousel-wrapper, .logement-carousel-wrapper');

  wrappers.forEach(wrapper => {
    const carousel = wrapper.querySelector('.don-carousel, .logement-carousel');
    const leftArrow = wrapper.querySelector('.don-arrow.left, .logement-arrow.left');
    const rightArrow = wrapper.querySelector('.don-arrow.right, .logement-arrow.right');

    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.don-card, .logement-card'));
    if (!cards.length) return;

    const gap = parseFloat(getComputedStyle(carousel).gap) || 20;
    const cardWidth = cards[0].getBoundingClientRect().width;

    leftArrow?.addEventListener('click', () => {
      carousel.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    });

    rightArrow?.addEventListener('click', () => {
      carousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    });

    let isDown = false, startX = 0, scrollStart = 0;

    carousel.addEventListener('pointerdown', e => {
      isDown = true;
      startX = e.clientX;
      scrollStart = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
      carousel.setPointerCapture?.(e.pointerId);
    });

    carousel.addEventListener('pointermove', e => {
      if (!isDown) return;
      const dx = startX - e.clientX;
      carousel.scrollLeft = scrollStart + dx;
    });

    const endPointer = () => {
      if (!isDown) return;
      isDown = false;
      carousel.style.cursor = '';
    };
    carousel.addEventListener('pointerup', endPointer);
    carousel.addEventListener('pointercancel', endPointer);

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') carousel.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
      if (e.key === 'ArrowRight') carousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    });
  });
})();


const serviceModal = document.getElementById('serviceModal');
const modalImage = document.getElementById('serviceModalImage');
const modalTitle = document.getElementById('serviceModalTitle');
const modalDescription = document.getElementById('serviceModalDescription');
const modalLocalisation = document.getElementById('serviceModalLocalisation');
const modalContact = document.getElementById('serviceModalContact');
const modalPrice = document.getElementById('serviceModalPrice');
const serviceModalClose = document.querySelector('.service-modal-close');

document.body.addEventListener('click', (e) => {
  const card = e.target.closest('.service-card');
  if (!card) return;

  modalImage.src = card.dataset.image || '';
  modalTitle.textContent = card.dataset.title || '';
  modalDescription.textContent = card.dataset.description || '';
  modalLocalisation.textContent = card.dataset.localisation || '';
  modalContact.textContent = card.dataset.contact || '';
  modalPrice.textContent = card.dataset.price ? `Prix : ${card.dataset.price}` : '';

  serviceModal.classList.add('active');
});

serviceModalClose.addEventListener('click', () => serviceModal.classList.remove('active'));
serviceModal.addEventListener('click', e => { if (e.target === serviceModal) serviceModal.classList.remove('active'); });

