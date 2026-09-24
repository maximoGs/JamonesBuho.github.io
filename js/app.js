/* =====================================================================
   ESTANCIA EL BÚHO × MYSTERIK PRODUCCIONES | MENDOZA
   Lógica JavaScript Pura y Directa
   WhatsApp: +54 9 261 709-4195
   ===================================================================== */

const WHATSAPP_PHONE = "5492617094195";

// Calculadora Financiera "Que Cada Jamón Valga"
const FinancialCalculator = {
  currency: "ARS",
  
  data: {
    ARS: {
      symbol: "$",
      portionPrice: 14500,
      hamCost: 380000,
      minPrice: 8000,
      maxPrice: 25000,
      stepPrice: 500
    },
    USD: {
      symbol: "US$",
      portionPrice: 14,
      hamCost: 350,
      minPrice: 8,
      maxPrice: 25,
      stepPrice: 1
    }
  },

  state: {
    locations: 6,
    jamsPerLocation: 2,
    portionPrice: 14500
  },

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const locSlider = document.getElementById("slider-locations");
    const rotSlider = document.getElementById("slider-rotation");
    const prcSlider = document.getElementById("slider-price");
    const btnArs = document.getElementById("btn-currency-ars");
    const btnUsd = document.getElementById("btn-currency-usd");

    if (locSlider) {
      locSlider.addEventListener("input", (e) => {
        this.state.locations = parseInt(e.target.value, 10);
        const lbl = document.getElementById("lbl-locations");
        if (lbl) lbl.textContent = `${this.state.locations} locales`;
        this.render();
      });
    }

    if (rotSlider) {
      rotSlider.addEventListener("input", (e) => {
        this.state.jamsPerLocation = parseFloat(e.target.value);
        const lbl = document.getElementById("lbl-rotation");
        if (lbl) lbl.textContent = `${this.state.jamsPerLocation} piezas/mes`;
        this.render();
      });
    }

    if (prcSlider) {
      prcSlider.addEventListener("input", (e) => {
        this.state.portionPrice = parseInt(e.target.value, 10);
        this.updatePriceLabel();
        this.render();
      });
    }

    if (btnArs && btnUsd) {
      btnArs.addEventListener("click", () => this.setCurrency("ARS"));
      btnUsd.addEventListener("click", () => this.setCurrency("USD"));
    }
  },

  setCurrency(curr) {
    if (this.currency === curr) return;
    this.currency = curr;

    const btnArs = document.getElementById("btn-currency-ars");
    const btnUsd = document.getElementById("btn-currency-usd");
    const prcSlider = document.getElementById("slider-price");

    if (curr === "ARS") {
      btnArs.classList.add("active");
      btnUsd.classList.remove("active");
      this.state.portionPrice = this.data.ARS.portionPrice;
      if (prcSlider) {
        prcSlider.min = this.data.ARS.minPrice;
        prcSlider.max = this.data.ARS.maxPrice;
        prcSlider.step = this.data.ARS.stepPrice;
        prcSlider.value = this.state.portionPrice;
      }
    } else {
      btnUsd.classList.add("active");
      btnArs.classList.remove("active");
      this.state.portionPrice = this.data.USD.portionPrice;
      if (prcSlider) {
        prcSlider.min = this.data.USD.minPrice;
        prcSlider.max = this.data.USD.maxPrice;
        prcSlider.step = this.data.USD.stepPrice;
        prcSlider.value = this.state.portionPrice;
      }
    }

    this.updatePriceLabel();
    this.render();
  },

  updatePriceLabel() {
    const lbl = document.getElementById("lbl-price");
    if (!lbl) return;
    const cfg = this.data[this.currency];
    lbl.textContent = `${cfg.symbol} ${this.format(this.state.portionPrice)}`;
  },

  format(val) {
    return new Intl.NumberFormat("es-AR").format(Math.round(val));
  },

  render() {
    const { locations, jamsPerLocation, portionPrice } = this.state;
    const cfg = this.data[this.currency];
    const portionsPerHam = 115; // Raciones de 70g

    const totalJams = Math.round(locations * jamsPerLocation * 10) / 10;
    const totalPortions = totalJams * portionsPerHam;
    const grossTotal = totalPortions * portionPrice;

    // Retorno neto operador
    const liquidation = totalJams * (portionsPerHam * portionPrice * 0.45);
    const cost = totalJams * cfg.hamCost;
    const passiveMonthly = Math.max(0, liquidation - cost);
    const passiveYearly = passiveMonthly * 12;

    const elMonth = document.getElementById("res-passive-month");
    const elYear = document.getElementById("res-passive-year");
    const elJams = document.getElementById("res-total-jams");
    const elGross = document.getElementById("res-gross-total");

    if (elMonth) elMonth.textContent = `${cfg.symbol} ${this.format(passiveMonthly)}`;
    if (elYear) elYear.textContent = `${cfg.symbol} ${this.format(passiveYearly)}`;
    if (elJams) elJams.textContent = `${totalJams} piezas/mes`;
    if (elGross) elGross.textContent = `${cfg.symbol} ${this.format(grossTotal)}`;

    // Enlace de WhatsApp dinámico con los valores simulados
    const btnWa = document.getElementById("btn-wa-simulation");
    if (btnWa) {
      const msg = encodeURIComponent(
        `Hola, estuve analizando en la web la proyección de concesión 'Que cada jamón valga' con ${locations} locales y ${totalJams} jamones/mes (${cfg.symbol} ${this.format(passiveMonthly)} mensual neto). Me interesa coordinar una reunión.`
      );
      btnWa.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    }
  }
};

// Menú Móvil & Enlaces
document.addEventListener("DOMContentLoaded", () => {
  FinancialCalculator.init();

  const toggleBtn = document.getElementById("btn-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });

    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });
  }
});
