"""Genera data/salas.json con las 15 salas.
Las respuestas se CALCULAN a partir de los datos de cada desafío, para que no haya errores de tipeo.
Uso: python3 tools/generar_salas.py data/salas.json data/salas.json
"""
import json, math, sys

actual = json.load(open(sys.argv[1]))
previas = {s["id"]: s for s in actual["salas"]}


def num(x):
    """Formato argentino: coma decimal, sin ceros de más."""
    x = round(x, 6)
    if x == int(x):
        return f"{int(x):,}".replace(",", ".")
    return f"{x:.6f}".rstrip("0").replace(".", ",")


def resp(etiqueta, valor, unidad):
    return {"etiqueta": etiqueta, "valor": round(valor, 6), "unidad": unidad}


def desafio(id_, enunciado, respuestas, pistas, esquema):
    assert 1 <= len(pistas) <= 3
    return {"id": id_, "enunciado": enunciado, "respuestas": respuestas, "tolerancia": 0.01,
            "pistas": pistas, "esquema": esquema}


def sala(id_, nombre, tema, historia, ficha, desafios):
    return {"id": id_, "nombre": nombre, "tema": tema, "historia": historia,
            "ficha": dict(zip(["titulo", "formula", "explicacion"], ficha)), "desafios": desafios}


salas = []

# 1 y 2: ya existentes
salas.append(previas["fuente"])
salas.append(previas["almacen"])

# 3. La memoria: binario
def d_binario(bits):
    valor = int(bits, 2)
    pesos = [2 ** i for i in range(len(bits) - 1, -1, -1)]
    usados = [str(p) for p, b in zip(pesos, bits) if b == "1"]
    return desafio(
        f"sala3-{bits}",
        f"Los LEDs de la memoria muestran el código {bits} (encendido = 1, apagado = 0). ¿Qué número es en decimal?",
        [resp("Código", valor, "en decimal")],
        ["Cada posición vale el doble que la de su derecha, empezando por 1.",
         f"Los valores de las posiciones son {', '.join(str(p) for p in pesos)}.",
         f"Sumá los valores donde hay un 1: {' + '.join(usados)}"],
        {"tipo": "binario", "bits": bits})

salas.append(sala(
    "memoria", "La memoria", "Sistemas de numeración: binario",
    "La memoria de las puertas guarda el código de acceso en binario. Leé qué LEDs están encendidos y pasá el número a decimal para desbloquearla.",
    ("Sistema binario", "1011 = 1·8 + 0·4 + 1·2 + 1·1 = 11",
     "Cada posición vale el doble que la de su derecha: 1, 2, 4, 8, 16, 32... Sumá los valores de las posiciones que tienen un 1."),
    [d_binario("1011"), d_binario("11010"), d_binario("100101")]))

# 4. Código de colores
COLORES = ["negro", "marrón", "rojo", "naranja", "amarillo", "verde", "azul", "violeta", "gris", "blanco"]

def d_colores(b1, b2, b3):
    v1, v2, v3 = COLORES.index(b1), COLORES.index(b2), COLORES.index(b3)
    valor = (v1 * 10 + v2) * 10 ** v3
    return desafio(
        f"sala4-{b1}-{b2}-{b3}",
        f"La resistencia tiene las bandas {b1}, {b2} y {b3}. ¿Cuánto mide?",
        [resp("R", valor, "Ω")],
        [f"{b1.capitalize()} vale {v1} y {b2} vale {v2}: las dos primeras bandas forman el número {v1}{v2}.",
         f"La tercera banda, {b3}, vale {v3}: multiplicá por 10 elevado a {v3}.",
         f"R = {v1}{v2} · {10 ** v3}"],
        {"tipo": "colores", "bandas": [b1, b2, b3]})

salas.append(sala(
    "colores", "El código de colores", "Sistema posicional y potencias de 10",
    "Las resistencias del cajón perdieron la etiqueta y solo quedan sus bandas de colores. Leelas para saber cuánto mide cada una.",
    ("Código de colores", "R = (1ª banda · 10 + 2ª banda) · 10^(3ª banda)",
     "Negro 0, marrón 1, rojo 2, naranja 3, amarillo 4, verde 5, azul 6, violeta 7, gris 8, blanco 9. La tercera banda dice cuántos ceros agregar."),
    [d_colores("rojo", "violeta", "naranja"), d_colores("marrón", "negro", "rojo"), d_colores("amarillo", "violeta", "marrón")]))

