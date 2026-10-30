// Dibuja el circuito de cada sala como un esquema animado.
// Cada tipo de esquema es una función que recibe los datos del desafío y devuelve el SVG.
// Si un desafío no tiene "esquema", la sala se juega igual, sin dibujo.

const NS = 'http://www.w3.org/2000/svg';

function svg(etiqueta, atributos = {}, texto) {
  const el = document.createElementNS(NS, etiqueta);
  for (const [clave, valor] of Object.entries(atributos)) el.setAttribute(clave, valor);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// Fuente → resistencia → LED, en serie. Usado en la sala 1.
function serieLed(datos, respuestas) {
  const lienzo = svg('svg', { viewBox: '0 0 520 200', class: 'esquema', role: 'img' });
  lienzo.setAttribute('aria-label', `Circuito en serie: fuente de ${datos.fuente}, resistencia desconocida y LED`);

  const recorrido = 'M60 86 V40 H460 V160 H60 V114';

  lienzo.append(
    svg('path', { d: 'M60 40 H460 V160 H60 Z', class: 'cable' }),
    svg('path', { d: recorrido, class: 'corriente', pathLength: '100' }),

    // Fuente (batería)
    svg('rect', { x: 54, y: 93, width: 12, height: 14, class: 'tapa' }),
    svg('line', { x1: 38, y1: 92, x2: 82, y2: 92, class: 'componente' }),
    svg('line', { x1: 48, y1: 108, x2: 72, y2: 108, class: 'componente grueso' }),
    svg('text', { x: 92, y: 88, class: 'signo' }, '+'),
    svg('text', { x: 98, y: 116, class: 'valor' }, datos.fuente),

    // Resistencia
    svg('rect', { x: 199, y: 37, width: 122, height: 6, class: 'tapa' }),
    svg('polyline', {
      points: '200,40 210,27 228,53 246,27 264,53 282,27 300,53 312,40 320,40',
      class: 'componente resistencia',
    }),
    svg('text', { x: 260, y: 86, class: 'incognita', 'text-anchor': 'middle', 'data-rol': 'etiqueta-r' },
      `${respuestas[0].etiqueta} = ?`),

    // LED
    svg('circle', { cx: 460, cy: 100, r: 34, class: 'brillo' }),
    svg('rect', { x: 455, y: 83, width: 10, height: 33, class: 'tapa' }),
    svg('polygon', { points: '442,84 478,84 460,112', class: 'componente led' }),
    svg('line', { x1: 442, y1: 114, x2: 478, y2: 114, class: 'componente' }),
    svg('path', { d: 'M486 92 l14 -10 M490 106 l14 -10', class: 'rayos' }),
    ...datos.led.map((linea, i) =>
      svg('text', { x: 444, y: 140 + i * 18, class: 'valor', 'text-anchor': 'end' }, linea)
    ),

    // Chispa (aparece en los errores)
    svg('path', {
      d: 'M260 4 l-8 14 h10 l-6 14 M248 10 l-8 -6 M272 10 l8 -6',
      class: 'chispa',
    })
  );

  return {
    el: lienzo,
    resolver() {
      const r = respuestas[0];
      lienzo.querySelector('[data-rol="etiqueta-r"]').textContent =
        `${r.etiqueta} = ${r.valor.toLocaleString('es-AR')} ${r.unidad}`;
      lienzo.classList.add('encendido');
    },
  };
}

const TIPOS = { 'serie-led': serieLed };

export function dibujarEsquema(desafio) {
  const datos = desafio.esquema;
  const tipo = datos && TIPOS[datos.tipo];
  if (!tipo) return null;

  const esquema = tipo(datos, desafio.respuestas);
  esquema.chispa = () => {
    esquema.el.classList.remove('falla');
    void esquema.el.getBoundingClientRect(); // reinicia la animación
    esquema.el.classList.add('falla');
  };
  return esquema;
}
