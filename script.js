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
  // read gap (some browsers use 'gap', fallback to columnGap)
  cardGap = parseFloat(cs.gap || cs.columnGap) || cardGap;

  // wait images loaded & layout stable
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
    const cardWidth = allCards[1].getBoundingClientRect().width; // the first real card now at index 1

    // helper to set scroll (instant)
    function setScrollLeftInstant(pos) {
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft = pos;
      // restore smooth a short time after (use next tick)
      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = 'smooth';
      });
    }

    // position at first real card
    setScrollLeftInstant(cardWidth + cardGap);

    // arrow handlers: move by cardWidth + gap
    function move(diff) {
      carousel.scrollBy({ left: diff, behavior: 'smooth' });
    }

    leftArrow.addEventListener('click', () => move(-(cardWidth + cardGap)));
    rightArrow.addEventListener('click', () => move(cardWidth + cardGap));

    // touch swipe (drag)
    let isDown = false;
    let startX;
    let scrollStart;

    carousel.addEventListener('pointerdown', (e) => {
      isDown = true;
      startX = e.clientX;
      scrollStart = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
      carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = startX - e.clientX;
      carousel.scrollLeft = scrollStart + dx;
    });
    carousel.addEventListener('pointerup', (e) => {
      if (!isDown) return;
      isDown = false;
      carousel.style.cursor = '';
      // snap to nearest card after pointer up
      snapToNearest();
    });
    carousel.addEventListener('pointercancel', () => {
      isDown = false;
      carousel.style.cursor = '';
      snapToNearest();
    });

    // snapping: compute nearest index and scroll to center that card
    function snapToNearest() {
      const scroll = carousel.scrollLeft;
      // Determine index among allCards where card left position is minimal distance to viewport center
      let closestIndex = 0;
      let closestDist = Infinity;
      const center = carousel.clientWidth / 2;
      allCards.forEach((c, i) => {
        const rect = c.getBoundingClientRect();
        // card center relative to carousel left
        const cardCenter = rect.left - carousel.getBoundingClientRect().left + rect.width / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      // scroll so chosen card is centered
      const targetCard = allCards[closestIndex];
      const targetLeft = targetCard.offsetLeft + (targetCard.offsetWidth / 2) - carousel.clientWidth / 2;
      carousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }

    // loop detection: if we reach clones, jump to corresponding real card
    let scrollEndTimer;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        // if scrolled to very left (we are at lastClone)
        if (carousel.scrollLeft <= 10) {
          // jump to last real card position
          const lastRealIndex = allCards.length - 2; // because first is lastClone, last is firstClone
          const targetCard = allCards[lastRealIndex];
          const targetLeft = targetCard.offsetLeft + (targetCard.offsetWidth / 2) - carousel.clientWidth / 2;
          setScrollLeftInstant(targetLeft);
        }
        // if scrolled to very right (we are at firstClone)
        else if (carousel.scrollLeft >= maxScroll - 10) {
          // jump to first real card
          const firstRealIndex = 1;
          const targetCard = allCards[firstRealIndex];
          const targetLeft = targetCard.offsetLeft + (targetCard.offsetWidth / 2) - carousel.clientWidth / 2;
          setScrollLeftInstant(targetLeft);
        }
      }, 80);
    });

    // optional: keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') leftArrow.click();
      if (e.key === 'ArrowRight') rightArrow.click();
    });

    // on resize recompute cardWidth & reposition to nearest real
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // recompute and snap
        snapToNearest();
      }, 150);
    });
  }

  // ensure images loaded before measuring: wait window load
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