# 5. Control de calidad: porcentajes
def d_tolerancia(r, t):
    delta = r * t / 100
    return desafio(
        f"sala5-{r}-{t}",
        f"Una resistencia de {num(r)} Ω tiene una tolerancia de ±{num(t)} %. ¿Cuáles son sus valores mínimo y máximo aceptables?",
        [resp("R mín", r - delta, "Ω"), resp("R máx", r + delta, "Ω")],
        ["Calculá primero cuántos ohms representa el porcentaje.",
         f"El {num(t)} % de {num(r)} es {num(r)} · {num(t)} / 100 = {num(delta)} Ω.",
         f"R mín = {num(r)} − {num(delta)} y R máx = {num(r)} + {num(delta)}"],
        {"tipo": "tolerancia", "nominal": f"{num(r)} Ω", "tolerancia": f"±{num(t)} %"})

salas.append(sala(
    "calidad", "El control de calidad", "Porcentajes",
    "Antes de instalar una resistencia hay que verificar que su valor real esté dentro de la tolerancia que indica el fabricante.",
    ("Tolerancia", "R mín = R − R · t / 100   y   R máx = R + R · t / 100",
     "La tolerancia es el porcentaje que el valor real puede alejarse del nominal, hacia arriba o hacia abajo."),
    [d_tolerancia(1000, 5), d_tolerancia(220, 10), d_tolerancia(4700, 2)]))

# 6. La batería: regla de tres
def d_bateria(cap, consumo, aparato):
    horas = cap / consumo
    return desafio(
        f"sala6-{cap}-{consumo}",
        f"La batería de emergencia tiene {num(cap)} mAh y {aparato} consume {num(consumo)} mA. ¿Cuántas horas puede funcionar?",
        [resp("t", horas, "h")],
        ["mAh significa: cuántos miliamperes puede entregar durante una hora.",
         f"Si a {num(cap)} mA dura 1 hora, a {num(consumo)} mA dura {num(cap)} / {num(consumo)} veces más.",
         f"t = {num(cap)} / {num(consumo)}"],
        {"tipo": "lampara", "simbolo": "lampara", "fuente": f"{num(cap)} mAh", "datos": [f"{num(consumo)} mA"]})

salas.append(sala(
    "bateria", "La batería", "Proporcionalidad y regla de tres",
    "La batería de emergencia tiene que alimentar las luces de evacuación. Calculá cuánto tiempo aguanta antes de agotarse.",
    ("Capacidad de una batería", "t = capacidad (mAh) / consumo (mA)",
     "Con la mitad de consumo la batería dura el doble: la duración es inversamente proporcional a la corriente que se consume."),
    [d_bateria(2000, 250, "la luz de evacuación"), d_bateria(3000, 500, "la alarma"), d_bateria(2400, 200, "el cartel de salida")]))

# 7. El tablero (ex sala 3)
salas.append(previas["tablero"])

# 8. Divisor de tensión
def d_divisor(vin, r1, r2):
    vout = vin * r2 / (r1 + r2)
    return desafio(
        f"sala8-{vin}-{r1}-{r2}",
        f"Un divisor de tensión recibe {num(vin)} V y tiene R₁ = {num(r1)} kΩ y R₂ = {num(r2)} kΩ. ¿Qué tensión le llega al sensor, conectado sobre R₂?",
        [resp("V salida", vout, "V")],
        ["La tensión se reparte en proporción a cada resistencia.",
         f"R₂ se queda con la fracción {num(r2)} / ({num(r1)} + {num(r2)}) = {num(r2)} / {num(r1 + r2)} de la tensión.",
         f"V salida = {num(vin)} · {num(r2)} / {num(r1 + r2)}"],
        {"tipo": "divisor", "fuente": f"{num(vin)} V", "r1": f"{num(r1)} kΩ", "r2": f"{num(r2)} kΩ"})

salas.append(sala(
    "divisor", "El divisor de tensión", "Proporciones",
    "El sensor de la puerta funciona con menos tensión que la fuente. Un divisor con dos resistencias baja la tensión: calculá cuánto le llega.",
    ("Divisor de tensión", "V salida = V entrada · R₂ / (R₁ + R₂)",
     "La tensión se reparte entre las dos resistencias en proporción a sus valores. R₂ se queda con la fracción R₂ / (R₁ + R₂)."),
    [d_divisor(12, 2, 1), d_divisor(9, 1, 2), d_divisor(15, 4, 1)]))

