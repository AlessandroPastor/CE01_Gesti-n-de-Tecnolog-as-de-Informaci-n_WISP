# -*- coding: utf-8 -*-
"""
Genera el catálogo de endpoints (anexo del entregable CE02 · S2-E3) a partir de
datos/endpoints_main.json, que se extrae del código real con:
    python tools/extraer_endpoints.py Z:/Wisp datos/endpoints_main.json
Uso:  python tools/catalogo_api.py      (desde la carpeta TI)
Salida: capitulos/linea2/tablas/catalogo_api.tex
"""
import json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
datos = json.load(open(os.path.join(BASE, "datos", "endpoints_main.json"), encoding="utf8"))

# Descripción breve para los endpoints que no tienen docstring en el código
DESC = {
 "POST /api/admin/backup": "Genera un respaldo de la base de datos en el servidor.",
 "GET /api/admin/backups": "Lista los respaldos disponibles.",
 "GET /api/admin/backups/download/{filename}": "Descarga un respaldo.",
 "POST /api/auth/login": "Inicio de sesión del personal; devuelve el JWT.",
 "GET /api/auth/me": "Datos del usuario que inició sesión.",
 "PUT /api/auth/password": "Cambia la contraseña propia.",
 "GET /api/auth/usuarios": "Lista el personal.",
 "POST /api/auth/usuarios": "Crea una cuenta de personal con su rol.",
 "GET /api/averias": "Lista averías con filtros por estado, zona y técnico.",
 "POST /api/averias": "Registra una avería de un cliente.",
 "GET /api/averias/{averia_id}": "Detalle de una avería.",
 "POST /api/averias/{averia_id}/asignar": "Asigna la avería a un técnico.",
 "GET /api/cajas-nap": "Lista cajas NAP (por zona).",
 "GET /api/cajas-nap/{caja_id}": "Detalle de la caja con su mapa de bornes.",
 "GET /api/cliente/me": "Cuenta del cliente: plan, estado y vencimiento.",
 "GET /api/cliente/mis-pagos": "Historial de pagos del cliente (paginado).",
 "GET /api/clientes/notificaciones": "Avisos del panel calculados en vivo: ventas por aprobar, instalaciones recientes o fallidas, averías demoradas y estado de WhatsApp.",
 "GET /api/clientes": "Lista paginada de clientes con filtros por zona, estado y tipo.",
 "POST /api/clientes": "Registra un cliente (queda pendiente de aprobación).",
 "DELETE /api/clientes/{cliente_id}": "Elimina un cliente no instalado.",
 "GET /api/clientes/{cliente_id}": "Ficha completa del cliente.",
 "PUT /api/clientes/{cliente_id}": "Actualiza los datos del cliente.",
 "POST /api/clientes/{cliente_id}/aprobar": "Aprueba la venta y la publica para el técnico de la zona.",
 "GET /api/clientes/{cliente_id}/calendario-pagos": "Calendario anual de pagos del cliente.",
 "POST /api/clientes/{cliente_id}/cortar": "Avisa por WhatsApp y corta el servicio en el MikroTik.",
 "GET /api/clientes/{cliente_id}/historial": "Bitácora del cliente (activaciones, cortes, pagos, cambios).",
 "POST /api/clientes/{cliente_id}/instalar": "Cierra la instalación: borne, ONU, evidencias y secreto PPPoE.",
 "POST /api/clientes/{cliente_id}/no-instalar": "Registra que no se pudo instalar, con motivo.",
 "GET /api/clientes/{cliente_id}/pppoe-status": "Estado de la sesión PPPoE en tiempo real.",
 "POST /api/clientes/{cliente_id}/reactivar": "Reactiva el servicio y extiende el vencimiento.",
 "POST /api/clientes/{cliente_id}/rechazar": "Rechaza la venta con motivo.",
 "GET /api/dashboard/ingresos-mensual": "Ingresos y gastos por mes para el gráfico.",
 "GET /api/dashboard/stats": "Indicadores del panel principal.",
 "GET /api/dashboard/ultimas-activaciones": "Últimas activaciones de clientes.",
 "GET /api/evidencias": "Lista fotos de evidencia por cliente, avería o retiro.",
 "POST /api/evidencias": "Sube una foto de evidencia.",
 "GET /api/evidencias/{evidencia_id}/archivo": "Descarga el archivo de una evidencia.",
 "GET /api/gastos": "Lista gastos operativos.",
 "POST /api/gastos": "Registra un gasto.",
 "GET /api/gastos/categorias": "Categorías de gasto usadas.",
 "DELETE /api/gastos/{gasto_id}": "Elimina un gasto.",
 "PUT /api/gastos/{gasto_id}": "Actualiza un gasto.",
 "GET /api/jornadas": "Lista jornadas de vendedores.",
 "GET /api/jornadas/activas": "Jornadas en curso con su última ubicación.",
 "POST /api/jornadas/finalizar": "El vendedor cierra su jornada.",
 "POST /api/jornadas/iniciar": "El vendedor inicia su jornada (ubicación de inicio).",
 "GET /api/jornadas/mi-jornada-activa": "Jornada en curso del vendedor.",
 "POST /api/jornadas/ping": "Registra un punto del recorrido.",
 "GET /api/jornadas/resumen-pasajes": "Resumen de pasajes y reintegros.",
 "PUT /api/jornadas/{jornada_id}/pasaje": "Registra el pasaje entregado.",
 "GET /api/jornadas/{jornada_id}/recorrido": "Recorrido de la jornada para el mapa.",
 "GET /api/mufas": "Lista mufas (por zona).",
 "DELETE /api/mufas/{mufa_id}": "Elimina una mufa.",
 "GET /api/mufas/{mufa_id}": "Detalle de la mufa con sus corridas.",
 "PUT /api/mufas/{mufa_id}": "Actualiza una mufa.",
 "GET /api/mufas/{mufa_id}/cajas-nap": "Cajas NAP que cuelgan de la mufa.",
 "POST /api/mufas/{mufa_id}/corridas": "Agrega una corrida de fibra (nombre, color, metros, trazado).",
 "DELETE /api/mufas/{mufa_id}/corridas/{corrida_id}": "Elimina una corrida.",
 "PUT /api/mufas/{mufa_id}/corridas/{corrida_id}": "Actualiza una corrida.",
 "GET /api/onus": "Inventario de ONU con filtros por estado y técnico.",
 "GET /api/onus/{onu_id}": "Detalle e historial de una ONU.",
 "GET /api/ordenes-retiro": "Lista órdenes de retiro.",
 "POST /api/ordenes-retiro": "Crea una orden de retiro de equipo.",
 "GET /api/ordenes-retiro/{orden_id}": "Detalle de la orden de retiro.",
 "POST /api/ordenes-retiro/{orden_id}/asignar": "Asigna la orden a un técnico.",
 "GET /api/pagos": "Lista pagos con filtros.",
 "POST /api/pagos": "Registra un pago (o adelanto), emite recibo y reactiva si corresponde.",
 "GET /api/pagos/reporte-caja": "Reporte de caja del día.",
 "GET /api/pagos/reporte-mensual-zonas": "Recaudación del mes por zona.",
 "GET /api/pagos/resumen-mensual": "Resumen mensual de ingresos.",
 "DELETE /api/pagos/{pago_id}": "Elimina un pago registrado por error.",
 "GET /api/pagos/{pago_id}": "Detalle de un pago.",
 "GET /api/pagos/{pago_id}/comprobante": "Descarga el comprobante adjunto.",
 "POST /api/pagos/{pago_id}/comprobante": "Adjunta la imagen del comprobante.",
 "GET /api/permisos/modulos": "Catálogo de módulos del panel y de la app.",
 "GET /api/permisos/modulos-padre": "Grupos del menú.",
 "POST /api/permisos/modulos-padre": "Crea un grupo del menú.",
 "PUT /api/permisos/modulos-padre/orden": "Ordena los grupos del menú.",
 "DELETE /api/permisos/modulos-padre/{padre_id}": "Elimina un grupo vacío.",
 "PUT /api/permisos/modulos-padre/{padre_id}": "Renombra un grupo o cambia su icono.",
 "PUT /api/permisos/modulos/{modulo_id}/padre": "Mueve un módulo a otro grupo.",
 "GET /api/permisos/roles": "Lista roles con sus módulos.",
 "POST /api/permisos/roles": "Crea un rol a partir de un tipo de cuenta.",
 "DELETE /api/permisos/roles/{rol_id}": "Elimina un rol sin usuarios.",
 "PUT /api/permisos/roles/{rol_id}": "Renombra o describe un rol.",
 "GET /api/permisos/mis-modulos": "Módulos visibles para quien consulta (menú del panel o barra de la app).",
 "GET /api/planes": "Lista planes comerciales.",
 "POST /api/planes": "Crea un plan y su perfil PPPoE en los routers.",
 "DELETE /api/planes/{plan_id}": "Desactiva un plan.",
 "PUT /api/planes/{plan_id}": "Actualiza un plan y sincroniza los perfiles.",
 "POST /api/whatsapp/aviso-cobro/{cliente_id}": "Envía el aviso de cobro a un cliente.",
 "POST /api/whatsapp/aviso-corte/{cliente_id}": "Envía el aviso de corte a un cliente.",
 "GET /api/whatsapp/masivos": "Lista envíos masivos.",
 "POST /api/whatsapp/masivos": "Crea un envío masivo por zona y estado.",
 "GET /api/whatsapp/masivos/destinatarios-count": "Cuenta destinatarios antes de enviar.",
 "GET /api/whatsapp/masivos/{mensaje_id}": "Avance y resultado por destinatario.",
 "POST /api/whatsapp/masivos/{mensaje_id}/cancelar": "Cancela un envío en curso.",
 "GET /api/whatsapp/qr": "Código QR para vincular el número.",
 "POST /api/whatsapp/recordatorio-preventivo/ejecutar": "Ejecuta a mano el recordatorio diario.",
 "POST /api/whatsapp/send": "Envía un mensaje manual.",
 "GET /api/whatsapp/status": "Estado de la sesión de WhatsApp.",
 "GET /api/zonas": "Lista zonas (la red solo la ve el administrador).",
 "POST /api/zonas": "Crea una zona.",
 "DELETE /api/zonas/{zona_id}": "Elimina una zona sin clientes.",
 "GET /api/zonas/{zona_id}": "Detalle de la zona.",
 "PUT /api/zonas/{zona_id}": "Actualiza la zona y su conexión al router.",
 "POST /api/zonas/{zona_id}/exec": "Ejecuta un comando RouterOS restringido (terminal).",
 "DELETE /api/zonas/{zona_id}/tecnicos/{tecnico_id}": "Quita un técnico de la zona.",
 "POST /api/zonas/{zona_id}/tecnicos/{tecnico_id}": "Asigna un técnico a la zona.",
 "GET /api/zonas/{zona_id}/wireguard-status": "Ping, SSH y handshake del túnel de la zona.",
 "DELETE /api/zonas/{zona_id}/wireguard/peer": "Revoca el peer WireGuard de la zona.",
}
ACCESO_FIX = {"GET /api/permisos/mis-modulos": "autenticado (personal o cliente)"}

