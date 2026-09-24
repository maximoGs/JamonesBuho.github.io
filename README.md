# 🍷 Estancia El Búho × Mysterik Producciones | Desembarco en Mendoza

> **Presentación Web Ejecutiva & Pitch Deck Interactivo de Alta Gama**  
> El encuentro entre la maestría artesanal serrana de **Agua de Oro (Córdoba)** y el prestigioso terroir vitivinícola y gastronómico de **Mendoza**.

---

## 📋 Resumen Ejecutivo del Proyecto

**Estancia El Búho**, fundada en 1948 por Don Víctor Fernández en Agua de Oro (Córdoba), es el templo de producción artesanal de jamón crudo estacionado más venerado de la República Argentina. Con un proceso de curación paciente de **18 a 24 meses** en el microclima de las Sierras Chicas —sin aceleradores químicos ni salmueras industriales—, su jamón se distingue por un veteado noble, textura que funde en boca y una sutilidad aromática alabada unánimemente por los mayores chefs del país.

De la mano de **Mysterik Producciones** en el liderazgo de marketing experiencial, relaciones públicas y vinculación regional, El Búho aterriza en la provincia de Mendoza con una propuesta integral de 4 ejes estratégicos:

1. **Charlas Magistrales y Capacitaciones de Sala:** Talleres intensivos de corte a cuchillo tradicional, cata organoléptica y maridaje de jamón crudo con vinos de alta gama para elevar el ticket promedio en salones y bodegas.
2. **Modelo "Que Cada Jamón Valga" (Red de Concesiones e Ingresos Pasivos):** Sistema llave en mano donde hoteles boutique, wine bars y salones de eventos reciben jamoneras de diseño y perniles en concesión con **$0 de inversión inicial en stock**, generando a su vez una **red de ingresos pasivos recurrentes** para el inversor u operador regional.
3. **Alianzas Territoriales de Prestigio:**
   - **Firma Torrent (Desde 1922):** El templo centenario de fiambres, quesos y delicatessen en Mendoza (Mercado Central, Godoy Cruz y Familia Raffa en Il Mercato Maipú), aportando capilaridad de distribución mayorista y vitrina de venta de élite.
   - **Bodega Martino Wines (Mayor Drummond, Luján de Cuyo):** Bodega patrimonial de 1901 seleccionada por la **Guía MICHELIN**, cuna de vinos excepcionales (*Varietales Inusuales* y *Baldomir*), ideal para activaciones de enoturismo prémium, sunsets y estuches de regalos corporativos combinados.
4. **Venta Directa y Catálogo Corporativo:** Provisión de piezas enteras con hueso, centros deshuesados al vacío listos para cortadora, sobres feteados "Corte Maestro" y estuches empresariales de madera pirograbada.

---

## 🌟 Características de la Plataforma Web

Esta aplicación web fue diseñada como una pieza de software estático de ultra-lujo, con arquitectura dual y experiencia interactiva fluida:

- **Modo Presentación (Pitch Deck / Keynote):** 10 diapositivas a pantalla completa con navegación por teclado (`←`, `→`, `Espacio`), gestos táctiles (swipe en smartphones y tablets), barra de progreso dorada, contador dinámico y atajos (`F` para pantalla completa).
- **Modo Web Dossier (Scroll Continuo):** Formato editorial ejecutivo one-page para lectura corrida, ideal para compartir por WhatsApp o revisar desde dispositivos móviles.
- **Simulador Financiero "Que Cada Jamón Valga":** Calculadora interactiva en tiempo real donde el usuario puede simular la cantidad de locales en concesión (1 a 25), rotación de piezas por mes y precio de venta al público por porción (70g), visualizando ingresos pasivos mensuales y anuales, rentabilidad de los establecimientos y facturación global, con selector de moneda (**ARS / USD**) y botón directo para compartir la simulación por WhatsApp.
- **Efectos de Sonido Autocontenidos:** Motor de síntesis de audio mediante **Web Audio API** nativo (sin dependencias ni archivos mp3 externos), con botón para silenciar o activar.
- **Mapa Territorial Vectorial:** Cartografía SVG de alta definición que ilustra los corredores estratégicos de Mendoza: Ciudad (Mercado Central / Torrent), Godoy Cruz, Luján de Cuyo (Martino Wines), Maipú (Familia Raffa) y proyección hacia Valle de Uco.
- **Optimización para Impresión / Exportación a PDF (Tecla `P`):** Hoja de estilos `@media print` configurada en formato A4 horizontal que transforma cada diapositiva en una lámina limpia y profesional para exportar a PDF en un clic.
- **Modal de Contacto Inteligente:** Formulario con redireccionamiento pre-cargado a WhatsApp para agendar degustaciones privadas, postular locales para concesión o solicitar listas de precios mayoristas.