# 9. Transformador
def d_trafo_v(v1, n1, n2):
    v2 = v1 * n2 / n1
    return desafio(
        f"sala9-v-{v1}-{n1}-{n2}",
        f"El transformador recibe {num(v1)} V en el primario, que tiene {num(n1)} vueltas. El secundario tiene {num(n2)} vueltas. ¿Qué tensión entrega?",
        [resp("V₂", v2, "V")],
        ["La tensión es directamente proporcional a la cantidad de vueltas.",
         f"Planteá la proporción: V₂ / {num(v1)} = {num(n2)} / {num(n1)}.",
         f"V₂ = {num(v1)} · {num(n2)} / {num(n1)}"],
        {"tipo": "transformador", "izquierda": [f"{num(v1)} V", f"{num(n1)} vueltas"], "derecha": [f"{num(n2)} vueltas"]})

def d_trafo_n(v1, n1, v2):
    n2 = n1 * v2 / v1
    return desafio(
        f"sala9-n-{v1}-{n1}-{v2}",
        f"El primario recibe {num(v1)} V y tiene {num(n1)} vueltas. Se necesitan {num(v2)} V a la salida. ¿Cuántas vueltas tiene que tener el secundario?",
        [resp("N₂", n2, "vueltas")],
        ["La tensión es directamente proporcional a la cantidad de vueltas.",
         f"Planteá la proporción: N₂ / {num(n1)} = {num(v2)} / {num(v1)}.",
         f"N₂ = {num(n1)} · {num(v2)} / {num(v1)}"],
        {"tipo": "transformador", "izquierda": [f"{num(v1)} V", f"{num(n1)} vueltas"], "derecha": [f"{num(v2)} V"]})

salas.append(sala(
    "transformador", "El transformador", "Proporcionalidad directa",
    "Para cargar la batería de emergencia hay que bajar los 220 V de la red. El transformador lo hace con dos bobinados de distinta cantidad de vueltas.",
    ("Relación de transformación", "V₂ / V₁ = N₂ / N₁",
     "Si el secundario tiene la mitad de vueltas que el primario, entrega la mitad de tensión. Armá la proporción y despejá lo que falta."),
    [d_trafo_v(220, 1000, 50), d_trafo_n(220, 1000, 22), d_trafo_v(110, 500, 25)]))

# 10. La lámpara: P = V · I
def d_potencia(incognita, v=None, i=None, p=None):
    if incognita == "P":
        p = v * i
        enun = f"La lámpara de emergencia funciona con {num(v)} V y consume {num(i)} A. ¿Qué potencia tiene?"
        r = resp("P", p, "W"); datos = [f"{num(v)} V", f"{num(i)} A"]
        pistas = ["La potencia es tensión por corriente.", "P = V · I", f"P = {num(v)} · {num(i)}"]
    elif incognita == "I":
        i = p / v
        enun = f"El reflector del pasillo es de {num(p)} W y se conecta a {num(v)} V. ¿Qué corriente consume?"
        r = resp("I", i, "A"); datos = [f"{num(p)} W", f"{num(v)} V"]
        pistas = ["Partí de P = V · I y despejá I.", "I = P / V", f"I = {num(p)} / {num(v)}"]
    else:
        v = p / i
        enun = f"Una lámpara de {num(p)} W consume {num(i)} A. ¿Con qué tensión funciona?"
        r = resp("V", v, "V"); datos = [f"{num(p)} W", f"{num(i)} A"]
        pistas = ["Partí de P = V · I y despejá V.", "V = P / I", f"V = {num(p)} / {num(i)}"]
    return desafio(f"sala10-{incognita}-{num(p)}", enun, [r], pistas,
                   {"tipo": "lampara", "simbolo": "lampara", "datos": datos})

salas.append(sala(
    "lampara", "La lámpara", "Ecuaciones: despeje de fórmulas",
    "Las lámparas del pasillo están quemadas. Para pedir los repuestos correctos necesitás calcular su potencia, su corriente o su tensión.",
    ("Potencia eléctrica", "P = V · I",
     "La potencia se mide en watts (W). Si conocés dos de los tres valores, despejá el tercero."),
    [d_potencia("P", v=12, i=0.5), d_potencia("I", v=220, p=1100), d_potencia("V", p=60, i=5)]))

