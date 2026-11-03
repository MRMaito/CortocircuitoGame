# Catálogo de salas

> Este archivo se genera solo con `python tools/generar_doc_salas.py` a partir de `data/salas.json`. No lo edites a mano: cambiá las salas y volvé a generarlo.

El juego tiene **15 salas** ordenadas de menor a mayor dificultad. Cada partida elige al azar uno de los desafíos de cada sala.

## Resumen

| # | Sala | Contenido de matemática | Fórmula de la ficha técnica | Desafíos |
| --- | --- | --- | --- | --- |
| 1 | [La fuente](#sala-1) | Ecuaciones lineales (despeje) | `V = I · R` | 3 |
| 2 | [El almacén](#sala-2) | Notación científica y potencias de 10 | `k = 10³ · M = 10⁶ · m = 10⁻³` | 3 |
| 3 | [La memoria](#sala-3) | Sistemas de numeración: binario | `1011 = 1·8 + 0·4 + 1·2 + 1·1 = 11` | 3 |
| 4 | [El código de colores](#sala-4) | Sistema posicional y potencias de 10 | `R = (1ª banda · 10 + 2ª banda) · 10^(3ª banda)` | 3 |
| 5 | [El control de calidad](#sala-5) | Porcentajes | `R mín = R − R · t / 100   y   R máx = R + R · t / 100` | 3 |
| 6 | [La batería](#sala-6) | Proporcionalidad y regla de tres | `t = capacidad (mAh) / consumo (mA)` | 3 |
| 7 | [El tablero](#sala-7) | Fracciones: resistencias en serie y en paralelo | `Serie: R = R₁ + R₂ · Paralelo: 1/R = 1/R₁ + 1/R₂` | 3 |
| 8 | [El divisor de tensión](#sala-8) | Proporciones | `V salida = V entrada · R₂ / (R₁ + R₂)` | 3 |
| 9 | [El transformador](#sala-9) | Proporcionalidad directa | `V₂ / V₁ = N₂ / N₁` | 3 |
| 10 | [La lámpara](#sala-10) | Ecuaciones: despeje de fórmulas | `P = V · I` | 3 |
| 11 | [El osciloscopio](#sala-11) | Función lineal y pendiente | `R = ΔV / ΔI` | 3 |
| 12 | [La estufa](#sala-12) | Potencias y raíz cuadrada | `P = I² · R   →   I = √(P / R)` | 3 |
| 13 | [El puente](#sala-13) | Proporciones y ecuaciones con fracciones | `R₁ / R₂ = R₃ / Rx` | 3 |
| 14 | [La señal](#sala-14) | Función seno y período | `f = 1 / T   y   v = V máx · sen(α)` | 3 |
| 15 | [La salida](#sala-15) | Sistemas de ecuaciones 2×2 | `I = I₁ + I₂   y   R₁ · I₁ = R₂ · I₂` | 3 |

## Sala 1

### La fuente

**Contenido:** Ecuaciones lineales (despeje)  
**Historia:** La fuente de emergencia funciona, pero el LED que abre la puerta se quemaría si lo conectás directo. Tenés que elegir la resistencia justa para protegerlo.

**Ficha técnica (Ley de Ohm):** `V = I · R`. La resistencia recibe la tensión que sobra entre la fuente y el LED. Despejá R: R = (V fuente − V LED) / I.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala1-led-9v` | La fuente entrega 9 V. El LED consume 2 V y necesita 0,02 A. ¿Qué resistencia tenés que conectar en serie? | R = 350 Ω | 1. Recordá la Ley de Ohm: V = I · R.<br>2. La resistencia recibe la tensión que sobra: 9 V − 2 V = 7 V.<br>3. R = 7 / 0,02 |
| `sala1-led-5v` | La fuente entrega 5 V. El LED consume 2 V y necesita 0,01 A. ¿Qué resistencia tenés que conectar en serie? | R = 300 Ω | 1. Recordá la Ley de Ohm: V = I · R.<br>2. La resistencia recibe la tensión que sobra: 5 V − 2 V = 3 V.<br>3. R = 3 / 0,01 |
| `sala1-led-12v` | La fuente entrega 12 V. El LED consume 2 V y necesita 0,02 A. ¿Qué resistencia tenés que conectar en serie? | R = 500 Ω | 1. Recordá la Ley de Ohm: V = I · R.<br>2. La resistencia recibe la tensión que sobra: 12 V − 2 V = 10 V.<br>3. R = 10 / 0,02 |

## Sala 2

### El almacén

**Contenido:** Notación científica y potencias de 10  
**Historia:** Los cajones de repuestos están rotulados con prefijos y el inventario quedó a medias. Para encontrar las piezas que necesitás, pasá cada valor a la unidad que pide la planilla.

**Ficha técnica (Prefijos del Sistema Internacional):** `k = 10³ · M = 10⁶ · m = 10⁻³`. Para pasar de kilo a la unidad, multiplicá por 1000. Para pasar de la unidad a mili, también multiplicá por 1000. Para ir al revés, dividí.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala2-4k7` | Convertí los valores del cajón A: la resistencia mide 4,7 kΩ y la corriente máxima es 0,005 A. | R = 4.700 Ω<br>I = 5 mA | 1. Kilo significa 10³ y mili significa 10⁻³.<br>2. 4,7 kΩ = 4,7 · 1000 Ω. Para pasar amperes a miliamperes, también multiplicá por 1000.<br>3. R = 4,7 · 1000 e I = 0,005 · 1000 |
| `sala2-2k2` | Convertí los valores del cajón B: la resistencia mide 2,2 kΩ y la corriente máxima es 0,03 A. | R = 2.200 Ω<br>I = 30 mA | 1. Kilo significa 10³ y mili significa 10⁻³.<br>2. 2,2 kΩ = 2,2 · 1000 Ω. Para pasar amperes a miliamperes, también multiplicá por 1000.<br>3. R = 2,2 · 1000 e I = 0,03 · 1000 |
| `sala2-1m5` | Convertí los valores del cajón C: la resistencia mide 1,5 MΩ y la corriente es de 250 mA. | R = 1.500 kΩ<br>I = 0,25 A | 1. Mega significa 10⁶ y kilo 10³: de MΩ a kΩ hay un factor de 1000.<br>2. 1,5 MΩ = 1,5 · 1000 kΩ. De miliamperes a amperes se divide por 1000.<br>3. R = 1,5 · 1000 e I = 250 / 1000 |

## Sala 3

### La memoria

**Contenido:** Sistemas de numeración: binario  
**Historia:** La memoria de las puertas guarda el código de acceso en binario. Leé qué LEDs están encendidos y pasá el número a decimal para desbloquearla.

**Ficha técnica (Sistema binario):** `1011 = 1·8 + 0·4 + 1·2 + 1·1 = 11`. Cada posición vale el doble que la de su derecha: 1, 2, 4, 8, 16, 32... Sumá los valores de las posiciones que tienen un 1.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala3-1011` | Los LEDs de la memoria muestran el código 1011 (encendido = 1, apagado = 0). ¿Qué número es en decimal? | Código = 11 en decimal | 1. Cada posición vale el doble que la de su derecha, empezando por 1.<br>2. Los valores de las posiciones son 8, 4, 2, 1.<br>3. Sumá los valores donde hay un 1: 8 + 2 + 1 |
| `sala3-11010` | Los LEDs de la memoria muestran el código 11010 (encendido = 1, apagado = 0). ¿Qué número es en decimal? | Código = 26 en decimal | 1. Cada posición vale el doble que la de su derecha, empezando por 1.<br>2. Los valores de las posiciones son 16, 8, 4, 2, 1.<br>3. Sumá los valores donde hay un 1: 16 + 8 + 2 |
| `sala3-100101` | Los LEDs de la memoria muestran el código 100101 (encendido = 1, apagado = 0). ¿Qué número es en decimal? | Código = 37 en decimal | 1. Cada posición vale el doble que la de su derecha, empezando por 1.<br>2. Los valores de las posiciones son 32, 16, 8, 4, 2, 1.<br>3. Sumá los valores donde hay un 1: 32 + 4 + 1 |

## Sala 4

### El código de colores

**Contenido:** Sistema posicional y potencias de 10  
**Historia:** Las resistencias del cajón perdieron la etiqueta y solo quedan sus bandas de colores. Leelas para saber cuánto mide cada una.

**Ficha técnica (Código de colores):** `R = (1ª banda · 10 + 2ª banda) · 10^(3ª banda)`. Negro 0, marrón 1, rojo 2, naranja 3, amarillo 4, verde 5, azul 6, violeta 7, gris 8, blanco 9. La tercera banda dice cuántos ceros agregar.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala4-rojo-violeta-naranja` | La resistencia tiene las bandas rojo, violeta y naranja. ¿Cuánto mide? | R = 27.000 Ω | 1. Rojo vale 2 y violeta vale 7: las dos primeras bandas forman el número 27.<br>2. La tercera banda, naranja, vale 3: multiplicá por 10 elevado a 3.<br>3. R = 27 · 1000 |
| `sala4-marrón-negro-rojo` | La resistencia tiene las bandas marrón, negro y rojo. ¿Cuánto mide? | R = 1.000 Ω | 1. Marrón vale 1 y negro vale 0: las dos primeras bandas forman el número 10.<br>2. La tercera banda, rojo, vale 2: multiplicá por 10 elevado a 2.<br>3. R = 10 · 100 |
| `sala4-amarillo-violeta-marrón` | La resistencia tiene las bandas amarillo, violeta y marrón. ¿Cuánto mide? | R = 470 Ω | 1. Amarillo vale 4 y violeta vale 7: las dos primeras bandas forman el número 47.<br>2. La tercera banda, marrón, vale 1: multiplicá por 10 elevado a 1.<br>3. R = 47 · 10 |

## Sala 5

### El control de calidad

**Contenido:** Porcentajes  
**Historia:** Antes de instalar una resistencia hay que verificar que su valor real esté dentro de la tolerancia que indica el fabricante.

**Ficha técnica (Tolerancia):** `R mín = R − R · t / 100   y   R máx = R + R · t / 100`. La tolerancia es el porcentaje que el valor real puede alejarse del nominal, hacia arriba o hacia abajo.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala5-1000-5` | Una resistencia de 1.000 Ω tiene una tolerancia de ±5 %. ¿Cuáles son sus valores mínimo y máximo aceptables? | R mín = 950 Ω<br>R máx = 1.050 Ω | 1. Calculá primero cuántos ohms representa el porcentaje.<br>2. El 5 % de 1.000 es 1.000 · 5 / 100 = 50 Ω.<br>3. R mín = 1.000 − 50 y R máx = 1.000 + 50 |
| `sala5-220-10` | Una resistencia de 220 Ω tiene una tolerancia de ±10 %. ¿Cuáles son sus valores mínimo y máximo aceptables? | R mín = 198 Ω<br>R máx = 242 Ω | 1. Calculá primero cuántos ohms representa el porcentaje.<br>2. El 10 % de 220 es 220 · 10 / 100 = 22 Ω.<br>3. R mín = 220 − 22 y R máx = 220 + 22 |
| `sala5-4700-2` | Una resistencia de 4.700 Ω tiene una tolerancia de ±2 %. ¿Cuáles son sus valores mínimo y máximo aceptables? | R mín = 4.606 Ω<br>R máx = 4.794 Ω | 1. Calculá primero cuántos ohms representa el porcentaje.<br>2. El 2 % de 4.700 es 4.700 · 2 / 100 = 94 Ω.<br>3. R mín = 4.700 − 94 y R máx = 4.700 + 94 |

## Sala 6

### La batería

**Contenido:** Proporcionalidad y regla de tres  
**Historia:** La batería de emergencia tiene que alimentar las luces de evacuación. Calculá cuánto tiempo aguanta antes de agotarse.

**Ficha técnica (Capacidad de una batería):** `t = capacidad (mAh) / consumo (mA)`. Con la mitad de consumo la batería dura el doble: la duración es inversamente proporcional a la corriente que se consume.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala6-2000-250` | La batería de emergencia tiene 2.000 mAh y la luz de evacuación consume 250 mA. ¿Cuántas horas puede funcionar? | t = 8 h | 1. mAh significa: cuántos miliamperes puede entregar durante una hora.<br>2. Si a 2.000 mA dura 1 hora, a 250 mA dura 2.000 / 250 veces más.<br>3. t = 2.000 / 250 |
| `sala6-3000-500` | La batería de emergencia tiene 3.000 mAh y la alarma consume 500 mA. ¿Cuántas horas puede funcionar? | t = 6 h | 1. mAh significa: cuántos miliamperes puede entregar durante una hora.<br>2. Si a 3.000 mA dura 1 hora, a 500 mA dura 3.000 / 500 veces más.<br>3. t = 3.000 / 500 |
| `sala6-2400-200` | La batería de emergencia tiene 2.400 mAh y el cartel de salida consume 200 mA. ¿Cuántas horas puede funcionar? | t = 12 h | 1. mAh significa: cuántos miliamperes puede entregar durante una hora.<br>2. Si a 2.400 mA dura 1 hora, a 200 mA dura 2.400 / 200 veces más.<br>3. t = 2.400 / 200 |

## Sala 7

### El tablero

**Contenido:** Fracciones: resistencias en serie y en paralelo  
**Historia:** El tablero principal necesita una resistencia equivalente exacta para volver a arrancar. Solo tenés las resistencias que quedaron conectadas: calculá cuánto valen en conjunto.

**Ficha técnica (Serie y paralelo):** `Serie: R = R₁ + R₂ · Paralelo: 1/R = 1/R₁ + 1/R₂`. En paralelo, sumá las fracciones con denominador común y después invertí el resultado. Si hay una resistencia en serie, sumala al final.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala7-6-3` | Dos resistencias de 6 Ω y 3 Ω están conectadas en paralelo. ¿Cuál es la resistencia equivalente? | R = 2 Ω | 1. En paralelo: 1/R = 1/R₁ + 1/R₂.<br>2. 1/6 + 1/3 = 1/6 + 2/6 = 3/6.<br>3. Si 1/R = 3/6 = 1/2, entonces R = 2/1. |
| `sala7-12-4` | Dos resistencias de 12 Ω y 4 Ω están conectadas en paralelo. ¿Cuál es la resistencia equivalente? | R = 3 Ω | 1. En paralelo: 1/R = 1/R₁ + 1/R₂.<br>2. 1/12 + 1/4 = 1/12 + 3/12 = 4/12.<br>3. Si 1/R = 4/12 = 1/3, entonces R = 3/1. |
| `sala7-serie` | Una resistencia de 4 Ω está en serie con dos resistencias en paralelo de 6 Ω y 3 Ω. ¿Cuál es la resistencia equivalente total? | R = 6 Ω | 1. Resolvé primero el paralelo y después sumá la de 4 Ω.<br>2. El paralelo de 6 Ω y 3 Ω da 1/6 + 2/6 = 3/6, o sea 2 Ω.<br>3. R = 4 + 2 |

## Sala 8

### El divisor de tensión

**Contenido:** Proporciones  
**Historia:** El sensor de la puerta funciona con menos tensión que la fuente. Un divisor con dos resistencias baja la tensión: calculá cuánto le llega.

**Ficha técnica (Divisor de tensión):** `V salida = V entrada · R₂ / (R₁ + R₂)`. La tensión se reparte entre las dos resistencias en proporción a sus valores. R₂ se queda con la fracción R₂ / (R₁ + R₂).

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala8-12-2-1` | Un divisor de tensión recibe 12 V y tiene R₁ = 2 kΩ y R₂ = 1 kΩ. ¿Qué tensión le llega al sensor, conectado sobre R₂? | V salida = 4 V | 1. La tensión se reparte en proporción a cada resistencia.<br>2. R₂ se queda con la fracción 1 / (2 + 1) = 1 / 3 de la tensión.<br>3. V salida = 12 · 1 / 3 |
| `sala8-9-1-2` | Un divisor de tensión recibe 9 V y tiene R₁ = 1 kΩ y R₂ = 2 kΩ. ¿Qué tensión le llega al sensor, conectado sobre R₂? | V salida = 6 V | 1. La tensión se reparte en proporción a cada resistencia.<br>2. R₂ se queda con la fracción 2 / (1 + 2) = 2 / 3 de la tensión.<br>3. V salida = 9 · 2 / 3 |
| `sala8-15-4-1` | Un divisor de tensión recibe 15 V y tiene R₁ = 4 kΩ y R₂ = 1 kΩ. ¿Qué tensión le llega al sensor, conectado sobre R₂? | V salida = 3 V | 1. La tensión se reparte en proporción a cada resistencia.<br>2. R₂ se queda con la fracción 1 / (4 + 1) = 1 / 5 de la tensión.<br>3. V salida = 15 · 1 / 5 |

## Sala 9

### El transformador

**Contenido:** Proporcionalidad directa  
**Historia:** Para cargar la batería de emergencia hay que bajar los 220 V de la red. El transformador lo hace con dos bobinados de distinta cantidad de vueltas.

**Ficha técnica (Relación de transformación):** `V₂ / V₁ = N₂ / N₁`. Si el secundario tiene la mitad de vueltas que el primario, entrega la mitad de tensión. Armá la proporción y despejá lo que falta.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala9-v-220-1000-50` | El transformador recibe 220 V en el primario, que tiene 1.000 vueltas. El secundario tiene 50 vueltas. ¿Qué tensión entrega? | V₂ = 11 V | 1. La tensión es directamente proporcional a la cantidad de vueltas.<br>2. Planteá la proporción: V₂ / 220 = 50 / 1.000.<br>3. V₂ = 220 · 50 / 1.000 |
| `sala9-n-220-1000-22` | El primario recibe 220 V y tiene 1.000 vueltas. Se necesitan 22 V a la salida. ¿Cuántas vueltas tiene que tener el secundario? | N₂ = 100 vueltas | 1. La tensión es directamente proporcional a la cantidad de vueltas.<br>2. Planteá la proporción: N₂ / 1.000 = 22 / 220.<br>3. N₂ = 1.000 · 22 / 220 |
| `sala9-v-110-500-25` | El transformador recibe 110 V en el primario, que tiene 500 vueltas. El secundario tiene 25 vueltas. ¿Qué tensión entrega? | V₂ = 5,5 V | 1. La tensión es directamente proporcional a la cantidad de vueltas.<br>2. Planteá la proporción: V₂ / 110 = 25 / 500.<br>3. V₂ = 110 · 25 / 500 |

## Sala 10

### La lámpara

**Contenido:** Ecuaciones: despeje de fórmulas  
**Historia:** Las lámparas del pasillo están quemadas. Para pedir los repuestos correctos necesitás calcular su potencia, su corriente o su tensión.

**Ficha técnica (Potencia eléctrica):** `P = V · I`. La potencia se mide en watts (W). Si conocés dos de los tres valores, despejá el tercero.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala10-P-6` | La lámpara de emergencia funciona con 12 V y consume 0,5 A. ¿Qué potencia tiene? | P = 6 W | 1. La potencia es tensión por corriente.<br>2. P = V · I<br>3. P = 12 · 0,5 |
| `sala10-I-1100` | El reflector del pasillo es de 1.100 W y se conecta a 220 V. ¿Qué corriente consume? | I = 5 A | 1. Partí de P = V · I y despejá I.<br>2. I = P / V<br>3. I = 1.100 / 220 |
| `sala10-V-60` | Una lámpara de 60 W consume 5 A. ¿Con qué tensión funciona? | V = 12 V | 1. Partí de P = V · I y despejá V.<br>2. V = P / I<br>3. V = 60 / 5 |

## Sala 11

### El osciloscopio

**Contenido:** Función lineal y pendiente  
**Historia:** La pantalla del osciloscopio muestra cómo cambia la corriente cuando sube la tensión. La recta delata qué resistencia hay en el circuito.

**Ficha técnica (Gráfico tensión-corriente):** `R = ΔV / ΔI`. En una resistencia, la corriente es proporcional a la tensión: el gráfico es una recta que pasa por el origen. Tomá dos puntos y dividí las diferencias.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala11-200` | La recta del osciloscopio pasa por los puntos (2 V; 0,01 A) y (6 V; 0,03 A). ¿Cuánto vale la resistencia? | R = 200 Ω | 1. La resistencia es el cociente entre la variación de tensión y la variación de corriente.<br>2. ΔV = 6 − 2 = 4 V  y  ΔI = 0,03 − 0,01 = 0,02 A.<br>3. R = 4 / 0,02 |
| `sala11-150` | La recta del osciloscopio pasa por los puntos (3 V; 0,02 A) y (9 V; 0,06 A). ¿Cuánto vale la resistencia? | R = 150 Ω | 1. La resistencia es el cociente entre la variación de tensión y la variación de corriente.<br>2. ΔV = 9 − 3 = 6 V  y  ΔI = 0,06 − 0,02 = 0,04 A.<br>3. R = 6 / 0,04 |
| `sala11-500` | La recta del osciloscopio pasa por los puntos (4 V; 0,008 A) y (10 V; 0,02 A). ¿Cuánto vale la resistencia? | R = 500 Ω | 1. La resistencia es el cociente entre la variación de tensión y la variación de corriente.<br>2. ΔV = 10 − 4 = 6 V  y  ΔI = 0,02 − 0,008 = 0,012 A.<br>3. R = 6 / 0,012 |

## Sala 12

### La estufa

**Contenido:** Potencias y raíz cuadrada  
**Historia:** La estufa del laboratorio tiene la placa quemada. Sabés su potencia y su resistencia: calculá qué corriente necesita el repuesto.

**Ficha técnica (Potencia en una resistencia):** `P = I² · R   →   I = √(P / R)`. Dividí la potencia por la resistencia para obtener I². Después sacá la raíz cuadrada.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala12-4-100` | La estufa del laboratorio tiene una resistencia de 100 Ω y disipa 4 W. ¿Qué corriente circula por ella? | I = 0,2 A | 1. Usá P = I² · R y despejá I.<br>2. I² = P / R = 4 / 100 = 0,04.<br>3. I = √0,04 |
| `sala12-18-2` | La estufa del laboratorio tiene una resistencia de 2 Ω y disipa 18 W. ¿Qué corriente circula por ella? | I = 3 A | 1. Usá P = I² · R y despejá I.<br>2. I² = P / R = 18 / 2 = 9.<br>3. I = √9 |
| `sala12-50-8` | La estufa del laboratorio tiene una resistencia de 8 Ω y disipa 50 W. ¿Qué corriente circula por ella? | I = 2,5 A | 1. Usá P = I² · R y despejá I.<br>2. I² = P / R = 50 / 8 = 6,25.<br>3. I = √6,25 |

## Sala 13

### El puente

**Contenido:** Proporciones y ecuaciones con fracciones  
**Historia:** Un puente de Wheatstone mide resistencias desconocidas: cuando el medidor del centro marca cero, las resistencias guardan la misma proporción.

**Ficha técnica (Puente equilibrado):** `R₁ / R₂ = R₃ / Rx`. Si el puente está equilibrado, armá la proporción y despejá Rx multiplicando en cruz.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala13-100-200-50` | El puente está equilibrado con R₁ = 100 Ω, R₂ = 200 Ω y R₃ = 50 Ω. ¿Cuánto vale la resistencia desconocida Rx? | Rx = 100 Ω | 1. En equilibrio se cumple la proporción R₁ / R₂ = R₃ / Rx.<br>2. 100 / 200 = 50 / Rx. Multiplicá en cruz.<br>3. Rx = 50 · 200 / 100 |
| `sala13-300-100-60` | El puente está equilibrado con R₁ = 300 Ω, R₂ = 100 Ω y R₃ = 60 Ω. ¿Cuánto vale la resistencia desconocida Rx? | Rx = 20 Ω | 1. En equilibrio se cumple la proporción R₁ / R₂ = R₃ / Rx.<br>2. 300 / 100 = 60 / Rx. Multiplicá en cruz.<br>3. Rx = 60 · 100 / 300 |
| `sala13-150-450-40` | El puente está equilibrado con R₁ = 150 Ω, R₂ = 450 Ω y R₃ = 40 Ω. ¿Cuánto vale la resistencia desconocida Rx? | Rx = 120 Ω | 1. En equilibrio se cumple la proporción R₁ / R₂ = R₃ / Rx.<br>2. 150 / 450 = 40 / Rx. Multiplicá en cruz.<br>3. Rx = 40 · 450 / 150 |

## Sala 14

### La señal

**Contenido:** Función seno y período  
**Historia:** La red eléctrica no entrega una tensión fija: oscila como una onda senoidal. Para sincronizar el generador hay que leer bien la señal.

**Ficha técnica (Señal senoidal):** `f = 1 / T   y   v = V máx · sen(α)`. La frecuencia (en hertz) es la inversa del período (en segundos). El valor de la tensión en un instante es el valor máximo por el seno del ángulo.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala14-20-10-30` | La señal tiene un período de 20 ms y un valor máximo de 10 V. ¿Cuál es su frecuencia y cuánto vale la tensión cuando el ángulo es de 30°? | f = 50 Hz<br>v = 5 V | 1. La frecuencia es la inversa del período, con el período en segundos.<br>2. 20 ms = 0,02 s. Para la tensión: sen(30°) = 0,5.<br>3. f = 1 / 0,02  y  v = 10 · 0,5 |
| `sala14-10-12-30` | La señal tiene un período de 10 ms y un valor máximo de 12 V. ¿Cuál es su frecuencia y cuánto vale la tensión cuando el ángulo es de 30°? | f = 100 Hz<br>v = 6 V | 1. La frecuencia es la inversa del período, con el período en segundos.<br>2. 10 ms = 0,01 s. Para la tensión: sen(30°) = 0,5.<br>3. f = 1 / 0,01  y  v = 12 · 0,5 |
| `sala14-50-8-90` | La señal tiene un período de 50 ms y un valor máximo de 8 V. ¿Cuál es su frecuencia y cuánto vale la tensión cuando el ángulo es de 90°? | f = 20 Hz<br>v = 8 V | 1. La frecuencia es la inversa del período, con el período en segundos.<br>2. 50 ms = 0,05 s. Para la tensión: sen(90°) = 1.<br>3. f = 1 / 0,05  y  v = 8 · 1 |

## Sala 15

### La salida

**Contenido:** Sistemas de ecuaciones 2×2  
**Historia:** La puerta final tiene dos circuitos en paralelo que necesitan la corriente justa. Repartí la corriente total entre las ramas para abrirla y escapar.

**Ficha técnica (Leyes de Kirchhoff):** `I = I₁ + I₂   y   R₁ · I₁ = R₂ · I₂`. La corriente total se reparte entre las ramas, y las dos ramas en paralelo tienen la misma tensión. Es un sistema de dos ecuaciones con dos incógnitas.

| Desafío | Enunciado | Respuesta | Pistas |
| --- | --- | --- | --- |
| `sala15-0_6-10-20` | Entran 0,6 A y se reparten entre dos ramas en paralelo de 10 Ω y 20 Ω. ¿Cuánta corriente pasa por cada rama? | I₁ = 0,4 A<br>I₂ = 0,2 A | 1. Planteá dos ecuaciones: la suma de las corrientes y la igualdad de tensiones.<br>2. I₁ + I₂ = 0,6  y  10 · I₁ = 20 · I₂.<br>3. De la segunda, I₁ = 20 · I₂ / 10. Reemplazá eso en la primera y despejá I₂. |
| `sala15-0_9-20-10` | Entran 0,9 A y se reparten entre dos ramas en paralelo de 20 Ω y 10 Ω. ¿Cuánta corriente pasa por cada rama? | I₁ = 0,3 A<br>I₂ = 0,6 A | 1. Planteá dos ecuaciones: la suma de las corrientes y la igualdad de tensiones.<br>2. I₁ + I₂ = 0,9  y  20 · I₁ = 10 · I₂.<br>3. De la segunda, I₁ = 10 · I₂ / 20. Reemplazá eso en la primera y despejá I₂. |
| `sala15-1-30-20` | Entran 1 A y se reparten entre dos ramas en paralelo de 30 Ω y 20 Ω. ¿Cuánta corriente pasa por cada rama? | I₁ = 0,4 A<br>I₂ = 0,6 A | 1. Planteá dos ecuaciones: la suma de las corrientes y la igualdad de tensiones.<br>2. I₁ + I₂ = 1  y  30 · I₁ = 20 · I₂.<br>3. De la segunda, I₁ = 20 · I₂ / 30. Reemplazá eso en la primera y despejá I₂. |
