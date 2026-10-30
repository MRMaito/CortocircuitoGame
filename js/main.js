// Arranque del juego y navegación entre pantallas.

import { Juego, CONFIG, formatearTiempo } from './juego.js';
import { dibujarSala } from './sala.js';
import { fraseDeOhmi } from './ohmi.js';
import { cargarRanking, guardarEnRanking } from './ranking.js';

const $ = (id) => document.getElementById(id);

const ui = {
  pantallas: {
    inicio: $('pantalla-inicio'),
    juego: $('pantalla-juego'),
    final: $('pantalla-final'),
  },
  jugar: $('boton-jugar'),
  errorCarga: $('error-carga'),
  tiempo: $('hud-tiempo'),
  carga: $('bateria-carga'),
  leds: $('hud-leds'),
  puntaje: $('hud-puntaje'),
  contenedorSala: $('contenedor-sala'),
  ohmi: $('ohmi-texto'),
  pista: $('boton-pista'),
  siguiente: $('boton-siguiente'),
  finalTitulo: $('final-titulo'),
  finalMensaje: $('final-mensaje'),
  finalPuntaje: $('final-puntaje'),
  finalTiempo: $('final-tiempo'),
  finalSalas: $('final-salas'),
  formRanking: $('form-ranking'),
  nombre: $('nombre-jugador'),
  listaRanking: $('lista-ranking'),
  reiniciar: $('boton-reiniciar'),
};

let juego = null;
let vistaSala = null;
let intervalo = null;
let tipeo = null;

const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)');

function mostrarPantalla(nombre) {
  Object.entries(ui.pantallas).forEach(([clave, el]) => el.classList.toggle('activa', clave === nombre));
}

// Ohmi escribe letra por letra; con movimiento reducido, aparece de una.
function decirOhmi(texto) {
  clearInterval(tipeo);
  if (sinMovimiento.matches) {
    ui.ohmi.textContent = texto;
    return;
  }
  ui.ohmi.setAttribute('aria-label', texto);
  let i = 0;
  ui.ohmi.textContent = '';
  tipeo = setInterval(() => {
    i += 2;
    ui.ohmi.textContent = texto.slice(0, i);
    if (i >= texto.length) clearInterval(tipeo);
  }, 18);
}

function prepararLeds() {
  ui.leds.replaceChildren(
    ...juego.salas.map((s) => {
      const li = document.createElement('li');
      li.title = `Sala ${s.numero}: ${s.nombre}`;
      return li;
    })
  );
}

// --luz va de 0 (laboratorio a oscuras) a 1 (toda la energía restaurada)
function iluminar(valor) {
  document.body.style.setProperty('--luz', valor.toFixed(2));
}

function actualizarHud() {
  ui.tiempo.textContent = formatearTiempo(juego.restante);
  ui.tiempo.classList.toggle('critico', juego.restante <= 60);
  ui.puntaje.textContent = juego.puntaje;
  const carga = juego.restante / CONFIG.duracion;
  ui.carga.style.width = `${carga * 100}%`;
  ui.carga.dataset.nivel = carga <= 0.1 ? 'critico' : carga <= 0.3 ? 'bajo' : 'normal';
  [...ui.leds.children].forEach((led, i) => {
    led.classList.toggle('resuelta', i < juego.salasSuperadas);
    led.classList.toggle('actual', i === juego.indice && !juego.resuelta);
  });
  iluminar(juego.salasSuperadas / juego.salas.length);
}

function actualizarBotonPista() {
  const usadas = juego.pistasUsadas;
  const total = juego.desafio.pistas?.length ?? 0;
  const costo = CONFIG.costoPistas[usadas];
  ui.pista.disabled = usadas >= total || juego.resuelta;
  ui.pista.textContent = usadas >= total ? 'Sin pistas' : `Pedir pista (−${costo})`;
}

function cargarSala() {
  vistaSala = dibujarSala(ui.contenedorSala, juego.sala, juego.desafio, juego.salas.length);
  vistaSala.formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    responder();
  });
  ui.siguiente.hidden = true;
  actualizarBotonPista();
  actualizarHud();
}