def tex(s):
    rep = {"\\": r"\textbackslash{}", "&": r"\&", "%": r"\%", "#": r"\#", "_": r"\_", "$": r"\$",
           "{": r"\{", "}": r"\}", "~": r"\textasciitilde{}", "`": "", "'": "'"}
    return "".join(rep.get(c, c) for c in str(s))

def ruta_tex(r):
    # permite cortes de línea después de cada "/"
    return r"\texttt{" + tex(r).replace("/", r"/\allowbreak{}") + "}"

def corto(doc):
    doc = re.sub(r"\s+", " ", doc).strip()
    m = re.match(r"(.+?[.!?])(\s|$)", doc)
    s = m.group(1) if m else doc
    s = re.sub(r"\s+—.*$", ".", s)
    return s if len(s) <= 120 else s[:117].rsplit(" ", 1)[0] + "…"

NOMBRES = {"admin": "Administración y respaldos", "auth": "Autenticación y usuarios", "averias": "Averías",
 "cajas_nap": "Cajas NAP y bornes", "cliente_app": "App del cliente", "clientes": "Clientes",
 "consultas": "Consulta DNI/RUC", "dashboard": "Dashboard", "evidencias": "Evidencias",
 "gastos": "Gastos", "jornadas": "Jornadas de vendedores", "mufas": "Mufas y corridas", "onus": "Inventario de ONU",
 "ordenes_retiro": "Órdenes de retiro", "pagos": "Pagos y reportes", "permisos": "Roles y módulos",
 "planes": "Planes", "whatsapp": "WhatsApp", "zonas": "Zonas y red"}

