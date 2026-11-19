# -*- coding: utf-8 -*-
"""
Datos del SGSI de WISP (CE03 · S2-E1) — fuente única para:
  * las tablas LaTeX del capítulo (capitulos/linea3/tablas/*.tex)
  * el libro Excel de productos obligatorios (sgsi/WISP_SGSI_Matrices.xlsx)
Ejecutar:  python sgsi/sgsi_datos.py   (desde la carpeta TI)
Alcance: infraestructura REAL en operación (servidor dockerizado de la oficina,
publicación de wispfibra.com por Cloudflare Tunnel + DNS, VPS con el hub
WireGuard y 13 zonas cuya segmentación real está en sucascoultimo.rsc). Fecha de corte: 18/11/2026.
"""
import os

# ---------------------------------------------------------------------------
# 1. INVENTARIO DE ACTIVOS
# (id, grupo, activo, propietario, ubicación, C, I, D, clasificación, criticidad)
# ---------------------------------------------------------------------------
ACTIVOS = [
 ("A01","Información","Base de datos de clientes, cobros y planta (PostgreSQL 15)","Resp. de sistemas","Contenedor wisp_postgres, volumen postgres_data","A","A","A","Confidencial","Crítica"),
 ("A02","Información","Evidencias fotográficas (fachadas, cajas NAP, comprobantes)","Resp. de sistemas","Servidor de oficina, /opt/wisp-isp/media","A","M","M","Confidencial","Alta"),
 ("A03","Información","Credenciales PPPoE y de routers guardadas en la base","Resp. de sistemas","Tablas clientes y zonas","A","A","M","Confidencial","Crítica"),
 ("A04","Información","Secretos del sistema: .env, llaves SSH, llaves WireGuard, token del túnel","Resp. de infraestructura","Servidor de oficina, VPS, routers","A","A","A","Confidencial","Crítica"),
 ("A05","Información","Configuraciones de los routers de zona (.rsc)","Resp. de infraestructura","Routers y copia del administrador","M","A","A","Confidencial","Alta"),
 ("A06","Información","Respaldos de la base de datos (pg_dump)","Resp. de sistemas","/opt/wisp-isp/backups y laptop (copia semanal)","A","A","A","Confidencial","Alta"),
 ("A07","Información","Registros (logs) de contenedores, Nginx y routers","Oficial de seguridad","Servidor de oficina y routers","M","A","M","Interna","Media"),
 ("A08","Software","Sistema de gestión: API FastAPI, panel React, sitio público","Resp. de sistemas","Contenedores wisp_backend, wisp_frontend, wisp_web","A","A","A","Confidencial","Crítica"),
 ("A09","Software","App móvil (técnico, vendedor, cliente)","Resp. de sistemas","Celulares del personal y clientes","M","M","M","Interna","Media"),
 ("A10","Software","Servicio de WhatsApp y su sesión vinculada","Resp. de sistemas","Contenedor wisp_whatsapp, volumen whatsapp_session","A","M","M","Confidencial","Alta"),
 ("A11","Software","Publicación de wispfibra.com: Nginx y conector del túnel","Resp. de infraestructura","Contenedores wisp_nginx y wisp_cloudflared","M","A","A","Pública","Alta"),
 ("A12","Infraestructura","Servidor de oficina (host Docker, Ubuntu 24.04, AMD A8-7600, 4 GB, disco único)","Resp. de infraestructura","Oficina central","A","A","A","Confidencial","Crítica"),
 ("A13","Infraestructura","Router de la oficina (salida a internet, sin puertos de entrada)","Resp. de infraestructura","Oficina central","M","A","A","Interna","Alta"),
 ("A14","Infraestructura","Segmentación de red de cada zona: VLAN 10 de transporte GPON/PPPoE (bridgeLAN) y red de gestión de la OLT (ether9)","Resp. de infraestructura","Routers de zona","M","A","A","Interna","Alta"),
 ("A15","Infraestructura","UPS y energía del servidor","Resp. de infraestructura","Oficina central","B","B","A","Interna","Alta"),
 ("A16","Infraestructura","Estaciones de trabajo de la oficina","Gerencia","Oficina central","M","M","M","Interna","Media"),
 ("A17","Servicios externos","Cuenta Cloudflare: DNS de wispfibra.com y túnel publicado","Resp. de infraestructura","Cloudflare","M","A","A","Confidencial","Crítica"),
 ("A18","Servicios externos","VPS con el hub WireGuard (wg0, UDP 51820)","Resp. de infraestructura","Proveedor de VPS","A","A","A","Confidencial","Crítica"),
 ("A19","Servicios externos","Cuentas de proveedores (VPS, dominio, APIs Perú)","Gerencia","Portales de los proveedores","A","A","M","Confidencial","Alta"),
 ("A20","Red de zonas","13 routers MikroTik RB4011 (PPPoE, colas, cortes)","Resp. de infraestructura","Gabinetes de zona","M","A","A","Confidencial","Crítica"),
 ("A21","Red de zonas","13 OLT VSOL (GPON)","Resp. de infraestructura","Gabinetes de zona","B","M","A","Interna","Alta"),
 ("A22","Red de zonas","Enlaces del proveedor mayorista","Gerencia","13 zonas","B","B","A","Interna","Alta"),
 ("A23","Servicios externos","Número de WhatsApp de la empresa","Gerencia","Teléfono vinculado","M","A","M","Confidencial","Alta"),
 ("A24","Personas","Administrador de sistemas y red","Gerencia","Oficina","—","—","A","—","Crítica"),
 ("A25","Personas","Técnicos (4) y personal comercial (6)","Gerencia","Campo y tienda","—","—","M","—","Media"),
 ("A26","Intangible","Reputación y confianza de los clientes","Gerencia","—","—","A","—","—","Alta"),
]

