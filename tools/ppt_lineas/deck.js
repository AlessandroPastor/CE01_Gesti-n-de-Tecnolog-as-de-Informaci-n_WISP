// Presentación de las líneas CE02 (Software) y CE03 (Infraestructura) — estilo de la oficial de CE01
const path = require("path");
const B = require("./base");
const { pres, K, HF, IMG, THEME, addSection, newSlide, txt, card, cardHead, bullets, note, chip, content, table, flow } = B;
const { applyTheme } = require("C:/Users/USER/.claude/skills/synced/e6df9385-a280-4cb8-ac88-189be4b2e2e7_14e48358-344b-4aa6-b94d-621fdcbd21d6/pptx/scripts/apply_theme.js");
const OUT = process.argv[2] || path.join(__dirname, "presentacion-wisp-lineas-2-3.pptx");

let s;
// ---------- Portada ----------
addSection("Apertura");
s = newSlide("PORTADA");
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.09, fill: { color: K.orange }, line: { color: K.orange, width: 0 } });
txt(s, "UNIVERSIDAD PERUANA UNIÓN", { x: 0.6, y: 0.32, w: 6.5, h: 0.32, fontSize: 13, bold: true, color: K.white, charSpacing: 2 });
txt(s, "Escuela Profesional de Ingeniería de Sistemas · Proyecto de Evaluación de Fin de Carrera", { x: 0.6, y: 0.64, w: 7, h: 0.28, fontSize: 10.5, color: K.ice });
card(s, 7.95, 0.3, 1.5, 0.95, { stripe: false });
s.addImage({ path: IMG + "Wisp.png", x: 8.03, y: 0.35, w: 1.34, h: 0.85, altText: "Logo de WISP" });
txt(s, "LÍNEAS CE02 · INGENIERÍA DE SOFTWARE  Y  CE03 · INFRAESTRUCTURA TECNOLÓGICA", { x: 0.6, y: 1.35, w: 8.8, h: 0.3, fontSize: 10.5, bold: true, color: K.orange, charSpacing: 1.5 });
s.addText([{ text: "Sistema de Gestión Integral e ", options: { color: K.white } }, { text: "Infraestructura Híbrida Segura", options: { color: K.orange } }],
  { isTextBox: true, x: 0.6, y: 1.7, w: 8.8, h: 1.0, fontFace: HF, fontSize: 28, bold: true, margin: 0, valign: "top" });
txt(s, "Para un ISP de fibra óptica multi-zona — WISP, región Puno", { x: 0.6, y: 2.72, w: 8.8, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: K.ice });
const pasos = [["Requerimientos", "56 RF validados"], ["Datos", "PostgreSQL 15"], ["Sistema", "wispfibra.com"], ["Calidad", "474 pruebas"], ["Red y DC", "ESXi + AWS"], ["SGSI", "ISO/IEC 27001"]];
pasos.forEach(([t, d], i) => {
  const x = 0.6 + i * 1.49;
  s.addShape(pres.shapes.RECTANGLE, { x, y: 3.25, w: 1.38, h: 0.72, fill: { color: "0B2E6E" }, line: { color: "2A4A86", width: 0.75 } });
  chip(s, String(i + 1), x + 0.08, 3.32, 0.24, K.orange, { h: 0.22, size: 8 });
  txt(s, t, { x: x + 0.38, y: 3.31, w: 0.98, h: 0.25, fontSize: 9.5, bold: true, color: K.white, valign: "middle" });
  txt(s, d, { x: x + 0.1, y: 3.6, w: 1.25, h: 0.3, fontSize: 8.5, color: K.ice });
});
txt(s, "Empresa caso de estudio: WISP Ingeniería en Redes y Telecomunicaciones — Región Puno", { x: 0.6, y: 4.17, w: 8.8, h: 0.25, fontSize: 9.5, color: K.ice });
[["Cabana Sulca, Cristian", "202212416"], ["Montes Mamani, Andrés Lino", "202212423"], ["Fernández Sánchez, Jean Piero", "202212439"], ["Mamani Mamani, Alessandro Pastor", "202212452"]].forEach(([n, c], i) => {
  const x = 0.6 + (i % 2) * 3.2, y = 4.47 + Math.floor(i / 2) * 0.42;
  txt(s, n, { x, y, w: 3.1, h: 0.22, fontSize: 10, bold: true, color: K.white });
  txt(s, c, { x, y: y + 0.2, w: 3.1, h: 0.2, fontSize: 8.5, color: K.orange });
});
txt(s, "Juliaca, Puno — Perú", { x: 7.2, y: 4.85, w: 2.25, h: 0.25, fontSize: 11, bold: true, color: K.white, align: "right" });
txt(s, "Noviembre 2026", { x: 7.2, y: 5.1, w: 2.25, h: 0.22, fontSize: 9.5, color: K.ice, align: "right" });
s.addNotes("Presentamos las líneas de software e infraestructura del proyecto WISP. La línea de gestión (CE01) se expuso en la primera parte.");

