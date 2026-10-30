// Dibuja una sala a partir de los datos de salas.json.
// Para hacer una sala con un puzzle visual propio, se puede reemplazar la parte de "respuestas"
// manteniendo la misma interfaz: devolver obtenerValores() con un string por respuesta.

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

export function dibujarSala(contenedor, sala, desafio, total) {
  contenedor.replaceChildren();

  const encabezado = crear('header', 'sala-encabezado');
  encabezado.append(
    crear('p', 'sala-numero', `Sala ${sala.numero} de ${total} · ${sala.tema}`),
    crear('h2', 'sala-nombre', sala.nombre)
  );

  const historia = crear('p', 'sala-historia', sala.historia);

  const ficha = crear('details', 'ficha');
  ficha.append(
    crear('summary', null, `Ficha técnica: ${sala.ficha.titulo}`),
    crear('p', 'ficha-formula', sala.ficha.formula),
    crear('p', 'ficha-explicacion', sala.ficha.explicacion)
  );

  const enunciado = crear('p', 'enunciado', desafio.enunciado);

  const formulario = crear('form', 'respuestas');
  formulario.noValidate = true;
  const inputs = desafio.respuestas.map((r, i) => {
    const campo = crear('label', 'campo');
    const id = `respuesta-${i}`;
    campo.htmlFor = id;
    const input = crear('input');
    input.id = id;
    input.type = 'text';
    input.inputMode = 'decimal';
    input.autocomplete = 'off';
    input.placeholder = '0';
    campo.append(crear('span', 'campo-etiqueta', `${r.etiqueta} =`), input, crear('span', 'campo-unidad', r.unidad));
    formulario.append(campo);
    return input;
  });
  const enviar = crear('button', 'boton boton-principal', 'Conectar');
  enviar.type = 'submit';
  formulario.append(enviar);

  contenedor.append(encabezado, historia, ficha, enunciado, formulario);
  inputs[0]?.focus();

  return {
    formulario,
    inputs,
    obtenerValores: () => inputs.map((i) => i.value),
    marcar(correctas) {
      inputs.forEach((input, i) => input.classList.toggle('incorrecto', !correctas[i]));
    },
    bloquear() {
      inputs.forEach((i) => (i.disabled = true));
      enviar.disabled = true;
    },
  };
}