# ---------------------------------------------------------------------------
# 2. EVALUACIÓN DE RIESGOS (ISO/IEC 27005) — P e I de 1 a 5
# (id, activos, amenaza, vulnerabilidad, verificada_en_sistema_real, P, I)
# ---------------------------------------------------------------------------
RIESGOS = [
 ("R-01","A20","Acceso no autorizado o botnet sobre RouterOS","Router sin reglas de filtrado; telnet, ftp, www, api y winbox abiertos; DNS recursivo abierto (export de SUCASCO)",True,4,5),
 ("R-02","A01, A03","Fuga de datos personales","Un único usuario de base de datos dueño de todo; credenciales PPPoE y de routers en texto plano",True,3,5),
 ("R-03","A01, A06","Pérdida de datos","Respaldo diario en el mismo servidor; copia externa manual y semanal; sin prueba de restauración en producción",True,3,5),
 ("R-04","A24","Ausencia o error del administrador único","Sin suplente formal ni procedimientos escritos",False,3,4),
 ("R-05","A17, A19","Toma de cuentas de Cloudflare, dominio o VPS","Cuentas sin MFA; quien controle el DNS o el túnel puede suplantar el sitio y el panel",False,2,5),
 ("R-06","A18","Caída del hub VPN","VPS única de un tercero; sin procedimiento de reconstrucción",False,2,4),
 ("R-07","A04","Robo de secretos (llaves, .env, token del túnel)","El backend entra a la VPS como root; llaves sin rotación; token del túnel en texto plano en el .env",True,3,5),
 ("R-08","A08, A20","Suplantación (man-in-the-middle) en SSH","El cliente SSH acepta cualquier llave de host (AutoAddPolicy)",True,2,4),
 ("R-09","A24, A25","Phishing e ingeniería social","Sin capacitación; sin MFA en cuentas privilegiadas",False,4,4),
 ("R-10","A02, A01","Exposición de datos en el repositorio","8 fotos de clientes y la IP pública de la VPS versionadas en Git",True,3,4),
 ("R-11","A20, A05","Error de configuración manual en los routers","Sin control de cambios ni respaldo automático de configuración",False,3,4),
 ("R-12","A22, A21","Corte de fibra o de energía en una zona","Enlace WAN único en la mayoría de zonas",False,4,3),
 ("R-13","A12, A08","Compromiso del host Docker desde un contenedor","Backend y WhatsApp en la red del host; backend con NET_ADMIN y el puerto 8000 escuchando en todas las interfaces; imagen cloudflared:latest sin versión fija",True,2,5),
 ("R-14","A10, A23","Bloqueo del número de WhatsApp","Librería no oficial (Baileys) sobre un número vinculado",True,3,3),
 ("R-15","A08, A11","Explotación de la aplicación web","Vulnerabilidades de código o dependencias desactualizadas",False,3,4),
 ("R-16","A20","Abuso de la terminal RouterOS del panel","Filtro de comandos por lista negra, eludible",True,2,4),
 ("R-17","A20, A21","Robo o sabotaje de equipos en campo","Gabinetes sin cerradura ni alarma",False,2,3),
 ("R-18","A07","Incidentes no detectados","Sin logs centralizados ni IDS; routers sin syslog remoto",True,4,4),
 ("R-19","A12","Falla de hardware del servidor único","PC de escritorio con disco único, 4 GB de RAM y sin equipo de respaldo",True,3,5),
 ("R-20","A21, A14","Acceso de clientes o de un atacante a la gestión de la OLT","VLAN 10 puenteada con ether6 y ether7 en bridgeLAN y sin filtro forward: desde la LAN de clientes 192.168.20.0/24 se llega a la gestión de la OLT 192.168.100.0/24 (ether9, con masquerade)",True,3,4),
]

