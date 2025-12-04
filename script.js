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
  carousel.style.transition = 'transform 0.4s ease';

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
    if (dx > 50) { 
      currentIndex--;
    } else if (dx < -50) { 
      currentIndex++;
    }
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
  const card = e.target.closest('.don-card, .logement-card, .sales-card');
  if (!card) return;
  modalImage.src = card.querySelector('img')?.src || card.dataset.image || '';
  modalTitle.textContent = card.dataset.title || card.querySelector('h3')?.textContent || '';
  let description = card.dataset.description || '';
  const hiddenInfo = card.querySelector('.hidden-info');
  if (hiddenInfo) description = hiddenInfo.innerHTML;
  modalDescription.innerHTML = description;
  modalLocalisation.textContent = card.dataset.localisation || card.querySelector('.localisation')?.textContent || '';
  modalContact.textContent = card.dataset.contact || '';
  modalPrice.textContent = card.dataset.price ? `Prix : ${card.dataset.price}` : '';
  serviceModal.classList.add('active');
});

serviceModalClose.addEventListener('click', () => serviceModal.classList.remove('active'));
serviceModal.addEventListener('click', e => {
  if (e.target === serviceModal) serviceModal.classList.remove('active');
});

