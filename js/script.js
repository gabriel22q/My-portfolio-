document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');

  // Smooth page transitions for links to other pages in this portfolio.
  // Keep normal browser behavior for new tabs, downloads, external links and anchors.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const homeLoader = document.getElementById('homeLoader');
  if (homeLoader) {
    // A short, consistent welcome pause gives visitors time to read the intro.
    window.setTimeout(() => homeLoader.classList.add('is-hidden'), 1550);
  }

  // Type the name on the homepage; keep a static name for reduced-motion users.
  const typingName = document.getElementById('typing-name');
  if (typingName) {
    const fullName = 'John Gabriel Ildefonso';
    if (reduceMotion) {
      typingName.textContent = fullName;
    } else {
      typingName.textContent = '';
      let letter = 0;
      const typeNext = () => {
        if (letter < fullName.length) {
          typingName.textContent += fullName.charAt(letter++);
          window.setTimeout(typeNext, 78);
        }
      };
      window.setTimeout(typeNext, 380);
    }
  }
  if (!reduceMotion) {
    requestAnimationFrame(() => document.body.classList.add('page-ready'));

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      const isLocalPage = destination.origin === window.location.origin &&
        destination.pathname.endsWith('.html') &&
        destination.pathname !== window.location.pathname;
      if (!isLocalPage) return;

      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = destination.href; }, 220);
    });
  } else {
    document.body.classList.add('page-ready');
  }

  // Apply the saved theme on every page before wiring up the toggle.
  const savedTheme = localStorage.getItem('jg-portfolio-theme') || 'light';
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeButton) {
      themeButton.textContent = theme === 'dark' ? '☀' : '☾';
      themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  };
  applyTheme(savedTheme);

  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('jg-portfolio-theme', nextTheme);
    applyTheme(nextTheme);
  });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Hide initials/letter placeholders when their real photo loads.
  document.querySelectorAll('.photo-placeholder img, .family-image img, .achievement-image img').forEach(img => {
    const hideFallback = () => {
      if (img.naturalWidth > 0) {
        const fallback = img.parentElement.querySelector('.placeholder-initials, .image-fallback');
        if (fallback) fallback.hidden = true;
      }
    };
    img.addEventListener('load', hideFallback);
    hideFallback();
  });

  // Consistent, accessible lightbox for every portfolio content image.
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Expanded portfolio image');
  modal.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" type="button" aria-label="Close expanded image">×</button>
      <div class="modal-image-wrap"><img alt=""></div>
      <div class="modal-copy">
        <span class="modal-kicker">A CLOSER LOOK</span>
        <h2></h2>
        <p></p>
        <span class="modal-hint">Click outside the image or press Esc to close</span>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector('img');
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  const portfolioImages = document.querySelectorAll(
    '.photo-placeholder img, .family-image img, .achievement-image img'
  );
  portfolioImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Expand image: ${img.alt || 'Portfolio image'}`);

    const openImage = () => {
      const card = img.closest('.family-card, .photo-frame, .timeline-card');
      const heading = card?.querySelector('h2, strong');
      const description = card?.querySelector('.family-card-copy p, .timeline-card > p, .photo-caption small, p');
      modalImage.src = img.currentSrc || img.src;
      modalImage.alt = img.alt || 'Portfolio image';
      modal.querySelector('.modal-copy h2').textContent = heading?.textContent?.trim() || img.alt || 'Portfolio image';
      modal.querySelector('.modal-copy p').textContent = description?.textContent?.trim() || img.alt || 'A moment from my portfolio.';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.modal-close').focus();
    };
    img.addEventListener('click', openImage);
    img.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImage();
      }
    });
  });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (window.matchMedia('(pointer:fine)').matches) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) translateY(-2px)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
});