# 11. Osciloscopio: pendiente
def d_vi(p1, p2):
    (v1, i1), (v2, i2) = p1, p2
    r = (v2 - v1) / (i2 - i1)
    return desafio(
        f"sala11-{num(r)}",
        f"La recta del osciloscopio pasa por los puntos ({num(v1)} V; {num(i1)} A) y ({num(v2)} V; {num(i2)} A). ¿Cuánto vale la resistencia?",
        [resp("R", r, "Ω")],
        ["La resistencia es el cociente entre la variación de tensión y la variación de corriente.",
         f"ΔV = {num(v2)} − {num(v1)} = {num(v2 - v1)} V  y  ΔI = {num(i2)} − {num(i1)} = {num(i2 - i1)} A.",
         f"R = {num(v2 - v1)} / {num(i2 - i1)}"],
        {"tipo": "grafico-vi", "puntos": [[v1, i1], [v2, i2]]})

salas.append(sala(
    "osciloscopio", "El osciloscopio", "Función lineal y pendiente",
    "La pantalla del osciloscopio muestra cómo cambia la corriente cuando sube la tensión. La recta delata qué resistencia hay en el circuito.",
    ("Gráfico tensión-corriente", "R = ΔV / ΔI",
     "En una resistencia, la corriente es proporcional a la tensión: el gráfico es una recta que pasa por el origen. Tomá dos puntos y dividí las diferencias."),
    [d_vi((2, 0.01), (6, 0.03)), d_vi((3, 0.02), (9, 0.06)), d_vi((4, 0.008), (10, 0.02))]))

# 12. La estufa: raíz cuadrada
def d_estufa(p, r):
    i = math.sqrt(p / r)
    return desafio(
        f"sala12-{p}-{r}",
        f"La estufa del laboratorio tiene una resistencia de {num(r)} Ω y disipa {num(p)} W. ¿Qué corriente circula por ella?",
        [resp("I", i, "A")],
        ["Usá P = I² · R y despejá I.",
         f"I² = P / R = {num(p)} / {num(r)} = {num(p / r)}.",
         f"I = √{num(p / r)}"],
        {"tipo": "lampara", "simbolo": "resistencia", "datos": [f"{num(r)} Ω", f"{num(p)} W"]})

salas.append(sala(
    "estufa", "La estufa", "Potencias y raíz cuadrada",
    "La estufa del laboratorio tiene la placa quemada. Sabés su potencia y su resistencia: calculá qué corriente necesita el repuesto.",
    ("Potencia en una resistencia", "P = I² · R   →   I = √(P / R)",
     "Dividí la potencia por la resistencia para obtener I². Después sacá la raíz cuadrada."),
    [d_estufa(4, 100), d_estufa(18, 2), d_estufa(50, 8)]))

# 13. El puente de Wheatstone
def d_puente(r1, r2, r3):
    rx = r3 * r2 / r1
    return desafio(
        f"sala13-{r1}-{r2}-{r3}",
        f"El puente está equilibrado con R₁ = {num(r1)} Ω, R₂ = {num(r2)} Ω y R₃ = {num(r3)} Ω. ¿Cuánto vale la resistencia desconocida Rx?",
        [resp("Rx", rx, "Ω")],
        ["En equilibrio se cumple la proporción R₁ / R₂ = R₃ / Rx.",
         f"{num(r1)} / {num(r2)} = {num(r3)} / Rx. Multiplicá en cruz.",
         f"Rx = {num(r3)} · {num(r2)} / {num(r1)}"],
        {"tipo": "puente", "r1": f"{num(r1)} Ω", "r2": f"{num(r2)} Ω", "r3": f"{num(r3)} Ω"})

salas.append(sala(
    "puente", "El puente", "Proporciones y ecuaciones con fracciones",
    "Un puente de Wheatstone mide resistencias desconocidas: cuando el medidor del centro marca cero, las resistencias guardan la misma proporción.",
    ("Puente equilibrado", "R₁ / R₂ = R₃ / Rx",
     "Si el puente está equilibrado, armá la proporción y despejá Rx multiplicando en cruz."),
    [d_puente(100, 200, 50), d_puente(300, 100, 60), d_puente(150, 450, 40)]))

