# Cortocircuito: Escape del Laboratorio

Escape room educativo de matemática con temática de circuitos electrónicos – Proyecto Integrador III.

Un cortocircuito dejó el Laboratorio 7 sin energía. El jugador tiene 20 minutos para resolver los problemas de matemática de cada tablero, restaurar la energía y escapar. Lo guía *Ohmi*, un robot de soldadura que da pistas.

**Jugar online:** https://mrmaito.github.io/CortocircuitoGame/

## Cómo correrlo en tu compu

El juego carga las salas desde `data/salas.json`, así que **no funciona abriendo `index.html` con doble clic**: hace falta un servidor local.

```bash
# Opción 1: Python (viene en Linux y macOS)
python3 -m http.server 8000

# Opción 2: VS Code
# Instalar la extensión "Live Server" y tocar "Go Live"
```

Después abrir http://localhost:8000

## Tests

Requieren Node 18 o superior. No hay que instalar nada.

```bash
npm test
```

- `tests/validar.test.js`: validación de respuestas (coma/punto, unidades, tolerancia ±1 %).
- `tests/juego.test.js`: puntaje, timer, pistas y fin de partida.
- `tests/salas.test.js`: revisa que `salas.json` esté bien cargado. **Córranlo cada vez que agreguen desafíos.**

## Estructura

```
index.html          pantallas de inicio, juego y final
css/estilos.css     estética de placa de circuito
js/main.js          arranque, timer y navegación entre pantallas
js/juego.js         estado de la partida (sin DOM, testeable)
js/sala.js          dibuja una sala a partir del JSON
js/validar.js       compara respuestas con tolerancia
js/ranking.js       top 10 en localStorage
js/ohmi.js          frases del robot guía
data/salas.json     salas y banco de desafíos
tests/              tests con node:test
```

## Cómo agregar una sala

1. Agregar un objeto nuevo en `data/salas.json` con el siguiente `numero`, siguiendo el formato de la sala 1.
2. Cargar entre 3 y 5 desafíos con valores distintos. Cada desafío tiene:
   - `enunciado`: el problema.
   - `respuestas`: una o más, cada una con `etiqueta`, `valor` (número) y `unidad`.
   - `pistas`: hasta 3, de la más general a la más concreta.
3. Verificar cada respuesta a mano (que la revise alguien distinto a quien la escribió).
4. Correr `npm test`.

Las salas con un puzzle visual propio (arrastrar resistencias, leer bandas de colores) se pueden armar en un módulo nuevo que reemplace la parte de respuestas de `js/sala.js`, siempre que devuelva `obtenerValores()` con un texto por respuesta.

## Cómo trabajar en equipo

- Nadie sube cambios directo a `main`: una rama por tarea (`sala-2`, `fix-timer`) y pull request.
- Otro integrante revisa el PR antes de mergear.
- Los bugs se cargan como *issues* con pasos para reproducirlos.

## Licencia

MIT
