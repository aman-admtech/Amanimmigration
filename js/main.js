/**
 * AMAN IMMIGRATION - Official Website Scripts
 * Global Component Loader (Header & Footer), Form Handlers, Calculator & Modals
 */

const WHATSAPP_NUMBER = '917696197634';

// --- 1. Global Component Loader (Header & Footer) ---
async function loadComponents() {
  const headerElem = document.getElementById('site-header');
  const footerElem = document.getElementById('site-footer');

  const promises = [];

  if (headerElem && !headerElem.hasChildNodes()) {
    promises.push(
      fetch('components/header.html')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.text();
        })
        .then(html => {
          headerElem.innerHTML = html;
          initMobileMenu();
          highlightActiveNav();
        })
        .catch(err => console.error('Error loading header component:', err))
    );
  } else if (headerElem) {
    initMobileMenu();
    highlightActiveNav();
  }

  if (footerElem && !footerElem.hasChildNodes()) {
    promises.push(
      fetch('components/footer.html')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.text();
        })
        .then(html => {
          footerElem.innerHTML = html;
          initProofModal();
        })
        .catch(err => console.error('Error loading footer component:', err))
    );
  } else if (footerElem) {
    initProofModal();
  }

  await Promise.all(promises);
}

// --- 2. Mobile Off-Canvas Right Drawer Navigation ---
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');

  function openDrawer() {
    if (!navLinks) return;
    navLinks.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileToggle?.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  }

  function closeDrawer() {
    if (!navLinks) return;
    navLinks.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileToggle?.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('mobile-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
        closeDrawer();
      }
    });
  }
}

// --- 2.1 Highlight Active Nav Link ---
function highlightActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html') || (currentFile === 'terms-and-conditions.html' && href === 'terms.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- 3. Proof Image Lightbox Modal ---
function initProofModal() {
  const proofCards = document.querySelectorAll('.proof-card');
  const proofModal = document.getElementById('proofModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (proofModal && modalImg && modalClose) {
    proofCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.proof-image');
        const studentName = card.querySelector('.proof-student-name')?.textContent.trim() || 'Aman Immigration Success';
        const location = card.querySelector('.proof-location')?.textContent.trim() || '';

        if (img) {
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          modalCaption.textContent = location ? `${studentName} • ${location}` : studentName;
          proofModal.classList.add('active');
        }
      });
    });

    modalClose.addEventListener('click', () => {
      proofModal.classList.remove('active');
    });

    proofModal.addEventListener('click', (e) => {
      if (e.target === proofModal) {
        proofModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && proofModal.classList.contains('active')) {
        proofModal.classList.remove('active');
      }
    });
  }
}

// --- 4. Interactive Visa Approvals Slider ---
function initVisaSlider() {
  const track = document.getElementById('visaSliderTrack');
  const prevBtn = document.getElementById('visaSliderPrev');
  const nextBtn = document.getElementById('visaSliderNext');
  const dotsContainer = document.getElementById('visaSliderDots');

  if (!track) return;

  const slides = track.querySelectorAll('.visa-slide');
  if (slides.length === 0) return;

  // Function to calculate accurate scroll distance per slide
  function getScrollStep() {
    const firstSlide = slides[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '24');
    return firstSlide.offsetWidth + gap;
  }

  // Create pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        const step = getScrollStep();
        track.scrollTo({ left: idx * step, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Synchronize active dot with scroll position
  function updateActiveDot() {
    if (!dotsContainer) return;
    const step = getScrollStep();
    if (step <= 0) return;
    const activeIndex = Math.min(
      Math.round(track.scrollLeft / step),
      slides.length - 1
    );
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  }, { passive: true });

  // Navigation button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const step = getScrollStep();
      if (track.scrollLeft <= 10) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const step = getScrollStep();
      const maxScroll = track.scrollWidth - track.clientWidth - 10;
      if (track.scrollLeft >= maxScroll) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    });
  }

  // Gentle auto-slide timer (4.5s), pauses on hover/touch
  let autoPlayInterval = null;
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      const step = getScrollStep();
      const maxScroll = track.scrollWidth - track.clientWidth - 10;
      if (track.scrollLeft >= maxScroll) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4500);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  track.addEventListener('touchstart', stopAutoPlay, { passive: true });
  track.addEventListener('touchend', startAutoPlay, { passive: true });

  startAutoPlay();
}

