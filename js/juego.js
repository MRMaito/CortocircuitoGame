// Estado de una partida: sala actual, timer, puntaje y pistas.
// No toca el DOM, así se puede testear con Node.

import { esCorrecta } from './validar.js';

export const CONFIG = {
  duracion: 10 * 60,      // segundos de batería de emergencia
  penalizacionError: 15,  // segundos que resta cada respuesta incorrecta
  puntosBase: 100,
  bonusMaximo: 60,        // bonus por rapidez: 60 - segundos usados en la sala
  costoPistas: [10, 20, 30],
};

export class Juego {
  constructor(salas, { config = CONFIG, azar = Math.random } = {}) {
    this.salas = salas;
    this.config = config;
    this.azar = azar;
  }

  iniciar() {
    this.indice = 0;
    this.puntaje = 0;
    this.restante = this.config.duracion;
    this.salasSuperadas = 0;
    this.prepararSala();
  }

  prepararSala() {
    const desafios = this.sala.desafios;
    this.desafio = desafios[Math.floor(this.azar() * desafios.length)];
    this.segundosSala = 0;
    this.pistasUsadas = 0;
    this.costoPistasSala = 0;
    this.resuelta = false;
  }

  get sala() {
    return this.salas[this.indice];
  }

  get terminado() {
    return this.indice >= this.salas.length || this.restante <= 0;
  }

  get escapo() {
    return this.salasSuperadas === this.salas.length;
  }

  // Llamar una vez por segundo. Devuelve true si se agotó el tiempo.
  tick() {
    if (this.terminado || this.resuelta) return this.terminado;
    this.restante = Math.max(0, this.restante - 1);
    this.segundosSala += 1;
    return this.restante <= 0;
  }

  pedirPista() {
    const pistas = this.desafio.pistas || [];
    if (this.pistasUsadas >= pistas.length) return null;
    const costo = this.config.costoPistas[this.pistasUsadas] ?? 0;
    const texto = pistas[this.pistasUsadas];
    this.pistasUsadas += 1;
    this.costoPistasSala += costo;
    return { texto, costo, quedan: pistas.length - this.pistasUsadas };
  }

  // valores: un string por cada respuesta del desafío, en el mismo orden
  responder(valores) {
    if (this.resuelta || this.terminado) return null;
    const respuestas = this.desafio.respuestas;
    const correctas = respuestas.map((r, i) =>
      esCorrecta(valores[i], r.valor, this.desafio.tolerancia ?? 0.01)
    );

    if (correctas.every(Boolean)) {
      const bonus = Math.max(0, this.config.bonusMaximo - this.segundosSala);
      const puntos = Math.max(0, this.config.puntosBase + bonus - this.costoPistasSala);
      this.puntaje += puntos;
      this.salasSuperadas += 1;
      this.resuelta = true;
      return { correcto: true, puntos, bonus, correctas };
    }

    this.restante = Math.max(0, this.restante - this.config.penalizacionError);
    return { correcto: false, correctas, sinTiempo: this.restante <= 0 };
  }

  siguienteSala() {
    this.indice += 1;
    if (!this.terminado) this.prepararSala();
  }

  get tiempoUsado() {
    return this.config.duracion - this.restante;
  }
}

export function formatearTiempo(segundos) {
  const s = Math.max(0, Math.floor(segundos));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
