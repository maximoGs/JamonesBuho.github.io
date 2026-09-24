/* =====================================================================
   APP CONTROLLER: ESTANCIA EL BÚHO × MYSTERIK PRODUCCIONES
   Slide Navigation, Deck Mode, Audio Feedback, and Interaction System
   ===================================================================== */

const App = {
  currentSlide: 0,
  totalSlides: 10,
  mode: 'presentation', // 'presentation' or 'scroll'
  soundEnabled: true,
  audioCtx: null,

  init() {
    this.detectInitialMode();
    this.bindEvents();
    this.updateSlideUI();
    this.setupTouchGestures();
  },

  detectInitialMode() {
    // If mobile or if user set query param ?mode=scroll
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    
    if (modeParam === 'scroll' || window.innerWidth < 768) {
      this.setMode('scroll');
    } else {
      this.setMode('presentation');
    }
  },

  setMode(newMode) {
    this.mode = newMode;
    const body = document.body;
    const toggleBtnText = document.getElementById('mode-toggle-text');
    const toggleBtnIcon = document.getElementById('mode-toggle-icon');

    if (newMode === 'presentation') {
      body.classList.remove('mode-scroll');
      body.classList.add('mode-presentation');
      if (toggleBtnText) toggleBtnText.textContent = 'Modo Web Dossier';
      if (toggleBtnIcon) toggleBtnIcon.className = 'fa-solid fa-scroll text-gold-400 mr-2';
      this.goToSlide(this.currentSlide, false);
    } else {
      body.classList.remove('mode-presentation');
      body.classList.add('mode-scroll');
      if (toggleBtnText) toggleBtnText.textContent = 'Modo Presentación';
      if (toggleBtnIcon) toggleBtnIcon.className = 'fa-solid fa-tv text-gold-400 mr-2';
      
      // Scroll smoothly to corresponding section in scroll mode
      const targetSec = document.getElementById(`scroll-slide-${this.currentSlide}`);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
    this.playSound('click');
  },

  toggleMode() {
    if (this.mode === 'presentation') {
      this.setMode('scroll');
    } else {
      this.setMode('presentation');
    }
  },

  bindEvents() {
    // Mode toggle button
    const btnToggleMode = document.getElementById('btn-toggle-mode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', () => this.toggleMode());
    }

    // Navigation buttons
    const btnNext = document.getElementById('deck-next');
    const btnPrev = document.getElementById('deck-prev');
    if (btnNext) btnNext.addEventListener('click', () => this.nextSlide());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevSlide());

    // Fullscreen button
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    // Audio toggle button
    const btnAudio = document.getElementById('btn-audio');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => this.toggleAudio());
    }

    // Print / PDF Export
    const btnPrint = document.getElementById('btn-print-deck');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (this.mode === 'presentation') {
          e.preventDefault();
          this.nextSlide();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (this.mode === 'presentation') {
          e.preventDefault();
          this.prevSlide();
        }
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        this.toggleMode();
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    });

    // Jump buttons from hero
    const btnStartDeck = document.getElementById('hero-btn-start');
    if (btnStartDeck) {
      btnStartDeck.addEventListener('click', () => {
        if (this.mode === 'presentation') {
          this.goToSlide(1);
        } else {
          document.getElementById('scroll-slide-1')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const btnGoModel = document.getElementById('hero-btn-model');
    if (btnGoModel) {
      btnGoModel.addEventListener('click', () => {
        if (this.mode === 'presentation') {
          this.goToSlide(5); // Slide 5 is the Concession / Calculator slide
        } else {
          document.getElementById('scroll-slide-5')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  },

  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this.mode !== 'presentation') return;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and significant (> 50px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  },

  goToSlide(index, playSfx = true) {
    if (index < 0 || index >= this.totalSlides) return;
    
    const prevIndex = this.currentSlide;
    this.currentSlide = index;

    const slides = document.querySelectorAll('.presentation-container .slide-item');
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active-slide');
      } else {
        slide.classList.remove('active-slide');
      }
    });

    this.updateSlideUI();
    if (playSfx && prevIndex !== index) {
      this.playSound('transition');
    }
  },

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  },

  prevSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  },

  updateSlideUI() {
    // Update slide number indicator
    const currentNumStr = String(this.currentSlide + 1).padStart(2, '0');
    const totalNumStr = String(this.totalSlides).padStart(2, '0');

    const numDisplay = document.getElementById('slide-number-display');
    if (numDisplay) {
      numDisplay.innerHTML = `<span class="text-gold-400 font-bold">${currentNumStr}</span> <span class="text-neutral-500 text-xs">/ ${totalNumStr}</span>`;
    }

    // Update progress bar
    const progressBar = document.getElementById('deck-progress-bar');
    if (progressBar) {
      const percentage = ((this.currentSlide + 1) / this.totalSlides) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Prev/Next button states
    const btnPrev = document.getElementById('deck-prev');
    const btnNext = document.getElementById('deck-next');
    if (btnPrev) {
      btnPrev.disabled = this.currentSlide === 0;
      btnPrev.classList.toggle('opacity-30', this.currentSlide === 0);
      btnPrev.classList.toggle('cursor-not-allowed', this.currentSlide === 0);
    }
    if (btnNext) {
      btnNext.disabled = this.currentSlide === this.totalSlides - 1;
      btnNext.classList.toggle('opacity-30', this.currentSlide === this.totalSlides - 1);
      btnNext.classList.toggle('cursor-not-allowed', this.currentSlide === this.totalSlides - 1);
    }
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
      document.getElementById('icon-fullscreen')?.classList.replace('fa-expand', 'fa-compress');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      document.getElementById('icon-fullscreen')?.classList.replace('fa-compress', 'fa-expand');
    }
  },

  toggleAudio() {
    this.soundEnabled = !this.soundEnabled;
    const iconAudio = document.getElementById('icon-audio');
    if (iconAudio) {
      if (this.soundEnabled) {
        iconAudio.className = 'fa-solid fa-volume-high text-gold-400';
        this.playSound('click');
      } else {
        iconAudio.className = 'fa-solid fa-volume-xmark text-neutral-500';
      }
    }
  },

  // Synthesized audio feedback via Web Audio API (completely standalone!)
  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'transition') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Audio not permitted or supported; fail silently
    }
  }
};

