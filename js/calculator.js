/* =====================================================================
   MODELO FINANCIERO: "QUE CADA JAMÓN VALGA"
   Red de Concesiones e Ingresos Pasivos en Mendoza
   Estancia El Búho × Mysterik Producciones
   ===================================================================== */

const FinancialModel = {
  // Base configuration defaults
  currency: 'ARS', // 'ARS' or 'USD'
  
  // Market benchmarks
  rates: {
    ARS: {
      symbol: '$',
      portionPriceDefault: 14500, // Precio de una ración gourmet de 70g con pan de masa madre y manteca
      portionPriceMin: 8000,
      portionPriceMax: 25000,
      stepPrice: 500,
      hamCostWholesale: 380000, // Costo de reposición mayorista por pieza entera reserva (aprox 8-9kg)
      hamNetValueWholesale: 580000, // Valor neto liquidado al operador por pieza
      passivePerJam: 200000 // Ganancia pasiva neta para el operador por jamón rotado
    },
    USD: {
      symbol: 'US$',
      portionPriceDefault: 14,
      portionPriceMin: 8,
      portionPriceMax: 28,
      stepPrice: 1,
      hamCostWholesale: 350,
      hamNetValueWholesale: 520,
      passivePerJam: 170
    }
  },

  state: {
    locations: 6,           // Cantidad de locales / wine bars / bodegas
    jamsPerLocation: 2,      // Jamones consumidos por local al mes
    portionsPerJam: 115,     // Porciones útiles de 70g por pernil
    portionPrice: 14500,     // Precio de la ración al comensal
    currency: 'ARS'
  },

  init() {
    this.bindEvents();
    this.calculate();
  },

  bindEvents() {
    const locSlider = document.getElementById('calc-locations');
    const rotSlider = document.getElementById('calc-rotation');
    const priceSlider = document.getElementById('calc-price');
    const currToggleARS = document.getElementById('curr-ars');
    const currToggleUSD = document.getElementById('curr-usd');
    const btnShareWA = document.getElementById('calc-btn-whatsapp');

    if (locSlider) {
      locSlider.addEventListener('input', (e) => {
        this.state.locations = parseInt(e.target.value, 10);
        document.getElementById('calc-val-locations').textContent = this.state.locations;
        this.calculate();
      });
    }

    if (rotSlider) {
      rotSlider.addEventListener('input', (e) => {
        this.state.jamsPerLocation = parseFloat(e.target.value);
        document.getElementById('calc-val-rotation').textContent = this.state.jamsPerLocation;
        this.calculate();
      });
    }

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.state.portionPrice = parseInt(e.target.value, 10);
        this.updatePriceLabel();
        this.calculate();
      });
    }

    if (currToggleARS && currToggleUSD) {
      currToggleARS.addEventListener('click', () => this.setCurrency('ARS'));
      currToggleUSD.addEventListener('click', () => this.setCurrency('USD'));
    }

    if (btnShareWA) {
      btnShareWA.addEventListener('click', () => this.shareToWhatsApp());
    }
  },

  setCurrency(curr) {
    if (this.state.currency === curr) return;
    this.state.currency = curr;

    const currARS = document.getElementById('curr-ars');
    const currUSD = document.getElementById('curr-usd');
    const priceSlider = document.getElementById('calc-price');

    if (curr === 'ARS') {
      currARS.classList.add('bg-gold-500', 'text-black', 'font-bold');
      currARS.classList.remove('text-neutral-400');
      currUSD.classList.remove('bg-gold-500', 'text-black', 'font-bold');
      currUSD.classList.add('text-neutral-400');

      this.state.portionPrice = this.rates.ARS.portionPriceDefault;
      if (priceSlider) {
        priceSlider.min = this.rates.ARS.portionPriceMin;
        priceSlider.max = this.rates.ARS.portionPriceMax;
        priceSlider.step = this.rates.ARS.stepPrice;
        priceSlider.value = this.state.portionPrice;
      }
    } else {
      currUSD.classList.add('bg-gold-500', 'text-black', 'font-bold');
      currUSD.classList.remove('text-neutral-400');
      currARS.classList.remove('bg-gold-500', 'text-black', 'font-bold');
      currARS.classList.add('text-neutral-400');

      this.state.portionPrice = this.rates.USD.portionPriceDefault;
      if (priceSlider) {
        priceSlider.min = this.rates.USD.portionPriceMin;
        priceSlider.max = this.rates.USD.portionPriceMax;
        priceSlider.step = this.rates.USD.stepPrice;
        priceSlider.value = this.state.portionPrice;
      }
    }

    this.updatePriceLabel();
    this.calculate();
  },

  updatePriceLabel() {
    const el = document.getElementById('calc-val-price');
    if (!el) return;
    const sym = this.rates[this.state.currency].symbol;
    el.textContent = `${sym} ${this.formatNumber(this.state.portionPrice)}`;
  },

  formatNumber(val) {
    return new Intl.NumberFormat('es-AR').format(Math.round(val));
  },

  calculate() {
    const { locations, jamsPerLocation, portionsPerJam, portionPrice, currency } = this.state;
    const rate = this.rates[currency];

    // Total monthly hams circulating
    const totalJamsMonth = Math.round(locations * jamsPerLocation * 10) / 10;
    
    // Total portions served across the network
    const totalPortionsMonth = Math.round(totalJamsMonth * portionsPerJam);

    // Total gross ticket generated in client venues
    const grossVenueRevenue = totalPortionsMonth * portionPrice;

    // Concession model split:
    // The venue keeps ~55% of the plate price for hospitality, wine, service, ambience.
    // The ham concession operator receives ~45% of the plate revenue or fixed liquidation per jamon.
    // Net passive profit for operator after ham cost:
    const operatorGrossLiquidation = totalJamsMonth * (portionsPerJam * portionPrice * 0.44);
    const hamWholesaleCosts = totalJamsMonth * rate.hamCostWholesale;
    const netPassiveMonthly = Math.max(0, operatorGrossLiquidation - hamWholesaleCosts);
    const netPassiveYearly = netPassiveMonthly * 12;

    // Earnings for the partner venue (host hotel, wine bar, restaurant)
    const venueProfitTotalMonthly = grossVenueRevenue - operatorGrossLiquidation;
    const avgProfitPerVenue = locations > 0 ? (venueProfitTotalMonthly / locations) : 0;

    // Render results
    const elTotalJams = document.getElementById('res-total-jams');
    const elGrossSales = document.getElementById('res-gross-sales');
    const elPassiveMonthly = document.getElementById('res-passive-monthly');
    const elPassiveYearly = document.getElementById('res-passive-yearly');
    const elVenueProfit = document.getElementById('res-venue-profit');
    const elBadgeTier = document.getElementById('res-tier-badge');

    const sym = rate.symbol;

    if (elTotalJams) elTotalJams.textContent = `${totalJamsMonth} piezas/mes`;
    if (elGrossSales) elGrossSales.textContent = `${sym} ${this.formatNumber(grossVenueRevenue)}`;
    if (elPassiveMonthly) elPassiveMonthly.textContent = `${sym} ${this.formatNumber(netPassiveMonthly)}`;
    if (elPassiveYearly) elPassiveYearly.textContent = `${sym} ${this.formatNumber(netPassiveYearly)}`;
    if (elVenueProfit) elVenueProfit.textContent = `${sym} ${this.formatNumber(avgProfitPerVenue)} /mes`;

    // Dynamic Tier badge
    if (elBadgeTier) {
      if (locations <= 3) {
        elBadgeTier.textContent = 'Fase Piloto • Nivel Boutique';
        elBadgeTier.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-neutral-800 text-gold-300 border border-gold-500/30';
      } else if (locations <= 9) {
        elBadgeTier.textContent = 'Fase Expansión • Red Cuyo Consolidada';
        elBadgeTier.className = 'px-3 py-1 text-xs font-semibold rounded-full bg-wine-900/60 text-gold-300 border border-gold-500/50 shadow-lg shadow-wine-950/40';
      } else {
        elBadgeTier.textContent = 'Liderazgo Absoluto • Red Gastronómica Provincial';
        elBadgeTier.className = 'px-3 py-1 text-xs font-bold rounded-full bg-gold-500/20 text-gold-200 border border-gold-400 shadow-lg shadow-gold-500/20 animate-pulse';
      }
    }
  },

  shareToWhatsApp() {
    const { locations, jamsPerLocation, currency } = this.state;
    const rate = this.rates[currency];
    const totalJamsMonth = Math.round(locations * jamsPerLocation * 10) / 10;
    const netMonthly = document.getElementById('res-passive-monthly')?.textContent || '';

    const text = encodeURIComponent(
      `Hola Mysterik Producciones, estuve viendo la propuesta de Estancia El Búho en Mendoza y simulé el modelo "Que Cada Jamón Valga".\n\n` +
      `📊 Proyección estimada:\n` +
      `• Locaciones en concesión: ${locations} locales\n` +
      `• Rotación estimada: ${totalJamsMonth} piezas/mes\n` +
      `• Ingreso pasivo mensual proyectado: ${netMonthly}\n\n` +
      `Quisiera coordinar una reunión o degustación privada para sumarme a la red de concesión / distribución en Mendoza.`
    );

    window.open(`https://wa.me/5492610000000?text=${text}`, '_blank');
  }
};

// Auto-initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FinancialModel.init());
} else {
  FinancialModel.init();
}
