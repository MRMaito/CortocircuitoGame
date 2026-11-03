# QA y pruebas

Hay tres niveles de prueba: los **tests automáticos** (los corre la compu), la **prueba manual** (la hace alguien del equipo antes de cada entrega) y las **pruebas de usabilidad** (con alumnos que no conocen el juego). Las tres sirven como evidencia para la parte de QA de la entrega.

## Tests automáticos

Se corren con doble clic en **`tests.bat`** (Windows, necesita [Node.js](https://nodejs.org) LTS) o con `npm test` (Linux/macOS). No hay que instalar nada más.

| Archivo | Qué revisa | Tests |
| --- | --- | --- |
| `tests/validar.test.js` | Que las respuestas se lean bien: coma o punto decimal, espacios, unidad escrita al final ("350 Ω"), margen de ±1 %, textos vacíos o sin números | 6 |
| `tests/juego.test.js` | Las reglas: puntaje y bonus, penalización por error, costo de las pistas, desafíos con dos respuestas y fin de partida por tiempo | 6 |
| `tests/salas.test.js` | Que cada sala y cada uno de los 45 desafíos estén bien cargados: campos completos, valores numéricos, entre 1 y 3 pistas, sin ids repetidos | 62 |

**Cuándo correrlos:** antes de cada Pull Request y siempre que se toquen las salas. Tienen que pasar todos; si alguno falla, el mensaje dice cuál y por qué.

## Prueba manual

Hacela antes de cada entrega y después de cambios grandes, en la versión publicada: https://mrmaito.github.io/CortocircuitoGame/

**Pantalla de inicio**
- [ ] El título se enciende y la chispa titila
- [ ] El botón dice "Jugar" (si dice "No se pudo cargar", falló la carga de las salas)

**Durante el juego**
- [ ] La batería baja de a un segundo y cambia de color: verde, ámbar al 30 % y rojo al 10 %
- [ ] Un error resta 15 segundos, salta una chispa en el circuito y Ohmi se confunde; al segundo error se enoja
- [ ] Se aceptan respuestas con coma, con punto y con la unidad escrita ("0,4", "0.4", "0,4 A")
- [ ] Las pistas aparecen en orden, descuentan 10, 20 y 30 puntos, y después de la tercera el botón dice "Sin pistas"
- [ ] Al acertar: la corriente recorre el circuito, se ve el valor correcto, Ohmi festeja y aparece "Abrir la puerta"
- [ ] El LED de la sala se prende arriba y el fondo se ilumina un poco más
- [ ] Se puede jugar solo con teclado: Tab para moverse y Enter para responder

**Final y ranking**
- [ ] Al resolver las 15 salas: "¡Escapaste del laboratorio!"
- [ ] Si se termina la batería: "Se agotó la batería"
- [ ] El ranking guarda el nombre y ordena por puntaje
- [ ] "Jugar de nuevo" arranca una partida nueva, con la batería llena

**Dispositivos**
- [ ] Chrome y Firefox en la compu
- [ ] Un celular: todo se lee bien y el teclado numérico aparece al responder

> **Truco para probar el final sin jugar 10 minutos:** en tu copia local cambiá `duracion: 10 * 60` por `duracion: 30` en `js/juego.js`, probá y **volvé a dejarlo como estaba** antes de hacer commit.

## Pruebas de usabilidad

El objetivo es ver si alguien que **no conoce el juego** lo entiende, lo puede terminar y aprende algo de matemática.

**Con quién:** 5 alumnos de otro curso. Después de corregir lo que salga, una segunda ronda con 2 o 3 alumnos nuevos para confirmar las mejoras.

**Cómo:**

1. Cada participante juega una partida completa en la versión publicada.
2. Alguien del equipo observa **sin ayudar** y anota en la planilla de abajo dónde se traba, qué no entiende y qué botones no encuentra.
3. Al terminar, responde un cuestionario corto del 1 al 5:
   - ¿Se entendía qué había que hacer en cada sala?
   - ¿La dificultad fue adecuada?
   - ¿El tiempo alcanzaba?
   - ¿Te divertiste?
   - ¿Sentís que practicaste matemática?
   - Y una pregunta abierta: ¿qué cambiarías?

**Planilla de observación** (una fila por participante):

| Participante | Salas resueltas | Tiempo usado | Pistas usadas | Errores | Dónde se trabó | Comentarios |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | | | | | | |
| P2 | | | | | | |

La pantalla final ya muestra puntaje, tiempo y salas resueltas, así que se puede sacar una foto al terminar cada partida.

**Qué mirar especialmente:** con 10 minutos para 15 salas, es probable que casi nadie llegue al final. Si pasa, es un hallazgo para el informe y se resuelve en `CONFIG` (ver [Arquitectura](ARQUITECTURA.md#configuración-del-juego)).

## Cómo reportar un bug

Cada bug va como **Issue** en GitHub: **Issues → New issue → Reportar un bug**. La plantilla pide:

- **Qué pasó** y **qué esperabas que pasara**
- **Pasos para reproducirlo**, numerados, para que otro lo pueda repetir
- **Gravedad**:
  - **Bloqueante:** no se puede seguir jugando (el juego se traba, una respuesta correcta no se acepta)
  - **Mayor:** se puede jugar pero algo está mal (puntaje mal calculado, pista equivocada)
  - **Menor:** detalle visual o de texto
- **Dónde:** navegador, compu o celular, y una captura si se puede

**Orden para corregir:** primero los bloqueantes, después los mayores y por último los menores. Al corregir uno, el Pull Request lo menciona ("Corrige #12") y GitHub cierra el issue solo al hacer el merge.