function responder() {
  const resultado = juego.responder(vistaSala.obtenerValores());
  if (!resultado) return;
  vistaSala.marcar(resultado.correctas);

  if (resultado.correcto) {
    vistaSala.bloquear();
    vistaSala.esquema?.resolver();
    decirOhmi(`${fraseDeOhmi('acierto')} +${resultado.puntos} puntos.`);
    ui.siguiente.hidden = false;
    ui.siguiente.textContent = juego.indice + 1 < juego.salas.length ? 'Abrir la puerta' : 'Salir del laboratorio';
    ui.siguiente.focus();
    actualizarBotonPista();
  } else {
    vistaSala.esquema?.chispa();
    ui.contenedorSala.classList.remove('sacudir');
    void ui.contenedorSala.offsetWidth; // reinicia la animación
    ui.contenedorSala.classList.add('sacudir');
    decirOhmi(fraseDeOhmi('error'));
    if (resultado.sinTiempo) return terminar();
  }
  actualizarHud();
}

function pedirPista() {
  const pista = juego.pedirPista();
  if (!pista) return decirOhmi(fraseDeOhmi('sinPistas'));
  decirOhmi(`Pista (−${pista.costo}): ${pista.texto}`);
  actualizarBotonPista();
}

function siguienteSala() {
  juego.siguienteSala();
  if (juego.terminado) return terminar();
  cargarSala();
  decirOhmi('Nueva sala, nuevo tablero. ¡A trabajar!');
}

function iniciar(salas) {
  document.body.classList.remove('apagon');
  juego = new Juego(salas);
  juego.iniciar();
  mostrarPantalla('juego');
  prepararLeds();
  cargarSala();
  decirOhmi(fraseDeOhmi('inicio'));
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    const sinTiempo = juego.tick();
    actualizarHud();
    if (sinTiempo) terminar();
  }, 1000);
}

function terminar() {
  clearInterval(intervalo);
  const escapo = juego.escapo;
  document.body.classList.toggle('apagon', !escapo);
  ui.finalTitulo.textContent = escapo ? '¡Escapaste del laboratorio!' : 'Se agotó la batería';
  ui.finalMensaje.textContent = escapo
    ? 'Restauraste toda la energía y las puertas se abrieron. Buen trabajo, técnico/a.'
    : 'El laboratorio quedó a oscuras. Revisá las fichas técnicas y volvé a intentarlo.';
  ui.finalPuntaje.textContent = juego.puntaje;
  ui.finalTiempo.textContent = formatearTiempo(juego.tiempoUsado);
  ui.finalSalas.textContent = `${juego.salasSuperadas} de ${juego.salas.length}`;
  ui.formRanking.hidden = false;
  mostrarRanking(cargarRanking());
  mostrarPantalla('final');
  ui.nombre.focus();
}

function mostrarRanking(ranking) {
  ui.listaRanking.replaceChildren(
    ...(ranking.length
      ? ranking.map((r) => {
          const li = document.createElement('li');
          li.textContent = `${r.nombre} — ${r.puntaje} pts · ${formatearTiempo(r.tiempo)}`;
          return li;
        })
      : [Object.assign(document.createElement('li'), { className: 'vacio', textContent: 'Todavía no hay partidas guardadas. ¡La tuya puede ser la primera!' })])
  );
}

async function cargarDatos() {
  const respuesta = await fetch('data/salas.json');
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  return datos.salas;
}

async function arrancar() {
  try {
    const salas = await cargarDatos();
    ui.jugar.disabled = false;
    ui.jugar.textContent = 'Jugar';
    ui.jugar.addEventListener('click', () => iniciar(salas));
    ui.reiniciar.addEventListener('click', () => iniciar(salas));
  } catch (error) {
    ui.jugar.textContent = 'No se pudo cargar';
    ui.errorCarga.hidden = false;
    ui.errorCarga.textContent =
      'No se pudieron cargar las salas. Si abriste el archivo con doble clic, levantá un servidor local (ver README).';
    console.error(error);
  }

  ui.pista.addEventListener('click', pedirPista);
  ui.siguiente.addEventListener('click', siguienteSala);
  ui.formRanking.addEventListener('submit', (e) => {
    e.preventDefault();
    const ranking = guardarEnRanking({
      nombre: ui.nombre.value,
      puntaje: juego.puntaje,
      tiempo: juego.tiempoUsado,
      salas: juego.salasSuperadas,
    });
    ui.formRanking.hidden = true;
    mostrarRanking(ranking);
  });
}

arrancar();
