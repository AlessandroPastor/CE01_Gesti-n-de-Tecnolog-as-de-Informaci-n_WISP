// Estilo de la presentación oficial de WISP (línea CE01), reutilizado para CE02 y CE03.
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const DIMS = JSON.parse(fs.readFileSync(path.join(__dirname, "dims.json"), "utf8"));
const IMG = "C:/Users/USER/Documents/ProyectoEPE/TI/imagenes/";
const FIG = path.join(__dirname, "fig").split(path.sep).join("/") + "/";

const K = {
  navy: "00205B", ink: "0A1230", text: "1B2437", muted: "5C6675", line: "DDE2EA",
  bg: "F6F7FA", orange: "F58220", orangeDk: "D96A0B", ice: "C9D6F0", white: "FFFFFF",
  green: "2E7D32", red: "B3261E", soft: "EEF2F8", orangeSoft: "FDEBDD",
};
const HF = "Trebuchet MS", BF = "Calibri";
const THEME = {
  name: "WISP Proyecto de Egreso", headFontFace: HF, bodyFontFace: BF,
  colors: { dk1: K.text, lt1: K.white, dk2: K.navy, lt2: K.bg, accent1: K.orange, accent2: K.navy,
    accent3: K.muted, accent4: K.orangeDk, accent5: K.ice, accent6: K.green, hlink: K.navy, folHlink: K.muted },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625, igual que la presentación oficial
pres.theme = { headFontFace: HF, bodyFontFace: BF };
pres.author = "Equipo del Proyecto de Egreso WISP";
pres.title = "WISP — Líneas CE02 Ingeniería de Software y CE03 Infraestructura Tecnológica";

const FOOT = {
  sw: "WISP · Ingeniería en Redes y Telecomunicaciones — Línea de Software (CE02)",
  inf: "WISP · Ingeniería en Redes y Telecomunicaciones — Línea de Infraestructura (CE03)",
  gen: "WISP · Ingeniería en Redes y Telecomunicaciones — Proyecto de Evaluación de Fin de Carrera",
};
for (const [k, txt] of Object.entries(FOOT)) {
  pres.defineSlideMaster({
    title: "CONTENIDO_" + k.toUpperCase(),
    background: { color: K.bg },
    objects: [
      { text: { text: txt, options: { x: 0.55, y: 5.3, w: 7.2, h: 0.25, fontFace: BF, fontSize: 8.5, color: K.muted, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.53, y: 0.58, w: 9.0, h: 0.55, fontFace: HF, fontSize: 22, bold: true, color: K.ink, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 9.15, y: 5.3, w: 0.4, h: 0.25, fontFace: BF, fontSize: 9, bold: true, color: K.navy, align: "right" },
  });
}
pres.defineSlideMaster({
  title: "SEPARADOR",
  background: { color: K.navy },
  objects: [
    { rect: { x: 0, y: 5.53, w: 10, h: 0.1, fill: { color: K.orange }, line: { color: K.orange } } },
    { placeholder: { options: { name: "title", type: "title", x: 3.95, y: 1.95, w: 5.6, h: 1.15, fontFace: HF, fontSize: 26, bold: true, color: K.white, valign: "top", align: "left", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({ title: "PORTADA", background: { color: K.navy }, objects: [] });

let seccion = null;
function addSection(t) { pres.addSection({ title: t }); seccion = t; }
function newSlide(master) { return pres.addSlide({ masterName: master, sectionTitle: seccion }); }

// ---------- primitivas ----------
function txt(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, fontFace: BF, fontSize: 11, color: K.text, margin: 0, valign: "top" }, o)); }
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: o.fill || K.white }, line: { color: K.line, width: 0.75 }, objectName: o.name || "tarjeta" });
  if (o.stripe !== false) s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h, fill: { color: o.stripeColor || K.orange }, line: { color: o.stripeColor || K.orange, width: 0 } });
}
function cardHead(s, t, x, y, w, color) { txt(s, t.toUpperCase(), { x, y, w, h: 0.28, fontSize: 9.5, bold: true, color: color || K.navy, charSpacing: 1.5 }); }
function bullets(s, items, x, y, w, h, o = {}) {
  const arr = items.map((it, i) => {
    const runs = typeof it === "string" ? [{ text: it }] : it;
    return runs.map((r, j) => ({ text: r.text, options: Object.assign({ bullet: j === 0 ? { indent: 12 } : undefined, breakLine: j === runs.length - 1 && i < items.length - 1, bold: r.b, color: r.c, paraSpaceAfter: o.gap ?? 4 }, {}) }));
  }).flat();
  s.addText(arr, Object.assign({ isTextBox: true, x, y, w, h, fontFace: BF, fontSize: (o.size || 11) + 1, color: K.text, margin: 0, valign: "top" }, o.extra || {}));
}
function kicker(s, k) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 0.36, w: 0.13, h: 0.13, fill: { color: K.orange }, line: { color: K.orange, width: 0 } });
  txt(s, k.toUpperCase(), { x: 0.78, y: 0.24, w: 8.5, h: 0.35, fontSize: 10, bold: true, color: K.orange, charSpacing: 2, valign: "middle" });
}
function note(s, t) { txt(s, t, { x: 0.55, y: 5.0, w: 8.9, h: 0.26, fontSize: 9, italic: true, color: K.orangeDk }); }
function chip(s, t, x, y, w, color, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: o.h || 0.24, rectRadius: 0.04, fill: { color: color || K.navy }, line: { color: color || K.navy, width: 0 } });
  txt(s, t, { x, y, w, h: o.h || 0.24, fontSize: o.size || 8.5, bold: true, color: o.color || K.white, align: "center", valign: "middle" });
}
function content(line, k, title) {
  const s = newSlide("CONTENIDO_" + line.toUpperCase());
  kicker(s, k);
  if (title.length > 62) console.warn("TITULO LARGO (" + title.length + "): " + title);
  s.addText(title, { placeholder: "title" });
  return s;
}
function fitImage(s, file, x, y, w, h, o = {}) {
  const d = DIMS[file];
  if (!d) throw new Error("Sin dimensiones: " + file);
  const r = Math.min(w / d[0], h / d[1]);
  const iw = d[0] * r, ih = d[1] * r;
  const ix = o.align === "left" ? x : x + (w - iw) / 2, iy = o.valign === "top" ? y : y + (h - ih) / 2;
  s.addImage({ path: file, x: ix, y: iy, w: iw, h: ih, altText: o.alt || path.basename(file) });
  return { x: ix, y: iy, w: iw, h: ih };
}
function imageCard(s, file, x, y, w, h, o = {}) {
  card(s, x, y, w, h, { stripe: false });
  const pad = o.pad ?? 0.1, capH = o.cap ? 0.26 : 0;
  const r = fitImage(s, file, x + pad, y + pad, w - 2 * pad, h - 2 * pad - capH, o);
  if (o.cap) txt(s, o.cap, { x: x + pad, y: y + h - pad - 0.24, w: w - 2 * pad, h: 0.24, fontSize: 8.5, color: K.muted, align: "center", italic: true });
  return r;
}
function table(s, head, rows, o) {
  const nR = rows.length + 1; const fs = Math.min(12, (o.size || 9) + (nR <= 8 ? 1 : 0.5)); const y0 = o.y ?? 1.3; const avail = (o.maxH ?? (4.9 - y0)) * 0.86; const rh = Math.min(0.46, Math.max(0.24, avail / nR));
  const H = head.map((t) => ({ text: t, options: { bold: true, color: K.white, fill: { color: K.navy }, fontSize: fs, valign: "middle" } }));
  const R = rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === "object" && c !== null && !Array.isArray(c) ? c : { text: String(c) };
    return { text: cell.text, options: Object.assign({ fontSize: fs, color: K.text, fill: { color: i % 2 ? "F9FAFC" : K.white }, valign: "middle", bold: j === 0 && o.boldFirst !== false }, cell.o || {}) };
  }));
  s.addTable([H, ...R], { x: o.x ?? 0.55, y: o.y ?? 1.3, w: o.w ?? 8.93, colW: o.colW, fontFace: BF, border: { type: "solid", pt: 0.5, color: K.line }, margin: [3, 5, 3, 5], rowH: o.rowH || rh, autoPage: false });
}
function stat(s, x, y, w, h, big, label, o = {}) {
  card(s, x, y, w, h, { stripeColor: o.color });
  txt(s, big, { x: x + 0.15, y: y + 0.08, w: w - 0.25, h: 0.6, fontFace: HF, fontSize: o.size || 26, bold: true, color: o.color === K.navy ? K.navy : K.ink, valign: "middle" });
  txt(s, label, { x: x + 0.15, y: y + 0.66, w: w - 0.25, h: h - 0.72, fontSize: 10.5, color: K.muted });
}
function statRow(s, stats, y = 1.3, h = 1.2) {
  const n = stats.length, gap = 0.15, w = (8.93 - gap * (n - 1)) / n;
  stats.forEach((st, i) => stat(s, 0.55 + i * (w + gap), y, w, h, st[0], st[1], st[2] || {}));
}
function cardsGrid(s, items, o = {}) {
  const cols = o.cols || 3, rowsN = Math.ceil(items.length / cols), gap = 0.15;
  const x0 = o.x ?? 0.55, y0 = o.y ?? 1.3, W = o.w ?? 8.93, Ht = o.h ?? 3.6;
  const w = (W - gap * (cols - 1)) / cols, h = (Ht - gap * (rowsN - 1)) / rowsN;
  items.forEach((it, i) => {
    const x = x0 + (i % cols) * (w + gap), y = y0 + Math.floor(i / cols) * (h + gap);
    card(s, x, y, w, h, { stripeColor: it.color });
    let yy = y + 0.1;
    if (it.chip) { chip(s, it.chip, x + w - (it.chipW || 1.0) - 0.12, y + 0.12, it.chipW || 1.0, it.chipColor); }
    txt(s, it.t, { x: x + 0.18, y: yy, w: w - 0.3 - (it.chip ? (it.chipW || 1.0) : 0), h: 0.3, fontSize: (o.tSize || 11.5) + (h >= 1.6 ? 0.5 : 0), bold: true, color: K.navy, valign: "middle" });
    txt(s, it.d, { x: x + 0.18, y: yy + 0.36, w: w - 0.3, h: h - 0.48, fontSize: (o.dSize || 10.5) + (h >= 1.6 ? 1 : 0), color: K.text });
  });
}
function flow(s, steps, o = {}) {
  const n = steps.length, gap = 0.22, x0 = o.x ?? 0.55, W = o.w ?? 8.93, y = o.y ?? 1.3, h = o.h ?? 1.25;
  const w = (W - gap * (n - 1)) / n;
  steps.forEach((st, i) => {
    const x = x0 + i * (w + gap);
    card(s, x, y, w, h, { stripe: false, fill: i === (o.hi ?? -1) ? K.orangeSoft : K.white });
    chip(s, st.n || String(i + 1), x + 0.12, y + 0.12, 0.34, i === (o.hi ?? -1) ? K.orange : K.navy);
    txt(s, st.t, { x: x + 0.12, y: y + 0.42, w: w - 0.22, h: 0.3, fontSize: 11.5, bold: true, color: K.navy });
    txt(s, st.d, { x: x + 0.12, y: y + 0.74, w: w - 0.22, h: h - 0.8, fontSize: h >= 1.4 ? 10.5 : 10, color: K.text });
    if (i < n - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w + 0.03, y: y + h / 2 - 0.08, w: 0.16, h: 0.16, fill: { color: K.orange }, line: { color: K.orange, width: 0 } });
  });
}
function divider(num, k, title, items, line) {
  const s = newSlide("SEPARADOR");
  txt(s, num, { x: 0.45, y: 0.9, w: 3.4, h: 2.6, fontFace: HF, fontSize: num.length > 2 ? 72 : 130, bold: true, color: K.orange, valign: "middle" });
  txt(s, k.toUpperCase(), { x: 3.95, y: 1.55, w: 5.6, h: 0.35, fontSize: 12, bold: true, color: K.ice, charSpacing: 2, valign: "middle" });
  s.addText(title, { placeholder: "title" });
  bullets(s, items, 3.98, 3.2, 5.45, 1.8, { size: 12, extra: { color: K.ice } });
  txt(s, line, { x: 0.55, y: 5.12, w: 7, h: 0.3, fontSize: 9.5, color: K.ice });
  return s;
}
function chartOpts(o) {
  return Object.assign({
    fontFace: BF, catAxisLabelColor: K.muted, valAxisLabelColor: K.muted, catAxisLabelFontFace: BF, valAxisLabelFontFace: BF,
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 9, dataLabelFontFace: BF, dataLabelFontSize: 10, dataLabelColor: K.text,
    valGridLine: { color: "E6E9EF", size: 0.5 }, catGridLine: { style: "none" }, showValue: true,
    titleFontFace: BF, titleFontSize: 10, titleColor: K.navy, showLegend: false, chartColors: [K.navy, K.orange, K.muted, K.ice],
  }, o.barDir === "bar" && !o.catAxisOrientation ? { catAxisOrientation: "maxMin", valAxisOrientation: "minMax" } : {}, o);
}

module.exports = { pres, K, HF, BF, THEME, IMG, FIG, addSection, newSlide, txt, card, cardHead, bullets, kicker, note, chip, content, fitImage, imageCard, table, stat, statRow, cardsGrid, flow, divider, chartOpts };