// Modal System for Contact & WhatsApp Inquiries
const ModalSystem = {
  open(type = 'general') {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    const selectReason = document.getElementById('modal-field-reason');
    if (selectReason) {
      if (type === 'concesion') selectReason.value = 'concesion';
      else if (type === 'capacitacion') selectReason.value = 'capacitacion';
      else if (type === 'productos') selectReason.value = 'productos';
      else if (type === 'alianza') selectReason.value = 'alianza';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    App.playSound('click');
  },

  close() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    App.playSound('click');
  },

  submitForm(e) {
    e.preventDefault();
    const name = document.getElementById('modal-name')?.value || 'Interesado';
    const venue = document.getElementById('modal-venue')?.value || 'Establecimiento';
    const reason = document.getElementById('modal-field-reason')?.value || 'concesion';
    const phone = document.getElementById('modal-phone')?.value || '';
    const notes = document.getElementById('modal-notes')?.value || '';

    let reasonText = 'Información General';
    if (reason === 'concesion') reasonText = 'Modelo de Concesión ("Que Cada Jamón Valga")';
    if (reason === 'capacitacion') reasonText = 'Charlas y Masterclasses de Corte & Maridaje';
    if (reason === 'productos') reasonText = 'Venta Directa de Piezas y Regalos Corporativos';
    if (reason === 'alianza') reasonText = 'Alianza Regional / Punto de Venta';

    const msg = encodeURIComponent(
      `🍷 *ESTANCIA EL BÚHO × MYSTERIK PRODUCCIONES*\n\n` +
      `¡Hola! Me comunico desde la presentación web en Mendoza:\n\n` +
      `• *Nombre:* ${name}\n` +
      `• *Establecimiento / Empresa:* ${venue}\n` +
      `• *Teléfono:* ${phone}\n` +
      `• *Interés:* ${reasonText}\n` +
      (notes ? `• *Mensaje:* ${notes}\n\n` : `\n`) +
      `Me gustaría coordinar una reunión y degustación de jamón El Búho en Mendoza.`
    );

    // Provide immediate visual confirmation
    const btnSubmit = document.getElementById('modal-btn-submit');
    if (btnSubmit) {
      btnSubmit.innerHTML = `<i class="fa-solid fa-check mr-2 text-emerald-400"></i> Redirigiendo a WhatsApp...`;
    }

    setTimeout(() => {
      window.open(`https://wa.me/5492610000000?text=${msg}`, '_blank');
      ModalSystem.close();
      if (btnSubmit) {
        btnSubmit.innerHTML = `Enviar Solicitud y Contactar`;
      }
    }, 600);
  }
};

// Global expose
window.App = App;
window.ModalSystem = ModalSystem;

document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Close modal when clicking on backdrop
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        ModalSystem.close();
      }
    });
  }
});