def nivel(v):
    return "Alto" if v >= 15 else ("Medio" if v >= 8 else "Bajo")

# ---------------------------------------------------------------------------
# 3. TRATAMIENTO (id, estrategia, acciones, responsable, plazo, P_res, I_res)
# ---------------------------------------------------------------------------
TRATAMIENTO = [
 ("R-01","Mitigar","Aplicar la plantilla endurecida a los 13 routers: filtro con política por defecto de descarte, servicios cerrados, gestión solo por WireGuard, syslog y NTP","Resp. de infraestructura","3 meses",2,5),
 ("R-02","Mitigar","Roles de base de datos con mínimo privilegio, vistas sin credenciales, cifrado de credenciales en reposo y respaldos cifrados","Resp. de sistemas","2 meses",2,5),
 ("R-03","Mitigar","Respaldo 3-2-1: copia diaria automática fuera del servidor (nube cifrada) y en disco externo; prueba de restauración trimestral","Resp. de sistemas","1 mes",1,5),
 ("R-04","Mitigar","Suplente capacitado con cuenta de emergencia custodiada por la Gerencia; procedimientos escritos (PR-SI-001 y planes)","Gerencia","3 meses",2,4),
 ("R-05","Mitigar","MFA en Cloudflare, registrador del dominio y proveedor de la VPS; correos de recuperación de la empresa; revisión de miembros de la cuenta","Resp. de infraestructura","Inmediato",1,5),
 ("R-06","Mitigar","Procedimiento y script para reconstruir el hub en otra VPS; copia de wg0.conf cifrada; mismo nombre DNS para el endpoint","Resp. de infraestructura","2 meses",2,2),
 ("R-07","Mitigar","Usuario con sudo limitado a wg en la VPS; PSK por peer; rotación anual de llaves; permisos 600 en el .env; token del túnel renovable","Resp. de infraestructura","2 meses",2,5),
 ("R-08","Mitigar","Archivo known_hosts con las huellas de la VPS y de cada router","Resp. de sistemas","1 mes",1,4),
 ("R-09","Mitigar","Plan de concientización (charlas, simulacro de phishing semestral) y MFA","Oficial de seguridad","3 meses",2,4),
 ("R-10","Mitigar","Retirar fotos e IP del historial de Git; regla en .gitignore; revisión antes de cada push","Resp. de sistemas","1 semana",1,4),
 ("R-11","Mitigar","Exportación nocturna de la configuración de cada router; control de cambios; probar primero en una zona","Resp. de infraestructura","2 meses",2,4),
 ("R-12","Mitigar / transferir","WAN secundaria con failover en zonas críticas; UPS por gabinete; SLA con el mayorista","Gerencia","6 meses",3,3),
 ("R-13","Mitigar","Regla de firewall que cierra el 8000 salvo desde la red de Docker; versiones fijas de imágenes; actualizaciones mensuales; quitar NET_ADMIN cuando el hub esté solo en la VPS","Resp. de infraestructura","1 mes",1,5),
 ("R-14","Aceptar","Pausas en envíos masivos y límites de recursos; plan de migración a la API oficial si hay bloqueo","Gerencia","Revisión anual",3,3),
 ("R-15","Mitigar","Proxy de Cloudflare, cabeceras de seguridad de Nginx, actualización mensual de dependencias","Resp. de sistemas","Continuo",2,4),
 ("R-16","Mitigar","Terminal con lista blanca de comandos y registro de cada uso","Resp. de sistemas","2 meses",1,4),
 ("R-17","Aceptar","Gabinetes con cerradura e inventario de equipos","Técnicos","6 meses",2,3),
 ("R-18","Mitigar","Syslog de routers y del servidor a un colector central; monitoreo con alertas; IDS en la red de oficina","Oficial de seguridad","3 meses",2,4),
 ("R-19","Mitigar","Servidor definitivo con disco espejo (RAID 1); mientras tanto, revisión SMART semanal, UPS y procedimiento de migración documentado","Gerencia","3 meses",2,4),
 ("R-20","Mitigar","Regla forward que descarta LAN de clientes hacia 192.168.100.0/24; gestión de la OLT en VLAN 99 alcanzable solo por WireGuard; cambiar credenciales de la OLT","Resp. de infraestructura","1 mes",1,4),
]

