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
    lienzo.append(
      svg('path', { d: `M24 ${y} H176`, class: 'cable' }),
      svg('path', { d: `M24 ${y} H176`, class: 'corriente', pathLength: '100' })
    );
    if (item.simbolo === 'amperimetro') {
      lienzo.append(
        svg('circle', { cx: 100, cy: y, r: 22, class: 'componente tapa-circulo' }),
        svg('text', { x: 100, y: y + 7, class: 'signo', 'text-anchor': 'middle' }, 'A')
      );
    } else {
      lienzo.append(...resistenciaH(40, y));
    }
    lienzo.append(
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


// ---------- Tipos agregados para las salas 3 a 15 ----------

const textoIncognita = (r) => `${r.etiqueta} = ?`;
const textoResuelto = (r) => `${r.etiqueta} = ${formatear(r.valor)} ${r.unidad}`;
const resueltos = (respuestas) => respuestas.map(textoResuelto);

// Sala 3: LEDs que forman un número binario
function binario(datos, respuestas) {
  const bits = datos.bits.split('');
  const n = bits.length;
  const paso = 64;
  const x0 = 260 - ((n - 1) * paso) / 2;
  const lienzo = nuevoLienzo(200, `Memoria con los LEDs ${datos.bits}`);
  lienzo.append(svg('path', { d: `M${x0 - 30} 30 H${x0 + (n - 1) * paso + 30}`, class: 'cable' }));
  bits.forEach((b, i) => {
    const x = x0 + i * paso;
    const peso = 2 ** (n - 1 - i);
    lienzo.append(
      svg('path', { d: `M${x} 30 V54`, class: 'cable' }),
      ...(b === '1' ? [svg('circle', { cx: x, cy: 70, r: 22, class: 'brillo-bit' })] : []),
      svg('circle', { cx: x, cy: 70, r: 15, class: b === '1' ? 'bit bit-1' : 'bit bit-0' }),
      svg('text', { x, y: 110, class: 'valor', 'text-anchor': 'middle' }, b),
      svg('text', { x, y: 132, class: 'peso', 'text-anchor': 'middle' }, String(peso))
    );
  });
  lienzo.append(incognita(260, 178, `${textoIncognita(respuestas[0])} en decimal`), chispa(400, 150));
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 4: resistencia con bandas de colores
const COLOR_BANDA = {
  negro: '#1d1d1f', marrón: '#8b4a1f', rojo: '#d63a2f', naranja: '#f08a24', amarillo: '#f2d13a',
  verde: '#2fa65a', azul: '#2f6fd6', violeta: '#8e4fd1', gris: '#8f969c', blanco: '#f2f2f2',
};

function colores(datos, respuestas) {
  const lienzo = nuevoLienzo(210, `Resistencia con bandas ${datos.bandas.join(', ')}`);
  lienzo.append(
    svg('path', { d: 'M30 80 H140 M380 80 H490', class: 'cable' }),
    svg('rect', { x: 140, y: 48, width: 240, height: 64, rx: 22, class: 'cuerpo-resistencia' })
  );
  datos.bandas.forEach((color, i) => {
    const x = 166 + i * 62;
    lienzo.append(
      svg('rect', { x, y: 48, width: 22, height: 64, fill: COLOR_BANDA[color], class: 'banda' }),
      svg('text', { x: x + 11, y: 138, class: 'peso', 'text-anchor': 'middle' }, color)
    );
  });
  lienzo.append(
    svg('rect', { x: 346, y: 48, width: 14, height: 64, class: 'banda banda-dorada' }),
    incognita(260, 188, textoIncognita(respuestas[0])),
    chispa(440, 40)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 5: rango de tolerancia sobre una recta numérica
function tolerancia(datos, respuestas) {
  const lienzo = nuevoLienzo(210, `Resistencia de ${datos.nominal} con tolerancia ${datos.tolerancia}`);
  lienzo.append(
    svg('path', { d: 'M140 44 H200 M320 44 H380', class: 'cable' }),
    ...resistenciaH(200, 44),
    svg('text', { x: 260, y: 86, class: 'valor', 'text-anchor': 'middle' }, `${datos.nominal}  ${datos.tolerancia}`),
    svg('rect', { x: 130, y: 128, width: 260, height: 12, class: 'rango' }),
    svg('path', { d: 'M60 134 H460 M130 122 V146 M260 122 V146 M390 122 V146', class: 'recta' }),
    svg('text', { x: 260, y: 118, class: 'peso', 'text-anchor': 'middle' }, datos.nominal),
    incognita(130, 176, textoIncognita(respuestas[0])),
    incognita(390, 176, textoIncognita(respuestas[1])),
    chispa(260, 150)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Salas 6, 10 y 12: fuente con una carga (lámpara o resistencia calefactora)
function lampara(datos, respuestas) {
  const esResistencia = datos.simbolo === 'resistencia';
  const lienzo = nuevoLienzo(200, `Circuito con ${esResistencia ? 'una resistencia calefactora' : 'una lámpara'}`);
  lienzo.append(
    svg('path', { d: 'M60 40 H460 V160 H60 Z', class: 'cable' }),
    svg('path', { d: 'M60 86 V40 H460 V160 H60 V114', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 100)
  );
  if (datos.fuente) lienzo.append(svg('text', { x: 98, y: 116, class: 'valor' }, datos.fuente));
  if (esResistencia) {
    lienzo.append(svg('circle', { cx: 460, cy: 100, r: 40, class: 'brillo brillo-calor' }), ...resistenciaV(460, 68));
  } else {
    lienzo.append(
      svg('circle', { cx: 460, cy: 100, r: 40, class: 'brillo brillo-lampara' }),
      svg('circle', { cx: 460, cy: 100, r: 22, class: 'componente tapa-circulo lamp' }),
      svg('path', { d: 'M445 85 L475 115 M475 85 L445 115', class: 'componente' })
    );
  }
  datos.datos.forEach((linea, i) => {
    lienzo.append(svg('text', { x: 420, y: 92 + i * 22, class: 'valor', 'text-anchor': 'end' }, linea));
  });
  lienzo.append(incognita(240, 108, textoIncognita(respuestas[0])), chispa(460, 20));
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 8: divisor de tensión
function divisor(datos, respuestas) {
  const lienzo = nuevoLienzo(230, `Divisor de tensión con ${datos.r1} y ${datos.r2}, alimentado con ${datos.fuente}`);
  lienzo.append(
    svg('path', { d: 'M60 30 H300 V200 H60 Z M300 118 H404 M300 200 H404 M408 118 H440 V138 M440 180 V200 H408', class: 'cable' }),
    svg('path', { d: 'M60 101 V30 H300 V200 H60 V129', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 115),
    svg('text', { x: 30, y: 120, class: 'valor', 'text-anchor': 'end' }, datos.fuente),
    ...resistenciaV(300, 44),
    ...resistenciaV(300, 128),
    svg('text', { x: 318, y: 82, class: 'valor' }, `R₁ = ${datos.r1}`),
    svg('text', { x: 318, y: 166, class: 'valor' }, `R₂ = ${datos.r2}`),
    svg('circle', { cx: 404, cy: 118, r: 4, class: 'borne' }),
    svg('circle', { cx: 404, cy: 200, r: 4, class: 'borne' }),
    svg('circle', { cx: 440, cy: 159, r: 21, class: 'componente tapa-circulo' }),
    svg('text', { x: 440, y: 166, class: 'signo', 'text-anchor': 'middle' }, 'V'),
    incognita(190, 122, textoIncognita(respuestas[0])),
    chispa(440, 96)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 9: transformador con dos bobinados
function bobina(x, hacia) {
  let d = `M${x} 60`;
  for (let i = 0; i < 4; i++) d += ` a12.5 12.5 0 0 ${hacia} 0 25`;
  return svg('path', { d, class: 'componente bobina' });
}

function transformador(datos, respuestas) {
  const lienzo = nuevoLienzo(250, 'Transformador con bobinado primario y secundario');
  lienzo.append(
    svg('path', { d: 'M70 88 V60 H200 M200 160 H70 V132 M320 60 H440 M320 160 H440', class: 'cable' }),
    svg('path', { d: 'M70 88 V60 H200 V160 H70 V132', class: 'corriente', pathLength: '100' }),
    svg('path', { d: 'M440 60 H320 V160 H440', class: 'corriente', pathLength: '100' }),
    svg('circle', { cx: 70, cy: 110, r: 22, class: 'componente tapa-circulo' }),
    svg('path', { d: 'M58 110 q6 -12 12 0 t12 0', class: 'componente' }),
    bobina(200, 1),
    bobina(320, 0),
    svg('path', { d: 'M252 50 V170 M268 50 V170', class: 'nucleo' }),
    svg('circle', { cx: 444, cy: 60, r: 4, class: 'borne' }),
    svg('circle', { cx: 444, cy: 160, r: 4, class: 'borne' }),
    svg('text', { x: 135, y: 200, class: 'valor', 'text-anchor': 'middle' }, 'Primario'),
    svg('text', { x: 385, y: 200, class: 'valor', 'text-anchor': 'middle' }, 'Secundario')
  );
  datos.izquierda.forEach((t, i) =>
    lienzo.append(svg('text', { x: 135, y: 222 + i * 20, class: 'valor', 'text-anchor': 'middle' }, t)));
  datos.derecha.forEach((t, i) =>
    lienzo.append(svg('text', { x: 385, y: 222 + i * 20, class: 'valor', 'text-anchor': 'middle' }, t)));
  lienzo.setAttribute('viewBox', '0 0 520 290');
  lienzo.append(incognita(385, 222 + datos.derecha.length * 20 + 6, textoIncognita(respuestas[0])), chispa(260, 4));
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 11: pantalla del osciloscopio con la recta V-I
function graficoVI(datos, respuestas) {
  const [[v1, i1], [v2, i2]] = datos.puntos;
  const vMax = v2 * 1.25;
  const iMax = i2 * 1.25;
  const X = (v) => 70 + (v / vMax) * 400;
  const Y = (i) => 190 - (i / iMax) * 160;
  const lienzo = nuevoLienzo(230, `Recta tensión-corriente que pasa por (${v1} V; ${i1} A) y (${v2} V; ${i2} A)`);
  lienzo.append(
    svg('rect', { x: 60, y: 20, width: 420, height: 180, rx: 8, class: 'pantalla-osc' }),
    svg('path', { d: 'M70 190 H470 M70 190 V30', class: 'eje' }),
    svg('text', { x: 474, y: 194, class: 'peso' }, 'V'),
    svg('text', { x: 66, y: 26, class: 'peso', 'text-anchor': 'end' }, 'I'),
    svg('path', { d: `M${X(0)} ${Y(0)} L${X(vMax)} ${Y(iMax)}`, class: 'traza' })
  );
  [[v1, i1], [v2, i2]].forEach(([v, i], k) => {
    const rotulo = `(${formatear(v)} V; ${formatear(i)} A)`;
    lienzo.append(
      svg('path', { d: `M${X(v)} ${Y(i)} V190 M${X(v)} ${Y(i)} H70`, class: 'guia' }),
      svg('circle', { cx: X(v), cy: Y(i), r: 5, class: 'punto' }),
      k === 0
        ? svg('text', { x: X(v) + 10, y: Y(i) + 20, class: 'valor' }, rotulo)
        : svg('text', { x: X(v) - 10, y: Y(i) - 12, class: 'valor', 'text-anchor': 'end' }, rotulo)
    );
  });
  lienzo.append(incognita(90, 58, textoIncognita(respuestas[0]), 'start'), chispa(400, 30));
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 13: puente de Wheatstone
function cajaResistencia(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const g = svg('g', { transform: `translate(${cx} ${cy}) rotate(${ang})` });
  g.append(svg('rect', { x: -24, y: -9, width: 48, height: 18, rx: 2, class: 'componente caja resistencia' }));
  return g;
}

function puente(datos, respuestas) {
  const lienzo = nuevoLienzo(240, `Puente de Wheatstone con R₁ = ${datos.r1}, R₂ = ${datos.r2} y R₃ = ${datos.r3}`);
  const A = [260, 30], I = [150, 120], D = [370, 120], B = [260, 210];
  lienzo.append(
    svg('path', { d: `M60 30 H260 L370 120 L260 210 H60 Z M260 30 L150 120 L260 210 M150 120 H238 M282 120 H370`, class: 'cable' }),
    svg('path', { d: 'M60 106 V30 H260 L370 120 L260 210 H60 V134', class: 'corriente', pathLength: '100' }),
    svg('path', { d: 'M260 30 L150 120 L260 210', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 120),
    cajaResistencia(...A, ...I),
    cajaResistencia(...I, ...B),
    cajaResistencia(...A, ...D),
    cajaResistencia(...D, ...B),
    svg('circle', { cx: 260, cy: 120, r: 20, class: 'componente tapa-circulo' }),
    svg('text', { x: 260, y: 127, class: 'signo', 'text-anchor': 'middle' }, 'G'),
    svg('text', { x: 186, y: 62, class: 'valor', 'text-anchor': 'end' }, `R₁ = ${datos.r1}`),
    svg('text', { x: 186, y: 190, class: 'valor', 'text-anchor': 'end' }, `R₂ = ${datos.r2}`),
    svg('text', { x: 334, y: 62, class: 'valor' }, `R₃ = ${datos.r3}`),
    incognita(334, 196, textoIncognita(respuestas[0]), 'start'),
    chispa(260, 66)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 14: señal senoidal
function senoidal(datos, respuestas) {
  const lienzo = nuevoLienzo(240, `Señal senoidal de período ${datos.periodo} y valor máximo ${datos.vmax}`);
  const x0 = 80, ancho = 320, y0 = 110, amp = 70;
  let d = '';
  for (let a = 0; a <= 450; a += 5) {
    const x = x0 + (a / 360) * ancho;
    const y = y0 - amp * Math.sin((a * Math.PI) / 180);
    d += `${a ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  const px = x0 + (datos.angulo / 360) * ancho;
  const py = y0 - amp * Math.sin((datos.angulo * Math.PI) / 180);
  lienzo.append(
    svg('rect', { x: 50, y: 20, width: 440, height: 210, rx: 8, class: 'pantalla-osc' }),
    svg('path', { d: `M${x0} ${y0} H480 M${x0} 30 V190`, class: 'eje' }),
    svg('path', { d: `M${x0} ${y0 - amp} H480`, class: 'guia' }),
    svg('text', { x: x0 - 8, y: y0 - amp + 5, class: 'valor', 'text-anchor': 'end' }, datos.vmax),
    svg('path', { d, class: 'traza' }),
    svg('path', { d: `M${x0} 206 H${x0 + ancho} M${x0} 198 V214 M${x0 + ancho} 198 V214`, class: 'eje' }),
    svg('text', { x: x0 + ancho / 2, y: 200, class: 'valor', 'text-anchor': 'middle' }, `T = ${datos.periodo}`),
    svg('path', { d: `M${px} ${py} V${y0}`, class: 'guia' }),
    svg('circle', { cx: px, cy: py, r: 5, class: 'punto' }),
    svg('text', { x: px + 6, y: y0 + 18, class: 'peso' }, `${datos.angulo}°`),
    incognita(476, 176, textoIncognita(respuestas[0]), 'end'),
    incognita(92, 176, textoIncognita(respuestas[1]), 'start'),
    chispa(300, 150)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

// Sala 15: la corriente se reparte entre dos ramas
function kirchhoff(datos, respuestas) {
  const lienzo = nuevoLienzo(220, `Corriente de ${datos.total} repartida entre ramas de ${datos.r1} y ${datos.r2}`);
  lienzo.append(
    svg('path', { d: 'M60 40 H400 V180 H60 Z M280 40 V180', class: 'cable' }),
    svg('path', { d: 'M60 96 V40 H400 V180 H60 V124', class: 'corriente', pathLength: '100' }),
    svg('path', { d: 'M280 40 V180', class: 'corriente', pathLength: '100' }),
    ...bateria(60, 110),
    svg('path', { d: 'M150 40 m-8 -7 l10 7 l-10 7', class: 'flecha' }),
    svg('text', { x: 170, y: 28, class: 'valor', 'text-anchor': 'middle' }, `I = ${datos.total}`),
    ...resistenciaV(280, 78),
    ...resistenciaV(400, 78),
    svg('text', { x: 262, y: 115, class: 'valor', 'text-anchor': 'end' }, datos.r1),
    svg('text', { x: 418, y: 115, class: 'valor' }, datos.r2),
    incognita(262, 172, textoIncognita(respuestas[0]), 'end'),
    incognita(418, 172, textoIncognita(respuestas[1]), 'start'),
    chispa(340, 50)
  );
  return { el: lienzo, textosResueltos: resueltos(respuestas) };
}

const TIPOS = {
  'serie-led': serieLed, conversion, paralelo, binario, colores, tolerancia, lampara,
  divisor, transformador, 'grafico-vi': graficoVI, puente, senoidal, kirchhoff,
};

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