# 14. La señal: período y seno
def d_senal(t_ms, vmax, ang):
    f = 1000 / t_ms
    v = vmax * math.sin(math.radians(ang))
    return desafio(
        f"sala14-{t_ms}-{vmax}-{ang}",
        f"La señal tiene un período de {num(t_ms)} ms y un valor máximo de {num(vmax)} V. ¿Cuál es su frecuencia y cuánto vale la tensión cuando el ángulo es de {num(ang)}°?",
        [resp("f", f, "Hz"), resp("v", v, "V")],
        ["La frecuencia es la inversa del período, con el período en segundos.",
         f"{num(t_ms)} ms = {num(t_ms / 1000)} s. Para la tensión: sen({num(ang)}°) = {num(math.sin(math.radians(ang)))}.",
         f"f = 1 / {num(t_ms / 1000)}  y  v = {num(vmax)} · {num(math.sin(math.radians(ang)))}"],
        {"tipo": "senoidal", "periodo": f"{num(t_ms)} ms", "vmax": f"{num(vmax)} V", "angulo": ang})

salas.append(sala(
    "senal", "La señal", "Función seno y período",
    "La red eléctrica no entrega una tensión fija: oscila como una onda senoidal. Para sincronizar el generador hay que leer bien la señal.",
    ("Señal senoidal", "f = 1 / T   y   v = V máx · sen(α)",
     "La frecuencia (en hertz) es la inversa del período (en segundos). El valor de la tensión en un instante es el valor máximo por el seno del ángulo."),
    [d_senal(20, 10, 30), d_senal(10, 12, 30), d_senal(50, 8, 90)]))

# 15. La salida: sistema 2x2
def d_kirchhoff(it, r1, r2):
    # I1 + I2 = It  y  r1·I1 = r2·I2  →  I1 = It · r2 / (r1 + r2)
    i1 = it * r2 / (r1 + r2)
    i2 = it - i1
    return desafio(
        f"sala15-{num(it)}-{r1}-{r2}",
        f"Entran {num(it)} A y se reparten entre dos ramas en paralelo de {num(r1)} Ω y {num(r2)} Ω. ¿Cuánta corriente pasa por cada rama?",
        [resp("I₁", i1, "A"), resp("I₂", i2, "A")],
        ["Planteá dos ecuaciones: la suma de las corrientes y la igualdad de tensiones.",
         f"I₁ + I₂ = {num(it)}  y  {num(r1)} · I₁ = {num(r2)} · I₂.",
         f"De la segunda, I₁ = {num(r2)} · I₂ / {num(r1)}. Reemplazá eso en la primera y despejá I₂."],
        {"tipo": "kirchhoff", "total": f"{num(it)} A", "r1": f"{num(r1)} Ω", "r2": f"{num(r2)} Ω"})

salas.append(sala(
    "salida", "La salida", "Sistemas de ecuaciones 2×2",
    "La puerta final tiene dos circuitos en paralelo que necesitan la corriente justa. Repartí la corriente total entre las ramas para abrirla y escapar.",
    ("Leyes de Kirchhoff", "I = I₁ + I₂   y   R₁ · I₁ = R₂ · I₂",
     "La corriente total se reparte entre las ramas, y las dos ramas en paralelo tienen la misma tensión. Es un sistema de dos ecuaciones con dos incógnitas."),
    [d_kirchhoff(0.6, 10, 20), d_kirchhoff(0.9, 20, 10), d_kirchhoff(1, 30, 20)]))

# Numerar y ordenar claves
final = []
for n, s in enumerate(salas, 1):
    final.append({"numero": n, **{k: v for k, v in s.items() if k != "numero"}})
    for d in s["desafios"]:
        d["id"] = (f"sala{n}-" + d["id"].split("-", 1)[1]).replace(",", "_").replace(".", "")

json.dump({"salas": final}, open(sys.argv[2], "w"), ensure_ascii=False, indent=2)
open(sys.argv[2], "a").write("\n")

# Resumen para revisar a mano
for s in final:
    print(f"{s['numero']:>2} {s['nombre']}")
    for d in s["desafios"]:
        print("     ", d["id"], "→", ", ".join(f"{r['etiqueta']}={r['valor']} {r['unidad']}" for r in d["respuestas"]))
