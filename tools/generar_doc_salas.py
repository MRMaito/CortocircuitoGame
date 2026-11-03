"""Genera docs/SALAS.md (el catálogo de salas) a partir de data/salas.json.
Correrlo cada vez que se cambian las salas:  python tools/generar_doc_salas.py
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
salas = json.loads((RAIZ / "data" / "salas.json").read_text(encoding="utf-8"))["salas"]


def num(x):
    texto = f"{x:,.6f}".rstrip("0").rstrip(".")
    return texto.replace(",", "_").replace(".", ",").replace("_", ".")


lineas = [
    "# Catálogo de salas",
    "",
    "> Este archivo se genera solo con `python tools/generar_doc_salas.py` a partir de `data/salas.json`. "
    "No lo edites a mano: cambiá las salas y volvé a generarlo.",
    "",
    f"El juego tiene **{len(salas)} salas** ordenadas de menor a mayor dificultad. "
    "Cada partida elige al azar uno de los desafíos de cada sala.",
    "",
    "## Resumen",
    "",
    "| # | Sala | Contenido de matemática | Fórmula de la ficha técnica | Desafíos |",
    "| --- | --- | --- | --- | --- |",
]
for s in salas:
    lineas.append(
        f"| {s['numero']} | [{s['nombre']}](#sala-{s['numero']}) | {s['tema']} | `{s['ficha']['formula']}` | {len(s['desafios'])} |"
    )

for s in salas:
    lineas += [
        "",
        f"## Sala {s['numero']}",
        "",
        f"### {s['nombre']}",
        "",
        f"**Contenido:** {s['tema']}  ",
        f"**Historia:** {s['historia']}",
        "",
        f"**Ficha técnica ({s['ficha']['titulo']}):** `{s['ficha']['formula']}`. {s['ficha']['explicacion']}",
        "",
        "| Desafío | Enunciado | Respuesta | Pistas |",
        "| --- | --- | --- | --- |",
    ]
    for d in s["desafios"]:
        respuesta = "<br>".join(f"{r['etiqueta']} = {num(r['valor'])} {r['unidad']}" for r in d["respuestas"])
        pistas = "<br>".join(f"{i}. {p}" for i, p in enumerate(d["pistas"], 1))
        lineas.append(f"| `{d['id']}` | {d['enunciado']} | {respuesta} | {pistas} |")

(RAIZ / "docs").mkdir(exist_ok=True)
(RAIZ / "docs" / "SALAS.md").write_text("\n".join(lineas) + "\n", encoding="utf-8")
print(f"docs/SALAS.md generado: {len(salas)} salas, {sum(len(s['desafios']) for s in salas)} desafíos")
