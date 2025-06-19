/* sky.js – steuert den Tagesablauf-Himmel */

(() => {
  // ---------- Konstanten ----------

  // CSS-Wurzelknoten für setProperty
  const root = document.documentElement;

  // Keyframes mit Startpunkt (0–1) und Farben
  const phases = [
    { start: 0.00, top: '#ffb474', bot: '#ffe4b0' }, // Morgen
    { start: 0.25, top: '#7ecfff', bot: '#c0e8ff' }, // Mittag
    { start: 0.50, top: '#ff9e8a', bot: '#626dd1' }, // Abend
    { start: 0.75, top: '#041036', bot: '#000421' }  // Nacht
  ];

  // ---------- Hilfsfunktionen ----------

  const lerp = (a, b, t) => a + (b - a) * t;

  // mischt zwei #rrggbb-Farben linear (RGB)
  function mix(c1, c2, t) {
    const n1 = parseInt(c1.slice(1), 16);
    const n2 = parseInt(c2.slice(1), 16);
    const r = lerp(n1 >> 16 & 255, n2 >> 16 & 255, t);
    const g = lerp(n1 >> 8  & 255, n2 >> 8  & 255, t);
    const b = lerp(n1       & 255, n2       & 255, t);
    return `rgb(${r | 0} ${g | 0} ${b | 0})`;
  }

  // ---------- Hauptfunktion ----------

  function update() {
    // Gesamt-Scrollbereich
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    // Fortschritt 0–1
    const p = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;

    // aktive Keyframe-Sektion finden
    const idx = phases.findIndex((ph, i) => p < (phases[i + 1]?.start ?? 1));
    const a = phases[idx];
    const b = phases[(idx + 1) % phases.length];
    const t = (p - a.start) / ((b.start - a.start) || 1);

    // Farbverlauf schreiben
    root.style.setProperty('--sky-top', mix(a.top, b.top, t));
    root.style.setProperty('--sky-bot', mix(a.bot, b.bot, t));

    // Nacht-Progress für Stern-Opacity
    root.style.setProperty('--night', p);
  }

  // ---------- Initialisierung ----------

  update(); // gleich beim Laden
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();