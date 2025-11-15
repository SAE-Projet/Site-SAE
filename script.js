const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
const overlay = document.getElementById('menu-overlay');

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('active');
  burger.classList.toggle('open', isOpen);
  overlay.classList.toggle('active', isOpen);

  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

overlay.addEventListener('click', () => {
  if (navLinks.classList.contains('active')) toggleMenu();
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) toggleMenu();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    toggleMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
    toggleMenu();
  }
});
