// Línea CE02 — Ingeniería de Software (capítulos 6 a 9 del documento)
const B = require("./base");
const { pres, K, HF, IMG, FIG, addSection, txt, card, cardHead, bullets, note, chip, content, imageCard, table, statRow, cardsGrid, flow, divider, chartOpts } = B;
const L2 = IMG + "linea2/";
const SW = "sw";
const LINE = "Línea CE02 — Ingeniería de Software";

module.exports = function ce02() {
  let s;
  // ======================= APERTURA DE LA LÍNEA =======================
  addSection("CE02 · Ingeniería de Software");
  s = divider("CE02", "Línea de especialidad 2 · Ingeniería de Software", "Del requerimiento al sistema en producción",
    ["S1-E1 · Requerimientos y Diseño del Sistema (CE021)", "S2-E2 · Plataforma de Datos del Sistema (CE022)", "S2-E3 · Sistema de Software Funcional Integrado (CE023)", "S2-E4 · Gestión del Proyecto y Calidad de Software (CE024)"], LINE);
  s.addNotes("La línea de software tiene cuatro entregables. Los recorremos en el orden en que se construyó el sistema: requerimientos y diseño, datos, sistema funcional y calidad.");

  s = content(SW, "CE02 · Visión de la línea", "Un sistema real: wispfibra.com en producción");
  statRow(s, [["56", "Requerimientos funcionales: 41 implementados, 5 parciales y 10 planificados"], ["169", "Endpoints de la API REST en 19 módulos por dominio"], ["7", "Contenedores Docker en producción, publicados por Cloudflare Tunnel"], ["474", "Pruebas automatizadas y de caja negra que pasan sin fallos"]]);
  card(s, 0.55, 2.7, 8.93, 2.2);
  cardHead(s, "Qué resuelve el sistema", 0.78, 2.82, 8);
  bullets(s, ["Lleva a una sola plataforma lo que se hacía en papel, en WhatsApp y entrando a mano a 13 routers.",
    "Cubre el ciclo de vida del cliente: captación, aprobación, instalación, cobranza, corte, reactivación, averías y retiro.",
    "Tres canales sobre una misma API: panel web (oficina), app móvil Expo (campo y clientes) y sitio público.",
    "Repositorio cristian-csc/Wisp-ISP; despliegue en https://wispfibra.com (/ sitio, /app panel, /api API)."], 0.8, 3.15, 8.5, 1.7);
  note(s, "Cada cifra de esta línea sale del código, de la base de datos o de una medición en producción.");
  s.addNotes("Antes de entrar a los entregables, el resultado: un sistema que ya funciona en producción. Todas las cifras se verificaron en el repositorio o en el servidor.");

  // ======================= E1 · REQUERIMIENTOS Y DISEÑO =======================
  addSection("CE02 · E1 Requerimientos y Diseño");
  s = divider("01", "Capítulo 6 · CE02 · S1-E1 · CE021", "Requerimientos y Diseño del Sistema",
    ["Especificación de requerimientos (RF, RNF, reglas, restricciones, HU)", "Prototipo navegable y su validación", "Diseño arquitectónico C4 (C1, C2, C3) y ADR", "Diseño detallado UML: casos de uso, clases, secuencias y estados"], LINE);
  s.addNotes("Primer entregable: qué debe hacer el sistema y cómo se diseñó antes de construirlo.");

  s = content(SW, "Capítulo 6 · Resumen ejecutivo", "Problema, usuarios, alcance y solución");
  cardsGrid(s, [
    { t: "Problema", d: "Unos 455 clientes en 13 zonas gestionados con un sistema heredado (PHP), papel y WhatsApp; cada router MikroTik se administraba a mano y sin trazabilidad." },
    { t: "Usuarios", d: "Administrador, atención al cliente, técnico, vendedor de campo, cliente final y visitante público: cada uno con su canal y sus permisos." },
    { t: "Alcance", d: "Ciclo de vida del cliente, planta externa (mufas, cajas NAP, bornes), inventario de ONU, red de zonas, cobranza, cortes y mensajería." },
    { t: "Solución", d: "API REST FastAPI + PostgreSQL, panel React, app Expo, integración con los MikroTik por SSH sobre WireGuard y avisos por WhatsApp." },
  ], { cols: 2, h: 3.55 });
  note(s, "El diseño parte del diagnóstico de la línea CE01: digitalizar captación, instalación y gestión de la red.");
  s.addNotes("El resumen ejecutivo del SRS: problema, usuarios, alcance y solución, en una página.");

  s = content(SW, "Capítulo 6 · Sección 1 · Usuarios", "Seis tipos de usuario, tres canales");
  table(s, ["Rol", "Canal", "Responsabilidad principal"], [
    ["Administrador", "Panel web", "Valida ventas; administra zonas, red (WireGuard, MikroTik), planes, inventario, cobranza y usuarios."],
    ["Atención al cliente", "Panel web", "Caja y mostrador: registra pagos, emite recibos y consulta clientes."],
    ["Técnico", "App móvil", "Instala en campo (caja NAP, borne, ONU, fotos), atiende averías y retiros, controla su inventario."],
    ["Vendedor de campo", "App móvil", "Capta clientes (datos, GPS, fotos) y registra su jornada y recorrido."],
    ["Cliente final", "App (PIN) y WhatsApp", "Consulta su cuenta y pagos; recibe avisos de cobro y de corte."],
    ["Visitante", "Sitio público", "Consulta planes y cobertura sin iniciar sesión."],
  ], { colW: [1.7, 1.6, 5.63], size: 9.5 });
  note(s, "Los roles son los que existen en el código: tipo de cuenta + rol configurable con sus módulos.");
  s.addNotes("Cada usuario tiene un canal: la oficina usa el panel; el campo y los clientes, la app.");

  s = content(SW, "Capítulo 6 · Sección 1 · Requerimientos funcionales", "56 requerimientos funcionales con estado real");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "RF", labels: ["Implementados", "Parciales", "Planificados"], values: [41, 5, 10] }],
    chartOpts({ x: 0.55, y: 1.3, w: 3.6, h: 3.55, holeSize: 58, showPercent: false, showValue: true, showLegend: true, legendPos: "b", legendFontFace: "Calibri", legendFontSize: 9, legendColor: K.muted, chartColors: [K.navy, K.orange, K.ice], dataLabelColor: K.white, showTitle: true, title: "Estado según el código (rama main)" }));
  card(s, 4.35, 1.3, 5.13, 3.55);
  cardHead(s, "Agrupados por proceso", 4.58, 1.42, 4.6);
  bullets(s, ["Portal y acceso: planes, cobertura, inicio de sesión (RF-01 a RF-04).", "Captación y aprobación de ventas con GPS y fotos (RF-05 a RF-11).", "Instalación: caja NAP, borne, ONU, evidencias (RF-12 a RF-23).", "Inventario de ONU y materiales (RF-24 a RF-28).", "Cobranza, recibos, cortes y reactivación (RF-29 a RF-35).", "Mensajería y bot de pagos por WhatsApp (RF-36 a RF-46).", "Red, zonas, averías, retiros y reportes (RF-47 a RF-56)."], 4.6, 1.75, 4.75, 3.05, { size: 10 });
  note(s, "Los 10 planificados son sobre todo el bot de comprobantes con IA, diferido por decisión (ADR-06).");
  s.addNotes("Cada RF tiene un estado verificado contra el código: no se marca nada como hecho si no está en main.");

  s = content(SW, "Capítulo 6 · Sección 1 · Requerimientos no funcionales", "12 RNF medibles según ISO/IEC 25010");
  table(s, ["ID", "Atributo", "Requerimiento", "Verificación"], [
    ["RNF-01", "Seguridad", "JWT y control de acceso por rol en cada endpoint", "Pruebas de API con roles"],
    ["RNF-02", "Seguridad", "bcrypt, solo HTTPS/TLS, freno a la fuerza bruta (8 intentos / 5 min)", "Prueba de login"],
    ["RNF-03", "Privacidad", "DNI, ubicación y fotos conforme a la Ley N.° 29733", "Revisión de datos"],
    ["RNF-04", "Disponibilidad", "Recordatorios y cortes diarios a las 08:00 y 09:00 sin intervención", "Registro del planificador"],
    ["RNF-06", "Rendimiento", "Consultas de borne y estado < 2 s; caché WireGuard de 120 s", "Medición"],
    ["RNF-08", "Trazabilidad", "Todo cambio relevante queda en el historial con usuario y fecha", "Consulta de historial"],
    ["RNF-09", "Escalabilidad", "Zona nueva = registro + peer WireGuard, sin rediseño", "Alta de zona de prueba"],
    ["RNF-10", "Recuperación", "Respaldo diario, 30 días de retención, copia fuera del servidor", "Prueba de restauración"],
    ["RNF-12", "Portabilidad", "Despliegue con Docker Compose en cualquier Linux", "Equipo limpio"],
  ], { colW: [0.8, 1.3, 4.43, 2.4], size: 8.5 });
  note(s, "Se muestran 9 de los 12; los otros cubren usabilidad en campo, confiabilidad del bot y mantenibilidad.");
  s.addNotes("Los no funcionales no son adjetivos: cada uno tiene una forma de verificarse.");

  s = content(SW, "Capítulo 6 · Sección 1 · Reglas de negocio", "Reglas que el sistema hace cumplir");
  cardsGrid(s, [
    { t: "RN-01 · Un borne, un cliente", d: "Índice único uq_borne_cliente y trigger trg_validar_borne en la base." },
    { t: "RN-02 · Inventario propio", d: "El técnico solo instala equipos de su inventario asignado." },
    { t: "RN-04 · Zonas asignadas", d: "El técnico solo ve y atiende órdenes de sus zonas." },
    { t: "RN-05 · Aprobación previa", d: "Una venta debe aprobarse antes de llegar al técnico; al aprobar se crea el PPPoE." },
    { t: "RN-06 / RN-08 · Pagos", d: "Sin números de operación repetidos; un pago reactiva al cliente cortado (sp_registrar_pago)." },
    { t: "RN-07 / RN-09 · Corte justo", d: "Se corta solo tras los días de gracia y siempre se avisa por WhatsApp antes." },
  ], { cols: 3, h: 3.55, dSize: 9.5, tSize: 10.5 });
  note(s, "12 reglas en total; cada una indica dónde se hace cumplir: API, base de datos o router.");
  s.addNotes("Lo importante de las reglas es dónde viven. Las críticas están en la base de datos, no solo en la interfaz.");

  s = content(SW, "Capítulo 6 · Sección 1 · Restricciones", "Las restricciones que moldearon el diseño");
  cardsGrid(s, [
    { t: "Presupuesto de MYPE", d: "Arquitectura simple y de bajo costo: un servidor en la oficina y una VPS pequeña." },
    { t: "Conectividad de campo", d: "Técnicos en zonas rurales con cobertura móvil intermitente." },
    { t: "Infraestructura heredada", d: "Cada zona tiene su MikroTik con convenciones propias; el sistema se adapta sin reconfigurar la red de golpe." },
    { t: "Sin IP pública", d: "Publicación por túnel de salida (Cloudflare) y gestión de la red por WireGuard." },
    { t: "Marco legal", d: "Ley N.° 29733 de Protección de Datos Personales y su reglamento." },
    { t: "Mensajería", d: "WhatsApp depende de una sesión vinculada y de las políticas de la plataforma." },
  ], { cols: 3, h: 3.55 });
  s.addNotes("Estas restricciones explican decisiones como el túnel de Cloudflare o el monolito modular.");

  s = content(SW, "Capítulo 6 · Sección 1 · Historias de usuario", "Historias con criterios de aceptación verificables");
  cardsGrid(s, [
    { t: "HU-01 · Vendedor de campo", chip: "RF-05 a 07", chipW: 0.95, d: "Registrar datos, ubicación y fotos de un cliente potencial. Criterios: DNI autocompleta el nombre; GPS del dispositivo; al menos una foto; queda en pendiente_aprobacion." },
    { t: "HU-02 · Administrador", chip: "RF-09 a 11", chipW: 0.95, d: "Aprobar o rechazar ventas. Criterios: rechazar exige motivo; al aprobar, la orden aparece en la app del técnico de esa zona." },
    { t: "HU-03 · Técnico", chip: "RF-12", chipW: 0.7, d: "Ver solo las instalaciones de sus zonas. Criterio: el listado filtra por tecnico_zona y muestra la ubicación en el mapa." },
    { t: "HU-04 · Técnico", chip: "RF-15 a 18", chipW: 0.95, d: "Registrar caja NAP y borne. Criterio: solo se ofrecen bornes libres; el borne queda vinculado al cliente." },
  ], { cols: 2, h: 3.55, dSize: 9.5 });
  note(s, "Formato «Como [rol], quiero [acción], para [beneficio]» con criterios Given/When/Then resumidos.");
  s.addNotes("Las historias conectan requerimientos con pruebas: sus criterios son los casos que luego se verificaron.");

  s = content(SW, "Capítulo 6 · Sección 1 · Validación y trazabilidad", "Validado con WISP y trazable hasta el código");
  card(s, 0.55, 1.3, 4.0, 3.55);
  cardHead(s, "Acta de validación", 0.78, 1.42, 3.6);
  bullets(s, ["Objetivo: validar la especificación y el prototipo navegable.", "Lugar: oficina central de WISP, Juliaca.", "Participantes: gerente/ingeniero, vendedor, técnico, atención y equipo del proyecto.", "Resultado: requerimientos aprobados con observaciones incorporadas.", [{ text: "Firma del acta: ", b: true }, { text: "pendiente de completar por el equipo." }]], 0.8, 1.75, 3.6, 3.0, { size: 10 });
  table(s, ["Requerimientos", "HU", "Componente", "Diseño y datos"], [
    ["RF-01, RF-02", "—", "web/, zonas.py (/publicas)", "zonas, planes"],
    ["RF-03, RF-04", "—", "auth.py, cliente_app.py", "usuarios, pin_app"],
    ["RF-05 a RF-07", "HU-01", "clientes.py, consultas.py; app vendedor", "Secuencia de venta"],
    ["RF-09 a RF-11", "HU-02", "clientes.py; AprobarClienteDialog", "Estados del cliente"],
    ["RF-15 a RF-18", "HU-04", "cajas_nap.py; app técnico", "bornes, trg_validar_borne"],
  ], { x: 4.7, w: 4.78, colW: [1.05, 0.55, 1.9, 1.28], size: 8.5 });
  note(s, "Matriz completa en el capítulo 6: requerimiento → historia → componente → diseño/datos.");
  s.addNotes("La rúbrica pide validación y trazabilidad: el acta y la matriz cubren ambos criterios.");

  s = content(SW, "Capítulo 6 · Sección 2 · Prototipo navegable", "Prototipo de fidelidad media y flujo de navegación");
  card(s, 0.55, 1.3, 3.3, 3.55);
  cardHead(s, "Ficha del prototipo", 0.78, 1.42, 3);
  bullets(s, ["Tipo: fidelidad media, navegable.", "Tecnología: HTML5, CSS3 y JavaScript, sin backend.", "10 pantallas principales y su flujo.", "Roles: administrador, vendedor, técnico y cliente (WhatsApp).", "Validado en sesión con usuarios de WISP."], 0.8, 1.75, 2.95, 3.0, { size: 10 });
  imageCard(s, L2 + "flujo_navegacion.png", 4.0, 1.3, 5.48, 3.55, { cap: "Flujo de navegación entre pantallas por rol" });
  s.addNotes("El prototipo sirvió para validar antes de construir; el flujo muestra cómo navega cada rol.");

  s = content(SW, "Capítulo 6 · Sección 2 · Pantallas principales", "Pantallas del prototipo: captación e instalación");
  [["proto_portal.png", "Portal público"], ["proto_registro_cliente.png", "Registro de cliente (GPS y fotos)"], ["proto_dashboard_tecnico.png", "Panel del técnico"], ["proto_registrar_instalacion.png", "Registrar instalación"]]
    .forEach(([f, c], i) => imageCard(s, L2 + f, 0.55 + (i % 2) * 4.54, 1.3 + Math.floor(i / 2) * 1.82, 4.39, 1.72, { cap: c }));
  s.addNotes("Cuatro pantallas del recorrido de una venta hasta la instalación.");

  s = content(SW, "Capítulo 6 · Sección 2 · Pantallas principales", "Pantallas del prototipo: gestión, cobranza y bot");
  [["proto_panel_gerencia.png", "Panel de gerencia"], ["proto_inventario.png", "Inventario y lectora"], ["proto_pagos_cortes.png", "Pagos y cortes"], ["proto_bot_whatsapp.png", "Bot de WhatsApp (diseño)"]]
    .forEach(([f, c], i) => imageCard(s, L2 + f, 0.55 + (i % 2) * 4.54, 1.3 + Math.floor(i / 2) * 1.82, 4.39, 1.72, { cap: c }));
  s.addNotes("Las pantallas de gestión: gerencia, inventario, cobranza y el bot de pagos que quedó planificado.");

  s = content(SW, "Capítulo 6 · Sección 2 · Validación del prototipo", "Lo que dijeron los usuarios y cómo entró al producto");
  table(s, ["Usuario", "Observación", "Cómo se incorporó"], [
    ["Vendedor", "Capturar la ubicación por GPS y no escribirla", "RF-06; app móvil con expo-location"],
    ["Técnico", "Ver la caja NAP como mapa visual de bornes", "RF-18; detalle de caja en la app y el panel"],
    ["Administrador", "Mostrar de inmediato el dato escaneado para corregirlo", "RF-24; pantalla escanear-equipo"],
    ["Técnico", "El técnico no impone la fecha: la coordina con el cliente", "RF-13, RF-14 (planificados)"],
    ["Cliente / gerencia", "Consultar la cuenta sin esperar al bot", "RF-44 a RF-46 con la app del cliente"],
  ], { colW: [1.6, 3.9, 3.43], size: 10 });
  note(s, "Cada observación terminó en un requerimiento con estado: así se cierra el ciclo de validación.");
  s.addNotes("La validación no fue un trámite: cinco observaciones cambiaron el producto.");

  s = content(SW, "Capítulo 6 · Sección 3 · Atributos de calidad", "La arquitectura responde a cinco atributos");
  cardsGrid(s, [
    { t: "Seguridad", d: "JWT, roles y módulos por endpoint; ningún servicio interno expuesto." },
    { t: "Disponibilidad", d: "Cortes y recordatorios automáticos; contenedores que se reinician solos." },
    { t: "Mantenibilidad", d: "Monolito modular: 19 routers por dominio y esquema versionado." },
    { t: "Escalabilidad", d: "Una zona nueva es un registro y un peer WireGuard." },
    { t: "Costo", d: "Un servidor en la oficina, sin IP pública, publicado por túnel." },
  ], { cols: 5, h: 2.0, dSize: 9.5 });
  card(s, 0.55, 3.45, 8.93, 1.45);
  cardHead(s, "Cómo se documentó", 0.78, 3.57, 8);
  bullets(s, ["Modelo C4: contexto (C1), contenedores (C2, que cumple el rol de vista de despliegue) y componentes (C3).", "9 decisiones registradas con el formato ADR de Michael Nygard: contexto, decisión y consecuencias."], 0.8, 3.9, 8.5, 0.95, { size: 10.5 });
  s.addNotes("Primero los atributos de calidad; las vistas C4 y las ADR muestran cómo se cumplen.");

  s = content(SW, "Capítulo 6 · Sección 3 · C4 nivel 1", "Vista de contexto: actores y sistemas externos");
  imageCard(s, FIG + "f6_12.png", 0.55, 1.3, 5.9, 3.6);
  card(s, 6.6, 1.3, 2.88, 3.6);
  cardHead(s, "Lectura", 6.83, 1.42, 2.5);
  bullets(s, ["Cinco actores humanos usan el sistema por tres canales.", "Sistemas externos: 13 routers MikroTik (SSH por WireGuard), WhatsApp y APIs Perú (DNI/RUC).", "El sistema es la única fuente de verdad del negocio."], 6.85, 1.75, 2.5, 3.1, { size: 10 });
  s.addNotes("C1: quién usa el sistema y con qué sistemas externos conversa.");

  s = content(SW, "Capítulo 6 · Sección 3 · C4 nivel 2", "Vista de contenedores: el sistema real de la rama main");
  imageCard(s, FIG + "f6_13.png", 0.55, 1.3, 6.3, 3.6);
  card(s, 7.0, 1.3, 2.48, 3.6);
  cardHead(s, "Contenedores", 7.23, 1.42, 2.1);
  bullets(s, ["Panel React 19 + Vite", "Sitio público estático", "API REST FastAPI (19 routers + APScheduler)", "PostgreSQL 15", "Servicio WhatsApp (Node 20 + Baileys)", "Nginx y Cloudflare Tunnel"], 7.25, 1.75, 2.15, 3.1, { size: 9.5 });
  s.addNotes("C2: los contenedores desplegables. Cumple también el rol de vista de despliegue que pide la plantilla.");

  s = content(SW, "Capítulo 6 · Sección 3 · C4 nivel 3", "Vista de componentes de la API REST");
  imageCard(s, FIG + "f6_14.png", 0.55, 1.3, 5.6, 3.6);
  card(s, 6.3, 1.3, 3.18, 3.6);
  cardHead(s, "Responsabilidades", 6.53, 1.42, 2.8);
  bullets(s, ["Seguridad: JWT, require_roles y freno a la fuerza bruta.", "Validación: esquemas Pydantic v2.", "Dominio: facturación, ciclo de 30 días y recibos PDF.", "Adaptadores: RouterOS (SSH), WireGuard, WhatsApp y APIs Perú.", "Persistencia: SQLAlchemy 2 y Alembic."], 6.55, 1.75, 2.85, 3.1, { size: 9.5 });
  s.addNotes("C3: cómo se organiza la API por dentro. Los adaptadores aíslan a los sistemas externos.");

  s = content(SW, "Capítulo 6 · Sección 3 · Despliegue", "Despliegue real: servidor de oficina, túnel y zonas");
  imageCard(s, FIG + "f6_15.png", 0.55, 1.3, 8.93, 3.0);
  bullets(s, ["Todo corre en un PC Ubuntu con Docker Compose; los servicios internos escuchan en 127.0.0.1.", "Cloudflare Tunnel publica sin puertos de entrada; los routers se gestionan por WireGuard a través de la VPS."], 0.6, 4.42, 8.8, 0.6, { size: 10 });
  s.addNotes("El despliegue que existe hoy. En la línea CE03 se diseña su evolución a ESXi y AWS.");

  s = content(SW, "Capítulo 6 · Sección 3 · ADR", "Nueve decisiones arquitectónicas registradas");
  table(s, ["ADR", "Decisión", "Estado"], [
    ["ADR-01", "Monolito modular con API REST", "Aceptada"],
    ["ADR-02", "PostgreSQL con migraciones Alembic", "Aceptada"],
    ["ADR-03", "FastAPI y React en lugar de Django y Angular", "Aceptada (reemplaza la propuesta de CE01)"],
    ["ADR-04", "Tareas programadas con APScheduler dentro del backend", "Aceptada"],
    ["ADR-05", "Panel web para oficina y app móvil Expo para campo", "Aceptada"],
    ["ADR-06", "Validación de comprobantes con IA pospuesta", "Diferida al semestre 2"],
    ["ADR-07", "WhatsApp mediante sesión vinculada (Baileys)", "Aceptada con riesgo (revisable)"],
    ["ADR-08", "Gestión de MikroTik por SSH sobre WireGuard", "Aceptada"],
    ["ADR-09", "Servidor on-premise con Cloudflare Tunnel y VPS como hub VPN", "Aceptada"],
  ], { colW: [0.9, 5.0, 3.03], size: 9.5 });
  s.addNotes("Las ADR explican por qué el sistema es como es; dos de ellas cambiaron decisiones de la línea CE01.");

  s = content(SW, "Capítulo 6 · Sección 3 · Tecnologías", "Pila tecnológica real del sistema");
  cardsGrid(s, [
    { t: "Backend", d: "Python, FastAPI, SQLAlchemy 2, Pydantic 2, Alembic, APScheduler, paramiko." },
    { t: "Base de datos", d: "PostgreSQL 15 (contenedor wisp_postgres)." },
    { t: "Panel web", d: "React 19, Vite 7, TypeScript, Tailwind CSS." },
    { t: "App móvil", d: "Expo SDK 54, React Native 0.81, TypeScript, compilación EAS." },
    { t: "Mensajería", d: "Node.js 20, Baileys y Express." },
    { t: "Infraestructura", d: "Docker Compose, Nginx, Cloudflare Tunnel, WireGuard." },
  ], { cols: 3, h: 3.55 });
  s.addNotes("La pila completa, con las versiones que están en el repositorio.");

  const umlSlide = (k, title, img, head, items, nota) => {
    const sl = content(SW, k, title);
    imageCard(sl, L2 + img, 0.55, 1.3, 6.1, 3.6);
    card(sl, 6.8, 1.3, 2.68, 3.6);
    cardHead(sl, head, 7.03, 1.42, 2.3);
    bullets(sl, items, 7.05, 1.75, 2.35, 3.1, { size: 9.5 });
    sl.addNotes(nota);
  };
  umlSlide("Capítulo 6 · Sección 4 · Casos de uso", "Casos de uso del sistema por actor", "casos_uso.png", "Actores",
    ["Visitante: consulta planes y cobertura.", "Vendedor: registra clientes con GPS y fotos.", "Administrador: aprueba ventas, gestiona red, planes y cobranza.", "Técnico: instala, atiende averías y retiros.", "Cliente: consulta su cuenta y pagos."], "Los casos de uso se agrupan por actor y corresponden a los requerimientos funcionales.");
  umlSlide("Capítulo 6 · Sección 4 · Modelo de dominio", "Modelo de dominio (diagrama de clases UML)", "clases_dominio.png", "Refinamiento",
    ["Cliente, Zona, Plan, CajaNap, Borne, Onu, Pago, Averia y Usuario.", "El diseño se refinó al implementar: la orden de instalación se volvió un estado del cliente.", "Los estados son los enumerados de la base de datos."], "El modelo de dominio es la base del modelo de datos del capítulo 7.");
  umlSlide("Capítulo 6 · Sección 4 · Secuencias", "Secuencia: registro, validación y coordinación de visita", "seq_venta.png", "Flujo",
    ["El vendedor registra al cliente en la app.", "El DNI autocompleta el nombre (APIs Perú).", "El administrador aprueba o rechaza con motivo.", "La orden aparece al técnico de la zona."], "Primera secuencia crítica: la venta en campo hasta la orden del técnico.");
  umlSlide("Capítulo 6 · Sección 4 · Secuencias", "Secuencia: caja, borne, equipo y cierre de la instalación", "seq_instalacion.png", "Flujo",
    ["El técnico elige caja NAP y un borne libre.", "Selecciona la ONU de su inventario o la escanea.", "Adjunta las fotos de evidencia.", "Al cerrar, la ONU pasa a instalada y el cliente a activo."], "La instalación vincula el borne, el equipo y el cliente en una sola operación.");
  umlSlide("Capítulo 6 · Sección 4 · Secuencias", "Secuencia: recordatorio, corte y reactivación", "seq_corte.png", "Flujo",
    ["08:00: recordatorio por WhatsApp.", "09:00: corte de vencidos tras los días de gracia, con aviso previo.", "El router agrega al cliente a la lista de corte.", "Al registrar el pago se reactiva y se confirma."], "Esta secuencia ya está implementada y se ejecuta todos los días.");
  umlSlide("Capítulo 6 · Sección 4 · Secuencias", "Secuencia (diseño): validación de pago con IA por WhatsApp", "seq_pago.png", "Estado",
    ["El cliente envía la foto del comprobante.", "La IA extrae monto, fecha y operación.", "Ante duda, revisión humana (RNF-07).", "Diferida por decisión (ADR-06)."], "La validación con IA quedó como diseño; se implementará después.");

  s = content(SW, "Capítulo 6 · Sección 4 · Estados", "Diagramas de estados del cliente, la ONU y la avería");
  [["est_cliente.png", "Ciclo de vida del cliente"], ["est_equipo.png", "Ciclo de vida de la ONU"], ["est_orden.png", "Ciclo de vida de una avería"]]
    .forEach(([f, c], i) => imageCard(s, L2 + f, 0.55 + i * 3.03, 1.3, 2.87, 3.6, { cap: c }));
  s.addNotes("Los estados del dominio son los mismos enumerados que tiene la base de datos.");

  // ======================= E2 · PLATAFORMA DE DATOS =======================
  addSection("CE02 · E2 Plataforma de Datos");
  s = divider("02", "Capítulo 7 · CE02 · S2-E2 · CE022", "Plataforma de Datos del Sistema",
    ["Modelo entidad-relación, lógico, normalizado y diccionario", "Implementación: DDL, DML y migraciones Alembic", "Consultas, procedimientos, funciones, triggers e índices", "Seguridad: roles, auditoría, respaldo y monitoreo"], LINE);
  s.addNotes("Segundo entregable: la base de datos que sostiene todo el negocio.");

  s = content(SW, "Capítulo 7 · Resumen ejecutivo", "Los datos son el negocio: un error es un cliente mal cortado");
  statRow(s, [["21", "Tablas y 16 tipos enumerados en el modelo documentado"], ["32", "Migraciones Alembic al momento del análisis (hoy 35 y 25 tablas)"], ["0,086 ms", "Historial de pagos con índice, antes 21 ms sobre 600 000 pagos", { size: 22 }], ["4 s", "Restauración de 650 000 filas con conteos y sumas idénticos"]]);
  card(s, 0.55, 2.7, 8.93, 2.2);
  cardHead(s, "Cómo se probó", 0.78, 2.82, 8);
  bullets(s, ["Esquema real del sistema en un contenedor postgres:15-alpine limpio, con datos anonimizados.", "Scripts reproducibles en la carpeta sql/ (01_ddl.sql a 13_resultado_respaldo.txt).", "La programación en la base y los roles están probados en laboratorio; pasan a producción con una migración Alembic."], 0.8, 3.15, 8.5, 1.7);
  s.addNotes("Todo lo que se muestra se ejecutó: no hay consultas solo escritas.");

  s = content(SW, "Capítulo 7 · Sección 1 · Modelo entidad-relación", "Modelo entidad-relación de las tablas principales");
  imageCard(s, FIG + "f7_1.png", 0.55, 1.3, 5.4, 3.6);
  card(s, 6.1, 1.3, 3.38, 3.6);
  cardHead(s, "Núcleo del modelo", 6.33, 1.42, 3);
  bullets(s, ["clientes es el centro: referencia zona, plan y tres usuarios (vendedor, aprobador, instalador).", "Planta externa: zonas → mufas → cajas_nap → bornes.", "Cobranza: pagos con número de operación único.", "Trazabilidad: historial, evidencias, averías y órdenes de retiro."], 6.35, 1.75, 3.05, 3.1, { size: 10 });
  s.addNotes("El modelo refleja la planta real: zona, mufa, caja y borne, hasta el cliente.");

  s = content(SW, "Capítulo 7 · Sección 1 · Modelo lógico y normalización", "Modelo lógico en tercera forma normal");
  cardsGrid(s, [
    { t: "Claves y unicidad", d: "Claves foráneas en todas las relaciones; únicos en DNI, usuario PPPoE, número de operación y número de borne por caja." },
    { t: "Tipos enumerados", d: "16 enumerados de PostgreSQL para estados (cliente, ONU, avería, retiro) en lugar de textos libres." },
    { t: "Normalización", d: "3FN: catálogos (planes, zonas) separados; historial y auditoría en tablas propias." },
    { t: "Diccionario de datos", d: "Cada columna de las tablas centrales con tipo, nulidad, restricción y significado de negocio." },
  ], { cols: 2, h: 3.55 });
  note(s, "Excepción detectada: campos equipo_* en clientes duplican onus; se registró como hallazgo.");
  s.addNotes("El modelo está normalizado; donde no, se registró como hallazgo en lugar de ocultarlo.");

  s = content(SW, "Capítulo 7 · Sección 1 · Validación del modelo", "Hallazgos de la validación y mejoras propuestas");
  table(s, ["Hallazgo", "Riesgo", "Mejora"], [
    ["RN-01 no estaba en la base: un cliente podía quedar en dos bornes", "Inconsistencia de planta", "Índice único parcial uq_borne_cliente + trigger"],
    ["Importes en float", "Errores de redondeo en dinero", "Migrar a numeric(10,2)"],
    ["Valores por defecto solo en Python", "INSERT directo incompleto", "Defaults en la base"],
    ["password_pppoe y password_mikrotik en texto plano", "Exposición si se filtra un respaldo", "Cifrado en reposo (pgcrypto)"],
    ["clientes.equipo_* duplica onus", "Dos fuentes de verdad", "Migrar a onus y eliminar"],
  ], { colW: [3.6, 2.4, 2.93], size: 9.5 });
  s.addNotes("La validación encontró cinco problemas reales; el primero se comprobó con una prueba.");

  s = content(SW, "Capítulo 7 · Sección 2 · Implementación", "Implementación versionada con Alembic");
  flow(s, [{ t: "DDL", d: "sql/01_ddl.sql: tablas, claves, únicos y enumerados del esquema real." }, { t: "DML", d: "sql/02_dml.sql: datos de prueba anonimizados." }, { t: "Migraciones", d: "Cada cambio del esquema es una migración revisable." }, { t: "Prueba", d: "postgres:15-alpine limpio; evidencias de creación." }], { h: 1.5 });
  card(s, 0.55, 3.0, 8.93, 1.9);
  cardHead(s, "Hitos del historial de migraciones", 0.78, 3.12, 8);
  bullets(s, ["El esquema nació con el ciclo del cliente y la cobranza; después se agregaron planta externa, inventario, jornadas de vendedores y mensajes masivos.", "El sistema aplica las migraciones pendientes en cada arranque (alembic upgrade head).", "Las migraciones nuevas se prueban de ida, vuelta e ida (ver calidad, capítulo 9)."], 0.8, 3.45, 8.5, 1.4, { size: 10.5 });
  s.addNotes("La base no se modifica a mano: todo cambio pasa por una migración.");

  s = content(SW, "Capítulo 7 · Sección 3 · Consultas", "Consultas SQL relevantes para el negocio");
  cardsGrid(s, [
    { t: "Q1 · Candidatos a corte", d: "Clientes activos o suspendidos con el servicio vencido y sus días de mora." },
    { t: "Q2 · Ocupación de planta", d: "Bornes libres, ocupados y dañados por caja NAP (COUNT ... FILTER)." },
    { t: "Q3 · Ingresos vs gastos", d: "Ingresos, gastos y utilidad por mes." },
    { t: "Q4 · Clientes por zona", d: "Distribución de clientes por zona y estado." },
    { t: "Q5 · Q6 · Reglas en la base", d: "Insertar un número de operación o un borne repetido debe fallar, y falla." },
    { t: "Q7 · Q8 · Red e inventario", d: "Zonas sin túnel WireGuard y ONU por técnico y estado." },
  ], { cols: 3, h: 3.55 });
  note(s, "sql/03_consultas.sql con su resultado de ejecución en PostgreSQL 15 (18/11/2026).");
  s.addNotes("Las consultas responden preguntas del negocio, no ejercicios genéricos.");

  s = content(SW, "Capítulo 7 · Sección 3 · Programación en la base", "Procedimiento, funciones y triggers");
  table(s, ["Objeto", "Tipo", "Qué hace"], [
    ["sp_registrar_pago", "Procedimiento", "Valida monto y mes, bloquea la fila del cliente (FOR UPDATE), inserta el pago y reactiva al suspendido en una sola transacción."],
    ["fn_dias_mora", "Función", "Días de atraso de un cliente a una fecha; base del corte automático (RN-07)."],
    ["trg_auditoria_pagos", "Trigger", "Copia cada alta, cambio o baja de un pago con el usuario y el antes/después en JSON."],
    ["trg_validar_borne", "Trigger", "Impide asignar un borne dañado y mantiene ocupado/libre coherente."],
    ["uq_borne_cliente", "Índice único parcial", "Un cliente ocupa como máximo un borne (RN-01)."],
  ], { colW: [1.9, 1.5, 5.53], size: 9.5 });
  note(s, "Probados con sql/07_pruebas_programacion.sql: casos válidos e inválidos con su resultado.");
  s.addNotes("La lógica que no puede fallar vive en la base: el pago y la reactivación ocurren juntos o no ocurren.");

  s = content(SW, "Capítulo 7 · Sección 3 · Optimización", "Planes de ejecución: los índices, medidos");
  s.addChart(pres.charts.BAR, [{ name: "Antes", labels: ["Historial de pagos", "Candidatos a corte"], values: [21.01, 4.24] }, { name: "Con índice", labels: ["Historial de pagos", "Candidatos a corte"], values: [0.086, 0.58] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.2, h: 3.55, barDir: "bar", barGrouping: "clustered", showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: K.muted, showTitle: true, title: "Tiempo de ejecución (ms, EXPLAIN ANALYZE)", dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0##", valAxisLabelFormatCode: "0" }));
  card(s, 5.9, 1.3, 3.58, 3.55);
  cardHead(s, "Resultado", 6.13, 1.42, 3.2);
  bullets(s, [[{ text: "ix_pagos_cliente_fecha: ", b: true }, { text: "de lectura secuencial de 600 000 filas a búsqueda por índice: unas 240 veces más rápido." }], [{ text: "ix_clientes_estado_venc: ", b: true }, { text: "de 50 000 filas leídas a búsqueda por índice: unas 7 veces más rápido." }], "Evidencia: sql/11_resultado_rendimiento.txt con los planes antes y después."], 6.15, 1.75, 3.2, 3.05, { size: 10 });
  s.addNotes("La optimización se demuestra con planes de ejecución, no con suposiciones.");

  s = content(SW, "Capítulo 7 · Sección 4 · Usuarios y roles", "Roles de base de datos con mínimo privilegio");
  table(s, ["Rol", "Inicia sesión", "Privilegios"], [
    ["wisp_owner", "No", "Dueño de los objetos; solo lo usan las migraciones de Alembic."],
    ["wisp_app", "Sí (backend)", "Lectura y escritura de datos de negocio; sin DDL."],
    ["wisp_lectura", "Sí (reportes)", "Solo las vistas v_clientes_reporte y v_ingresos_mes, sin credenciales PPPoE ni PIN."],
    ["wisp_respaldo", "Sí (copias)", "Rol predefinido pg_read_all_data: lee todo, no escribe nada."],
    ["PUBLIC", "—", "Sin privilegios sobre el esquema public."],
  ], { colW: [1.8, 1.6, 5.53], size: 10 });
  note(s, "sql/06_seguridad.sql; las contraseñas del laboratorio no se usan en producción.");
  s.addNotes("Cada conexión a la base tiene un rol con lo mínimo que necesita.");

  s = content(SW, "Capítulo 7 · Sección 4 · Auditoría y respaldo", "Auditoría inalterable y respaldo probado");
  card(s, 0.55, 1.3, 3.6, 3.55);
  cardHead(s, "Auditoría implementada", 0.78, 1.42, 3.2);
  bullets(s, ["trg_auditoria_pagos registra cada cambio de un pago con usuario, fecha y antes/después.", "La tabla de auditoría no admite UPDATE ni DELETE desde el rol de la aplicación.", "Historial de negocio del cliente para activaciones, cortes y cambios de plan."], 0.8, 1.75, 3.25, 3.0, { size: 10 });
  table(s, ["Mecanismo", "Frecuencia", "Objetivo"], [
    ["pg_dump -Fc", "Diario, 03:00", "Retención de 30 días"],
    ["Copia fuera del servidor", "Diaria", "NAS y S3 cifrado (hoy manual semanal)"],
    ["Archivado de WAL", "Cada 15 min", "RPO ≤ 15 min"],
    ["Réplica en flujo", "Continua", "Contingencia, RPO ≤ 5 min"],
    ["Prueba de restauración", "Trimestral", "Comparar conteos y sumas"],
  ], { x: 4.3, w: 5.18, colW: [1.75, 1.25, 2.18], size: 9 });
  note(s, "Restauración probada: 650 000 filas en unos 4 s con conteos y sumas idénticos (sql/13).");
  s.addNotes("Un respaldo que no se restauró no es un respaldo; este se restauró y se comparó.");

  s = content(SW, "Capítulo 7 · Sección 4 · Monitoreo", "Evidencias de monitoreo de la base de datos");
  cardsGrid(s, [
    { t: "Tamaño y crecimiento", d: "Tamaño de la base y de las tablas más grandes con sus filas vivas." },
    { t: "Aciertos de caché", d: "Porcentaje de bloques servidos desde memoria (pg_stat_database)." },
    { t: "Sesiones por rol", d: "pg_stat_activity: conexiones por usuario y estado." },
    { t: "Lecturas e índices", d: "seq_scan frente a idx_scan por tabla, y operaciones registradas en auditoria_pagos." },
  ], { cols: 2, h: 3.55 });
  note(s, "sql/09_monitoreo.sql, pensado para correr a diario desde MON-01 (Zabbix) o a mano.");
  s.addNotes("Con estas consultas se vigila la salud de la base sin herramientas extra.");

  // ======================= E3 · SISTEMA FUNCIONAL =======================
  addSection("CE02 · E3 Sistema Funcional");
  s = divider("03", "Capítulo 8 · CE02 · S2-E3 · CE023", "Sistema de Software Funcional Integrado",
    ["Arquitectura e integración con la base y servicios externos", "Funcionalidad: flujos, roles, panel, app y sitio", "Código y diseño técnico", "Despliegue, desempeño, escalabilidad y manual técnico"], LINE);
  s.addNotes("Tercer entregable: el sistema funcionando en producción.");

  s = content(SW, "Capítulo 8 · Resumen ejecutivo", "En producción en wispfibra.com");
  statRow(s, [["169", "Endpoints en 19 módulos, con JWT, tipo de cuenta y módulos del rol"], ["3", "Canales: panel web, app móvil Expo y sitio público"], ["7", "Contenedores con Docker Compose en el servidor de la oficina"], ["98d64db", "Commit documentado de la rama main (86 commits)", { size: 20 }]]);
  card(s, 0.55, 2.7, 8.93, 2.2);
  cardHead(s, "Cómo se usa", 0.78, 2.82, 8);
  bullets(s, ["La oficina (administración y atención) trabaja en wispfibra.com/app.", "Técnicos, vendedores y clientes usan la app móvil, que muestra a cada rol solo sus módulos.", "El público consulta planes y cobertura en wispfibra.com; todos consumen la misma API en /api."], 0.8, 3.15, 8.5, 1.7);
  s.addNotes("Este capítulo documenta el código real de main y el despliegue que se puede visitar.");

  s = content(SW, "Capítulo 8 · Sección 1 · Arquitectura", "Componentes del sistema y su tamaño");
  table(s, ["Componente", "Tecnología", "Responsabilidad", "Tamaño"], [
    ["API REST", "FastAPI, SQLAlchemy 2, Pydantic 2", "19 routers, seguridad, planificador, integración con routers y VPS", "32 archivos · 11 636 líneas"],
    ["Migraciones", "Alembic", "Esquema versionado", "35 migraciones · 1 963 líneas"],
    ["Panel web", "React 19, Vite 7, TypeScript", "Administración, atención, finanzas, red", "123 archivos · 23 692 líneas"],
    ["App móvil", "Expo SDK 54, React Native 0.81", "Técnico, vendedor y cliente", "52 archivos · 9 067 líneas"],
    ["WhatsApp", "Node.js 20, Baileys, Express", "Mensajes y vinculación por QR", "1 archivo · 278 líneas"],
    ["Sitio público", "HTML, CSS, JavaScript", "Planes, cobertura y contacto", "3 archivos · 2 168 líneas"],
  ], { colW: [1.3, 2.35, 3.1, 2.18], size: 9 });
  note(s, "Arquitectura de monolito modular (ADR-01): un backend con módulos por dominio y clientes separados.");
  s.addNotes("Las líneas de código dan una idea del tamaño real del sistema construido.");

  s = content(SW, "Capítulo 8 · Sección 1 · Integración", "Integración con la base de datos y servicios externos");
  table(s, ["Sistema externo", "Mecanismo", "Uso en el negocio"], [
    ["13 routers MikroTik", "SSH con llave (paramiko) por la IP del túnel WireGuard", "Secretos PPPoE, perfiles de planes, corte y reactivación"],
    ["VPS hub WireGuard", "SSH (wg show, wg set)", "Alta y baja de peers y estado del túnel (caché 120 s)"],
    ["WhatsApp", "Servicio propio (Baileys) por HTTP local con token", "Recordatorios, avisos de corte, confirmaciones, masivos"],
    ["APIs Perú", "HTTPS con token solo en el servidor", "Autocompletar DNI y RUC con cuota mensual"],
    ["Cloudflare", "Túnel de salida y DNS de wispfibra.com", "Publicar sitio, panel y API sin puertos de entrada"],
    ["PostgreSQL", "SQLAlchemy 2 + Alembic (25 tablas)", "Fuente única de verdad"],
  ], { colW: [1.75, 3.5, 3.68], size: 9 });
  s.addNotes("Cada integración está detrás de un adaptador: los endpoints nunca ejecutan comandos directamente.");

  s = content(SW, "Capítulo 8 · Sección 2 · Mapa del negocio", "Los procesos del negocio que cubre el sistema");
  imageCard(s, L2 + "d01_mapa_negocio.png", 0.55, 1.3, 8.93, 3.6);
  s.addNotes("El mapa muestra todos los procesos del negocio que hoy pasan por el sistema.");

  s = content(SW, "Capítulo 8 · Sección 2 · Flujo principal", "De la venta a la instalación");
  imageCard(s, L2 + "d02_venta_instalacion.png", 0.55, 1.3, 6.2, 3.6);
  card(s, 6.9, 1.3, 2.58, 3.6);
  cardHead(s, "Puntos clave", 7.13, 1.42, 2.2);
  bullets(s, ["El vendedor registra con GPS y fotos.", "Al aprobar la venta se crea el secreto PPPoE en el router de la zona.", "El técnico registra caja, borne y ONU; el cliente queda activo."], 7.15, 1.75, 2.25, 3.1, { size: 10 });
  s.addNotes("Dato verificado en el código: el secreto PPPoE se crea al aprobar, no al instalar.");

  s = content(SW, "Capítulo 8 · Sección 2 · Flujos", "Cobranza, corte y reactivación");
  imageCard(s, L2 + "d03_cobranza_corte.png", 0.55, 1.3, 6.2, 3.6);
  card(s, 6.9, 1.3, 2.58, 3.6);
  cardHead(s, "Automatización", 7.13, 1.42, 2.2);
  bullets(s, ["08:00: recordatorio preventivo por WhatsApp.", "09:00: corte de vencidos tras los días de gracia, con aviso previo.", "Al registrar el pago: reactivación y confirmación."], 7.15, 1.75, 2.25, 3.1, { size: 10 });
  s.addNotes("La cobranza ya no depende de que alguien recuerde cortar o reactivar.");

  s = content(SW, "Capítulo 8 · Sección 2 · Flujos", "Averías, retiros y jornada del vendedor");
  imageCard(s, L2 + "d04_averias_retiros.png", 0.55, 1.3, 4.39, 3.6, { cap: "Averías y órdenes de retiro" });
  imageCard(s, L2 + "d05_jornada_vendedor.png", 5.09, 1.3, 4.39, 3.6, { cap: "Jornada y recorrido del vendedor" });
  s.addNotes("Los flujos de soporte: averías con estados y seguimiento de vendedores en campo.");

  s = content(SW, "Capítulo 8 · Sección 2 · Roles y permisos", "Roles configurables y módulos por rol");
  imageCard(s, L2 + "d06_roles_modulos.png", 0.55, 1.3, 5.0, 3.6);
  table(s, ["Rol", "Barra inferior de la app"], [
    ["Técnico", "Averías · Retiros · Órdenes · Inventario · Registrar"],
    ["Vendedor", "Jornada · Registrar · Mis clientes"],
    ["Cliente", "Inicio · Pagos · Perfil"],
  ], { x: 5.7, w: 3.78, colW: [1.0, 2.78], size: 9, maxH: 1.6 });
  txt(s, "Panel: 18 módulos agrupados. Tablas roles, modulos_padre, modulos y rol_modulo; GET /api/permisos/mis-modulos arma el menú de cada usuario.", { x: 5.7, y: 3.1, w: 3.78, h: 1.2, fontSize: 10 });
  s.addNotes("El administrador decide qué módulos ve cada rol sin tocar código.");

  s = content(SW, "Capítulo 8 · Sección 2 · Evidencia funcional", "Panel web: dashboard y padrón de clientes");
  imageCard(s, L2 + "panel/p01_dashboard.png", 0.55, 1.3, 4.39, 3.6, { cap: "Dashboard con la bandeja «Por atender»" });
  imageCard(s, L2 + "panel/p02_clientes.png", 5.09, 1.3, 4.39, 3.6, { cap: "Padrón de clientes con filtros por estado" });
  note(s, "Capturas del entorno Docker local con datos anonimizados en pantalla.");
  s.addNotes("Estas son pantallas reales del sistema; los nombres y DNI se anonimizaron antes de capturar.");

  s = content(SW, "Capítulo 8 · Sección 2 · Evidencia funcional", "Aprobación de ventas y ficha del cliente");
  imageCard(s, L2 + "panel/p14_pendientes.png", 0.55, 1.3, 4.39, 3.6, { cap: "Pendientes de aprobación" });
  imageCard(s, L2 + "panel/p03_cliente_detalle.png", 5.09, 1.3, 4.39, 3.6, { cap: "Ficha del cliente: corte, pausa e historial" });
  s.addNotes("Desde la ficha se corta, se pausa y se consulta todo el historial del cliente.");

  s = content(SW, "Capítulo 8 · Sección 2 · Evidencia funcional", "Red: zonas y mapa de infraestructura");
  imageCard(s, L2 + "panel/p04_zonas.png", 0.55, 1.3, 4.39, 3.6, { cap: "Zonas: routers en línea y estado del túnel" });
  imageCard(s, L2 + "panel/p05_zona_detalle.png", 5.09, 1.3, 4.39, 3.6, { cap: "Detalle de zona con el mapa de mufas y cajas" });
  s.addNotes("La planta externa y el estado de cada zona en un solo lugar.");

  s = content(SW, "Capítulo 8 · Sección 2 · Evidencia funcional", "Cajas NAP e inventario de materiales");
  imageCard(s, L2 + "panel/p06_cajas_nap.png", 0.55, 1.3, 4.39, 3.6, { cap: "Bornes por caja NAP (libre, ocupado, dañado)" });
  imageCard(s, L2 + "panel/p07_inventario.png", 5.09, 1.3, 4.39, 3.6, { cap: "Stock en almacén y en manos del personal" });
  s.addNotes("Las cajas NAP muestran cada borne; el inventario controla lo que tiene cada técnico.");

  s = content(SW, "Capítulo 8 · Sección 2 · Evidencia funcional", "Pagos y roles configurables");
  imageCard(s, L2 + "panel/p09_pagos.png", 0.55, 1.3, 4.39, 3.6, { cap: "Pagos: recaudación del mes e historial" });
  imageCard(s, L2 + "panel/p12_roles.png", 5.09, 1.3, 4.39, 3.6, { cap: "Roles y módulos: el menú cambia sin desplegar" });
  s.addNotes("La caja y los permisos se gestionan desde el panel.");

  s = content(SW, "Capítulo 8 · Sección 2 · App móvil y sitio", "App móvil por rol y sitio público");
  imageCard(s, L2 + "d07_app_movil.png", 0.55, 1.3, 4.39, 3.6, { cap: "Estructura de la app móvil (28 pantallas)" });
  imageCard(s, L2 + "cap_sitio_publico.png", 5.09, 1.3, 4.39, 3.6, { cap: "Sitio público wispfibra.com" });
  note(s, "Pendiente: capturas de la app desde un celular (la app es nativa y no se captura desde Docker).");
  s.addNotes("La app tiene 28 pantallas en Expo Router; el sitio está publicado en wispfibra.com.");

  s = content(SW, "Capítulo 8 · Sección 2 · Automatización", "Lo que el sistema hace solo");
  table(s, ["Proceso", "Cuándo", "Qué hace"], [
    ["Recordatorio preventivo", "08:00 diario (Lima)", "Avisa por WhatsApp a quienes vencen en los próximos días."],
    ["Corte automático", "09:00 diario (Lima)", "Corta a los vencidos tras los días de gracia, salvo compromiso de pago; avisa antes."],
    ["Reactivación", "Al registrar un pago", "Quita al cliente de la lista de corte del router y extiende su vencimiento."],
    ["Confirmación de pago", "Al registrar un pago", "Mensaje de WhatsApp con el detalle; se puede reenviar."],
    ["Mensajes masivos", "A pedido", "Envío por zona y estado con pausas aleatorias y registro por destinatario."],
    ["Notificaciones del panel", "En cada consulta", "Ventas por aprobar, instalaciones fallidas, averías demoradas, estado de WhatsApp."],
  ], { colW: [2.0, 1.75, 5.18], size: 9.5 });
  s.addNotes("APScheduler dentro del backend ejecuta las tareas diarias (ADR-04).");

  s = content(SW, "Capítulo 8 · Sección 3 · Código", "Estructura del repositorio y buenas prácticas");
  table(s, ["Carpeta", "Contenido"], [
    ["backend/app/", "main, config, models, schemas, acceso (módulos por endpoint), scheduler"],
    ["backend/app/routers/", "19 routers, uno por dominio"],
    ["backend/alembic/versions/", "35 migraciones del esquema"],
    ["frontend/src/", "Panel: views/ por módulo, components/, lib/ (API por dominio)"],
    ["mobile/", "App Expo: pantallas por rol y services/api.ts"],
    ["whatsapp/ · web/ · nginx/", "Mensajería, sitio público y proxy inverso"],
  ], { w: 5.1, colW: [1.95, 3.15], size: 9 });
  card(s, 5.8, 1.3, 3.68, 3.6);
  cardHead(s, "Patrones aplicados", 6.03, 1.42, 3.3);
  bullets(s, ["Modularidad por dominio.", "Inyección de dependencias de FastAPI: sesión, usuario y roles en la firma.", "Esquemas Pydantic de entrada y salida.", "Adaptadores hacia sistemas externos.", "Configuración por variables de entorno.", "Caché, GROUP BY y una sesión SSH por caja."], 6.05, 1.75, 3.35, 3.1, { size: 9.5 });
  s.addNotes("La seguridad se declara en la firma de cada endpoint, por eso no se puede olvidar.");

  s = content(SW, "Capítulo 8 · Sección 3 · Errores y validaciones", "Manejo de errores y validaciones");
  cardsGrid(s, [
    { t: "Mensajes claros", d: "HTTPException con mensajes en español: «El cliente no está aprobado para instalación»." },
    { t: "Validar antes del router", d: "La fecha de instalación no puede ser futura ni de hace más de una semana." },
    { t: "Duplicados en la base", d: "Únicos en número de operación, borne por caja, DNI y usuario PPPoE." },
    { t: "Operaciones atómicas", d: "Si el router no responde se informa; un PPPoE existente se vincula, no se duplica." },
    { t: "Arranque seguro", d: "En producción el backend no arranca con claves de ejemplo; login bloqueado tras 8 fallos." },
    { t: "Borrados protegidos", d: "No se borra un usuario con actividad, una caja con bornes ocupados ni una zona con clientes." },
  ], { cols: 3, h: 3.55 });
  s.addNotes("Las validaciones evitan dejar la red o la base en un estado a medias.");

  s = content(SW, "Capítulo 8 · Sección 4 · Despliegue", "Siete servicios en Docker Compose, sin puertos abiertos");
  table(s, ["Contenedor", "Servicio", "Detalle"], [
    ["wisp_postgres", "PostgreSQL 15 · 127.0.0.1:5432", "Volumen postgres_data; chequeo de salud"],
    ["wisp_backend", "FastAPI · 8000", "Aplica migraciones al arrancar"],
    ["wisp_frontend", "Panel · 127.0.0.1:3000", "Servido con Nginx"],
    ["wisp_web", "Sitio · 127.0.0.1:3002", "Estático"],
    ["wisp_whatsapp", "Node + Baileys · 127.0.0.1:3001", "Límite de 0,5 CPU y 512 MB"],
    ["wisp_nginx", "Nginx · 80", "Enruta /, /app y /api; cabeceras de seguridad"],
    ["wisp_cloudflared", "Cloudflare Tunnel", "Publica wispfibra.com sin puertos de entrada"],
  ], { w: 5.9, colW: [1.5, 2.2, 2.2], size: 8.5 });
  card(s, 6.6, 1.3, 2.88, 3.6);
  cardHead(s, "Verificado (19/11/2026)", 6.83, 1.42, 2.5);
  bullets(s, ["wispfibra.com → 200 OK", "www.wispfibra.com → 200 OK", "/app/ → 200 OK", "/api/health → 200 OK", "HSTS de un año; servidor Cloudflare"], 6.85, 1.75, 2.5, 3.1, { size: 10 });
  s.addNotes("La evidencia de despliegue es verificable: cualquiera puede abrir las cuatro URL.");

  s = content(SW, "Capítulo 8 · Desempeño", "Tiempos de respuesta medidos en producción");
  s.addChart(pres.charts.BAR, [{ name: "p50", labels: ["Sitio", "Panel", "API salud", "Zonas", "Resumen"], values: [474, 460, 467, 474, 478] }, { name: "p95", labels: ["Sitio", "Panel", "API salud", "Zonas", "Resumen"], values: [593, 481, 486, 519, 510] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.4, h: 3.55, barDir: "col", barGrouping: "clustered", showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: K.muted, showTitle: true, title: "Milisegundos, 30 peticiones por ruta (150/150 con éxito)", dataLabelPosition: "outEnd", dataLabelFontSize: 8 }));
  card(s, 6.1, 1.3, 3.38, 3.55);
  cardHead(s, "Dónde se va el tiempo", 6.33, 1.42, 3);
  bullets(s, ["TCP a Cloudflare (Río de Janeiro): ≈ 120 ms.", "TLS: ≈ 115 ms, una vez por conexión.", "Túnel hasta la oficina y regreso: ≈ 230 ms.", [{ text: "Procesamiento de la API: 3 a 7 ms.", b: true }], "Con conexión abierta: ≈ 229 ms por petición."], 6.35, 1.75, 3.05, 3.05, { size: 10 });
  note(s, "El servidor no es el cuello de botella; activar la caché de Cloudflare para estáticos es la mejora.");
  s.addNotes("Medido con tools/medir_desempeno.py: casi todo el tiempo es red, no procesamiento.");

  s = content(SW, "Capítulo 8 · Escalabilidad", "Capacidad actual y cómo crece cada dimensión");
  table(s, ["Dimensión", "Hoy", "Cómo crece"], [
    ["Zonas", "13", "Registro + peer WireGuard + sincronizar planes, sin cambiar código"],
    ["Clientes", "Unos 455", "Probado con 50 000 clientes y 600 000 pagos"],
    ["Permisos", "Roles configurables", "Roles y módulos desde el panel, sin desplegar"],
    ["Tráfico web", "Cloudflare", "Absorbe TLS y tráfico malicioso"],
    ["Servidor", "4 núcleos, 4 GB", "Límite real: migrar al diseño ESXi + AWS (CE03) con el mismo Compose"],
  ], { colW: [1.5, 1.9, 5.53], size: 9.5, maxH: 2.3 });
  card(s, 0.55, 3.75, 8.93, 1.15, { stripeColor: K.navy });
  txt(s, [{ text: "Límite para replicar el backend: ", options: { bold: true, color: K.navy } }, { text: "el freno de login, la caché de WireGuard y el planificador viven en memoria. Con dos copias, los cortes de las 09:00 se ejecutarían dos veces: habría que llevar ese estado a Redis y dejar un solo planificador." }], { x: 0.78, y: 3.87, w: 8.55, h: 0.95, fontSize: 10.5 });
  s.addNotes("Hallazgo del código: para escalar horizontalmente hay que sacar el estado de la memoria.");

  s = content(SW, "Capítulo 8 · Anexo · Manual técnico", "Manual técnico breve para el administrador");
  cardsGrid(s, [
    { t: "Instalar", d: "Ubuntu 24.04, Docker, clonar el repositorio, .env y docker compose up -d --build." },
    { t: "Actualizar", d: "git pull y compose up -d --build; las migraciones se aplican solas." },
    { t: "Respaldar y restaurar", d: "pg_dump diario a las 03:00; restauración con psql en un servidor nuevo." },
    { t: "Agregar zona", d: "Crear zona, llaves WireGuard, peer del hub, verificar túnel y planes, asignar técnicos." },
    { t: "Colaboradores", d: "Crear cuenta con rol; al cese se desactiva, no se borra." },
    { t: "Problemas frecuentes", d: "Túnel caído, puerto 8000 bloqueado, WhatsApp desvinculado, corte que no corta." },
  ], { cols: 3, h: 3.55 });
  s.addNotes("El manual permite que otra persona opere el sistema sin depender del desarrollador.");

  // ======================= E4 · CALIDAD =======================
  addSection("CE02 · E4 Calidad de Software");
  s = divider("04", "Capítulo 9 · CE02 · S2-E4 · CE024", "Gestión del Proyecto y Calidad de Software",
    ["Pruebas: unitarias, caja blanca y caja negra", "Integración, despliegue y operación continua", "Gestión ágil del proyecto de software", "Aseguramiento y auditoría de la calidad (CMMI)"], LINE);
  s.addNotes("Cuarto entregable: cómo sabemos que el sistema es de calidad y cómo se gestionó.");

  s = content(SW, "Capítulo 9 · Resumen ejecutivo", "Todo pasa: 474 casos en tres niveles");
  statRow(s, [["121", "Pruebas unitarias y de caja blanca (pytest)"], ["45", "Casos de caja negra contra la API"], ["308", "Verificaciones de caja negra en la interfaz"], ["732", "Decisiones de permiso revisadas una a una"]]);
  card(s, 0.55, 2.7, 8.93, 2.2);
  cardHead(s, "Estado de la calidad", 0.78, 2.82, 8);
  bullets(s, ["Reglas críticas (facturación, cobro y permisos) al 100 % de cobertura de líneas y ramas.", "2 defectos reales encontrados y corregidos en la ronda; ninguno abierto.", "Integración aún manual: se diseñó un pipeline CI de 4 etapas, validado contra el código.", "Proceso: nivel 1 de CMMI con casi todo el nivel 2; el plan de mejora cierra las brechas."], 0.8, 3.15, 8.5, 1.7);
  s.addNotes("Versión probada: rama pastor, commit dd46fc1. Volvimos a correr la suite: 121 pasan en 7,45 s.");

  s = content(SW, "Capítulo 9 · Sección 1 · Estrategia", "Tres niveles de prueba complementarios");
  flow(s, [{ t: "Unitarias", d: "Funciones y endpoints aislados con SQLite en memoria; no tocan datos reales." }, { t: "Caja blanca", d: "Cobertura de líneas y ramas; caminos de las reglas críticas a propósito." }, { t: "Caja negra · API", d: "HTTP real al servidor: equivalencia, valores límite y tablas de decisión." }, { t: "Caja negra · interfaz", d: "Chrome sin interfaz: 9 recorridos a 1440 px, 390 px y modo oscuro." }], { h: 1.6 });
  card(s, 0.55, 3.1, 8.93, 1.8);
  cardHead(s, "Pruebas que no afectan la operación", 0.78, 3.22, 8);
  bullets(s, ["WhatsApp y MikroTik se interceptan y responden con datos simulados: no sale nada real.", "Lo que crean las pruebas (ONUs, materiales, un técnico de prueba) se borra al terminar.", "Comando reproducible: docker exec wisp_local_backend python -m pytest -q tests/ --cov=app --cov-branch"], 0.8, 3.55, 8.5, 1.3, { size: 10.5 });
  s.addNotes("La estrategia combina mirar el código por dentro y probarlo como lo usaría una persona.");

  s = content(SW, "Capítulo 9 · Sección 1 · Pruebas unitarias", "121 pruebas unitarias por archivo");
  s.addChart(pres.charts.BAR, [{ name: "Casos", labels: ["Reglas puras", "ONUs", "Inventario", "Ciclo de servicio", "Gastos", "Pagos"], values: [29, 23, 20, 19, 18, 12] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.2, h: 3.55, barDir: "bar", showTitle: true, title: "Casos por archivo (121 pasan en 7,45 s)", dataLabelPosition: "outEnd", chartColors: [K.navy] }));
  card(s, 5.9, 1.3, 3.58, 3.55);
  cardHead(s, "Ejemplos representativos", 6.13, 1.42, 3.2);
  bullets(s, ["Entrega de varias líneas: todo o nada si una excede el stock.", "Un técnico no devuelve ni consume más de lo que tiene.", "Recorrido completo de una ONU queda en orden en su historial.", "Corte temporal no reactiva a un cliente suspendido."], 6.15, 1.75, 3.2, 3.05, { size: 10 });
  s.addNotes("Las pruebas están en backend/tests dentro del repositorio.");

  s = content(SW, "Capítulo 9 · Sección 1 · Cobertura", "Cobertura donde un error cuesta dinero");
  s.addChart(pres.charts.BAR, [{ name: "Cobertura", labels: ["facturacion.py", "billing.py", "acceso.py", "onus_historial.py", "inventario.py", "onus.py", "gastos.py", "pagos.py", "clientes.py", "Total app"], values: [100, 100, 100, 94.2, 83.6, 75.7, 73.9, 40.7, 25.9, 41.5] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.6, h: 3.6, barDir: "bar", showTitle: true, title: "Cobertura de líneas y ramas (%)", dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", valAxisMaxVal: 110, valAxisHidden: true, chartColors: [K.navy] }));
  card(s, 6.3, 1.3, 3.18, 3.6);
  cardHead(s, "Lectura", 6.53, 1.42, 2.8);
  bullets(s, ["Facturación, cobro y permisos: 100 % en líneas y ramas.", "Los routers de clientes, zonas, MikroTik y WhatsApp dependen de servicios externos y hoy se prueban de punta a punta.", "Meta del plan de mejora: ≥ 60 % total."], 6.55, 1.75, 2.85, 3.1, { size: 10 });
  s.addNotes("La cobertura total es baja, pero está concentrada donde importa; lo decimos tal cual.");

  s = content(SW, "Capítulo 9 · Sección 1 · Caja blanca", "Caminos recorridos y matriz de permisos");
  table(s, ["Función", "Ramas recorridas"], [
    ["acceso.permite_con_roles", "Ruta sin regla, superadministrador, regla amplia, regla «usar» y Red sin escritura"],
    ["facturacion.dia_de_pago", "Día ≤ 25 y ≥ 26: límites 1, 25, 26 y 31"],
    ["facturacion.con_dia", "Mes corto, febrero bisiesto y no bisiesto"],
    ["billing.monto_mensual", "Sin plan, sin TV, con TV y TV nula"],
    ["onus_historial.normalizar_*", "Serie corta, hex de la OLT e inválida; MAC ceros, multicast y no hex"],
  ], { w: 5.6, colW: [2.1, 3.5], size: 9 });
  card(s, 6.3, 1.3, 3.18, 3.6, { stripeColor: K.navy });
  txt(s, "732", { x: 6.5, y: 1.45, w: 2.8, h: 0.7, fontFace: HF, fontSize: 34, bold: true, color: K.navy });
  txt(s, "decisiones de permiso comparadas, ruta por ruta y rol por rol. Las únicas 30 diferencias son endpoints nuevos cerrados a quien no tiene el módulo: lo esperado. Además, cada migración nueva se probó de ida, vuelta e ida.", { x: 6.5, y: 2.2, w: 2.85, h: 2.6, fontSize: 10 });
  s.addNotes("La matriz de permisos garantiza que ningún rol obtenga acceso que no debería.");

  s = content(SW, "Capítulo 9 · Sección 1 · Caja negra", "API: 45 de 45 casos con valores límite");
  table(s, ["Grupo", "Técnica", "Caso", "Esperado", "Obtenido"], [
    ["Autenticación", "Equivalencia", "Contraseña incorrecta / token alterado", "401", "401"],
    ["Permisos", "Tabla de decisión", "Técnico sin módulo consulta el stock", "403", "403"],
    ["Permisos", "Tabla de decisión", "Técnico consulta su propio material", "200", "200"],
    ["ONU · serie", "Valor límite", "11 y 13 caracteres", "rechazada", "rechazada"],
    ["ONU · MAC", "Equivalencia", "Ceros, difusión y multicast", "rechazada", "rechazada"],
    ["Inventario", "Valor límite", "Entregar el stock + 1", "400", "400"],
    ["Pagos", "Valor límite", "Monto −1 y monto 0", "400", "400"],
    ["Pagos", "Equivalencia", "Cliente inexistente", "404", "404"],
  ], { colW: [1.4, 1.6, 3.53, 1.2, 1.2], size: 9 });
  s.addNotes("Sin mirar el código: solo entradas y salidas esperadas.");

  s = content(SW, "Capítulo 9 · Sección 1 · Caja negra", "Interfaz: 308 de 308 verificaciones");
  s.addChart(pres.charts.BAR, [{ name: "Casos", labels: ["Diseño y accesibilidad", "Inventario", "ONUs", "Módulos padre", "Zonas y cajas", "Caja NAP", "WhatsApp masivo", "Red / Inventario", "ONU y consumo"], values: [68, 60, 41, 35, 28, 24, 22, 19, 11] }],
    chartOpts({ x: 0.55, y: 1.3, w: 5.6, h: 3.6, barDir: "bar", showTitle: true, title: "Verificaciones por recorrido en Chrome", dataLabelPosition: "outEnd", chartColors: [K.orange] }));
  table(s, ["#", "Defecto encontrado", "Estado"], [
    ["1", "El «corte temporal» (monto 0) se rechazaba siempre por una regla posterior", "Corregido"],
    ["2", "Estado «Con técnico» con contraste 4,48:1, bajo WCAG AA (4,5:1)", "Corregido"],
  ], { x: 6.3, w: 3.18, colW: [0.3, 2.13, 0.75], size: 8.5, maxH: 2.3 });
  txt(s, "Cuatro verificaciones se ajustaron por cambios legítimos del sistema: se corrigió la prueba, no la aplicación.", { x: 6.3, y: 3.75, w: 3.18, h: 1.0, fontSize: 9.5, color: K.muted, italic: true });
  s.addNotes("Las pruebas de interfaz encontraron un defecto real de accesibilidad.");

  s = content(SW, "Capítulo 9 · Sección 1 · Flujos críticos", "Cada flujo crítico tiene pruebas que lo cubren");
  table(s, ["Flujo crítico", "Requisitos", "Pruebas"], [
    ["Aprobar e instalar", "RF-10, RF-11, RN-05", "test_aprobar_un_pendiente, test_no_se_aprueba_dos_veces, test_instalar_exige_que_este_aprobado"],
    ["Corte y reactivación", "RF-33 a RF-35, RN-07 a RN-09", "test_cortar_suspende_avisa_y_luego_corta, test_reactivar_no_perdona_la_deuda"],
    ["Cobro y fecha de pago", "RF-29, RF-32, RN-06", "29 reglas puras al 100 %; duplicados, adelantos y montos límite"],
    ["Control de acceso", "RN-04, RN-12", "732 decisiones de la matriz; 8 casos de permisos en la API"],
    ["Inventario", "RF-24 a RF-26, RN-02", "Todo o nada, serie y MAC, devoluciones y consumo con tope"],
  ], { colW: [1.75, 2.0, 5.18], size: 9 });
  s.addNotes("La trazabilidad llega hasta la prueba: requisito, regla y caso que lo verifica.");

  s = content(SW, "Capítulo 9 · Sección 2 · CI/CD", "Hoy: integración manual, despliegue con un comando");
  cardsGrid(s, [
    { t: "Control de versiones", d: "GitHub; main = producción, pastor = trabajo. 97 commits del 19/10 al 19/11/2026." },
    { t: "Integración", d: "Cada cambio se prueba en el Docker local, igual al de producción, antes de unir a main." },
    { t: "Despliegue", d: "git pull y docker compose up -d --build; migraciones automáticas al arrancar." },
    { t: "Brecha", d: "Nada impide unir a main un cambio cuyas pruebas fallan: falta un pipeline CI.", color: K.red, chip: "Brecha", chipColor: K.red, chipW: 0.75 },
  ], { cols: 2, h: 3.55 });
  s.addNotes("Decimos con honestidad dónde estamos: la integración continua aún no es automática.");

  s = content(SW, "Capítulo 9 · Sección 2 · Pipeline", "Pipeline CI/CD propuesto en cuatro etapas");
  imageCard(s, FIG + "f9_2.png", 0.55, 1.3, 8.93, 2.3);
  cardsGrid(s, [
    { t: "Validado contra el código", d: "requirements.txt, package-lock y build existen; el umbral 100 % en reglas críticas se cumple." },
    { t: "CD de «tirar»", d: "El servidor no acepta conexiones entrantes: revisa main cada 15 min, despliega y revierte si /api/health falla." },
    { t: "Primer resultado", d: "Hoy fallaría por 26 hallazgos de ruff (16 se corrigen solos): es la condición para activarlo." },
  ], { cols: 3, y: 3.72, h: 1.2, dSize: 9 });
  s.addNotes("El pipeline está en config/ci_wisp.yml; aún no está activado en el repositorio.");

  s = content(SW, "Capítulo 9 · Sección 2 · Observabilidad", "Observabilidad en producción");
  table(s, ["Señal", "Implementación", "Estado"], [
    ["Salud", "healthcheck de PostgreSQL y GET /api/health", { text: "Operativo", o: { color: K.green, bold: true } }],
    ["Autorrecuperación", "restart: unless-stopped en los 7 contenedores", { text: "Operativo", o: { color: K.green, bold: true } }],
    ["Registros", "14 loggers en el backend; docker compose logs; registro del túnel", { text: "Operativo", o: { color: K.green, bold: true } }],
    ["Recursos", "docker stats; techo de 0,5 CPU y 512 MB para WhatsApp", { text: "Operativo", o: { color: K.green, bold: true } }],
    ["Negocio y red", "Dashboard del panel; estado WireGuard por zona", { text: "Operativo", o: { color: K.green, bold: true } }],
    ["Tiempo de respuesta", "tools/medir_desempeno.py", { text: "Manual", o: { color: K.orangeDk, bold: true } }],
    ["Alertas", "Propuesta: monitor externo cada minuto con aviso por WhatsApp", { text: "Falta", o: { color: K.red, bold: true } }],
  ], { colW: [1.8, 5.73, 1.4], size: 9.5 });
  s.addNotes("Hay observabilidad funcional; lo que falta son alertas automáticas cuando el sitio cae.");

  s = content(SW, "Capítulo 9 · Sección 2 · Rollback", "Cómo se vuelve atrás según lo que falló");
  table(s, ["Qué falló", "Cómo se revierte"], [
    ["Una versión del código", "git checkout de la etiqueta anterior y docker compose up -d --build"],
    ["Una migración", "alembic downgrade -1 (cada migración se probó de ida y vuelta)"],
    ["Datos dañados", "Restaurar el respaldo diario: pg_dump a las 03:00, 30 días, copia fuera del servidor"],
    ["El servidor completo", "Reinstalar con el manual técnico y restaurar base y evidencias; el túnel se reconecta"],
    ["Una zona (router)", "Configuración de cada MikroTik respaldada aparte (plan de continuidad del SGSI)"],
  ], { colW: [2.2, 6.73], size: 10 });
  s.addNotes("El rollback está pensado por tipo de falla, no como un procedimiento único.");

  s = content(SW, "Capítulo 9 · Sección 3 · Gestión ágil", "Project Charter y Product Backlog actualizado");
  card(s, 0.55, 1.3, 3.4, 3.55);
  cardHead(s, "Project Charter (CE01, cap. 3)", 0.78, 1.42, 3.1);
  bullets(s, ["Acta, objetivos, alcance y EDT.", "Equipo Scrum: PO, Scrum Master y dos desarrolladores.", "Cronograma, costos y riesgos.", "Novedad S2: inventario, ONUs, roles configurables y WhatsApp masivo; IA postergada."], 0.8, 1.75, 3.05, 3.05, { size: 10 });
  s.addChart(pres.charts.DOUGHNUT, [{ name: "HU", labels: ["Hechas", "Parciales", "Pendientes"], values: [13, 2, 2] }],
    chartOpts({ x: 4.1, y: 1.3, w: 2.6, h: 3.55, holeSize: 55, showLegend: true, legendPos: "b", legendFontSize: 9, legendColor: K.muted, chartColors: [K.navy, K.orange, K.ice], dataLabelColor: K.white, showTitle: true, title: "17 historias de usuario" }));
  table(s, ["HU", "Estado"], [["HU-01 a HU-13", "Hechas"], ["HU-14 ONU dañada + aviso", "Parcial"], ["HU-15 Consulta de pagos", "Parcial"], ["HU-16 Fecha por WhatsApp", "Pendiente"], ["HU-17 Comprobante con IA", "Pendiente"]], { x: 6.85, w: 2.63, colW: [1.83, 0.8], size: 8.5 });
  s.addNotes("El backlog del semestre 1 se actualizó con el estado real de cada historia.");

  s = content(SW, "Capítulo 9 · Sección 3 · Sprints", "Sprint Backlog y métricas de avance");
  imageCard(s, IMG + "linea2/calidad/commits_dia.png", 0.55, 1.3, 5.4, 2.3);
  table(s, ["Métrica", "Valor"], [["Historias hechas", "13 / 17 (76 %)"], ["RF implementados", "41 / 56 (73 %)"], ["Commits A → B", "38 → 57 (+50 %)"], ["Defectos", "2 / 2 corregidos"], ["Pruebas que pasan", "474 / 474"]], { x: 6.1, w: 3.38, colW: [1.7, 1.68], size: 9.5 });
  cardsGrid(s, [
    { t: "Sprint A · 09–15/11", d: "Roles configurables y despliegue en wispfibra.com (zonas, red y roles)." },
    { t: "Sprint B · 16–22/11", d: "Inventario, ONUs, mapa, diagnóstico de planes y la ronda de pruebas." },
  ], { cols: 2, y: 3.72, h: 1.2, w: 5.4 });
  s.addNotes("Los sprints se reconstruyeron del historial git: cada commit asignado a su semana y tema.");

  s = content(SW, "Capítulo 9 · Sección 3 · Retrospectiva", "Retrospectiva del Sprint B");
  cardsGrid(s, [
    { t: "Qué salió bien", d: "Producción sin abrir puertos; la ronda encontró 2 defectos antes que un usuario; migraciones probadas de ida y vuelta.", color: K.green },
    { t: "Qué no salió bien", d: "Pruebas a mano; un cambio puede llegar a main sin ellas; 4 verificaciones desactualizadas; 4 commits sin autor.", color: K.red },
    { t: "Qué haremos distinto", d: "Activar el CI y exigirlo; mover los scripts de caja negra al repositorio; configurar el autor en todos los equipos.", color: K.navy },
  ], { cols: 3, h: 3.2 });
  note(s, "Elaborada a partir de la evidencia del repositorio; el equipo la valida y firma en su acta.");
  s.addNotes("La retrospectiva convierte los problemas del sprint en acciones del plan de mejora.");

  s = content(SW, "Capítulo 9 · Sección 3 · Marcos de proceso", "Comparación y adaptación de marcos");
  table(s, ["Aspecto", "Scrum (adoptado)", "RUP", "Cascada", "Kanban"], [
    ["Ciclo de vida", "Sprints cortos", "4 fases iterativas", "Secuencial", "Flujo continuo"],
    ["Requisitos", "Backlog que cambia", "Casos de uso estables", "Fijos al inicio", "Tarjetas según llegan"],
    ["Documentación", "Mínima", "Abundante", "Abundante por fase", "Mínima"],
    ["Ajuste a WISP", { text: "Alto", o: { bold: true, color: K.green } }, "Medio: pesado para 4", "Bajo: el alcance cambió", "Alto para operación"],
  ], { colW: [1.5, 1.85, 1.9, 1.85, 1.83], size: 9.5, maxH: 1.9 });
  cardsGrid(s, [
    { t: "PMBOK", d: "Gestión formal del semestre 1: acta, EDT, costos y riesgos." },
    { t: "Scrum", d: "Construcción del software en sprints con incrementos desplegables." },
    { t: "Kanban", d: "Operación: averías, instalaciones y pagos en la bandeja «Por atender»." },
    { t: "De RUP", d: "Arquitectura temprana (C4 + 9 ADR) y modelo de datos antes de construir." },
  ], { cols: 4, y: 3.3, h: 1.6, dSize: 9 });
  s.addNotes("No elegimos un marco puro: cada etapa usa el que mejor se ajusta.");

  s = content(SW, "Capítulo 9 · Sección 4 · Matriz de calidad", "Matriz de calidad ISO/IEC 25010 con valores medidos");
  table(s, ["Atributo", "Métrica", "Meta", "Medido"], [
    ["Corrección funcional", "Pruebas que pasan", "100 %", { text: "100 % (474)", o: { color: K.green, bold: true } }],
    ["Eficiencia", "Procesamiento de la API", "< 50 ms", { text: "3–7 ms", o: { color: K.green, bold: true } }],
    ["Fiabilidad", "Peticiones con éxito", "100 %", { text: "150/150", o: { color: K.green, bold: true } }],
    ["Seguridad", "Decisiones de permiso correctas", "100 %", { text: "732/732", o: { color: K.green, bold: true } }],
    ["Mantenibilidad", "Complejidad ciclomática media", "A (≤ 5)", { text: "A (3,64)", o: { color: K.green, bold: true } }],
    ["Mantenibilidad", "Funciones con complejidad > 10", "0", { text: "34 de 587", o: { color: K.red, bold: true } }],
    ["Capacidad de prueba", "Cobertura total de ramas", "≥ 60 %", { text: "20 %", o: { color: K.red, bold: true } }],
    ["Adecuación funcional", "RF implementados", "≥ 80 %", { text: "73 %", o: { color: K.orangeDk, bold: true } }],
    ["Usabilidad", "Contraste WCAG AA", "100 %", { text: "100 %", o: { color: K.green, bold: true } }],
  ], { colW: [2.0, 3.43, 1.5, 2.0], size: 9 });
  s.addNotes("Verde cumple, rojo no: la matriz muestra dónde está la deuda de calidad.");

  s = content(SW, "Capítulo 9 · Sección 4 · Calidad del código", "Métricas del código y code smells");
  statRow(s, [["9 910", "Líneas de código fuente del backend", { size: 24 }], ["3,64", "Complejidad ciclomática media (rango A)", { size: 24 }], ["587", "Bloques analizados con radon 6.0.1", { size: 24 }]], 1.3, 1.05);
  table(s, ["Smell", "Casos", "Tratamiento"], [
    ["Método largo y complejo", "16", "registrar_movimientos (CC 40), create_pago (36): extraer servicios"],
    ["Módulo dios", "3", "clientes.py (1 968 líneas), pagos.py, inventario.py: dividir por caso de uso"],
    ["Excepción sin causa", "10", "raise HTTPException(...) from e"],
    ["Comparación con True/None e imports sin usar", "16", "Corrección automática con ruff --fix"],
    ["API heredada Query.get()", "9", "Migrar a Session.get() (129 avisos)"],
  ], { y: 2.5, colW: [2.6, 0.7, 5.63], size: 9 });
  note(s, "Los 497 avisos B008 de ruff son falsos positivos: es el patrón Depends() de FastAPI.");
  s.addNotes("Medimos con radon y ruff; separamos los smells reales de los falsos positivos.");

  s = content(SW, "Capítulo 9 · Sección 4 · Deuda técnica", "Registro de deuda técnica y refactorización");
  table(s, ["ID", "Deuda", "Impacto", "Refactorización"], [
    ["DT-01", "Cobertura baja en routers que llaman a MikroTik y WhatsApp", { text: "Alto", o: { color: K.red, bold: true } }, "Simular SSH y HTTP en pruebas"],
    ["DT-02", "Routers de clientes y pagos demasiado grandes", "Medio", "Capa de servicios por caso de uso"],
    ["DT-03", "26 hallazgos de análisis estático", "Bajo", "ruff --fix y corrección manual"],
    ["DT-04", "Uso de Query.get() heredado", "Bajo", "Migrar a Session.get()"],
    ["DT-05", "Estado en memoria (login, caché WG, planificador)", "Medio", "Redis y planificador único"],
    ["DT-06", "Scripts de caja negra fuera del repositorio", "Medio", "Moverlos a tests/e2e/"],
    ["DT-07", "Imagen cloudflared:latest sin versión fija", "Medio", "Fijar versión (NC-07 del SGSI)"],
  ], { colW: [0.75, 4.0, 0.9, 3.28], size: 9 });
  note(s, "Ya se refactoriza: el defecto 1 se corrigió reordenando las validaciones de create_pago.");
  s.addNotes("La deuda está registrada con impacto y acción, y una parte ya se pagó en esta ronda.");

  s = content(SW, "Capítulo 9 · Sección 4 · Auditoría CMMI", "Auditoría de madurez del proceso (CMMI-DEV, tipo SCAMPI C)");
  const pa = [["PP", "Planificación", "S"], ["REQM", "Requisitos", "S"], ["PMC", "Monitoreo", "P"], ["CM", "Configuración", "P"], ["PPQA", "Aseguramiento", "P"], ["MA", "Medición", "P"], ["RD", "Desarrollo de req.", "S"], ["TS", "Solución técnica", "S"], ["PI", "Integración", "P"], ["VER", "Verificación", "S"], ["VAL", "Validación", "P"]];
  pa.forEach(([c, n, r], i) => {
    const x = 0.55 + (i % 6) * 1.5, y = 1.3 + Math.floor(i / 6) * 1.05, col = r === "S" ? K.green : K.orange;
    card(s, x, y, 1.38, 0.92, { stripeColor: col });
    txt(s, c, { x: x + 0.15, y: y + 0.08, w: 0.9, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: K.navy });
    chip(s, r, x + 1.0, y + 0.1, 0.28, col);
    txt(s, n, { x: x + 0.15, y: y + 0.48, w: 1.2, h: 0.35, fontSize: 9, color: K.muted });
  });
  card(s, 9.55 - 1.5, 2.35, 1.38, 0.92, { stripe: false, fill: K.soft });
  txt(s, "S = satisfecha\nP = parcial", { x: 8.15, y: 2.42, w: 1.25, h: 0.8, fontSize: 9, color: K.muted });
  card(s, 0.55, 3.55, 8.93, 1.35, { stripeColor: K.navy });
  txt(s, [{ text: "Resultado: nivel 1 con la mayor parte del nivel 2. ", options: { bold: true, color: K.navy } }, { text: "PP y REQM satisfechas; PMC, CM, PPQA y MA parciales. La brecha no es técnica: falta hacer el proceso repetible y registrado (CI, etiquetas de versión, registro de revisiones y métricas por sprint)." }], { x: 0.78, y: 3.67, w: 8.55, h: 1.15, fontSize: 10.5 });
  s.addNotes("Autoevaluación con lista de verificación por área de proceso; S satisfecha, P parcial.");

  s = content(SW, "Capítulo 9 · Sección 4 · Plan de mejora", "Plan de mejora de la calidad del software");
  table(s, ["#", "Acción", "Atiende", "Plazo"], [
    ["1", "Corregir los 26 hallazgos y activar el CI como requisito para unir a main", "AQ-01, DT-03", "Semana 1"],
    ["2", "Etiquetar cada despliegue con notas de cambios", "AQ-02", "Semana 1"],
    ["3", "Monitor externo con alerta por WhatsApp sobre /api/health", "Observabilidad", "Semana 2"],
    ["4", "Pruebas de zonas, MikroTik y WhatsApp con clientes simulados (≥ 60 %)", "DT-01", "Semanas 2–4"],
    ["5", "Mover scripts de caja negra a tests/e2e/ y correrlos en CI", "DT-06", "Semana 3"],
    ["6", "Dividir clientes.py y pagos.py en servicios", "DT-02", "Semanas 3–6"],
    ["7", "Revisión de código en pull requests con la lista de verificación", "AQ-05", "Continuo"],
    ["8", "Tablero de métricas por sprint", "AQ-04", "Cada sprint"],
    ["9", "Pruebas de la app Expo", "Limitación", "Semestre siguiente"],
  ], { colW: [0.4, 5.33, 1.6, 1.6], size: 9 });
  s.addNotes("Cada acción del plan cierra un hallazgo de la auditoría o una deuda registrada.");

  s = content(SW, "Cierre de la línea de software", "Conclusiones de la línea CE02");
  flow(s, [{ t: "Requerimientos", d: "56 RF, 12 RNF y 12 reglas validados y trazables." }, { t: "Datos", d: "Modelo normalizado, lógica en la base e índices medidos." }, { t: "Sistema", d: "169 endpoints, 3 canales, en producción." }, { t: "Calidad", d: "474 casos que pasan; plan de mejora CMMI." }], { h: 1.4, hi: 2 });
  card(s, 0.55, 2.9, 8.93, 2.0);
  bullets(s, ["El sistema reemplazó al heredado y opera en wispfibra.com con datos reales de la empresa.", "Las reglas que no pueden fallar (borne único, pago y reactivación) se garantizan en la base de datos.", "Lo pendiente está identificado: bot de comprobantes con IA, CI activo, alertas y capturas de la app.", "La línea de infraestructura (CE03) diseña dónde y cómo debe correr este sistema de forma segura."], 0.8, 3.05, 8.5, 1.8, { size: 11 });
  s.addNotes("Cerramos la línea de software y pasamos a la de infraestructura, que la sostiene.");
};
