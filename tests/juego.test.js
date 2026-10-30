import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Juego, CONFIG, formatearTiempo } from '../js/juego.js';

const salas = [
  { numero: 1, desafios: [{ respuestas: [{ valor: 350 }], pistas: ['a', 'b', 'c'] }] },
  { numero: 2, desafios: [{ respuestas: [{ valor: 4700 }, { valor: 5 }], pistas: ['a'] }] },
];

function nuevoJuego() {
  const juego = new Juego(salas, { azar: () => 0 });
  juego.iniciar();
  return juego;
}

test('una respuesta correcta suma puntos base + bonus', () => {
  const juego = nuevoJuego();
  for (let i = 0; i < 10; i++) juego.tick();
  const r = juego.responder(['350']);
  assert.equal(r.correcto, true);
  assert.equal(r.puntos, CONFIG.puntosBase + CONFIG.bonusMaximo - 10);
  assert.equal(juego.salasSuperadas, 1);
});

test('un error resta tiempo y no suma puntos', () => {
  const juego = nuevoJuego();
  const r = juego.responder(['100']);
  assert.equal(r.correcto, false);
  assert.equal(juego.restante, CONFIG.duracion - CONFIG.penalizacionError);
  assert.equal(juego.puntaje, 0);
});

test('las pistas cuestan 10, 20 y 30 y después se agotan', () => {
  const juego = nuevoJuego();
  assert.equal(juego.pedirPista().costo, 10);
  assert.equal(juego.pedirPista().costo, 20);
  assert.equal(juego.pedirPista().costo, 30);
  assert.equal(juego.pedirPista(), null);
  for (let i = 0; i < CONFIG.bonusMaximo; i++) juego.tick();
  assert.equal(juego.responder(['350']).puntos, CONFIG.puntosBase - 60);
});

test('un desafío con varias respuestas exige todas correctas', () => {
  const juego = nuevoJuego();
  juego.responder(['350']);
  juego.siguienteSala();
  assert.equal(juego.responder(['4700', '9']).correcto, false);
  assert.equal(juego.responder(['4700', '5']).correcto, true);
  juego.siguienteSala();
  assert.equal(juego.terminado, true);
  assert.equal(juego.escapo, true);
});

test('el juego termina cuando se agota el tiempo', () => {
  const juego = nuevoJuego();
  let sinTiempo = false;
  for (let i = 0; i < CONFIG.duracion; i++) sinTiempo = juego.tick();
  assert.equal(sinTiempo, true);
  assert.equal(juego.terminado, true);
  assert.equal(juego.escapo, false);
});

test('formatea el tiempo como mm:ss', () => {
  assert.equal(formatearTiempo(1200), '20:00');
  assert.equal(formatearTiempo(75), '01:15');
  assert.equal(formatearTiempo(-3), '00:00');
});