---

## 📂 Estructura del Repositorio

```text
presentacionjamones/
│
├── index.html              # Estructura semántica, slides y dossier ejecutivo
├── css/
│   └── styles.css          # Tipografías de lujo, animaciones, glassmorphism y print styles
├── js/
│   ├── app.js              # Controlador de navegación, modos, atajos, audio y modales
│   └── calculator.js       # Lógica financiera interactiva del modelo "Que Cada Jamón Valga"
├── assets/
│   ├── logo-elbuho.svg     # Escudo heráldico de Estancia El Búho (Agua de Oro)
│   ├── logo-mysterik.svg   # Isotipo y tipografía de Mysterik Producciones
│   ├── logo-torrent.svg    # Emblema tradicional de la Firma Torrent (1922)
│   ├── logo-martino.svg    # Marca distintiva de Bodega Martino Wines (1901)
│   └── map-mendoza.svg     # Mapeo territorial y corredores estratégicos en Mendoza
├── .gitignore              # Archivo de exclusiones estándar para Git
└── README.md               # Documentación integral del proyecto
```

---

## 🚀 Despliegue y Ejecución Local

Al ser un proyecto estático sin dependencias pesadas ni necesidad de compiladores (`npm`/`webpack`), funciona directamente abriendo el archivo en cualquier navegador.

### Opción 1: Abrir directamente
Hacer doble clic en `index.html` en el explorador de archivos.

### Opción 2: Servidor local ligero (opcional)
Con Python:
```bash
python -m http.server 8000
```
Luego abrir `http://localhost:8000` en tu navegador.

---

## 📦 Instrucciones para Pushear al Repositorio Remoto

El repositorio local ya está inicializado con su commit estructurado. Para subirlo a GitHub, GitLab o Bitbucket:

1. Crea un repositorio vacío en tu plataforma favorita (por ejemplo, en GitHub: `presentacion-elbuho-mendoza`).
2. En la terminal dentro de esta carpeta, ejecuta:

```bash
# Vincular con tu repositorio remoto
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Asegurar la rama principal
git branch -M main

# Subir los cambios
git push -u origin main
```

### Despliegue en GitHub Pages (Gratis en 1 click):
1. Ve a **Settings** > **Pages** en tu repositorio de GitHub.
2. En **Source**, selecciona `Deploy from a branch` y elige la rama `main` (carpeta `/root`).
3. Haz clic en **Save** y en segundos tu presentación estará online en `https://TU_USUARIO.github.io/TU_REPOSITORIO/`.

---

## 👥 Créditos y Producción

- **Producto & Tradición:** Estancia El Búho (Agua de Oro, Córdoba, Argentina - Desde 1948).
- **Dirección de Marketing, Expansión & Vinculación Regional:** Mysterik Producciones (Mendoza, Argentina).
- **Puntos Estratégicos & Alianzas Territoriales:**
  - Firma Torrent (Mercado Central / Godoy Cruz / Il Mercato Maipú - Desde 1922).
  - Bodega Martino Wines (Mayor Drummond, Luján de Cuyo - Patrimonio 1901 / Guía Michelin).
