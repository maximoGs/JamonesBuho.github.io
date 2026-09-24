/* =====================================================================
   ESTANCIA EL BÚHO × MYSTERIK PRODUCCIONES | MENDOZA
   Lógica Ejecutiva, Navegación y Calculadora B2B
   Contacto directo WhatsApp: +54 9 261 709-4195
   ===================================================================== */

const PHONE_NUMBER = "5492617094195";

const Calculator = {
  currency: "ARS",
  
  config: {
    ARS: {
      symbol: "$",
      portionPrice: 14500,
      hamCost: 380000,
      minPrice: 8000,
      maxPrice: 24000,
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
    this.bind();
    this.update();
  },

  bind() {
    const loc = document.getElementById("calc-locations");
    const rot = document.getElementById("calc-rotation");
    const prc = document.getElementById("calc-price");
    const btnArs = document.getElementById("btn-curr-ars");
    const btnUsd = document.getElementById("btn-curr-usd");

    if (loc) {
      loc.addEventListener("input", (e) => {
        this.state.locations = parseInt(e.target.value, 10);
        document.getElementById("val-locations").textContent = this.state.locations;
        this.update();
      });
    }

    if (rot) {
      rot.addEventListener("input", (e) => {
        this.state.jamsPerLocation = parseFloat(e.target.value);
        document.getElementById("val-rotation").textContent = this.state.jamsPerLocation;
        this.update();
      });
    }

    if (prc) {
      prc.addEventListener("input", (e) => {
        this.state.portionPrice = parseInt(e.target.value, 10);
        this.updatePriceLabel();
        this.update();
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

    const btnArs = document.getElementById("btn-curr-ars");
    const btnUsd = document.getElementById("btn-curr-usd");
    const prc = document.getElementById("calc-price");

    if (curr === "ARS") {
      btnArs.className = "px-3 py-1 text-xs font-bold rounded bg-amber-600 text-white";
      btnUsd.className = "px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white";
      this.state.portionPrice = this.config.ARS.portionPrice;
      if (prc) {
        prc.min = this.config.ARS.minPrice;
        prc.max = this.config.ARS.maxPrice;
        prc.step = this.config.ARS.stepPrice;
        prc.value = this.state.portionPrice;
      }
    } else {
      btnUsd.className = "px-3 py-1 text-xs font-bold rounded bg-amber-600 text-white";
      btnArs.className = "px-3 py-1 text-xs font-medium rounded text-slate-400 hover:text-white";
      this.state.portionPrice = this.config.USD.portionPrice;
      if (prc) {
        prc.min = this.config.USD.minPrice;
        prc.max = this.config.USD.maxPrice;
        prc.step = this.config.USD.stepPrice;
        prc.value = this.state.portionPrice;
      }
    }

    this.updatePriceLabel();
    this.update();
  },

  updatePriceLabel() {
    const el = document.getElementById("val-price");
    if (!el) return;
    const cfg = this.config[this.currency];
    el.textContent = `${cfg.symbol} ${this.format(this.state.portionPrice)}`;
  },

  format(num) {
    return new Intl.NumberFormat("es-AR").format(Math.round(num));
  },

  update() {
    const { locations, jamsPerLocation, portionPrice } = this.state;
    const cfg = this.config[this.currency];
    const portionsPerHam = 115; // Raciones de 70g

    // Métricas
    const totalJams = Math.round(locations * jamsPerLocation * 10) / 10;
    const totalPortions = totalJams * portionsPerHam;
    const grossTurnover = totalPortions * portionPrice;

    // Retorno operador / inversor neto de piezas
    const operatorLiquidation = totalJams * (portionsPerHam * portionPrice * 0.45);
    const hamCosts = totalJams * cfg.hamCost;
    const netPassiveMonthly = Math.max(0, operatorLiquidation - hamCosts);
    const netPassiveYearly = netPassiveMonthly * 12;

    // Ganancia establecimiento
    const venueProfitTotal = grossTurnover - operatorLiquidation;
    const venueProfitAvg = locations > 0 ? venueProfitTotal / locations : 0;

    // Actualizar elementos DOM
    const elPassiveMonth = document.getElementById("out-passive-month");
    const elPassiveYear = document.getElementById("out-passive-year");
    const elVenueProfit = document.getElementById("out-venue-profit");
    const elTotalJams = document.getElementById("out-total-jams");
    const elGross = document.getElementById("out-gross-turnover");

    if (elPassiveMonth) elPassiveMonth.textContent = `${cfg.symbol} ${this.format(netPassiveMonthly)}`;
    if (elPassiveYear) elPassiveYear.textContent = `${cfg.symbol} ${this.format(netPassiveYearly)}`;
    if (elVenueProfit) elVenueProfit.textContent = `${cfg.symbol} ${this.format(venueProfitAvg)}`;
    if (elTotalJams) elTotalJams.textContent = `${totalJams} piezas/mes`;
    if (elGross) elGross.textContent = `${cfg.symbol} ${this.format(grossTurnover)}`;

    // Actualizar enlace WhatsApp de la simulación
    const waBtn = document.getElementById("btn-calc-wa");
    if (waBtn) {
      const msg = encodeURIComponent(
        `Hola, estuve analizando el modelo "Que cada jamón valga" en la web con una proyección de ${locations} locales y ${totalJams} jamones/mes (${cfg.symbol} ${this.format(netPassiveMonthly)} pasivo mensual). Me interesa avanzar en una reunión.`
      );
      waBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${msg}`;
    }
  }
};

// Navegación móvil y enlaces directos
document.addEventListener("DOMContentLoaded", () => {
  Calculator.init();

  // Menú hamburguesa móvil
  const btnMenu = document.getElementById("btn-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  if (btnMenu && mobileMenu) {
    btnMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
});

// Función global para WhatsApp
window.contactWhatsApp = function(topic) {
  let msg = "Hola, me comunico a través de la presentación de Estancia El Búho x Mysterik Producciones en Mendoza.";
  if (topic === "concesion") {
    msg = "Hola, me interesa conocer las condiciones para sumar mi local a la red de concesión ('Que cada jamón valga') en Mendoza.";
  } else if (topic === "capacitacion") {
    msg = "Hola, me gustaría coordinar una capacitación de corte a cuchillo o cata sensorial para mi equipo / establecimiento.";
  } else if (topic === "redes") {
    msg = "Hola, me interesa la cobertura de contenido audiovisual para redes de Mysterik Producciones para mi local / bodega.";
  } else if (topic === "productos") {
    msg = "Hola, quisiera solicitar la lista de precios mayorista y formatos de venta de jamón Estancia El Búho en Mendoza.";
  } else if (topic === "alianza") {
    msg = "Hola, me interesa una reunión para vincular mi bodega / firma comercial con Estancia El Búho y Mysterik Producciones.";
  }

  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};