// --- 5. Main Initialization on DOM Ready ---
document.addEventListener('DOMContentLoaded', async () => {
  // First load external header & footer
  await loadComponents();

  // Initialize Visa Slider
  initVisaSlider();

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Hero Lead Form -> WhatsApp Integration ---
  const heroLeadForm = document.getElementById('heroLeadForm');
  if (heroLeadForm) {
    heroLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('leadName')?.value.trim() || 'Candidate';
      const phone = document.getElementById('leadPhone')?.value.trim() || 'Not provided';
      const visaType = document.getElementById('leadVisaType')?.value || 'General Consultation';
      const country = document.getElementById('leadCountry')?.value || 'Any';

      const message = `Hello Aman Immigration, I would like to book a consultation:%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Visa Type:* ${encodeURIComponent(visaType)}%0A*Preferred Country:* ${encodeURIComponent(country)}%0A%0APlease review my profile and guide me.`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    });
  }

  // --- Contact Us Form -> WhatsApp Integration ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim() || 'Inquirer';
      const phone = document.getElementById('contactPhone')?.value.trim() || 'Not provided';
      const city = document.getElementById('contactCity')?.value.trim() || 'Kotkapura / Punjab';
      const visaType = document.getElementById('contactService')?.value || 'Consultation';
      const userMessage = document.getElementById('contactMessage')?.value.trim() || 'Please call me back.';

      const text = `Hello Aman Immigration Kotkapura,%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*City:* ${encodeURIComponent(city)}%0A*Visa Interest:* ${encodeURIComponent(visaType)}%0A*Message:* ${encodeURIComponent(userMessage)}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    });
  }

  // --- Interactive Visa Eligibility Checker ---
  const calcForm = document.getElementById('eligibilityCheckerForm');
  const calcResultBox = document.getElementById('calcResultBox');
  const calcResultText = document.getElementById('calcResultText');
  const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  if (calcForm && calcResultBox) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const qualification = document.getElementById('calcEdu')?.value || '12th';
      const language = document.getElementById('calcLang')?.value || 'without-ielts';
      const destination = document.getElementById('calcCountry')?.value || 'singapore';

      let recommendation = '';
      let countryName = '';

      if (destination === 'singapore') {
        countryName = 'Singapore Study Visa';
        if (language === 'without-ielts') {
          recommendation = 'Great News! Singapore allows student admission & visa filing *Without IELTS* with high visa grant rates. Fast track decision within 45 days. You are eligible for our "Pay All After Visa" pathway!';
        } else {
          recommendation = 'Excellent Profile! With your English proficiency and qualification, you are eligible for top diplomas, degrees, and paid internships in Singapore.';
        }
      } else if (destination === 'russia') {
        countryName = 'Russia Study Visa';
        recommendation = 'High Visa Success! Top government universities in Russia offer Medical, Engineering, and Business degrees in English medium without mandatory IELTS. Fast processing under 45 days with "Pay After Visa" facility.';
      } else if (destination === 'belarus') {
        countryName = 'Belarus Study Visa';
        recommendation = 'European Education Opportunity! Belarus is an affordable, safe destination with 100% genuine admission & visa support. No IELTS required for primary intake.';
      } else if (destination === 'dubai') {
        countryName = 'Dubai (UAE) Visa';
        recommendation = 'Rapid Processing! Dubai offers quick 1 to 2-year study & open work permits with simple documentation and zero IELTS prerequisite.';
      } else if (destination === 'croatia') {
        countryName = 'Croatia / Europe Schengen';
        recommendation = 'Gateway to Europe! Croatian vocational study and work permit options are available. Start your European career path with verified embassy documentation.';
      } else {
        countryName = destination.toUpperCase() + ' Visa';
        recommendation = 'Good Eligibility! Your academic background meets baseline criteria. A customized SOP, financial roadmap, and document check will finalize your best pathway.';
      }

      calcResultText.innerHTML = `<strong>${countryName}:</strong> ${recommendation}`;
      calcResultBox.classList.add('active');

      if (calcWhatsAppBtn) {
        const waMsg = `Hello Aman Immigration, I checked my eligibility on your website:%0A%0A*Qualification:* ${encodeURIComponent(qualification)}%0A*Language:* ${encodeURIComponent(language)}%0A*Destination:* ${encodeURIComponent(destination)}%0A%0APlease evaluate my case in detail.`;
        calcWhatsAppBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;
      }
    });
  }

  // --- Document Checklist Tabs ---
  const docTabBtns = document.querySelectorAll('.docs-tab-btn');
  const docTabContents = document.querySelectorAll('.docs-tab-content');

  if (docTabBtns.length > 0 && docTabContents.length > 0) {
    docTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        docTabBtns.forEach(b => b.classList.remove('active'));
        docTabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }
});
