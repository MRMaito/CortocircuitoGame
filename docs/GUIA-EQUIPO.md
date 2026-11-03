# Guía del equipo

Bienvenido al proyecto. Esta guía te da el contexto para que puedas ponerte a trabajar sin tener que preguntar todo. Si algo no está claro, preguntale a Michael (MRMaito), que armó el repo.

## De qué se trata

Es el trabajo final de **Proyecto Integrador III**: un software o juego educativo para una materia a elección, hecho en equipo y con los estándares de ingeniería de software de la especialización.

Elegimos **matemática aplicada a la electrónica**: un escape room donde cada sala es un circuito que se arregla resolviendo un problema. La electrónica es el contexto; lo que se practica y se evalúa es la matemática. El jugador no necesita saber electrónica, porque cada sala muestra la fórmula que hay que usar en la "ficha técnica".

**Entrega y defensa: 27 de noviembre de 2026.**

### Qué evalúan

| Área | Qué se espera | Estado |
| --- | --- | --- |
| Gestión | Definición de roles y Project Charter | ⏳ Falta |
| Investigación | Selección del contenido pedagógico e informe técnico | 🟡 El contenido está ([catálogo de salas](SALAS.md)); falta el informe |
| Desarrollo | Código fuente funcional en un repositorio remoto | ✅ Hecho y publicado |
| QA | Pruebas de usabilidad y corrección de bugs | 🟡 Tests automáticos hechos; faltan las pruebas con usuarios ([QA](QA.md)) |
| Defensa | Presentación en la última clase | ⏳ Falta |

## Qué está hecho

- El juego completo, con **15 salas** y **45 desafíos** (3 por sala, elegidos al azar en cada partida).
- Timer de 10 minutos, pistas con costo, puntaje con bonus por rapidez y ranking.
- Un circuito animado por sala y Ohmi, el robot guía, con 7 expresiones según cómo vaya el jugador.
- Funciona en compu y en celular.
- 74 tests automáticos.
- Publicado en https://mrmaito.github.io/CortocircuitoGame/ (se actualiza solo con cada cambio en `main`).

## Qué falta

Para la entrega:

- [ ] Definir roles del equipo
- [ ] Project Charter
- [ ] Informe técnico y pedagógico (el [catálogo de salas](SALAS.md) y la [arquitectura](ARQUITECTURA.md) tienen casi todo el material)
- [ ] Pruebas de usabilidad con alumnos de otro curso y su informe ([plan en QA.md](QA.md#pruebas-de-usabilidad))
- [ ] Corregir lo que salga de esas pruebas
- [ ] Presentación para la defensa

Mejoras opcionales del juego, si sobra tiempo:

- [ ] Revisar la dificultad: 10 minutos para 15 salas es muy ajustado (40 segundos por sala). Las pruebas de usabilidad van a decir si hay que subir el tiempo o bajar la penalización por error.
- [ ] Sonidos (chispa, acierto, puerta que se abre)
- [ ] Modo práctica: sin timer, para usar en clase sala por sala

## Tu primer día

### 1. Bajar el repo

La forma más simple en Windows es **GitHub Desktop**:

1. Instalalo desde https://desktop.github.com y entrá con tu cuenta de GitHub.
2. Aceptá la invitación al repo que te llegó por mail (si no te llegó, pedísela a Michael).
3. En GitHub Desktop: **File → Clone repository** → elegí `MRMaito/CortocircuitoGame`.

Si ya usás Git por consola: `git clone https://github.com/MRMaito/CortocircuitoGame.git`

### 2. Jugarlo

Doble clic en **`jugar.bat`**. Se abre el navegador con el juego. Jugalo entero una vez para entender cómo funciona antes de tocar nada.

### 3. Correr los tests

Instalá [Node.js](https://nodejs.org) (versión LTS) y hacé doble clic en **`tests.bat`**. Tienen que pasar todos.

### 4. Elegir un editor

Recomendado: [Visual Studio Code](https://code.visualstudio.com). Abrí la carpeta del repo con **File → Open Folder**.

## Cómo trabajamos con Git

La regla de oro: **nadie sube cambios directo a `main`**. Todo lo que está en `main` se publica solo en la página del juego, así que `main` tiene que funcionar siempre.

1. **Creá una rama** para tu tarea, con un nombre corto que diga qué hacés: `informe-pedagogico`, `fix-timer`, `sonidos`.
   En GitHub Desktop: **Current branch → New branch**.
2. **Hacé commits chicos** con mensajes que expliquen el cambio, en español: "Agregar sonido de chispa al errar", no "cambios".
3. **Antes de subir**, corré `tests.bat` y jugá la parte que tocaste.
4. **Subí la rama** (**Push origin**) y abrí un **Pull Request** en GitHub (**Create Pull Request**). Explicá qué cambiaste y cómo probarlo.
5. **Otro integrante revisa** el Pull Request y lo aprueba. Recién ahí se hace **Merge**.
6. En 1 o 2 minutos el cambio aparece en la página publicada.

Para empezar una tarea nueva, volvé a `main` y traé los últimos cambios (**Fetch origin → Pull**) antes de crear la rama.

### Bugs y tareas

Los bugs y las tareas pendientes se cargan como **Issues** en GitHub. Hay una plantilla para reportar bugs ([cómo usarla](QA.md#cómo-reportar-un-bug)). Si tomás un issue, asignátelo para que nadie más lo agarre.

## Convenciones

- **Todo en español:** código, comentarios, commits, issues y documentación. Es un proyecto educativo en español y así lo puede leer cualquiera del curso.
- **Sin frameworks ni dependencias:** el juego es HTML, CSS y JavaScript puro. No hace falta compilar nada, y eso simplifica mucho la publicación y la defensa.
- **Las respuestas de los desafíos no se escriben a mano:** las calcula `tools/generar_salas.py`. Ver [Arquitectura](ARQUITECTURA.md#cómo-agregar-o-cambiar-desafíos).
