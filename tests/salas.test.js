// Revisa que el banco de desafíos esté bien cargado antes de jugar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { salas } = JSON.parse(readFileSync(new URL('../data/salas.json', import.meta.url), 'utf8'));

test('hay al menos una sala y los números son consecutivos', () => {
  assert.ok(salas.length > 0);
  salas.forEach((s, i) => assert.equal(s.numero, i + 1, `la sala en la posición ${i} debería ser la ${i + 1}`));
});

for (const sala of salas) {
  test(`sala ${sala.numero} (${sala.nombre}) tiene todos los campos`, () => {
    for (const campo of ['id', 'nombre', 'tema', 'historia']) assert.ok(sala[campo], `falta "${campo}"`);
    assert.ok(sala.ficha?.titulo && sala.ficha?.formula, 'falta la ficha técnica');
    assert.ok(sala.desafios.length >= 1, 'necesita al menos un desafío');
  });

  for (const d of sala.desafios) {
    test(`desafío ${d.id} es válido`, () => {
      assert.ok(d.enunciado, 'falta el enunciado');
      assert.ok(d.respuestas.length >= 1, 'necesita al menos una respuesta');
      d.respuestas.forEach((r) => {
        assert.equal(typeof r.valor, 'number', 'el valor tiene que ser un número, no un texto');
        assert.ok(r.etiqueta && r.unidad, 'falta etiqueta o unidad');
      });
      assert.ok(d.pistas.length >= 1 && d.pistas.length <= 3, 'entre 1 y 3 pistas');
    });
  }
}

test('los ids de desafío no se repiten', () => {
  const ids = salas.flatMap((s) => s.desafios.map((d) => d.id));
  assert.equal(new Set(ids).size, ids.length);
});
