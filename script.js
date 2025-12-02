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

    // loop detection: jump when at clones
    carousel.addEventListener('scroll', () => {
      if (isJumping) return; // ignore while we're programmatically jumping

      // debounce end-of-scroll checks
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        // if we're very close to the left edge (we are on lastClone)
        if (carousel.scrollLeft <= 5) {
          // jump to last real card
          const lastRealIndex = allCards.length - 2;
          const targetCard = allCards[lastRealIndex];
          const targetLeft = targetCard.offsetLeft + (targetCard.offsetWidth / 2) - carousel.clientWidth / 2;
          setScrollLeftInstant(targetLeft);
        }
        // if we're very close to the right edge (we are on firstClone)
        else if (carousel.scrollLeft >= maxScroll - 5) {
          const firstRealIndex = 1;
          const targetCard = allCards[firstRealIndex];
          const targetLeft = targetCard.offsetLeft + (targetCard.offsetWidth / 2) - carousel.clientWidth / 2;
          setScrollLeftInstant(targetLeft);
        }
      }, 60);
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
