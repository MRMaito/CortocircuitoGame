// Validación de respuestas numéricas.
// Acepta coma o punto decimal, espacios y una unidad escrita al final ("350 Ω", "0,4A").

export function parsearNumero(texto) {
  if (texto === null || texto === undefined) return NaN;
  const limpio = String(texto).trim().replace(/\s+/g, '').replace(',', '.');
  const coincidencia = limpio.match(/^[-+]?(\d+\.?\d*|\.\d+)/);
  if (!coincidencia) return NaN;
  return Number(coincidencia[0]);
}

// tolerancia relativa: 0.01 = ±1 % del valor esperado
export function esCorrecta(texto, esperado, tolerancia = 0.01) {
  const valor = parsearNumero(texto);
  if (Number.isNaN(valor)) return false;
  if (esperado === 0) return Math.abs(valor) <= tolerancia;
  return Math.abs(valor - esperado) <= Math.abs(esperado) * tolerancia;
}
