// Ohmi, el robot de soldadura que guía al jugador: sus frases y sus caras.

const FRASES = {
  inicio: [
    '¡Bzzt! Soy Ohmi. Si me necesitás, pedime una pista.',
    'Tranqui, que de peores cortocircuitos salimos.',
  ],
  acierto: [
    '¡Contacto perfecto! Esa soldadura quedó impecable.',
    '¡Se hizo la luz! Bueno, un poquito de luz.',
    'Ni el multímetro lo hubiera medido mejor.',
  ],
  // Primer error de la sala: Ohmi duda
  duda: [
    'Mmm... eso no me cierra. Revisá el despeje.',
    '¿Seguro? Fijate bien las unidades.',
    'Casi. Mirá de nuevo la ficha técnica.',
  ],
  // Errores siguientes: Ohmi se enoja
  enojo: [
    '¡Chispazo! Eso te costó 15 segundos de batería.',
    '¡Otra vez no! Huele a resistencia quemada.',
    '¡Bzzzt! Así me vas a fundir los circuitos.',
  ],
  pista: ['Dejame pensar... '],
  sinPistas: ['No me quedan más pistas para esta sala. ¡Vos podés!'],
  nuevaSala: ['Nueva sala, nuevo tablero. ¡A trabajar!', 'Abrimos la puerta. Lo que sigue es más difícil.'],
  pocoTiempo: ['¡Queda menos de un minuto de batería! ¡Rápido!'],
};

export function fraseDeOhmi(tipo) {
  const lista = FRASES[tipo] || FRASES.inicio;
  return lista[Math.floor(Math.random() * lista.length)];
}

// ---------- Caras ----------
// Cada cara es un SVG de 64 × 64 con dos ojos (centros en x = 22 y x = 42) y, a veces, cejas.

const OJO = (x, y = 32, alto = 18) =>
  `<rect class="ojo" x="${x - 5}" y="${y - alto / 2}" width="10" height="${alto}" rx="5"/>`;

const CARAS = {
  neutral: `<g class="parpadeo">${OJO(22)}${OJO(42)}</g>`,

  feliz: `
    <path class="trazo" d="M15 35 Q22 24 29 35"/>
    <path class="trazo" d="M35 35 Q42 24 49 35"/>`,

  enojado: `
    <path class="ojo" d="M17 30 L27 34 L27 40 Q22 44 17 40 Z"/>
    <path class="ojo" d="M47 30 L37 34 L37 40 Q42 44 47 40 Z"/>
    <path class="trazo" d="M14 21 L29 28"/>
    <path class="trazo" d="M50 21 L35 28"/>`,

  confundido: `
    <g class="parpadeo">${OJO(22, 33, 18)}</g>
    <path class="trazo" d="M36 34 H48"/>
    <path class="trazo" d="M15 18 Q22 13 29 18"/>
    <path class="trazo" d="M36 26 L48 23"/>
    <text class="signo-cara" x="53" y="16">?</text>`,

  sorprendido: `
    <circle class="ojo" cx="22" cy="33" r="8"/>
    <circle class="ojo" cx="42" cy="33" r="8"/>
    <path class="trazo" d="M14 18 Q22 12 30 18"/>
    <path class="trazo" d="M34 18 Q42 12 50 18"/>`,

  pensando: `
    <g class="mirar-arriba">${OJO(25, 28, 14)}${OJO(45, 28, 14)}</g>
    <path class="trazo" d="M36 17 L48 14"/>
    <circle class="punto-cara" cx="52" cy="50" r="2"/>
    <circle class="punto-cara" cx="57" cy="44" r="2.5"/>`,

  triste: `
    <rect class="ojo" x="17" y="34" width="10" height="11" rx="5"/>
    <rect class="ojo" x="37" y="34" width="10" height="11" rx="5"/>
    <path class="trazo" d="M14 29 L28 24"/>
    <path class="trazo" d="M50 29 L36 24"/>`,
};

export const EXPRESIONES = Object.keys(CARAS);

// Cambia la cara de Ohmi. Devuelve la expresión que quedó puesta.
export function ponerCara(contenedor, expresion) {
  const cara = CARAS[expresion] ? expresion : 'neutral';
  if (contenedor.dataset.cara === cara) return cara;
  contenedor.dataset.cara = cara;
  contenedor.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true">${CARAS[cara]}</svg>`;
  contenedor.classList.remove('cambio');
  void contenedor.offsetWidth; // reinicia la animación del cambio de cara
  contenedor.classList.add('cambio');
  return cara;
}