filas, mod = [], None
for e in datos:
    if e["modulo"] != mod:
        mod = e["modulo"]
        n = sum(1 for x in datos if x["modulo"] == mod)
        filas.append(r"\multicolumn{4}{l}{\cellcolor{upeublue!10}\textbf{%s} (\texttt{%s}, %d)} \\" % (tex(NOMBRES.get(mod, mod)), tex(mod), n))
    k = e["metodo"] + " " + e["ruta"]
    desc = corto(e["doc"]) if e["doc"] else DESC.get(k, "")
    acceso = ACCESO_FIX.get(k, e["acceso"]).replace("atencion_cliente", "atención").replace("vendedor_campo", "vendedor").replace("tecnico", "técnico")
    filas.append(" & ".join([r"\texttt{%s}" % e["metodo"], ruta_tex(e["ruta"]), tex(acceso), tex(desc)]) + r" \\")
filas.append(r"\multicolumn{4}{l}{\cellcolor{upeublue!10}\textbf{Salud del servicio} (\texttt{main})} \\")
filas.append(r"\texttt{GET} & \texttt{/api/health} & público & Verificación de que la API responde. \\")

d = os.path.join(BASE, "capitulos", "linea2", "tablas"); os.makedirs(d, exist_ok=True)
open(os.path.join(d, "catalogo_api.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")
sin = [e["metodo"] + " " + e["ruta"] for e in datos if not e["doc"] and (e["metodo"] + " " + e["ruta"]) not in DESC]
print(len(datos) + 1, "endpoints escritos; sin descripción:", sin)
