// =====================================================
// Preloader
// =====================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 2000);
  }
});

// =====================================================
// Scroll Progress Bar
// =====================================================
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = scrollPercent + '%';
  }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });


// =====================================================
// Mobile Navigation Toggle (Enhanced)
// =====================================================
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    mobileNav.classList.toggle('hidden', !isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileNav.classList.add('hidden');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================================
// Active Navigation Highlight on Scroll
// =====================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });

// =====================================================
// Scroll Fade-In Animation (Enhanced)
// =====================================================
const faders = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

faders.forEach(el => appearOnScroll.observe(el));

// =====================================================
// Typed Text Animation
// =====================================================
class TypeWriter {
  constructor(element, words, waitTime = 2000) {
    this.element = element;
    this.words = words;
    this.waitTime = waitTime;
    this.wordIndex = 0;
    this.txt = '';
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.textContent = this.txt;

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.waitTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 400;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

const typedElement = document.getElementById('typedRole');
if (typedElement) {
  new TypeWriter(typedElement, [
    'Software Developer',
    'Full-Stack Engineer',
    'UI/UX Enthusiast',
    'Data Scientist',
    'Machine Learning Dev'
  ], 2200);
}

// =====================================================
// Animated Counters
// =====================================================
function animateCounter(element, target, suffix = '', duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    if (current !== start) {
      element.textContent = current + suffix;
      start = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target + suffix;
      element.classList.add('counting');
      setTimeout(() => element.classList.remove('counting'), 400);
    }
  }

  requestAnimationFrame(update);
}

const counterElements = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = parseInt(entry.target.dataset.counter, 10);
    const suffix = entry.target.dataset.suffix || '';
    animateCounter(entry.target, target, suffix);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

// =====================================================
// Project Filter Tabs (with animation)
// =====================================================
const tabs = document.querySelectorAll('.tab');
const projectCards = document.querySelectorAll('.project-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    projectCards.forEach((card, index) => {
      const match = filter === 'all' || card.dataset.cat === filter;

      if (match) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 80);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});

// =====================================================
// Project Modal / Lightbox
// =====================================================
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalTechs = document.getElementById('modalTechs');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

// Add click handlers to project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // Don't open modal if clicking a link
    if (e.target.closest('a')) return;

    const img = card.querySelector('img');
    const title = card.querySelector('h3');
    const category = card.querySelector('.project-category');
    const description = card.querySelector('.project-description');
    const techTags = card.querySelectorAll('.project-tech-tag');

    if (modalImage && img) modalImage.src = img.src;
    if (modalImage && img) modalImage.alt = img.alt;
    if (modalTitle && title) modalTitle.textContent = title.textContent;
    if (modalCategory && category) modalCategory.textContent = category.textContent;
    if (modalDescription && description) modalDescription.innerHTML = description.innerHTML;
    if (modalTechs) {
      modalTechs.innerHTML = '';
      techTags.forEach(tag => {
        const clone = tag.cloneNode(true);
        modalTechs.appendChild(clone);
      });
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =====================================================
// Sticky Header Shadow on Scroll
// =====================================================
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (header) {
    header.style.boxShadow = window.scrollY > 10 ? '0 4px 30px rgba(0,0,0,0.08)' : 'none';
  }
}, { passive: true });

// =====================================================
// Back to Top Button
// =====================================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =====================================================
// Tilt Effect on Cards (Desktop only)
// =====================================================
if (window.matchMedia('(pointer: fine)').matches) {
  const tiltCards = document.querySelectorAll('.project-card, .service-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

// =====================================================
// Parallax Effect on Hero Elements
// =====================================================
const heroTerminal = document.querySelector('.animate-float');
const heroCircle = document.querySelector('.hero-circle');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < 800) {
    if (heroTerminal) {
      heroTerminal.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
    if (heroCircle) {
      heroCircle.style.transform = `translateY(${scrollY * 0.04}px) scale(${1 - scrollY * 0.0003})`;
    }
  }
}, { passive: true });

// =====================================================
// Magnetic Button Effect (CTA Buttons)
// =====================================================
if (window.matchMedia('(pointer: fine)').matches) {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s ease';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });
}

// =====================================================
// Initialize: Make sure above-fold content visible
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  // Ensure initial hero elements are visible if they are in viewport
  const heroFaders = document.querySelectorAll('.fade-in');
  heroFaders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('visible'), 200);
    }
  });
});