// ---------- Agenda ----------
s = content("gen", "Contenido de la presentación", "Siete entregables, dos líneas de especialidad");
const ag = [
  ["01", "Requerimientos y Diseño", "SRS, prototipo, C4 y ADR, UML", "CE02"], ["02", "Plataforma de Datos", "Modelo, SQL, programación, seguridad", "CE02"],
  ["03", "Sistema Funcional Integrado", "Arquitectura, flujos, código, despliegue", "CE02"], ["04", "Gestión y Calidad de Software", "Pruebas, CI/CD, ágil, CMMI", "CE02"],
  ["05", "Análisis y Diseño de Red", "VLAN, VPN WireGuard, firewall, IDS", "CE03"], ["06", "Centro de Datos Híbrido", "ESXi, AWS, dimensionamiento, RTO/RPO", "CE03"],
  ["07", "SGSI ISO/IEC 27001", "Riesgos, SoA, incidentes, ética, auditoría", "CE03"],
];
ag.forEach(([n, t, d, l], i) => {
  const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4, x = 0.55 + col * 4.54, y = 1.3 + row * 0.9;
  card(s, x, y, 4.39, 0.78, { stripeColor: l === "CE02" ? K.orange : K.navy });
  txt(s, n, { x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.55, fontFace: HF, fontSize: 20, bold: true, color: K.orange, valign: "middle" });
  txt(s, t, { x: x + 0.8, y: y + 0.1, w: 2.9, h: 0.3, fontSize: 11, bold: true, color: K.navy, valign: "middle" });
  txt(s, d, { x: x + 0.8, y: y + 0.42, w: 2.9, h: 0.28, fontSize: 9, color: K.muted });
  chip(s, l, x + 3.62, y + 0.27, 0.62, l === "CE02" ? K.orange : K.navy);
});
card(s, 5.09, 4.0, 4.39, 0.78, { stripe: false, fill: K.soft });
txt(s, "Cierre: entregables en ejecución, conclusiones y siguientes pasos", { x: 5.27, y: 4.1, w: 4.1, h: 0.6, fontSize: 10, color: K.navy, bold: true, valign: "middle" });
s.addNotes("La presentación sigue los códigos oficiales: cuatro entregables de software y tres de infraestructura.");

// ---------- Mapa de entregables ----------
s = content("gen", "Mapa de entregables", "Cada entregable con su código, capítulo y estado");
const ok = (t) => ({ text: t, o: { color: K.green, bold: true } }), pend = (t) => ({ text: t, o: { color: K.orangeDk, bold: true } });
table(s, ["Línea", "Código", "Momento", "Entregable", "Capítulo", "Estado"], [
  ["CE02", "CE021", "S1 · E1", "Requerimientos y Diseño del Sistema", "6", ok("Completo (acta por firmar)")],
  ["CE02", "CE022", "S2 · E2", "Plataforma de Datos del Sistema", "7", ok("Completo en laboratorio")],
  ["CE02", "CE023", "S2 · E3", "Sistema de Software Funcional Integrado", "8", ok("En producción")],
  ["CE02", "CE024", "S2 · E4", "Gestión del Proyecto y Calidad de Software", "9", ok("Completo (CI por activar)")],
  ["CE03", "CE0311", "S1 · E1", "Análisis y Diseño de Red", "10", ok("Completo")],
  ["CE03", "CE0331", "S1 · E2", "Análisis y Diseño de Centro de Datos Híbrido", "11", ok("Completo")],
  ["CE03", "CE0321–24", "S2 · E1", "Planificación e Implementación del SGSI", "12", ok("Completo (declaración por firmar)")],
  ["CE03", "CE0312–13", "S2 · E2", "Implementación, Testing y Monitoreo de Red", "—", pend("En ejecución")],
  ["CE03", "CE0332–33", "S2 · E3", "Implementación, Gestión y Control de Centro de Datos", "—", pend("En ejecución")],
], { colW: [0.7, 1.05, 0.85, 3.6, 0.75, 1.98], size: 9 });
note(s, "Documento de respaldo: Perfil de Proyecto de Egreso (PDF), con un capítulo por entregable.");
s.addNotes("Siete entregables completos y dos en ejecución, que dependen de la implementación física.");

