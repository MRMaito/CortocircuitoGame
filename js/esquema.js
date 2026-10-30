// Dibuja el circuito de cada sala como un esquema animado.
// Cada tipo de esquema es una función que recibe los datos del desafío y devuelve el SVG.
// Si un desafío no tiene "esquema" o su tipo no existe acá, la sala se juega igual, sin dibujo.

const NS = 'http://www.w3.org/2000/svg';

function svg(etiqueta, atributos = {}, texto) {
  const el = document.createElementNS(NS, etiqueta);
  for (const [clave, valor] of Object.entries(atributos)) el.setAttribute(clave, valor);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

const formatear = (n) => n.toLocaleString('es-AR');

// ---------- Piezas reutilizables ----------

// Resistencia horizontal de 120 de ancho, empezando en x0, sobre la línea y
function resistenciaH(x0, y) {
  const pts = [[x0, y], [x0 + 10, y - 13]];
  for (let i = 0; i < 5; i++) pts.push([x0 + 28 + i * 18, i % 2 ? y - 13 : y + 13]);
  pts.push([x0 + 112, y], [x0 + 120, y]);
  return [
    svg('rect', { x: x0 - 1, y: y - 3, width: 122, height: 6, class: 'tapa' }),
    svg('polyline', { points: pts.map((p) => p.join(',')).join(' '), class: 'componente resistencia' }),
  ];
}

// Resistencia vertical de 64 de alto, empezando en y0, sobre la línea x
function resistenciaV(x, y0) {
  const pts = [[x, y0], [x - 12, y0 + 6]];
  for (let i = 0; i < 5; i++) pts.push([i % 2 ? x - 12 : x + 12, y0 + 16 + i * 10]);
  pts.push([x, y0 + 64]);
  return [
    svg('rect', { x: x - 3, y: y0 - 1, width: 6, height: 66, class: 'tapa' }),
    svg('polyline', { points: pts.map((p) => p.join(',')).join(' '), class: 'componente resistencia' }),
  ];
}

// Batería vertical centrada en (x, y)
function bateria(x, y) {
  return [
    svg('rect', { x: x - 6, y: y - 7, width: 12, height: 14, class: 'tapa' }),
    svg('line', { x1: x - 22, y1: y - 8, x2: x + 22, y2: y - 8, class: 'componente' }),
    svg('line', { x1: x - 12, y1: y + 8, x2: x + 12, y2: y + 8, class: 'componente grueso' }),
    svg('text', { x: x + 32, y: y - 12, class: 'signo' }, '+'),
  ];
}

function chispa(x, y) {
  return svg('path', {
    d: `M${x} ${y} l-8 14 h10 l-6 14 M${x - 12} ${y + 6} l-8 -6 M${x + 12} ${y + 6} l8 -6`,
    class: 'chispa',
  });
}

function incognita(x, y, texto, anchor = 'middle') {
  return svg('text', { x, y, class: 'incognita', 'text-anchor': anchor, 'data-rol': 'incognita' }, texto);
}

function nuevoLienzo(alto, etiqueta) {
  const lienzo = svg('svg', { viewBox: `0 0 520 ${alto}`, class: 'esquema', role: 'img' });
  lienzo.setAttribute('aria-label', etiqueta);
  return lienzo;
}

// ---------- Tipos de esquema ----------

// Sala 1: fuente → resistencia → LED, en serie
function serieLed(datos, respuestas) {
  const lienzo = nuevoLienzo(200, `Circuito en serie: fuente de ${datos.fuente}, resistencia desconocida y LED`);
  const r = respuestas[0];

  lienzo.append(
    svg('path', { d: 'M60 40 H460 V160 H60 Z', class: 'cable' }),
    svg('path', { d: 'M60 86 V40 H460 V160 H60 V114', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 100),
    svg('text', { x: 98, y: 116, class: 'valor' }, datos.fuente),
    ...resistenciaH(200, 40),
    incognita(260, 86, `${r.etiqueta} = ?`),
    svg('circle', { cx: 460, cy: 100, r: 34, class: 'brillo' }),
    svg('rect', { x: 455, y: 83, width: 10, height: 33, class: 'tapa' }),
    svg('polygon', { points: '442,84 478,84 460,112', class: 'componente led' }),
    svg('line', { x1: 442, y1: 114, x2: 478, y2: 114, class: 'componente' }),
    svg('path', { d: 'M486 92 l14 -10 M490 106 l14 -10', class: 'rayos' }),
    ...datos.led.map((linea, i) =>
      svg('text', { x: 444, y: 140 + i * 18, class: 'valor', 'text-anchor': 'end' }, linea)
    ),
    chispa(260, 4)
  );

  return {
    el: lienzo,
    textosResueltos: [`${r.etiqueta} = ${formatear(r.valor)} ${r.unidad}`],
  };
}

// Sala 2: cada componente con su valor rotulado y la conversión pedida al lado
function conversion(datos, respuestas) {
  const lienzo = nuevoLienzo(200, 'Componentes del cajón con sus valores a convertir');
  const filas = [60, 148];

  datos.items.forEach((item, i) => {
    const y = filas[i];
    const r = respuestas[i];
    lienzo.append(svg('path', { d: `M24 ${y} H176`, class: 'cable' }));
    if (item.simbolo === 'amperimetro') {
      lienzo.append(
        svg('circle', { cx: 100, cy: y, r: 22, class: 'componente tapa-circulo' }),
        svg('text', { x: 100, y: y + 7, class: 'signo', 'text-anchor': 'middle' }, 'A')
      );
    } else {
      lienzo.append(...resistenciaH(40, y));
    }
    lienzo.append(
      svg('path', { d: `M24 ${y} H176`, class: 'corriente', pathLength: '100' }),
      svg('text', { x: 100, y: y - 30, class: 'valor', 'text-anchor': 'middle' }, item.desde),
      svg('path', { d: `M210 ${y} H290 M280 ${y - 8} l10 8 l-10 8`, class: 'flecha' }),
      incognita(312, y + 7, `${r.etiqueta} = ? ${r.unidad}`, 'start')
    );
  });
  lienzo.append(chispa(250, 82));

  return {
    el: lienzo,
    textosResueltos: respuestas.map((r) => `${r.etiqueta} = ${formatear(r.valor)} ${r.unidad}`),
  };
}

// Sala 3: dos resistencias en paralelo, con una en serie opcional
function paralelo(datos, respuestas) {
  const conSerie = Boolean(datos.serie);
  const lienzo = nuevoLienzo(
    220,
    `Resistencias de ${datos.r1} y ${datos.r2} en paralelo${conSerie ? `, en serie con ${datos.serie}` : ''}`
  );
  const r = respuestas[0];

  lienzo.append(
    svg('path', { d: 'M60 40 H460 V180 H60 Z M380 40 V180', class: 'cable' }),
    svg('path', { d: 'M60 96 V40 H460 V180 H60 V124', class: 'corriente', pathLength: '100' }),
    svg('path', { d: 'M380 40 V180', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 110),
    ...resistenciaV(380, 78),
    ...resistenciaV(460, 78),
    svg('text', { x: 358, y: 115, class: 'valor', 'text-anchor': 'end' }, datos.r1),
    svg('text', { x: 482, y: 115, class: 'valor' }, datos.r2),
    incognita(220, conSerie ? 128 : 116, `${r.etiqueta} equivalente = ?`),
    chispa(220, 140)
  );
  if (conSerie) {
    lienzo.append(...resistenciaH(160, 40), svg('text', { x: 220, y: 78, class: 'valor', 'text-anchor': 'middle' }, datos.serie));
  }

  return {
    el: lienzo,
    textosResueltos: [`${r.etiqueta} equivalente = ${formatear(r.valor)} ${r.unidad}`],
  };
}

const TIPOS = { 'serie-led': serieLed, conversion, paralelo };

export function dibujarEsquema(desafio) {
  const datos = desafio.esquema;
  const tipo = datos && TIPOS[datos.tipo];
  if (!tipo) return null;

  const { el, textosResueltos } = tipo(datos, desafio.respuestas);
  return {
    el,
    resolver() {
      el.querySelectorAll('[data-rol="incognita"]').forEach((t, i) => (t.textContent = textosResueltos[i]));
      el.classList.add('encendido');
    },
    chispa() {
      el.classList.remove('falla');
      void el.getBoundingClientRect(); // reinicia la animación
      el.classList.add('falla');
    },
  };
}
