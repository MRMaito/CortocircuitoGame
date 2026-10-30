// Top 10 guardado en el navegador. Si localStorage no está disponible, el juego sigue sin ranking.

const CLAVE = 'cortocircuito-ranking';
const MAXIMO = 10;

export function cargarRanking() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) || '[]');
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function guardarEnRanking({ nombre, puntaje, tiempo, salas }) {
  const ranking = cargarRanking();
  ranking.push({
    nombre: (nombre || 'Anónimo').trim().slice(0, 20),
    puntaje,
    tiempo,
    salas,
    fecha: new Date().toISOString().slice(0, 10),
  });
  ranking.sort((a, b) => b.puntaje - a.puntaje || a.tiempo - b.tiempo);
  const top = ranking.slice(0, MAXIMO);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(top));
  } catch {
    // sin almacenamiento: devolvemos el ranking igual para mostrarlo
  }
  return top;
}