// ---------- Líneas ----------
require("./ce02")();
require("./ce03")();

// ---------- Cierre ----------
addSection("Cierre");
s = content("gen", "Cierre de las líneas CE02 y CE03", "Conclusiones: del sistema a la infraestructura segura");
flow(s, [{ t: "Software", d: "Sistema real en wispfibra.com: 169 endpoints, 3 canales, 474 pruebas." }, { t: "Datos", d: "Reglas críticas en la base; índices medidos; respaldo restaurado." }, { t: "Red y DC", d: "13 islas → red segmentada; PC → ESXi + AWS con 3-2-1." }, { t: "Seguridad", d: "SGSI con 20 riesgos, 37 controles y auditoría con 7 NC." }], { h: 1.45, hi: 3 });
card(s, 0.55, 2.95, 4.39, 1.95);
cardHead(s, "Lo logrado", 0.78, 3.07, 4);
bullets(s, ["El sistema reemplazó al heredado y opera con datos reales.", "La infraestructura actual se publicó sin abrir puertos.", "Las fallas propias se midieron y se reportaron, no se ocultaron."], 0.8, 3.4, 4.0, 1.45, { size: 10 });
card(s, 5.09, 2.95, 4.39, 1.95, { stripeColor: K.navy });
cardHead(s, "Siguientes pasos", 5.32, 3.07, 4);
bullets(s, ["Hub en AWS y plantilla endurecida en las 13 zonas.", "Host ESXi, 7 VM y ejercicio de recuperación.", "CI activo, alertas, MFA y copia externa diaria."], 5.34, 3.4, 4.0, 1.45, { size: 10 });
s.addNotes("Cerramos con lo logrado y con los siguientes pasos, que son los entregables en ejecución.");

s = newSlide("PORTADA");
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.09, fill: { color: K.orange }, line: { color: K.orange, width: 0 } });
txt(s, "Gracias", { x: 0, y: 1.25, w: 10, h: 0.8, fontFace: HF, fontSize: 44, bold: true, color: K.white, align: "center", valign: "middle" });
txt(s, "Sistema de Gestión Integral e Infraestructura Híbrida Segura — Ecosistema Multi-Zona para WISP", { x: 0.5, y: 2.1, w: 9, h: 0.3, fontSize: 13, color: K.ice, align: "center" });
txt(s, "Líneas CE02 · Ingeniería de Software y CE03 · Infraestructura Tecnológica", { x: 0.5, y: 2.42, w: 9, h: 0.3, fontSize: 11, color: K.ice, align: "center" });
card(s, 4.25, 2.95, 1.5, 0.95, { stripe: false });
s.addImage({ path: IMG + "Wisp.png", x: 4.33, y: 3.0, w: 1.34, h: 0.85, altText: "Logo de WISP" });
txt(s, "Cabana Sulca · Montes Mamani · Fernández Sánchez · Mamani Mamani", { x: 0.5, y: 4.3, w: 9, h: 0.28, fontSize: 10.5, color: K.white, align: "center" });
txt(s, "Universidad Peruana Unión — Escuela Profesional de Ingeniería de Sistemas · 2026", { x: 0.5, y: 4.6, w: 9, h: 0.25, fontSize: 9, color: K.ice, align: "center" });
s.addNotes("Gracias. Quedamos atentos a sus preguntas.");

pres.writeFile({ fileName: OUT }).then(async (f) => { await applyTheme(f, THEME); console.log("escrito", f, "diapositivas:", pres.slides.length); });