# ---------------------------------------------------------------------------
# 4. DECLARACIÓN DE APLICABILIDAD (control, nombre, riesgos, estado, justificación)
#    Estado: Impl. / Parcial / Plan. / Excluido
# ---------------------------------------------------------------------------
SOA = [
 ("5.1","Políticas de seguridad","Todos","Parcial","Política PO-SGSI-01 y 6 políticas específicas; falta aprobación firmada."),
 ("5.2","Roles y responsabilidades","R-04","Parcial","Roles definidos; Oficial de seguridad por designar."),
 ("5.3","Segregación de funciones","R-04","Plan.","Oficial distinto del administrador."),
 ("5.9","Inventario de activos","Todos","Impl.","Inventario de 26 activos con propietario."),
 ("5.12","Clasificación de la información","R-02","Impl.","Clasificación C-I-D del inventario."),
 ("5.15","Control de acceso","R-02, R-16","Impl.","JWT y require_roles por endpoint en el backend."),
 ("5.16","Gestión de identidades","R-09","Parcial","Cuentas nominales en el sistema; faltan en routers y servidor."),
 ("5.17","Información de autenticación","R-05, R-07","Parcial","bcrypt y secretos fuera del repositorio; falta rotación."),
 ("5.18","Derechos de acceso","R-02","Parcial","Matriz de accesos por rol; revisión trimestral pendiente."),
 ("5.19-5.23","Proveedores y servicios en la nube","R-05, R-06, R-12","Parcial","Política de proveedores; SLA del mayorista y MFA de cuentas pendientes."),
 ("5.24-5.28","Gestión de incidentes","R-18","Parcial","Plan de incidentes (Anexo C); faltan simulacros."),
 ("5.29-5.30","Continuidad TIC","R-03, R-06, R-19","Parcial","Plan de continuidad con BIA (Anexo D); respaldo diario local ya existe."),
 ("5.31","Requisitos legales","R-02, R-10","Parcial","Ley 29733; inscripción de bancos de datos pendiente (Anexo F)."),
 ("5.34","Privacidad y datos personales","R-02, R-10","Parcial","Datos de prueba anonimizados; fotos aún en el repositorio."),
 ("6.3","Concienciación y capacitación","R-09","Plan.","Plan de concientización (Anexo E)."),
 ("6.8","Reporte de eventos","R-18","Plan.","Reporte en 30 min o menos por el canal oficial."),
 ("7.1-7.4","Seguridad física de la oficina","R-17, R-19","Plan.","Servidor y red en gabinete con cerradura."),
 ("7.9","Activos fuera de las instalaciones","R-17","Plan.","Gabinetes de zona con cerradura."),
 ("7.11","Servicios de suministro","R-12, R-19","Parcial","UPS y encendido automático tras corte en el servidor."),
 ("8.2","Accesos privilegiados","R-05, R-07, R-16","Parcial","Solo el administrador ve la red; falta sudo limitado y lista blanca."),
 ("8.3","Restricción de acceso a la información","R-02","Parcial","Roles de base de datos y vistas probados en laboratorio."),
 ("8.5","Autenticación segura","R-05, R-09","Parcial","Freno a la fuerza bruta en el login; MFA pendiente."),
 ("8.7","Protección contra malware","R-15","Plan.","IDS con firmas y actualizaciones."),
 ("8.8","Vulnerabilidades técnicas","R-01, R-13, R-15","Plan.","Parches mensuales de Ubuntu, Docker, RouterOS y dependencias."),
 ("8.9","Gestión de la configuración","R-01, R-11, R-13","Parcial","docker-compose y migraciones versionadas; routers sin control."),
 ("8.12","Prevención de fuga de datos","R-02, R-10","Plan.","Alerta por exportaciones masivas."),
 ("8.13","Respaldo de la información","R-03","Parcial","pg_dump diario con retención de 30 días; falta copia externa automática."),
 ("8.14","Redundancia","R-06, R-12, R-19","Plan.","Disco espejo, WAN secundaria, hub reconstruible."),
 ("8.15","Registro de eventos","R-18","Parcial","Historial del cliente; falta centralizar logs."),
 ("8.16","Monitoreo de actividades","R-18","Plan.","Colector de logs, monitoreo y alertas."),
 ("8.20","Seguridad de redes","R-01, R-08, R-13, R-20","Parcial","Servicios internos en 127.0.0.1 y publicación por túnel sin puertos de entrada; routers sin filtrado."),
 ("8.22","Segregación de redes","R-01, R-13, R-20","Parcial","En las zonas existe la VLAN 10 de transporte GPON/PPPoE, pero puenteada con los puertos LAN y sin aislar la gestión de la OLT; VLAN 99 de gestión pendiente."),
 ("8.24","Uso de criptografía","R-02, R-07","Parcial","HTTPS por Cloudflare y WireGuard; algunas zonas aún con SSTP."),
 ("8.28","Codificación segura","R-15","Impl.","Validación con Pydantic; ORM sin SQL concatenado."),
 ("8.32","Gestión de cambios","R-11","Impl.","Cambios del sistema por Git y migraciones revisables."),
 ("5.6","Contacto con grupos de interés especial","—","Excluido","La MYPE no participa en grupos sectoriales; se evaluará en el siguiente ciclo."),
 ("8.30","Desarrollo externalizado","—","Excluido","El software se desarrolla internamente."),
]

