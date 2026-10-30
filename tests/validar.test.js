import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearNumero, esCorrecta } from '../js/validar.js';

test('parsea enteros, coma y punto decimal', () => {
  assert.equal(parsearNumero('350'), 350);
  assert.equal(parsearNumero('0,02'), 0.02);
  assert.equal(parsearNumero('0.02'), 0.02);
  assert.equal(parsearNumero(' 350,0 '), 350);
  assert.equal(parsearNumero('.5'), 0.5);
});

test('ignora la unidad escrita al final', () => {
  assert.equal(parsearNumero('350 Ω'), 350);
  assert.equal(parsearNumero('0,4A'), 0.4);
});

test('devuelve NaN si no hay número', () => {
  assert.ok(Number.isNaN(parsearNumero('')));
  assert.ok(Number.isNaN(parsearNumero('abc')));
  assert.ok(Number.isNaN(parsearNumero(null)));
});

test('acepta respuestas dentro de la tolerancia de ±1 %', () => {
  assert.ok(esCorrecta('350', 350));
  assert.ok(esCorrecta('353', 350));
  assert.ok(esCorrecta('347', 350));
  assert.ok(!esCorrecta('360', 350));
});

test('rechaza vacíos y texto', () => {
  assert.ok(!esCorrecta('', 350));
  assert.ok(!esCorrecta('trescientos', 350));
});

test('maneja el valor esperado cero', () => {
  assert.ok(esCorrecta('0', 0));
  assert.ok(!esCorrecta('1', 0));
});
