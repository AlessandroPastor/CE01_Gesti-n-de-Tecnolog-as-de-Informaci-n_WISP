// Línea CE03 — Infraestructura Tecnológica (capítulos 10 a 12 y anexos del SGSI)
const B = require("./base");
const { pres, K, HF, FIG, addSection, txt, card, cardHead, bullets, note, chip, content, imageCard, table, statRow, cardsGrid, flow, divider, chartOpts } = B;
const IF = "inf";
const LINE = "Línea CE03 — Infraestructura Tecnológica";

module.exports = function ce03() {
  let s;
  addSection("CE03 · Infraestructura Tecnológica");
  s = divider("CE03", "Línea de especialidad 3 · Infraestructura Tecnológica", "La infraestructura que sostiene al sistema",
    ["S1-E1 · Análisis y Diseño de Red (CE0311)", "S1-E2 · Análisis y Diseño de Centro de Datos Híbrido (CE0331)", "S2-E1 · Planificación e Implementación del SGSI (CE0321–CE0324)", "S2-E2 y S2-E3 · Implementación de red y centro de datos (en ejecución)"], LINE);
  s.addNotes("La línea de infraestructura diseña la red y el centro de datos híbrido, y gestiona su seguridad con un SGSI.");

  s = content(IF, "CE03 · Punto de partida", "Lo real y lo propuesto, separados");
  cardsGrid(s, [
    { t: "Hoy (AS-IS, verificado)", color: K.navy, d: "Un PC dockerizado en la oficina (A8-7600, 4 GB) publicado por Cloudflare Tunnel en wispfibra.com; VPS de terceros como hub WireGuard; 13 zonas MikroTik. En SUCASCO: cero reglas de firewall, servicios de gestión abiertos y la OLT alcanzable desde los clientes." },
    { t: "Diseño (TO-BE)", d: "Oficina segmentada en 5 VLAN detrás de FW01; host VMware ESXi con 7 VM; VPC en AWS São Paulo con el hub WireGuard, réplica de contingencia y respaldos en S3; plantilla endurecida para las 13 zonas." },
  ], { cols: 2, h: 2.4, dSize: 10 });
  card(s, 0.55, 3.85, 8.93, 1.05, { stripeColor: K.navy });
  txt(s, [{ text: "Regla de los documentos: ", options: { bold: true, color: K.navy } }, { text: "ninguna tabla mezcla lo que existe con lo que se propone, y no se publican claves, IP públicas reales ni datos personales (se usan marcadores como <EIP-HUB>)." }], { x: 0.78, y: 3.97, w: 8.55, h: 0.85, fontSize: 10.5 });
  s.addNotes("La rúbrica penaliza lo que solo se describe: por eso separamos lo verificado de lo diseñado.");

  // ======================= E1 · RED =======================
  addSection("CE03 · E1 Diseño de Red");
  s = divider("05", "Capítulo 10 · CE03 · S1-E1 · CE0311", "Análisis y Diseño de Red",
    ["Organización, servicios críticos, interesados y alcance", "Topologías general, lógica y de seguridad", "VPN híbrida WireGuard hub-and-spoke", "Firewall, DMZ, IDS/IPS, honeypot y pruebas planeadas"], LINE);
  s.addNotes("Primer entregable de infraestructura: el diseño de la red, sin implementación.");

  s = content(IF, "Capítulo 10 · Resumen ejecutivo", "De 13 islas sin firewall a una red segmentada");
  imageCard(s, FIG + "f10_1.png", 0.55, 1.3, 4.6, 3.6);
  card(s, 5.3, 1.3, 4.18, 3.6);
  cardHead(s, "Diseño en una página", 5.53, 1.42, 3.8);
  bullets(s, [[{ text: "Problema: ", b: true }, { text: "cada zona es una isla administrada a mano; SUCASCO sin reglas, con telnet, ftp, www, winbox y api abiertos." }], [{ text: "Topología: ", b: true }, { text: "oficina con 5 VLAN tras FW01, VPC en AWS y 13 zonas con plantilla endurecida." }], [{ text: "VPN: ", b: true }, { text: "WireGuard hub-and-spoke con el hub en EC2 e IP elástica." }], [{ text: "Riesgos: ", b: true }, { text: "acceso a routers, servicios expuestos, movimiento lateral y servidor único." }]], 5.55, 1.75, 3.85, 3.1, { size: 10 });
  s.addNotes("La topología ejecutiva resume oficina, AWS y zonas unidas por WireGuard.");

  s = content(IF, "Capítulo 10 · Organización y necesidades", "Necesidades de red y servicios críticos");
  table(s, ["Necesidad", "Detalle"], [
    ["Usuarios y sedes", "1 oficina (unas 10 estaciones), 13 zonas, unos 455 clientes, personal de campo"],
    ["Servicios TI", "Sistema de gestión, base de datos, WhatsApp, gestión de 13 routers, sitio"],
    ["Nube", "Concentrador VPN, réplica de contingencia y respaldos fuera de la oficina"],
    ["Ancho de banda", "La VPN solo lleva gestión (< 2 Mbps); el tráfico de clientes sale por el ISP local"],
    ["Crecimiento", "Doble de clientes y hasta 25 zonas en 3 años"],
  ], { w: 5.3, colW: [1.5, 3.8], size: 9 });
  table(s, ["Proceso", "Criticidad"], [
    ["Internet al cliente", { text: "Alta", o: { color: K.red, bold: true } }], ["Cobranza y cortes", { text: "Alta", o: { color: K.red, bold: true } }], ["Instalación en campo", { text: "Alta", o: { color: K.red, bold: true } }], ["Facturación y caja", { text: "Alta", o: { color: K.red, bold: true } }], ["Comunicación con clientes", "Media"], ["Supervisión de la red", "Media"], ["Administración interna", "Baja"],
  ], { x: 6.0, w: 3.48, colW: [2.4, 1.08], size: 9 });
  s.addNotes("Primero el negocio: qué procesos dependen de la red y qué tan críticos son.");

  s = content(IF, "Capítulo 10 · Interesados y alcance", "Partes interesadas, alcance y exclusiones");
  cardsGrid(s, [
    { t: "Clientes y gerencia", d: "Servicio estable, cortes justos, privacidad; operación centralizada y de bajo costo." },
    { t: "Personal y administrador", d: "Acceso confiable al sistema; gestión remota de los routers sin exponerlos." },
    { t: "ISP, AWS y Cloudflare", d: "Uso correcto de enlaces; modelo de responsabilidad compartida." },
    { t: "Reguladores", d: "Ley N.° 29733, OSIPTEL y MTC." },
  ], { cols: 4, h: 1.55, dSize: 9 });
  card(s, 0.55, 3.0, 4.39, 1.9);
  cardHead(s, "Dentro del alcance", 0.78, 3.12, 4);
  bullets(s, ["Red de la oficina: VLAN de gestión, servidores, usuarios, DMZ y seguridad.", "VPC en AWS y VPN WireGuard con las 13 zonas.", "Firewall, DMZ, IDS/IPS, honeypot y plantilla de zona."], 0.8, 3.45, 4.0, 1.4, { size: 9.5 });
  card(s, 5.09, 3.0, 4.39, 1.9, { stripeColor: K.muted });
  cardHead(s, "Exclusiones justificadas", 5.32, 3.12, 4, K.muted);
  bullets(s, ["Red óptica pasiva (PON, mufas, NAP): la gestiona el sistema.", "WiFi del cliente: responsabilidad del usuario.", "Dispositivos personales y enlaces del mayorista."], 5.34, 3.45, 4.0, 1.4, { size: 9.5 });
  s.addNotes("El alcance deja claro qué entra al diseño y qué no, con su justificación.");

  s = content(IF, "Capítulo 10 · Objetivos del diseño", "Objetivos medibles del diseño de red");
  table(s, ["Objetivo", "Indicador", "Meta"], [
    ["Segmentar la oficina por función", "VLAN definidas y documentadas", "5 VLAN, 100 %"],
    ["Retirar la administración de internet", "Zonas con gestión solo por VPN", "13 de 13"],
    ["Política restrictiva", "Equipos con default deny en input y forward", "100 % (FW01, hub, 13 zonas)"],
    ["Unificar la gestión remota", "Zonas migradas de SSTP a WireGuard", "13 de 13 al cierre del S2"],
    ["Impedir el movimiento lateral", "Pruebas zona → zona denegadas", "100 %"],
    ["Disponibilidad del enlace de gestión", "Rutas alternas consideradas", "≥ 1 WAN secundaria en zonas críticas"],
    ["Visibilidad de eventos", "Equipos que envían logs al SIEM", "100 % de los equipos de red"],
  ], { colW: [3.0, 3.4, 2.53], size: 9.5 });
  s.addNotes("Cada objetivo tiene indicador y meta: se verificarán en la implementación.");

  s = content(IF, "Capítulo 10 · Topología general", "Vista maestra: oficina, AWS y 13 zonas");
  imageCard(s, FIG + "f10_2.png", 0.55, 1.3, 6.2, 3.6);
  card(s, 6.9, 1.3, 2.58, 3.6);
  cardHead(s, "Componentes", 7.13, 1.42, 2.2);
  bullets(s, ["FW01 MikroTik RB5009 y SW-CORE CRS326.", "Oficina 10.20.0.0/16 en 5 VLAN; ESXI-01 con una VM por VLAN.", "AWS sa-east-1, VPC 10.50.0.0/16: EC2-WGHUB y EC2-DR.", "Zonas RTR-Zxx en 10.10.0.(100+n)."], 7.15, 1.75, 2.25, 3.1, { size: 9.5 });
  s.addNotes("La vista maestra integra los tres ambientes que luego se detallan.");

  s = content(IF, "Capítulo 10 · Topología lógica", "VLAN, subredes y enrutamiento de la oficina");
  table(s, ["VLAN", "Nombre", "Red", "Equipos"], [
    ["10", "GESTIÓN", "10.20.10.0/24", "ESXi (.10), SW-CORE (.2), NAS (.20), administrador (.50)"],
    ["20", "SERVIDORES", "10.20.20.0/24", "APP-01 (.10), DB-01 (.11), NAS-01 datos (.20)"],
    ["30", "USUARIOS", "10.20.30.0/24", "Estaciones por DHCP (.100–.200)"],
    ["40", "DMZ", "10.20.40.0/24", "PROXY-01 (.10, Nginx + cloudflared), HONEY-01 (.66)"],
    ["50", "SEGURIDAD", "10.20.50.0/24", "IDS-01 Suricata, SIEM-01 Wazuh, MON-01 Zabbix"],
    ["—", "VPN (overlay)", "10.10.0.0/24", "Hub .1, FW01 .2, zonas .101–.199"],
  ], { w: 5.7, colW: [0.55, 1.2, 1.25, 2.7], size: 8.5 });
  imageCard(s, FIG + "f10_3.png", 6.4, 1.3, 3.08, 3.6);
  note(s, "Gateway .1 de cada VLAN en FW01 con política por defecto de descarte.");
  s.addNotes("Cinco VLAN por función; el overlay VPN usa el mismo esquema de direcciones que ya tiene el sistema.");

  s = content(IF, "Capítulo 10 · Direccionamiento", "Zonas AS-IS frente a TO-BE y plan de AWS");
  table(s, ["Segmento", "AS-IS (SUCASCO, real)", "TO-BE (plantilla para 13 zonas)"], [
    ["WAN", "WAN1 192.168.1.2/24 al módem (doble NAT); WAN2–4 deshabilitadas", "Igual; WAN2 con failover en zonas críticas"],
    ["Clientes PPPoE", "192.168.20.0/24 en bridgeLAN", "/24 única por zona; no se anuncia por la VPN"],
    ["Transporte GPON", "VLAN 10 sobre ether10, puenteada con ether6/7", "VLAN 10 solo transporta PPPoE (capa 2)"],
    ["Gestión de OLT", "ether9 192.168.100.1/24, igual en todas las zonas", "VLAN 99 172.16.id.0/28, única y anunciada"],
    ["Túnel de gestión", "SSTP a dos VPS", "WireGuard wg-wisp 10.10.0.(100+id)/24"],
  ], { colW: [1.5, 3.7, 3.73], size: 9, maxH: 2.25 });
  table(s, ["VPC 10.50.0.0/16", "Uso"], [["Pública 10.50.1.0/24", "EC2-WGHUB con IP elástica"], ["Privada app 10.50.2.0/24", "EC2-DR, réplica de contingencia"], ["Privada datos 10.50.3.0/24", "Reservada para RDS"]], { y: 3.65, colW: [3.0, 5.93], size: 9 });
  s.addNotes("El AS-IS viene del export real de SUCASCO; el TO-BE corrige la red de OLT repetida en todas las zonas.");

  s = content(IF, "Capítulo 10 · Matriz de comunicación", "Qué puede hablar con qué");
  const P = { text: "P", o: { color: K.green, bold: true, align: "center" } }, D = { text: "D", o: { color: K.red, bold: true, align: "center" } }, R = (t) => ({ text: "R " + t, o: { color: K.orangeDk, bold: true, align: "center" } }), N = { text: "—", o: { align: "center" } };
  table(s, ["Origen \\ destino", "GEST", "SERV", "USU", "DMZ", "SEG", "Zonas", "Internet"], [
    ["GESTIÓN (10)", N, P, P, P, P, R("(SSH)"), P],
    ["SERVIDORES (20)", D, N, D, D, R("(logs)"), R("(SSH, API)"), R("(443)")],
    ["USUARIOS (30)", D, R("(443)"), N, D, D, D, P],
    ["DMZ (40)", D, R("(8000)"), D, N, R("(logs)"), D, R("(CF)")],
    ["SEGURIDAD (50)", D, D, D, D, N, R("(SNMP)"), R("(upd)")],
    ["Zonas (VPN)", D, D, D, D, R("(syslog)"), D, N],
  ], { colW: [1.7, 0.85, 1.0, 0.85, 0.85, 1.05, 1.33, 1.3], size: 9 });
  note(s, "P = permitido · R = restringido al puerto indicado · D = denegado. Zona → zona: denegado en el hub.");
  s.addNotes("Esta matriz se convierte en reglas de FW01 y del hub, y en pruebas positivas y negativas.");

  s = content(IF, "Capítulo 10 · Seguridad perimetral", "Capas de control antes de cada zona");
  imageCard(s, FIG + "f10_4.png", 0.55, 1.3, 4.6, 3.6);
  table(s, ["FW01", "Diseño"], [
    ["Producto", "MikroTik RB5009 con RouterOS 7: la misma plataforma que las zonas"],
    ["Interfaces", "ether1 WAN; SFP+ troncal 802.1Q (VLAN 10–50); ether8 fuera de banda; wg-hub"],
    ["Política", "input y forward: descartar; acepta establecidas; registra lo descartado"],
    ["Reglas", "Mínimo privilegio por origen, destino y puerto; revisión trimestral"],
    ["DMZ", "PROXY-01 abre el túnel de salida: la DMZ no recibe conexiones de internet"],
  ], { x: 5.3, w: 4.18, colW: [1.0, 3.18], size: 8.5 });
  s.addNotes("Cloudflare, FW01, IDS y el firewall de cada zona: defensa en profundidad.");

  s = content(IF, "Capítulo 10 · Router de zona", "Endurecimiento del router de zona");
  table(s, ["Aspecto", "AS-IS (export real)", "TO-BE (diseño)"], [
    ["Filtro de firewall", { text: "Sin reglas", o: { color: K.red, bold: true } }, "Default deny en input y forward"],
    ["Servicios de gestión", "telnet, ftp, www, ssh, api, winbox abiertos", "telnet, ftp, www y api apagados; ssh, winbox, api-ssl solo desde gestión"],
    ["DNS y proxy de corte", "Resolutor abierto; :998 sin restricción", "Solo desde la LAN de clientes"],
    ["Gestión remota", "SSTP a dos VPS", "WireGuard al hub en AWS"],
    ["Red de la OLT", "192.168.100.0/24 repetida", "VLAN 99 172.16.id.0/28"],
    ["Registro y hora", "Sin syslog ni NTP", "Syslog al SIEM y cliente NTP"],
    ["Failover WAN", "Scripts para 4 ISP, 1 activo", "WAN2 en zonas críticas; scripts depurados"],
  ], { colW: [1.8, 3.2, 3.93], size: 9 });
  note(s, "Plantilla config/plantilla_zona_tobe.rsc, sin secretos; se valida zona por zona en el semestre 2.");
  s.addNotes("El hallazgo más grave de toda la línea: routers de zona sin ninguna regla de filtrado.");

  s = content(IF, "Capítulo 10 · VPN híbrida", "WireGuard hub-and-spoke");
  imageCard(s, FIG + "f10_5.png", 0.55, 1.3, 5.2, 2.6);
  table(s, ["Parámetro", "Valor (sin secretos)"], [
    ["Hub", "EC2-WGHUB, 10.10.0.1, <EIP-HUB>:51820/UDP"],
    ["Oficina", "FW01 10.10.0.2; anuncia 10.20.{10,20,50}.0/24"],
    ["Zonas", "10.10.0.(100+id); anuncian 172.16.id.0/28"],
    ["Cifrado", "Noise_IKpsk2: Curve25519, ChaCha20-Poly1305, BLAKE2s + PSK por peer"],
    ["Keepalive", "25 s; los peers inician (funciona tras CGNAT)"],
  ], { x: 5.9, w: 3.58, colW: [1.0, 2.58], size: 8.5 });
  card(s, 0.55, 4.05, 5.2, 0.85, { stripeColor: K.navy });
  txt(s, "Cambio respecto al AS-IS: las LAN de clientes ya no viajan por la VPN; cada zona anuncia solo su red de gestión, que es única.", { x: 0.78, y: 4.12, w: 4.85, h: 0.72, fontSize: 9.5 });
  s.addNotes("El hub reenvía solo lo que permite su política nftables; zona a zona está denegado.");

  s = content(IF, "Capítulo 10 · Decisión de VPN", "Por qué WireGuard para la conectividad híbrida");
  cardsGrid(s, [
    { t: "Funciona tras CGNAT", d: "La oficina y varias zonas no tienen IP pública fija: los peers inician la conexión hacia la IP elástica del hub." },
    { t: "Costo", d: "Un túnel gestionado de AWS exige IP pública en cada extremo y se cobra por conexión: serían 14." },
    { t: "Ya lo usa el sistema", d: "El panel ya administra peers WireGuard (alta, baja y estado del handshake)." },
    { t: "Seguridad", d: "Código pequeño y criptografía moderna fija, sin negociación de algoritmos débiles; nativo en RouterOS 7." },
  ], { cols: 2, h: 2.75 });
  card(s, 0.55, 4.2, 8.93, 0.7, { stripeColor: K.muted });
  txt(s, "Contrapartida: el hub es una instancia que WISP administra (parches, nftables); se mitiga con una AMI y la recuperación del capítulo 11.", { x: 0.78, y: 4.27, w: 8.55, h: 0.58, fontSize: 9.5 });
  s.addNotes("La elección de VPN se justifica por las condiciones reales de WISP.");

  s = content(IF, "Capítulo 10 · Flujos de información", "Flujos planeados: origen, protocolo y destino");
  table(s, ["Origen", "Protocolo · puerto", "Destino", "Propósito"], [
    ["Usuario / app", "HTTPS · 443", "Cloudflare", "Panel, API y sitio"],
    ["cloudflared (PROXY-01)", "QUIC/HTTPS · 7844/443 saliente", "Cloudflare", "Túnel sin puertos de entrada"],
    ["PROXY-01 (Nginx)", "HTTP · 8000 / 3000 / 3002", "APP-01", "API, panel y sitio"],
    ["APP-01", "PostgreSQL · 5432", "DB-01", "Datos del sistema"],
    ["APP-01", "SSH · 22 / API-SSL · 8729 (VPN)", "RTR de zona", "PPPoE, perfiles, corte"],
    ["MON-01", "SNMPv3 · 161/UDP (VPN)", "RTR y OLT", "Disponibilidad y tráfico"],
    ["RTR / OLT de zona", "Syslog 514 · traps 162", "SIEM-01 / MON-01", "Eventos y alarmas"],
    ["DB-01", "PostgreSQL · 5432 (VPN)", "EC2-DR", "Réplica de contingencia"],
    ["APP-01 / DB-01", "HTTPS · 443", "S3", "Respaldos cifrados"],
  ], { colW: [1.85, 2.65, 1.6, 2.83], size: 8.5 });
  s.addNotes("Cada flujo tiene puerto y propósito: así se escriben las reglas sin abrir de más.");

  s = content(IF, "Capítulo 10 · Matriz de componentes", "Matriz de componentes de red");
  table(s, ["Componente", "IP planeada", "Zona", "Función", "Crit."], [
    ["FW01 (RB5009)", ".1 de cada VLAN; 10.10.0.2", "Perímetro", "Firewall, enrutamiento, peer VPN", "Alta"],
    ["SW-CORE (CRS326)", "10.20.10.2", "Gestión", "Troncal y puerto espejo", "Alta"],
    ["ESXI-01 / APP-01 / DB-01", "10.20.10.10 / .20.10 / .20.11", "Gestión / Servidores", "Hipervisor, backend, PostgreSQL", "Alta"],
    ["PROXY-01 / HONEY-01", "10.20.40.10 / .40.66", "DMZ", "Nginx + cloudflared / OpenCanary", "Alta / Media"],
    ["IDS-01 / SIEM-01 / MON-01", "10.20.50.10–.12", "Seguridad", "Suricata / Wazuh / Zabbix", "Media"],
    ["EC2-WGHUB", "10.50.1.10 + EIP; 10.10.0.1", "AWS pública", "Hub VPN, Suricata, Cowrie", "Alta"],
    ["EC2-DR", "10.50.2.10", "AWS privada", "Réplica de contingencia", "Media"],
    ["RTR-Zxx / OLT-Zxx (13)", "10.10.0.(100+id); 172.16.id.1/.2", "Zona", "PPPoE, colas, NAT / GPON", "Alta"],
  ], { colW: [2.0, 2.2, 1.35, 2.55, 0.83], size: 8.5 });
  note(s, "Cubre el 100 % de los componentes dibujados en las topologías.");
  s.addNotes("La matriz es la lista de comprobación para implementar: nada dibujado queda fuera.");

  s = content(IF, "Capítulo 10 · Detección", "IDS/IPS, honeypots y SIEM planificados");
  table(s, ["Tecnología", "Ubicación", "Qué detectará", "Cómo se validará"], [
    ["Suricata (IDS)", "IDS-01, VLAN 50, espejo del troncal", "Escaneos, movimiento lateral, malware, Winbox desde segmentos no autorizados", "nmap desde USUARIOS; EICAR; alerta en Wazuh"],
    ["Suricata (IPS)", "En línea sobre wg0 en el hub", "Tráfico anómalo de un router comprometido, escaneos a la EIP", "Ping zona → zona; escaneo de laboratorio"],
    ["Cowrie", "Hub, TCP 22 público", "Fuerza bruta y comandos de atacantes reales", "Intento SSH desde internet"],
    ["OpenCanary", "HONEY-01 en la DMZ", "Cualquier conexión interna a servicios señuelo", "Conexión desde USUARIOS"],
    ["Wazuh (SIEM)", "SIEM-01, VLAN 50", "Correlación de Suricata, Cowrie, OpenCanary y syslog", "Tablero con las alertas de prueba"],
  ], { colW: [1.35, 2.0, 3.0, 2.58], size: 8.5 });
  note(s, "La administración real del hub va por AWS Systems Manager; el puerto 22 público es solo el señuelo.");
  s.addNotes("La detección se planifica con su forma de validarse en el semestre 2.");

  s = content(IF, "Capítulo 10 · Pruebas planeadas", "Matriz de pruebas de conectividad (semestre 2)");
  table(s, ["ID", "Prueba", "Esperado"], [
    ["PC-01 / 02", "Oficina ↔ AWS por VPN (ping, TCP 5432)", { text: "Permitido", o: { color: K.green, bold: true } }],
    ["PC-03", "APP-01 → RTR-SUCASCO por SSH", { text: "Permitido", o: { color: K.green, bold: true } }],
    ["PC-04", "Handshake WireGuard de cada zona", "< 180 s"],
    ["PC-05", "RTR-SUCASCO → RTR-HUATA", { text: "Denegado y registrado", o: { color: K.red, bold: true } }],
    ["PC-06", "Internet → Winbox/SSH de un router por su WAN", { text: "Denegado", o: { color: K.red, bold: true } }],
    ["PC-07 / 08", "DMZ → AWS · Internet → subred privada", { text: "Denegado", o: { color: K.red, bold: true } }],
    ["PC-09", "USUARIOS → GESTIÓN (ESXi 443)", { text: "Denegado", o: { color: K.red, bold: true } }],
    ["PC-10", "Cliente moroso navega", "Redirigido al aviso"],
    ["PC-11 / 12", "Caída de WAN1 · caída del hub", "Failover < 60 s · sin impacto"],
    ["PC-13", "MON-01 consulta SNMPv3 a la OLT", { text: "Permitido", o: { color: K.green, bold: true } }],
  ], { colW: [1.2, 5.13, 2.6], size: 9 });
  s.addNotes("Pruebas positivas y negativas: lo que debe pasar y lo que debe bloquearse.");

  s = content(IF, "Capítulo 10 · Escalabilidad y siguientes pasos", "Preparada para 25 zonas y hoja de ruta");
  statRow(s, [["154", "Zonas que admite el overlay 10.10.0.0/24 (.101 a .254)"], ["> 4000", "Redes /28 de gestión en 172.16.0.0/16", { size: 22 }], ["< 2 Mbps", "Tráfico de gestión de la VPN", { size: 22 }], ["0", "Impacto en los clientes si cae el hub (salen por su ISP)"]]);
  flow(s, [{ t: "Hub en AWS", d: "EC2-WGHUB con nftables, Suricata y Cowrie." }, { t: "Oficina", d: "FW01, SW-CORE y las 5 VLAN." }, { t: "Zonas", d: "SSTP → WireGuard con la plantilla, empezando por SUCASCO." }, { t: "Sistema", d: "Alta de peers anunciando la red de gestión." }, { t: "Validar", d: "IDS, SIEM, monitoreo y pruebas PC-01 a PC-13." }], { y: 2.7, h: 2.2 });
  s.addNotes("La hoja de ruta es exactamente el contenido del entregable de implementación de red.");

  // ======================= E2 · CENTRO DE DATOS =======================
  addSection("CE03 · E2 Centro de Datos Híbrido");
  s = divider("06", "Capítulo 11 · CE03 · S1-E2 · CE0331", "Análisis y Diseño de Centro de Datos Híbrido",
    ["Necesidades, alcance y objetivos medibles", "On-premise: rack, host VMware ESXi y 7 VM", "AWS: región, VPC, EC2, Security Groups, NACL e IAM", "Dimensionamiento, disponibilidad y RTO/RPO"], LINE);
  s.addNotes("Segundo entregable de infraestructura: dónde y cómo se alojan los servicios.");

  s = content(IF, "Capítulo 11 · Resumen ejecutivo", "De un PC sin redundancia a un centro de datos híbrido");
  statRow(s, [["4 GB", "RAM del PC actual (A8-7600, disco único): no cumple ESXi 8", { size: 24 }], ["64 GB", "Host ESXi propuesto: 8 núcleos / 16 hilos, SSD en RAID 1", { size: 24 }], ["7 VM", "Cargas separadas por función y zona de seguridad", { size: 24 }], ["2 × t4g", "Instancias en AWS: hub VPN y réplica", { size: 24 }]]);
  table(s, ["Servicio", "Entorno", "Criterio de reparto"], [
    ["API, panel, sitio, WhatsApp", "On-premise", "Uso diario en la oficina; costo fijo; ya opera en local"],
    ["Base de datos", "On-premise", "Datos personales bajo control directo de la empresa"],
    ["Publicación (Nginx, cloudflared)", "On-premise (DMZ)", "Publica sin IP pública por túnel de salida"],
    ["Concentrador VPN", "AWS", "Requiere IP pública fija que la oficina no tiene"],
    ["Réplica y respaldos", "AWS (EC2, S3)", "Fuera de la oficina para sobrevivir a un incidente local"],
  ], { y: 2.65, colW: [2.6, 1.6, 4.73], size: 9 });
  s.addNotes("El reparto on-premise/nube se justifica servicio por servicio.");

  s = content(IF, "Capítulo 11 · Necesidades y objetivos", "Situación actual, crecimiento y objetivos");
  table(s, ["AS-IS", "Hoy"], [
    ["Servidor", "PC A8-7600, 4 GB, disco de 450 GB; Docker con 1,3–1,8 GB en reposo"],
    ["VPN", "VPS de terceros; algunas zonas aún con SSTP"],
    ["Respaldos", "pg_dump diario en el mismo equipo; copia manual semanal"],
    ["Crecimiento a 3 años", "Unos 910 clientes, 25 zonas y 27 GB de evidencias"],
  ], { w: 4.6, colW: [1.4, 3.2], size: 9 });
  table(s, ["Objetivo", "Meta"], [
    ["Dimensionar el host ESXi", "100 % cubierto con ≥ 30 % de margen"],
    ["Separar cargas", "7 VM dedicadas"],
    ["AWS costo-eficiente", "Servicios justificados"],
    ["Disponibilidad mínima", "RTO ≤ 2 h en servicios críticos"],
    ["Respaldos fuera de sitio", "Regla 3-2-1"],
  ], { x: 5.3, w: 4.18, colW: [2.0, 2.18], size: 9 });
  note(s, "Alta disponibilidad con dos hosts y vCenter se descarta por costo; se compensa con la réplica en AWS.");
  s.addNotes("El equipo actual se reutiliza como estación de pruebas.");

  s = content(IF, "Capítulo 11 · On-premise", "Rack de la oficina y equipamiento propuesto");
  imageCard(s, FIG + "f11_2.png", 0.55, 1.3, 4.0, 3.6);
  table(s, ["Equipo", "Especificación clave"], [
    ["ESXI-01 Dell R250", "Xeon E-2378 8C/16T, 64 GB ECC, 2 × 1,92 TB RAID 1, iDRAC"],
    ["FW01 RB5009", "7 × 1 GbE, 2,5 GbE, SFP+; RouterOS 7"],
    ["SW-CORE CRS326", "24 × 1 GbE, 2 SFP+, 802.1Q, puerto espejo"],
    ["NAS-01 DS224+", "2 × 4 TB en RAID 1 para respaldos locales"],
    ["UPS APC 1500 VA", "Carga ≈ 240 W, unos 30 min de autonomía"],
    ["Rack 18U", "Con PDU y organizadores"],
  ], { x: 4.7, w: 4.78, colW: [1.55, 3.23], size: 8.5 });
  s.addNotes("Equipamiento real y comprable; se verifica la compatibilidad con la guía de Broadcom.");

  s = content(IF, "Capítulo 11 · Hipervisor", "Diseño del hipervisor VMware ESXi 8");
  imageCard(s, FIG + "f11_3.png", 0.55, 1.3, 5.6, 3.6);
  table(s, ["vSwitch", "Uplinks y uso"], [
    ["vSwitch0", "vmnic0 + vmnic1 activo/en espera: gestión (VLAN 10)"],
    ["vSwitch1", "vmnic2 + vmnic3: datos VLAN 20, 40 y 50; balanceo por puerto virtual"],
    ["vSwitch2", "vmnic4 al puerto espejo; PG-SPAN VLAN 4095 promiscuo solo para IDS-01"],
    ["Seguridad", "Promiscuo, cambio de MAC y transmisiones falsificadas: rechazar"],
    ["Licencia", "ESXi 8 gratuito (8.0 U3e) o académica; respaldo con ghettoVCB"],
  ], { x: 6.3, w: 3.18, colW: [0.95, 2.23], size: 8.5 });
  s.addNotes("Tres vSwitches: gestión, datos y espejo para el IDS.");

  s = content(IF, "Capítulo 11 · Máquinas virtuales", "Siete máquinas virtuales planeadas");
  table(s, ["VM", "vCPU", "RAM", "Disco", "Función"], [
    ["APP-01", "4", "8 GB", "60 + 150 GB", "Backend FastAPI, panel, sitio, WhatsApp; disco de evidencias"],
    ["DB-01", "4", "8 GB", "120 GB", "PostgreSQL 15 con archivado WAL"],
    ["PROXY-01", "2", "2 GB", "30 GB", "Nginx + cloudflared (DMZ)"],
    ["HONEY-01", "1", "1 GB", "20 GB", "OpenCanary (señuelo DMZ)"],
    ["MON-01", "2", "4 GB", "60 GB", "Zabbix 7.0 LTS (SNMP a routers y OLT)"],
    ["SIEM-01", "4", "8 GB", "150 GB", "Wazuh (manager, indexer, dashboard)"],
    ["IDS-01", "2", "4 GB", "40 GB", "Suricata sobre el espejo del troncal"],
    [{ text: "Total", o: { bold: true } }, { text: "19", o: { bold: true } }, { text: "35 GB", o: { bold: true } }, { text: "630 GB", o: { bold: true } }, "Ubuntu 24.04 en todas"],
  ], { colW: [1.2, 0.7, 0.9, 1.3, 4.83], size: 9.5 });
  s.addNotes("Una VM por función: un compromiso en la DMZ no alcanza la base de datos.");

  s = content(IF, "Capítulo 11 · AWS", "Región, VPC y servicios en AWS");
  imageCard(s, FIG + "f11_4.png", 0.55, 1.3, 5.0, 3.6);
  card(s, 5.7, 1.3, 3.78, 3.6);
  cardHead(s, "Decisiones", 5.93, 1.42, 3.4);
  bullets(s, [[{ text: "sa-east-1 (São Paulo): ", b: true }, { text: "la región completa más cercana; la latencia se nota en la operación diaria." }], [{ text: "Instancia NAT: ", b: true }, { text: "el propio hub, en vez de un NAT Gateway de cargo fijo." }], [{ text: "Endpoint de S3: ", b: true }, { text: "los respaldos no pasan por el NAT y no tienen costo de transferencia." }], [{ text: "Graviton (t4g): ", b: true }, { text: "las imágenes del sistema son multiarquitectura." }], "Flujo transfronterizo documentado según la Ley N.° 29733."], 5.95, 1.75, 3.45, 3.1, { size: 9.5 });
  s.addNotes("Cada servicio de AWS se eligió por costo y por la necesidad real de WISP.");

  s = content(IF, "Capítulo 11 · Seguridad en AWS", "Security Groups, NACL e IAM");
  table(s, ["Nombre", "Alcance", "Regla principal"], [
    ["sg-wghub", "Instancia", "Entrada UDP 51820 (zonas tras CGNAT); TCP 22 solo hacia Cowrie; todo desde sg-dr (NAT)"],
    ["sg-dr", "Instancia", "TCP 5432 solo desde 10.20.20.11/32; TCP 8000 desde gestión; sin entrada de internet"],
    ["NACL pública", "Subred", "UDP 51820, TCP 22 y efímeros de retorno; deniega el resto"],
    ["NACL privada", "Subred", "Solo desde 10.50/16, 10.20/16 y 10.10.0/24; sin entrada directa de internet"],
    ["rol-ec2-hub / rol-ec2-dr", "IAM", "Systems Manager sin SSH; CloudWatch; respaldos solo en su prefijo"],
    ["svc-respaldo-oficina", "IAM", "Solo PutObject en el prefijo de respaldos (no puede borrar)"],
  ], { colW: [2.0, 1.0, 5.93], size: 9 });
  note(s, "Cuenta raíz con MFA y sin uso diario; bucket con bloqueo público, versionado, cifrado y ciclo de vida a Glacier.");
  s.addNotes("Mínimo privilegio también en la nube: ni siquiera la oficina puede borrar respaldos.");

  s = content(IF, "Capítulo 11 · Integración híbrida", "Los dos diseños usan las mismas redes y extremos");
  table(s, ["Elemento", "Diseño de red (cap. 10)", "Diseño de centro de datos (cap. 11)"], [
    ["Hub VPN", "EC2-WGHUB, 10.10.0.1, <EIP-HUB>:51820", "EC2-WGHUB en sn-publica, 10.50.1.10"],
    ["Peer on-premise", "FW01 10.10.0.2; anuncia 10.20.{10,20,50}.0/24", "VM en VLAN 20 y 50 de ESXI-01"],
    ["Red de AWS", "10.50.0.0/16", "VPC 10.50.0.0/16"],
    ["Réplica de la base", "Flujo DB-01 → EC2-DR, TCP 5432", "sg-dr permite 5432 solo desde 10.20.20.11"],
    ["Peers de zona", "10.10.0.(100+id); anuncian 172.16.id.0/28", "rt-privada enruta 172.16.0.0/16 al hub"],
  ], { colW: [1.7, 3.6, 3.63], size: 9.5 });
  note(s, "La coherencia entre ambos documentos es un criterio de la rúbrica (10 %).");
  s.addNotes("Red y centro de datos encajan: mismas IP, mismos extremos, mismas reglas.");

  s = content(IF, "Capítulo 11 · Dimensionamiento", "Recursos asignados frente a la capacidad del host");
  s.addChart(pres.charts.BAR, [{ name: "Uso", labels: ["RAM (39 de 64 GB)", "Disco (670 GB de 1,9 TB)", "vCPU (19 de 16 hilos)"], values: [61, 35, 119] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.0, h: 3.55, barDir: "bar", showTitle: true, title: "Porcentaje de la capacidad asignada", dataLabelPosition: "outEnd", dataLabelFormatCode: "0\"%\"", valAxisMaxVal: 140, valAxisHidden: true, chartColors: [K.navy] }));
  card(s, 5.7, 1.3, 3.78, 3.55);
  cardHead(s, "Justificación", 5.93, 1.42, 3.4);
  bullets(s, ["CPU: 1,2:1 sobre hilos, debajo del 3:1 habitual en cargas ligeras.", "RAM: 39 % de margen, ampliable a 128 GB.", "Disco: 35 % de uso; espacio para instantáneas y para duplicar datos.", "La base cabe en memoria (< 2 GB a 3 años); evidencias 27 GB frente a 150 GB.", "Energía: unos 240 W dentro del UPS de 1500 VA."], 5.95, 1.75, 3.45, 3.05, { size: 9.5 });
  s.addNotes("El dimensionamiento parte del consumo real medido hoy en el servidor.");

  s = content(IF, "Capítulo 11 · Disponibilidad y continuidad", "Respaldo 3-2-1 y RTO/RPO por servicio");
  flow(s, [{ n: "1", t: "Producción", d: "Datos en ESXI-01 con RAID 1." }, { n: "2", t: "Copia local", d: "NAS-01: ghettoVCB y pg_dump diario." }, { n: "3", t: "Fuera de sitio", d: "S3: pg_dump cifrado, WAL cada 15 min, evidencias nocturnas." }], { w: 4.6, h: 1.6 });
  table(s, ["Servicio", "RPO", "RTO", "Estrategia"], [
    ["Base de datos", "5 min", "1 h", "Promover la réplica o PITR con WAL"],
    ["API, panel y app", "15 min", "2 h", "Restaurar APP-01 o activar EC2-DR"],
    ["Hub VPN", "24 h", "30 min", "Relanzar desde la AMI y reasignar la EIP"],
    ["Routers", "24 h", "1 h", "Export nocturno y restaurar el .rsc"],
    ["Evidencias", "24 h", "4 h", "Sincronización a S3 y NAS"],
  ], { x: 5.3, w: 4.18, colW: [1.15, 0.6, 0.6, 1.83], size: 8.5 });
  card(s, 0.55, 3.05, 4.6, 1.85, { stripeColor: K.navy });
  txt(s, [{ text: "Contingencia: ", options: { bold: true, color: K.navy } }, { text: "réplica en flujo de PostgreSQL hacia EC2-DR. Ante la pérdida de la oficina se promueve la réplica, se levantan los contenedores en EC2-DR y el túnel de Cloudflare apunta a esa instancia." }], { x: 0.78, y: 3.17, w: 4.25, h: 1.65, fontSize: 10 });
  s.addNotes("Los objetivos de recuperación se validarán con al menos un ejercicio completo en el semestre 2.");

  // ======================= SGSI =======================
  addSection("CE03 · S2-E1 SGSI");
  s = divider("07", "Capítulo 12 · CE03 · S2-E1 · CE0321–CE0324", "Planificación e Implementación del SGSI",
    ["Contexto, alcance, liderazgo y objetivos", "Activos, riesgos ISO/IEC 27005, tratamiento y SoA", "Políticas, accesos, incidentes, continuidad y ética", "Métricas, auditoría interna y revisión por la dirección"], LINE);
  s.addNotes("El SGSI se aplica sobre la infraestructura real que opera hoy, no solo sobre el diseño.");

  s = content(IF, "Capítulo 12 · Resumen ejecutivo", "El SGSI sobre la infraestructura que opera hoy");
  statRow(s, [["26", "Activos inventariados con clasificación C-I-D"], ["20", "Riesgos evaluados: 7 altos, 12 medios y 1 bajo"], ["37", "Controles del Anexo A en la Declaración de Aplicabilidad"], ["7", "No conformidades en la auditoría interna (2 mayores)"]]);
  card(s, 0.55, 2.7, 8.93, 2.2);
  cardHead(s, "Ciclo PHVA", 0.78, 2.82, 8);
  bullets(s, [[{ text: "Planificar: ", b: true }, { text: "contexto, alcance, riesgos y SoA." }], [{ text: "Hacer: ", b: true }, { text: "políticas, procedimiento de accesos, planes de incidentes, continuidad y concientización, y controles de base de datos ya probados." }], [{ text: "Verificar: ", b: true }, { text: "auditoría interna del 18/11/2026: 7 NC, 2 observaciones y 5 conformidades." }], [{ text: "Actuar: ", b: true }, { text: "acciones correctivas y revisión por la dirección." }]], 0.8, 3.15, 8.5, 1.7);
  s.addNotes("La mayor exposición está fuera del software: routers sin filtrado, respaldos que no salen del servidor y un único equipo.");

  s = content(IF, "Capítulo 12 · Contexto de la organización", "Qué protege el SGSI");
  imageCard(s, FIG + "f12_1.png", 0.55, 1.3, 4.6, 3.6);
  table(s, ["Servicio", "Cómo se expone"], [
    ["Sitio, panel y API", "Solo por el túnel; HTTPS de Cloudflare, HSTS"],
    ["PostgreSQL, WhatsApp, panel", "No se publican: 127.0.0.1"],
    ["API en el puerto 8000", "Red del host: el firewall debe cerrarla (R-13)"],
    ["Hub VPN", "UDP 51820; solo peers con llave"],
    ["Routers de zona", { text: "WAN sin filtrado (R-01)", o: { color: K.red, bold: true } }],
    ["Gestión de la OLT", { text: "Alcanzable desde clientes (R-20)", o: { color: K.red, bold: true } }],
  ], { x: 5.3, w: 4.18, colW: [1.75, 2.43], size: 8.5 });
  s.addNotes("La tabla de exposición se verificó contra la configuración real.");

  s = content(IF, "Capítulo 12 · Alcance", "Alcance, límites y exclusiones del SGSI");
  cardsGrid(s, [
    { t: "Físico", d: "Oficina central de Juliaca (servidor, router, switch, UPS, estaciones) y gabinetes de las 13 zonas." },
    { t: "Tecnológico", d: "Los 26 activos del inventario: información, software, infraestructura, red de zonas y servicios externos." },
    { t: "Organizacional", d: "Todo el personal de WISP y los terceros con acceso lógico." },
    { t: "Exclusiones", color: K.muted, d: "Red óptica pasiva, equipos del cliente, infraestructura de Cloudflare, VPS y Meta (sí sus cuentas), y el ESXi/AWS del diseño hasta que exista." },
  ], { cols: 2, h: 3.55 });
  s.addNotes("El diseño híbrido entrará al alcance cuando se implemente.");

  s = content(IF, "Capítulo 12 · Liderazgo", "Política de seguridad y roles del SGSI");
  card(s, 0.55, 1.3, 4.39, 3.6);
  cardHead(s, "Política PO-SGSI-01", 0.78, 1.42, 4);
  bullets(s, ["Acceso por rol y con mínimo privilegio.", "Ningún servicio interno expuesto: publicación por túnel, administración por VPN.", "Información crítica respaldada fuera del servidor y restauración probada.", "Incidentes reportados en ≤ 30 min y notificados en plazos de ley.", "Datos personales conforme a la Ley N.° 29733.", "Revisión anual y tras cada incidente grave."], 0.8, 1.75, 4.0, 3.1, { size: 9.5 });
  table(s, ["Rol", "Responsabilidad"], [
    ["Alta dirección", "Aprueba política y SoA; preside la revisión"],
    ["Oficial de seguridad", "Coordina el SGSI, lidera el CSIRT, audita accesos"],
    ["Resp. de infraestructura", "Servidor, red, VPS, túnel y routers"],
    ["Resp. de sistemas", "Sistema, base de datos y respaldos"],
    ["Suplente técnico", "Cubre al administrador (R-04)"],
    ["Usuarios", "Uso aceptable y reporte de incidentes"],
  ], { x: 5.09, w: 4.39, colW: [1.6, 2.79], size: 8.5 });
  note(s, "Segregación de funciones (A.5.3): quien administra los sistemas no es quien los supervisa.");
  s.addNotes("La política es corta y verificable; los roles separan operación de supervisión.");

  s = content(IF, "Capítulo 12 · Objetivos", "Nueve objetivos de seguridad medibles");
  table(s, ["ID", "Indicador", "Línea base (18/11/2026)", "Meta"], [
    ["OS-1", "Cuentas nominales con rol", "Sistema: 100 %; routers y servidor sin medir", "100 %"],
    ["OS-2", "Zonas gestionadas por WireGuard", "SUCASCO aún en SSTP", "13 de 13"],
    ["OS-3", "Restauraciones probadas", "1 en laboratorio (4 s)", "1 por trimestre"],
    ["OS-4", "Operaciones críticas trazadas", "Historial y auditoría de pagos", "100 %"],
    ["OS-5", "Riesgos altos con residual medio o bajo", "0 de 7", "7 de 7"],
    ["OS-6", "Personal capacitado", "0 de 11", "11 de 11"],
    ["OS-7", "Cuentas privilegiadas con MFA", "Sin medir", "100 %"],
    ["OS-8", "Puertos de entrada no autorizados", "0 en la oficina; 13 routers expuestos", "0"],
    ["OS-9", "Días con copia externa", "0 (copia semanal manual)", "100 %"],
  ], { colW: [0.7, 3.0, 3.53, 1.7], size: 9 });
  s.addNotes("La línea base es honesta: varios objetivos empiezan en cero.");

  s = content(IF, "Capítulo 12 · Activos", "Inventario de 26 activos y su criticidad");
  s.addChart(pres.charts.BAR, [{ name: "Activos", labels: ["Información", "Infraestructura", "Software", "Servicios externos", "Red de zonas", "Personas", "Intangible"], values: [7, 5, 4, 4, 3, 2, 1] }],
    chartOpts({ x: 0.55, y: 1.3, w: 4.6, h: 3.55, barDir: "bar", showTitle: true, title: "Activos por tipo", dataLabelPosition: "outEnd", chartColors: [K.navy] }));
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Criticidad", labels: ["Crítica", "Alta", "Media"], values: [9, 13, 4] }],
    chartOpts({ x: 5.3, y: 1.3, w: 4.18, h: 3.55, holeSize: 55, showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: K.muted, chartColors: [K.red, K.orange, K.ice], dataLabelColor: K.white, showTitle: true, title: "Criticidad" }));
  note(s, "Cada activo tiene propietario, ubicación y clasificación C-I-D (hoja Inventario del Excel de matrices).");
  s.addNotes("El activo más crítico es la base de datos de clientes, cobros y planta.");

  s = content(IF, "Capítulo 12 · Evaluación de riesgos", "Los siete riesgos altos (ISO/IEC 27005)");
  s.addChart(pres.charts.BAR, [{ name: "Nivel", labels: ["R-01 Routers sin filtrado", "R-09 Phishing", "R-18 Incidentes no detectados", "R-02 Fuga de datos personales", "R-03 Pérdida de datos", "R-07 Robo de secretos", "R-19 Falla del servidor único"], values: [20, 16, 16, 15, 15, 15, 15] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.7, h: 3.6, barDir: "bar", showTitle: true, title: "Nivel = probabilidad × impacto (alto: 15 a 25)", dataLabelPosition: "outEnd", valAxisMaxVal: 25, valAxisHidden: true, chartColors: [K.red] }));
  card(s, 6.4, 1.3, 3.08, 3.6);
  cardHead(s, "Metodología", 6.63, 1.42, 2.7);
  bullets(s, ["P e I de 1 a 5; nivel = P × I.", "Bajo 1–6, medio 8–12, alto 15–25.", "20 riesgos: 7 altos, 12 medios, 1 bajo.", "Las vulnerabilidades se verificaron en la configuración real.", "Línea base de 22 riesgos del sistema heredado en el Anexo B."], 6.65, 1.75, 2.75, 3.1, { size: 9.5 });
  s.addNotes("El riesgo más alto, 20, es de red: routers de zona sin filtrado.");

  s = content(IF, "Capítulo 12 · Tratamiento", "Plan de tratamiento y riesgo residual");
  table(s, ["Riesgo", "Estrategia", "Acción principal", "Plazo", "Residual"], [
    ["R-01 Routers", "Mitigar", "Plantilla endurecida en los 13 routers; gestión solo por WireGuard", "3 meses", "10 (medio)"],
    ["R-02 Fuga de datos", "Mitigar", "Roles de base con mínimo privilegio, cifrado de credenciales y respaldos cifrados", "2 meses", "10 (medio)"],
    ["R-03 Pérdida de datos", "Mitigar", "Copia externa diaria cifrada y prueba trimestral", "1 mes", "5 (bajo)"],
    ["R-05 Cuentas externas", "Mitigar", "MFA en Cloudflare, dominio y VPS", "Inmediato", "5 (bajo)"],
    ["R-07 Secretos", "Mitigar", "sudo limitado en la VPS, PSK por peer, rotación anual, .env con permisos 600", "2 meses", "10 (medio)"],
    ["R-10 Repositorio", "Mitigar", "Retirar fotos e IP del historial de Git; .gitignore; revisión antes de cada push", "1 semana", "4 (bajo)"],
    ["R-14 / R-17", "Aceptar", "WhatsApp: pausas y plan a la API oficial · campo: gabinetes con cerradura", "Revisión", "9 / 6"],
  ], { colW: [1.6, 0.95, 4.08, 1.05, 1.25], size: 8.5 });
  note(s, "17 riesgos se mitigan, 1 se mitiga y transfiere (R-12) y 2 se aceptan con aprobación de la Gerencia.");
  s.addNotes("Cada riesgo tiene estrategia, responsable, plazo y un residual calculado.");

  s = content(IF, "Capítulo 12 · Declaración de Aplicabilidad", "SoA: 37 controles del Anexo A de ISO/IEC 27001:2022");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "SoA", labels: ["Implementados", "Parciales", "Planificados", "Excluidos"], values: [5, 20, 10, 2] }],
    chartOpts({ x: 0.55, y: 1.3, w: 3.6, h: 3.55, holeSize: 55, showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: K.muted, chartColors: [K.green, K.orange, K.navy, K.muted], dataLabelColor: K.white, showTitle: true, title: "Estado de los 37 controles" }));
  imageCard(s, FIG + "f12_2.png", 4.3, 1.3, 5.18, 1.5, { cap: "Trazabilidad del riesgo mayor: riesgo → control → implementación → evidencia" });
  card(s, 4.3, 2.95, 5.18, 1.9);
  cardHead(s, "Ejemplos", 4.53, 3.07, 4.8);
  bullets(s, ["5.15 Control de acceso: implementado (JWT y require_roles por endpoint).", "8.5 Autenticación segura: parcial (freno al login; MFA pendiente).", "8.20 / 8.22 Redes: parcial (túnel sin puertos; VLAN 10 puenteada en zonas).", "8.13 Respaldo: parcial (diario, sin copia externa automática)."], 4.55, 3.4, 4.85, 1.4, { size: 9.5 });
  s.addNotes("Cada control tiene justificación, estado y evidencia; las exclusiones están justificadas.");

  s = content(IF, "Capítulo 12 · Políticas y procedimientos", "Seis documentos del SGSI, vinculados a componentes reales");
  cardsGrid(s, [
    { t: "PO-SGSI-01 · Seguridad", d: "Política general; revisión anual y tras incidentes graves." },
    { t: "PO-SGSI-02 · Accesos", d: "Cuentas nominales, MFA en servicios externos, SSH con llave, routers solo por WireGuard." },
    { t: "PR-SGSI-03 · Incidentes", d: "Reporte en ≤ 30 min, severidad, CSIRT, contención y lecciones aprendidas." },
    { t: "PO-SGSI-04 · Proveedores", d: "Cloudflare, VPS, Meta, APIs Perú y mayorista con términos revisados." },
    { t: "PO-SGSI-05 · Respaldo", d: "3-2-1, export nocturno de routers, .env cifrado, prueba trimestral." },
    { t: "PO-SGSI-06 · Uso aceptable", d: "Sin datos de clientes en el celular personal; teléfono bloqueado; reportar pérdidas." },
  ], { cols: 3, h: 3.55 });
  note(s, "El procedimiento PR-SI-001 (Anexo A) ejecuta el alta, la modificación y la baja de accesos.");
  s.addNotes("Las políticas mencionan componentes reales: no son plantillas genéricas.");

  s = content(IF, "Capítulo 12 · Identidades y accesos", "Matriz de accesos por rol y MFA");
  table(s, ["Rol", "Cloudflare / dominio", "Servidor", "Routers", "Sistema", "Base de datos"], [
    ["Gerencia", "Propietario (MFA)", "—", "—", "Admin", "—"],
    ["Administrador", "Admin (MFA)", "sudo, SSH con llave", "Admin", "Admin", "Dueño (migraciones)"],
    ["Oficial de seguridad", "Lectura", "Lectura de logs", "Lectura", "Lectura", "Lectura (vistas)"],
    ["Suplente técnico", "—", "Emergencia", "Emergencia", "Técnico", "—"],
    ["Técnico / vendedor / atención", "—", "—", "—", "Su rol (zonas)", "—"],
    ["Backend · respaldos", "—", "Contenedor", "SSH limitado (api)", "—", "Rol de aplicación · respaldo"],
  ], { colW: [1.85, 1.45, 1.4, 1.35, 1.3, 1.58], size: 8.5, maxH: 2.45 });
  card(s, 0.55, 3.85, 8.93, 1.05, { stripeColor: K.navy });
  txt(s, [{ text: "MFA obligatoria ", options: { bold: true, color: K.navy } }, { text: "en Cloudflare, el dominio y la VPS: quien controla el DNS o el túnel puede suplantar el panel (R-05). Ningún secreto en el repositorio; llaves WireGuard generadas en cada equipo y rotación anual." }], { x: 0.78, y: 3.95, w: 8.55, h: 0.9, fontSize: 10 });
  s.addNotes("Mínimo privilegio en cada capa, desde Cloudflare hasta la base de datos.");

  s = content(IF, "Capítulo 12 · Incidentes", "Gestión de incidentes: severidad, CSIRT y playbooks");
  table(s, ["Severidad", "Ejemplo", "Aviso interno"], [
    [{ text: "Crítico", o: { color: K.red, bold: true } }, "Datos personales comprometidos, ≥ 3 zonas o servidor caídos, ransomware", "15 min"],
    [{ text: "Alto", o: { color: K.orangeDk, bold: true } }, "Cuenta privilegiada comprometida sin fuga; 1 o 2 zonas sin servicio", "30 min"],
    ["Medio", "Cuenta operativa comprometida; degradación parcial; clic en phishing", "2 h"],
    ["Bajo", "Evento sin impacto confirmado; phishing reportado sin clic", "24 h"],
  ], { w: 5.4, colW: [1.0, 3.5, 0.9], size: 8.5, maxH: 2.2 });
  card(s, 6.1, 1.3, 3.38, 3.6);
  cardHead(s, "Tres playbooks (Anexo C)", 6.33, 1.42, 3);
  bullets(s, ["1 · Acceso no autorizado a datos de clientes (R-02).", "2 · Caída del servicio en varias zonas (R-06, R-11, R-12).", "3 · Compromiso del servidor o del túnel (R-05, R-13, R-19).", "Notificación: ANPD y CNSD en 48 h; OSIPTEL por interrupciones; DIVINDAT ante indicios de delito."], 6.35, 1.75, 3.05, 3.1, { size: 9.5 });
  card(s, 0.55, 3.75, 5.4, 1.15, { stripeColor: K.navy });
  txt(s, [{ text: "Contención en esta infraestructura: ", options: { bold: true, color: K.navy } }, { text: "bloquear la cuenta, desactivar la ruta del túnel en Cloudflare, revocar el peer WireGuard, detener el contenedor comprometido o aislar el router de zona." }], { x: 0.78, y: 3.83, w: 5.05, h: 1.0, fontSize: 10 });
  s.addNotes("Cada playbook tiene tiempos: detectar, reportar, contener, preservar evidencia, erradicar, notificar y aprender.");

  s = content(IF, "Capítulo 12 · Continuidad", "Continuidad del negocio: BIA y recuperación");
  table(s, ["Servicio", "Hoy (RTO / RPO)", "Meta", "Cómo se alcanza"], [
    ["Base de datos", "≈ 4 h / hasta 7 días si se pierde el disco", "2 h / 1 h", "Copia externa diaria y WAL; restauración probada"],
    ["Sistema (API, panel, app)", "4–8 h (reinstalar)", "2 h", "Equipo de respaldo con Docker y compose listos"],
    ["Publicación (túnel)", "30 min", "30 min", "Token nuevo con el mismo nombre DNS"],
    ["Hub VPN", "Sin procedimiento", "1 h", "Script de reconstrucción y wg0.conf cifrado"],
    ["Configuración de routers", "Manual", "1 h", "Exportación nocturna automática"],
  ], { colW: [1.9, 2.6, 1.0, 3.43], size: 8.5, maxH: 2.3 });
  card(s, 0.55, 3.7, 8.93, 1.2, { stripeColor: K.red });
  txt(s, [{ text: "El riesgo que podría quebrar a WISP: ", options: { bold: true, color: K.red } }, { text: "perder los datos de clientes y cobros por la falla del servidor único (R-19) con respaldos que no salen de él (R-03). Sin ese registro no se puede cobrar ni demostrar pagos." }], { x: 0.78, y: 3.8, w: 8.55, h: 1.0, fontSize: 10 });
  s.addNotes("El BIA identifica el riesgo existencial y la estrategia para cerrarlo (Anexo D, metodología INCIBE).");

  s = content(IF, "Capítulo 12 · Ética (CE0324)", "Ética de la seguridad de la información");
  cardsGrid(s, [
    { t: "Código adoptado", d: "ACM 2018 (1.2 evitar daños, 1.6 privacidad, 1.7 confidencialidad, 2.5 evaluar riesgos, 2.9 sistemas seguros) y los cánones de (ISC)²." },
    { t: "Alcance ético de pruebas", d: "Solo sistemas de WISP o de laboratorio, con autorización escrita; sin DoS ni pruebas contra terceros." },
    { t: "Confidencialidad", d: "Ley N.° 29733; en los entregables solo hay datos anonimizados." },
    { t: "Divulgación responsable", d: "Vulnerabilidades de terceros se reportan en privado; 90 días o hasta su corrección." },
    { t: "Conflictos de interés", d: "Cada integrante los declara; quien audita un área no la administra." },
    { t: "Coherencia demostrada", d: "Datos del router de SUCASCO analizados en privado; fotos en el repositorio reportadas como NC-02." },
  ], { cols: 3, h: 3.55, dSize: 9 });
  note(s, "Declaración firmada por los cuatro integrantes; informe ético-legal completo en el Anexo F.");
  s.addNotes("La ética se demuestra con el comportamiento del proyecto, no solo con una declaración.");

  s = content(IF, "Capítulo 12 · Auditoría interna", "Auditoría interna del 18/11/2026: hallazgos");
  table(s, ["ID", "Control", "Hallazgo", "Tipo"], [
    ["NC-01", "8.20", "Router de SUCASCO sin reglas de filtrado y con gestión expuesta", { text: "Mayor", o: { color: K.red, bold: true } }],
    ["NC-02", "5.34", "8 fotos de evidencias de clientes versionadas en Git", { text: "Mayor", o: { color: K.red, bold: true } }],
    ["NC-03", "8.13", "Respaldo en el mismo disco; copia externa manual y semanal", "Menor"],
    ["NC-04", "8.24", "Credenciales PPPoE y de routers en texto plano", "Menor"],
    ["NC-05", "8.20", "El cliente SSH acepta cualquier llave de host (AutoAddPolicy)", "Menor"],
    ["NC-06", "8.22", "VLAN 10 puenteada y sin filtro: los clientes llegan a la OLT", "Menor"],
    ["NC-07", "8.8", "cloudflared:latest sin versión fija y backend con NET_ADMIN", "Menor"],
    ["C-01..05", "5.15 a 8.32", "JWT y roles, sin secretos, freno al login, servicios en 127.0.0.1, migraciones", { text: "Conforme", o: { color: K.green, bold: true } }],
  ], { colW: [0.85, 0.95, 6.03, 1.1], size: 8.5 });
  note(s, "Auditoría documental y técnica, sin pruebas intrusivas, sobre ISO/IEC 27001:2022 cláusulas 4 a 10 y la SoA.");
  s.addNotes("Encontramos y reportamos nuestras propias fallas: es lo que da credibilidad al SGSI.");

  s = content(IF, "Capítulo 12 · Revisión por la dirección", "Revisión por la dirección y mejora continua");
  imageCard(s, FIG + "f12_3.png", 0.55, 1.3, 8.93, 0.9);
  card(s, 0.55, 2.35, 4.39, 2.55);
  cardHead(s, "Conclusión", 0.78, 2.47, 4);
  txt(s, "El SGSI es adecuado en su diseño, pero aún no es eficaz en la red de zonas ni en los respaldos, donde están las dos NC de mayor impacto.", { x: 0.8, y: 2.8, w: 4.0, h: 2.0, fontSize: 10.5 });
  card(s, 5.09, 2.35, 4.39, 2.55, { stripeColor: K.navy });
  cardHead(s, "Decisiones", 5.32, 2.47, 4);
  bullets(s, ["Resolver NC-02 en una semana y NC-01 empezando por SUCASCO.", "MFA en Cloudflare, dominio y VPS de inmediato.", "Automatizar la copia externa diaria.", "Oficial de seguridad separado del administrador.", "Presupuestar el servidor definitivo con disco espejo."], 5.34, 2.8, 4.0, 2.05, { size: 9.5 });
  s.addNotes("La matriz maestra une cada riesgo con su control, implementación, prueba y evidencia.");

  s = content(IF, "Capítulo 12 · Anexos del SGSI", "Anexos A a F y libro de matrices");
  cardsGrid(s, [
    { t: "A · PR-SI-001", d: "Procedimiento de alta, modificación y baja de accesos a sistemas, servidor, Cloudflare, VPS, routers y OLT." },
    { t: "B · Línea base", d: "22 riesgos del sistema heredado y qué cambió con el sistema en producción." },
    { t: "C · Incidentes", d: "Severidad, CSIRT, fases, 3 playbooks, indicadores de compromiso y notificación." },
    { t: "D · Continuidad", d: "Comité, BIA, estrategia INCIBE, plan de crisis y recuperación del servidor." },
    { t: "E · Concientización", d: "7 actividades: encuesta, phishing, MFA, equipos en campo y simulacro de incidente." },
    { t: "F · Ético-legal", d: "34 obligaciones verificadas, 12 riesgos ético-legales, 8 políticas y el Código de Ética." },
  ], { cols: 3, h: 3.55, dSize: 9.5 });
  note(s, "Excel sgsi/WISP_SGSI_Matrices.xlsx: inventario, riesgos, tratamiento, SoA y trazabilidad.");
  s.addNotes("Los productos obligatorios del SGSI están todos: informe, inventario, matrices, SoA, políticas y ética.");

  // ======================= S2-E2 y S2-E3 =======================
  addSection("CE03 · S2-E2 y S2-E3 en ejecución");
  s = content(IF, "CE03 · S2-E2 · CE0312–CE0313", "Implementación y monitoreo de red: plan de ejecución");
  table(s, ["Criterio de la rúbrica", "Peso", "Qué se implementará", "Evidencia"], [
    ["Conectividad híbrida", "15 %", "EC2-WGHUB y migración SSTP → WireGuard", "wg show, rutas, PC-01 a PC-04"],
    ["Seguridad perimetral", "22 %", "FW01, 5 VLAN, DMZ y plantilla de zona", "Export sanitizado, PC-05 a PC-09"],
    ["IDS/IPS y honeypot", "18 %", "Suricata, Cowrie, OpenCanary", "Alertas de punta a punta"],
    ["Monitoreo y registros", "15 %", "Wazuh y Zabbix; syslog de 13 zonas", "Tableros y logs"],
    ["Plan y resultados de pruebas", "12 %", "Matriz PC-01 a PC-13", "Esperado vs obtenido"],
    ["Trazabilidad, documentación y sustentación", "18 %", "Repositorio técnico sin secretos", "Git con configuraciones"],
  ], { colW: [2.4, 0.7, 3.2, 2.63], size: 9 });
  note(s, "Estado: pendiente. Depende del despliegue real del hub en AWS y del equipamiento de la oficina.");
  s.addNotes("Somos claros: este entregable aún no tiene evidencia, y aquí está su plan alineado a la rúbrica.");

  s = content(IF, "CE03 · S2-E3 · CE0332–CE0333", "Implementación y control del centro de datos: plan");
  table(s, ["Criterio de la rúbrica", "Peso", "Qué se implementará", "Evidencia"], [
    ["On-premise ESXi y VM", "18 %", "ESXI-01, vSwitches, port groups y 7 VM", "Capturas y configuración"],
    ["AWS", "18 %", "VPC, subredes, EC2, SG y NACL", "Consola y export sanitizado"],
    ["Identidades y accesos", "14 %", "IAM, MFA, llaves SSH, Systems Manager", "Políticas y matriz"],
    ["Inventario final", "12 %", "Activos con evidencia", "Excel actualizado"],
    ["Continuidad probada", "14 %", "Backup, restore, recuperación de VM, AWS y VPN", "Registro de recuperación"],
    ["Monitoreo operativo", "10 %", "Métricas ESXi y CloudWatch con alertas", "Tableros"],
    ["Trazabilidad y versiones", "14 %", "Repositorio con README e historial", "Git"],
  ], { colW: [2.3, 0.7, 3.4, 2.53], size: 9 });
  note(s, "Estado: pendiente. La primera migración es mover los contenedores actuales a APP-01, DB-01 y PROXY-01.");
  s.addNotes("La base ya existe: los contenedores actuales se migran a las VM sin cambiar el sistema.");
};