# ---------------------------------------------------------------------------
# 5. MATRIZ MAESTRA (riesgo, control, implementación, prueba, evidencia)
# ---------------------------------------------------------------------------
MAESTRA = [
 ("R-01","8.20, 8.22, 8.9","Plantilla endurecida de router y VLAN de gestión","PC-05, PC-06","Export del router y registro del hub"),
 ("R-02","8.3, 8.24, 5.34","Roles de base de datos, vistas, cifrado en reposo","P6, P7","Resultado de pruebas de roles"),
 ("R-03","8.13","Respaldo 3-2-1 y prueba trimestral","B1-B4","Registro de restauración"),
 ("R-04","5.2, 5.3, 5.30","Suplente y procedimientos","Ejercicio de mesa","Acta del ejercicio"),
 ("R-05","5.17, 8.5","MFA en Cloudflare, dominio y VPS","Revisión de la configuración de cuentas","Captura de MFA activo"),
 ("R-06","8.14","Reconstrucción del hub","Simulacro de caída del hub","Tiempo de recuperación medido"),
 ("R-07","5.17, 8.2","sudo limitado, PSK, rotación","Revisión de sudoers","Configuración de la VPS"),
 ("R-08","8.20","known_hosts","Llave de host alterada","Error de conexión registrado"),
 ("R-09","6.3, 8.5","Capacitación y MFA","Phishing simulado","Tasa de clics"),
 ("R-10","5.34","Limpieza del repositorio","Búsqueda en el historial de Git","Resultado de git log"),
 ("R-11","8.9, 8.32","Exportación nocturna y control de cambios","PC-11","Diferencias entre exportaciones"),
 ("R-12","7.11, 8.14","WAN secundaria y UPS","PC-11","Registro del failover"),
 ("R-13","8.8, 8.20","Puerto 8000 cerrado, imágenes con versión fija","Escaneo de puertos del servidor","Resultado del escaneo"),
 ("R-14","5.23","Pausas y límites","Monitoreo del servicio","Registro de envíos masivos"),
 ("R-15","8.28, 8.8","Proxy, cabeceras, dependencias","Escaneo autorizado","Informe del escaneo"),
 ("R-16","8.2","Lista blanca de comandos","Comando no permitido","Registro de la terminal"),
 ("R-17","7.9","Gabinetes con cerradura","Inspección de campo","Fotos de inspección"),
 ("R-18","8.15, 8.16","Colector de logs, monitoreo, IDS","Prueba con nmap autorizada","Alerta registrada"),
 ("R-19","8.14, 7.11","Disco espejo, revisión SMART, UPS","Restauración en otro equipo","Tiempo de migración medido"),
 ("R-20","8.22, 8.20","Regla forward y VLAN 99 para la OLT","Desde un equipo en la LAN de clientes, intentar 192.168.100.1","Intento bloqueado y registro del router"),
]

