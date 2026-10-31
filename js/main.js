/**
 * AASTHA PASRIJA — AWARD-WINNING MINIMALIST PORTFOLIO
 * Main Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initHeroVideo();
  initToolkitFilter();
  initProjectSlider();
  initContactForm();
  initEmailCopy();
  initBackToTop();
  initPhotoDeck();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  // Default to black/dark theme
  const savedTheme = localStorage.getItem('aastha-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('aastha-theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('theme-toggle-icon');
  if (!iconSpan) return;

  if (theme === 'light') {
    // Show Moon icon for light mode
    iconSpan.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    iconSpan.setAttribute('title', 'Switch to Dark Mode');
  } else {
    // Show Sun icon for dark mode
    iconSpan.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    iconSpan.setAttribute('title', 'Switch to Light Mode');
  }
}

/* --------------------------------------------------------------------------
   2. Navbar Scroll Spy & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  // Blur & border on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. Hero Video Autoplay & Custom Audio Controls
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById('hero-video');
  const audioBtn = document.getElementById('video-audio-toggle');
  const audioIcon = document.getElementById('video-audio-icon');
  const audioLabel = document.getElementById('video-audio-label');
  const fsBtn = document.getElementById('video-fullscreen-btn');

  if (!video) return;

  // Modern browsers require muted for autoplay
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;

  const triggerPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry playing on first document interaction if browser blocks autoplay
        const playOnInteract = () => {
          video.play();
          document.removeEventListener('click', playOnInteract);
          document.removeEventListener('touchstart', playOnInteract);
        };
        document.addEventListener('click', playOnInteract, { once: true });
        document.addEventListener('touchstart', playOnInteract, { once: true });
      });
    }
  };

  // Fast start: trigger play immediately or when initial data is ready
  if (video.readyState >= 2) {
    triggerPlay();
  } else {
    video.addEventListener('loadeddata', triggerPlay, { once: true });
    video.addEventListener('canplay', triggerPlay, { once: true });
  }

  // Seamless, stutter-free loop buffer reset
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.duration - video.currentTime < 0.15) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });

  // Audio Toggle
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        audioLabel.textContent = 'Unmute';
        audioIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
      } else {
        audioLabel.textContent = 'Mute';
        audioIcon.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
      }
    });
  }

  // Fullscreen
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch((err) => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Technical Toolkit Category Filter
   -------------------------------------------------------------------------- */
function initToolkitFilter() {
  const filterBtns = document.querySelectorAll('.toolkit-filter-bar .filter-btn');
  const cards = document.querySelectorAll('.toolkit-grid .toolkit-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Projects Responsive Slider (2 in a Row on Desktop)
   -------------------------------------------------------------------------- */
function initProjectSlider() {
  const track = document.getElementById('project-slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const counterCurrent = document.getElementById('slider-current-num');
  const counterTotal = document.getElementById('slider-total-num');
  const dotsContainer = document.getElementById('slider-dots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.project-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  function getCardsPerView() {
    return window.innerWidth > 768 ? 2 : 1;
  }

  function getMaxIndex() {
    const perView = getCardsPerView();
    return Math.max(0, totalCards - perView);
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const cardsPerView = getCardsPerView();
    const maxIdx = getMaxIndex();

    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    // Card width percentage + gap
    // Desktop: cards flex is 50% - 0.75rem, gap is 1.5rem (24px)
    const cardEl = cards[0];
    if (cardEl) {
      const cardWidth = cardEl.offsetWidth;
      const gap = 24; // 1.5rem
      const moveDistance = (cardWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${moveDistance}px)`;
    }

    // Update Counter (formatted e.g. 01 / 02 or 01 / 04)
    if (counterCurrent && counterTotal) {
      const curFormatted = String(currentIndex + 1).padStart(2, '0');
      const totFormatted = String(maxIdx + 1).padStart(2, '0');
      counterCurrent.textContent = curFormatted;
      counterTotal.textContent = totFormatted;
    }

    // Update Buttons state
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIdx;

    // Update Dots
    const dots = dotsContainer?.querySelectorAll('.slider-dot') || [];
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex < maxIdx) {
      currentIndex++;
      updateSlider();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 40;
    if (touchEndX < touchStartX - threshold) {
      // swipe left -> next
      nextBtn.click();
    } else if (touchEndX > touchStartX + threshold) {
      // swipe right -> prev
      prevBtn.click();
    }
  }

  // Window resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderDots();
      updateSlider();
    }, 100);
  });

  // Initial render
  renderDots();
  updateSlider();
}

/* --------------------------------------------------------------------------
   6. Contact Form & Feedback Toast (FormSubmit.co Direct Email Integration)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending message...
    `;

    try {
      const response = await fetch('https://formsubmit.co/ajax/aasthapasrija23@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || 'Software Engineering Inquiry',
          message: message,
          _subject: `New Portfolio Message from ${name}: ${subject || 'Software Engineering Inquiry'}`,
          _captcha: 'false',
          _template: 'table'
        })
      });

      if (response.ok) {
        form.reset();
        showToast('Message sent successfully! Aastha will receive it directly.');
      } else {
        console.warn('FormSubmit returned error status, attempting fallback submission');
        form.submit();
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fetch error, falling back to native submission:', err);
      form.submit();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   7. Copy Email Button
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('contact-email-val');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = emailText.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      const origContent = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span style="color: #10b981; font-weight: bold;">Copied!</span>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = origContent;
      }, 2000);
    }).catch(() => {
      showToast('Copied email to clipboard!');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Back To Top
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   9. Interactive Photo Deck (Cycle Stack on Click)
   -------------------------------------------------------------------------- */
function initPhotoDeck() {
  const deck = document.getElementById('photo-deck');
  if (!deck) return;

  const cards = deck.querySelectorAll('.stacked-photo-card');
  if (!cards || cards.length < 3) return;

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const current1 = deck.querySelector('.card-1');
      const current2 = deck.querySelector('.card-2');
      const current3 = deck.querySelector('.card-3');

      if (card.classList.contains('card-2')) {
        current1.className = 'stacked-photo-card card-3';
        current2.className = 'stacked-photo-card card-1';
        current3.className = 'stacked-photo-card card-2';
      } else if (card.classList.contains('card-3')) {
        current1.className = 'stacked-photo-card card-2';
        current2.className = 'stacked-photo-card card-3';
        current3.className = 'stacked-photo-card card-1';
      }
    });
  });
}

