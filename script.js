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

(function() {
  const carousel = document.getElementById('donCarousel');
  const leftArrow = document.getElementById('leftArrow');
  const rightArrow = document.getElementById('rightArrow');

  if (!carousel) return;

  let cardGap = 20; // fallback
  const cs = window.getComputedStyle(carousel);
  cardGap = parseFloat(cs.gap || cs.columnGap) || cardGap;

  function init() {
    const cards = Array.from(carousel.querySelectorAll('.don-card'));
    if (cards.length === 0) return;

    // clone first and last
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    carousel.appendChild(firstClone);
    carousel.insertBefore(lastClone, carousel.firstChild);

    // recompute cards after clones
    const allCards = Array.from(carousel.querySelectorAll('.don-card'));
    const cardWidth = allCards[1].getBoundingClientRect().width; // first real card now at index 1

    // state
    let isJumping = false;
    let scrollTimeout;

    function setScrollLeftInstant(pos) {
      // lock to avoid responding to scroll events while jumping
      isJumping = true;
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft = pos;
      // restore smooth behavior and release lock soon after
      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = 'smooth';
        // small delay to allow subsequent natural scroll events to settle
        setTimeout(() => { isJumping = false; }, 80);
      });
    }

    // center first real card initially
    setScrollLeftInstant(cardWidth + cardGap);

    function moveByCard(n = 1) {
      if (isJumping) return;
      carousel.scrollBy({ left: (cardWidth + cardGap) * n, behavior: 'smooth' });
    }

    leftArrow.addEventListener('click', () => moveByCard(-1));
    rightArrow.addEventListener('click', () => moveByCard(1));

    // pointer drag support
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    carousel.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      scrollStart = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
      carousel.setPointerCapture && carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = startX - e.clientX;
      carousel.scrollLeft = scrollStart + dx;
    });
    function endPointer(e) {
      if (!isDown) return;
      isDown = false;
      carousel.style.cursor = '';
      snapToNearest();
    }
    carousel.addEventListener('pointerup', endPointer);
    carousel.addEventListener('pointercancel', endPointer);

    // snapping to nearest card (center)
    function snapToNearest() {
      const center = carousel.clientWidth / 2;
      let closest = { idx: 0, dist: Infinity };
      allCards.forEach((c, i) => {
        const rect = c.getBoundingClientRect();
        const cardCenter = rect.left - carousel.getBoundingClientRect().left + rect.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < closest.dist) {
          closest = { idx: i, dist };
        }
      });
      const target = allCards[closest.idx];
      const targetLeft = target.offsetLeft + (target.offsetWidth / 2) - carousel.clientWidth / 2;
      carousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }

    carousel.addEventListener('scroll', () => {
      if (isJumping) return;
    
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
        // — clone gauche : on revient instant au vrai dernier
        if (carousel.scrollLeft <= 5) {
          const lastReal = allCards.length - 2;
          const target = allCards[lastReal];
          const targetLeft = target.offsetLeft + target.offsetWidth/2 - carousel.clientWidth/2;
          setScrollLeftInstant(targetLeft);
        }
    
        // — clone droite : on revient instant au vrai premier
        else if (carousel.scrollLeft >= maxScroll - 5) {
          const firstReal = 1;
          const target = allCards[firstReal];
          const targetLeft = target.offsetLeft + target.offsetWidth/2 - carousel.clientWidth/2;
          setScrollLeftInstant(targetLeft);
        }
      }, 40); // délai court = NO visible jump
    });

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') moveByCard(-1);
      if (e.key === 'ArrowRight') moveByCard(1);
    });

    // on resize, snap to nearest real card after layout stabilizes
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        snapToNearest();
      }, 150);
    });
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();

function autoFitText(element) {
    const parent = element.parentElement;
    let fontSize = parseInt(window.getComputedStyle(element).fontSize);

    // Réduit la taille si le texte déborde
    while (element.scrollHeight > parent.clientHeight || element.scrollWidth > parent.clientWidth) {
        fontSize--;
        element.style.fontSize = fontSize + "px";
        if (fontSize <= 10) break; // taille minimale
    }
}

window.addEventListener("load", () => {
    document.querySelectorAll(".text-part1, .text-part2").forEach(block => {
        autoFitText(block);
    });
});

window.addEventListener("resize", () => {
    document.querySelectorAll(".text-part1, .text-part2").forEach(block => {
        block.style.fontSize = ""; // reset
        autoFitText(block);
    });
});

// Modal pour cartes services / ventes / achats
const serviceCards = document.querySelectorAll('.service-card');
const serviceModal = document.getElementById('serviceModal');
const modalImage = document.getElementById('serviceModalImage');
const modalTitle = document.getElementById('serviceModalTitle');
const modalDescription = document.getElementById('serviceModalDescription');
const modalLocalisation = document.getElementById('serviceModalLocalisation');
const modalContact = document.getElementById('serviceModalContact');
const modalPrice = document.getElementById('serviceModalPrice');
const serviceModalClose = document.querySelector('.service-modal-close');

serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    modalImage.src = card.dataset.image || '';
    modalTitle.textContent = card.dataset.title || '';
    modalDescription.textContent = card.dataset.description || '';
    modalLocalisation.textContent = card.dataset.localisation || '';
    modalContact.textContent = card.dataset.contact || '';
    modalPrice.textContent = card.dataset.price ? `Prix : ${card.dataset.price}` : '';
    serviceModal.classList.add('active');
  });
});

serviceModalClose.addEventListener('click', () => {
  serviceModal.classList.remove('active');
});

serviceModal.addEventListener('click', e => {
  if (e.target === serviceModal) serviceModal.classList.remove('active');
});


