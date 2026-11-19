"""Extrae los endpoints reales de backend/app/routers (rama origin/main) con su rol.
Uso: python endpoints.py <ruta_repo> <salida_json>"""
import subprocess, re, json, sys, ast
repo, salida = sys.argv[1], sys.argv[2]
def show(path):
    return subprocess.run(["git", "-C", repo, "show", "origin/main:" + path],
                          capture_output=True).stdout.decode("utf8", "ignore")

main = show("backend/app/main.py")
prefijos = dict((m.group(1), m.group(2)) for m in re.finditer(r'include_router\((\w+)\.router,\s*prefix="([^"]*)"', main))

res = []
for mod, pref in prefijos.items():
    src = show(f"backend/app/routers/{mod}.py")
    if not src:
        continue
    # dependencias con nombre definidas a nivel de módulo: X = require_roles(...)
    alias = {}
    for m in re.finditer(r'^(\w+)\s*=\s*(require_roles\([^\n]*\))', src, re.M):
        alias[m.group(1)] = m.group(2)
    try:
        tree = ast.parse(src)
    except SyntaxError:
        continue
    lines = src.splitlines()
    for node in ast.walk(tree):
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        for dec in node.decorator_list:
            if not (isinstance(dec, ast.Call) and isinstance(dec.func, ast.Attribute)
                    and isinstance(dec.func.value, ast.Name) and dec.func.value.id == "router"):
                continue
            metodo = dec.func.attr.upper()
            if metodo not in ("GET", "POST", "PUT", "PATCH", "DELETE"):
                continue
            ruta = dec.args[0].value if dec.args and isinstance(dec.args[0], ast.Constant) else ""
            firma = "\n".join(lines[node.lineno - 1: (node.body[0].lineno - 1)])
            roles = set(re.findall(r'RolUsuario\.(\w+)', firma))
            for a, d in alias.items():
                if a in firma:
                    roles |= set(re.findall(r'RolUsuario\.(\w+)', d))
            if "get_current_cliente" in firma or "cliente_actual" in firma:
                acceso = "cliente (PIN)"
            elif roles:
                acceso = ", ".join(sorted(roles))
            elif "get_current_user" in firma:
                acceso = "autenticado"
            else:
                acceso = "público"
            doc = ast.get_docstring(node) or ""
            doc = doc.strip().split("\n\n")[0].replace("\n", " ")
            res.append({"modulo": mod, "metodo": metodo, "ruta": (pref + ruta) or pref,
                        "funcion": node.name, "acceso": acceso, "doc": doc[:160]})
res.sort(key=lambda r: (r["modulo"], r["ruta"], r["metodo"]))
json.dump(res, open(salida, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(res), "endpoints")
from collections import Counter
print(Counter(r["modulo"] for r in res))
print(Counter(r["acceso"] for r in res).most_common(12))