# ---------------------------------------------------------------------------
def tex(s):
    rep = {"\\": r"\textbackslash{}", "&": r"\&", "%": r"\%", "#": r"\#", "_": r"\_", "$": r"\$", "{": r"\{", "}": r"\}"}
    return "".join(rep.get(c, c) for c in str(s))

def escribir_tablas(base):
    d = os.path.join(base, "capitulos", "linea3", "tablas"); os.makedirs(d, exist_ok=True)
    grupo = None; filas = []
    for a in ACTIVOS:
        if a[1] != grupo:
            grupo = a[1]; filas.append(r"\multicolumn{9}{l}{\textit{%s}} \\" % tex(grupo))
        clas = {"Confidencial": "Conf.", "Interna": "Int.", "Pública": "Púb."}.get(a[8], a[8])
        filas.append(" & ".join(tex(x) for x in (a[0], a[2], a[3], a[4], a[5], a[6], a[7], clas, a[9])) + r" \\")
    open(os.path.join(d, "activos.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")

    filas = []
    for r in RIESGOS:
        v = r[5] * r[6]
        vul = tex(r[3]) + (r"\textsuperscript{v}" if r[4] else "")
        filas.append(" & ".join([tex(r[0]), tex(r[1]), tex(r[2]), vul, str(r[5]), str(r[6]), str(v), nivel(v)]) + r" \\")
    open(os.path.join(d, "riesgos.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")

    filas = []
    for t in TRATAMIENTO:
        v = t[5] * t[6]
        filas.append(" & ".join([tex(t[0]), tex(t[1]), tex(t[2]), tex(t[3]), tex(t[4]), r"%d$\times$%d = %d %s" % (t[5], t[6], v, nivel(v))]) + r" \\")
    open(os.path.join(d, "tratamiento.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")

    filas = []
    for s in SOA:
        if s[3] == "Excluido" and not any("midrule" in f for f in filas):
            filas.append(r"\midrule")
        filas.append(" & ".join(tex(x) for x in s) + r" \\")
    open(os.path.join(d, "soa.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")

    filas = [" & ".join(tex(x) for x in m) + r" \\" for m in MAESTRA]
    open(os.path.join(d, "maestra.tex"), "w", encoding="utf8").write("\n".join(filas) + "\n")

def escribir_excel(base):
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    wb = Workbook()
    azul = PatternFill("solid", fgColor="00205B"); blanco = Font(color="FFFFFF", bold=True)
    borde = Border(*(Side(style="thin", color="BFC5D2"),) * 4)
    colores = {"Alto": "F8CBAD", "Medio": "FFE699", "Bajo": "C6EFCE"}

    def hoja(nombre, titulo, cab, filas, anchos, col_nivel=None):
        ws = wb.create_sheet(nombre)
        ws["A1"] = titulo; ws["A1"].font = Font(bold=True, size=13, color="00205B")
        ws["A2"] = "WISP Ingeniería en Redes y Telecomunicaciones · SGSI ISO/IEC 27001:2022 · corte 18/11/2026"
        ws["A2"].font = Font(italic=True, color="58585A")
        for j, c in enumerate(cab, 1):
            x = ws.cell(row=4, column=j, value=c); x.fill = azul; x.font = blanco
            x.alignment = Alignment(wrap_text=True, vertical="center"); x.border = borde
        for i, f in enumerate(filas, 5):
            for j, v in enumerate(f, 1):
                x = ws.cell(row=i, column=j, value=v)
                x.alignment = Alignment(wrap_text=True, vertical="top"); x.border = borde
            if col_nivel:
                n = ws.cell(row=i, column=col_nivel).value
                if n in colores:
                    ws.cell(row=i, column=col_nivel).fill = PatternFill("solid", fgColor=colores[n])
        for j, w in enumerate(anchos, 1):
            ws.column_dimensions[get_column_letter(j)].width = w
        ws.freeze_panes = "A5"; ws.auto_filter.ref = "A4:%s%d" % (get_column_letter(len(cab)), 4 + len(filas))
        return ws

    hoja("Inventario", "Inventario de activos y clasificación de la información",
         ["ID", "Grupo", "Activo", "Propietario", "Ubicación", "C", "I", "D", "Clasificación", "Criticidad"],
         [list(a) for a in ACTIVOS], [6, 16, 48, 22, 38, 5, 5, 5, 14, 11])
    hoja("Riesgos", "Evaluación de riesgos (ISO/IEC 27005) — nivel = P × I; Bajo 1-6, Medio 8-12, Alto 15-25",
         ["ID", "Activos", "Amenaza", "Vulnerabilidad", "Verificada en el sistema real", "P", "I", "P×I", "Nivel"],
         [[r[0], r[1], r[2], r[3], "Sí" if r[4] else "No", r[5], r[6], r[5] * r[6], nivel(r[5] * r[6])] for r in RIESGOS],
         [7, 12, 34, 60, 12, 5, 5, 6, 9], col_nivel=9)
    rr = {r[0]: r for r in RIESGOS}
    hoja("Tratamiento", "Plan de tratamiento de riesgos y riesgo residual",
         ["ID", "Nivel inicial", "Estrategia", "Acciones", "Responsable", "Plazo", "P residual", "I residual", "Residual", "Nivel residual"],
         [[t[0], nivel(rr[t[0]][5] * rr[t[0]][6]), t[1], t[2], t[3], t[4], t[5], t[6], t[5] * t[6], nivel(t[5] * t[6])] for t in TRATAMIENTO],
         [7, 11, 16, 70, 24, 14, 9, 9, 9, 12], col_nivel=10)
    hoja("SoA", "Declaración de Aplicabilidad — Anexo A de ISO/IEC 27001:2022",
         ["Control", "Nombre", "Riesgos que trata", "Aplica", "Estado", "Justificación / evidencia"],
         [[s[0], s[1], s[2], "No" if s[3] == "Excluido" else "Sí", s[3], s[4]] for s in SOA],
         [11, 34, 18, 7, 10, 70])
    hoja("Trazabilidad", "Matriz maestra: riesgo → control → implementación → prueba → evidencia",
         ["Riesgo", "Control ISO", "Implementación", "Prueba", "Evidencia"],
         [list(m) for m in MAESTRA], [8, 16, 50, 30, 36])
    del wb["Sheet"]
    ruta = os.path.join(base, "sgsi", "WISP_SGSI_Matrices.xlsx")
    wb.save(ruta); return ruta

if __name__ == "__main__":
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    escribir_tablas(base)
    print("Tablas LaTeX escritas en capitulos/linea3/tablas/")
    print("Excel:", escribir_excel(base))
    altos = sum(1 for r in RIESGOS if r[5] * r[6] >= 15)
    medios = sum(1 for r in RIESGOS if 8 <= r[5] * r[6] < 15)
    est = {}
    for s in SOA: est[s[3]] = est.get(s[3], 0) + 1
    print("Activos:", len(ACTIVOS), "| Riesgos:", len(RIESGOS), "altos", altos, "medios", medios, "bajos", len(RIESGOS) - altos - medios)
    print("SoA:", est)
    print("Residuales altos:", sum(1 for t in TRATAMIENTO if t[5] * t[6] >= 15))
