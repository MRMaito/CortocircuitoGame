// Frases de Ohmi, el robot de soldadura que guía al jugador.

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
  error: [
    '¡Chispazo! Eso te costó 15 segundos de batería.',
    'Huele a resistencia quemada... probá de nuevo.',
    'Casi. Revisá el despeje, que la fórmula no miente.',
  ],
  sinPistas: ['No me quedan más pistas para esta sala. ¡Vos podés!'],
};

export function fraseDeOhmi(tipo) {
  const lista = FRASES[tipo] || FRASES.inicio;
  return lista[Math.floor(Math.random() * lista.length)];
}
