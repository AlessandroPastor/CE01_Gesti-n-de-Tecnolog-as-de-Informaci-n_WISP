# -*- coding: utf-8 -*-
"""
Mide tiempos de respuesta del sistema en producción (https://wispfibra.com).
Carga ligera: N peticiones secuenciales por ruta, solo rutas públicas.
Uso:  python tools/medir_desempeno.py [N]     (desde la carpeta TI; N=30 por defecto)
Salida: datos/desempeno_AAAA-MM-DD.csv y capitulos/linea2/tablas/desempeno.tex
"""
import subprocess, sys, os, csv, statistics, datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = int(sys.argv[1]) if len(sys.argv) > 1 else 30
RUTAS = [
    ("Sitio público", "https://wispfibra.com/"),
    ("Panel (ingreso)", "https://wispfibra.com/app/"),
    ("API: salud", "https://wispfibra.com/api/health"),
    ("API: zonas públicas", "https://wispfibra.com/api/zonas/publicas"),
    ("API: resumen público", "https://wispfibra.com/api/zonas/publicas/resumen"),
]
FMT = "%{http_code};%{time_connect};%{time_appconnect};%{time_starttransfer};%{time_total};%{size_download}"

def medir(url):
    r = subprocess.run(["curl", "-s", "-o", os.devnull, "-m", "20", "-w", FMT, url],
                       capture_output=True, text=True)
    p = r.stdout.strip().split(";")
    return {"codigo": p[0], "conexion": float(p[1]) * 1000, "tls": float(p[2]) * 1000,
            "ttfb": float(p[3]) * 1000, "total": float(p[4]) * 1000, "bytes": int(float(p[5]))}

def pct(v, q):
    v = sorted(v); k = (len(v) - 1) * q; f = int(k); c = min(f + 1, len(v) - 1)
    return v[f] + (v[c] - v[f]) * (k - f)

hoy = datetime.date.today().isoformat()
filas, resumen = [], []
for nombre, url in RUTAS:
    ms = [medir(url) for _ in range(N)]
    for i, m in enumerate(ms, 1):
        filas.append({"ruta": nombre, "url": url, "n": i, **m})
    ok = [m for m in ms if m["codigo"].startswith("2")]
    tot = [m["total"] for m in ok]; tt = [m["ttfb"] for m in ok]
    resumen.append({"ruta": nombre, "url": url, "ok": len(ok), "n": N,
                    "ttfb_med": statistics.median(tt) if tt else 0,
                    "p50": statistics.median(tot) if tot else 0,
                    "p95": pct(tot, 0.95) if tot else 0,
                    "max": max(tot) if tot else 0,
                    "kb": (statistics.median([m["bytes"] for m in ok]) / 1024) if ok else 0})
    r = resumen[-1]
    print(f"{nombre:22} ok {r['ok']}/{N}  TTFB {r['ttfb_med']:7.1f} ms  p50 {r['p50']:7.1f}  p95 {r['p95']:7.1f}  max {r['max']:7.1f}  {r['kb']:.1f} KB")

os.makedirs(os.path.join(BASE, "datos"), exist_ok=True)
with open(os.path.join(BASE, "datos", f"desempeno_{hoy}.csv"), "w", newline="", encoding="utf8") as f:
    w = csv.DictWriter(f, fieldnames=list(filas[0].keys())); w.writeheader(); w.writerows(filas)

lineas = []
for r in resumen:
    lineas.append(r"%s & %d/%d & %.0f & %.0f & %.0f & %.0f & %.1f \\" % (
        r["ruta"], r["ok"], r["n"], r["ttfb_med"], r["p50"], r["p95"], r["max"], r["kb"]))
d = os.path.join(BASE, "capitulos", "linea2", "tablas"); os.makedirs(d, exist_ok=True)
open(os.path.join(d, "desempeno.tex"), "w", encoding="utf8").write("\n".join(lineas) + "\n")
print("CSV y tabla escritos;", hoy)
