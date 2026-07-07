---
name: caratula-profesional
description: Usar cuando el usuario quiera crear, mejorar o rediseñar la carátula o portada de un documento LaTeX académico o profesional. Cubre jerarquía visual, logo institucional, datos del autor, espaciado y estilo formal para trabajos universitarios (tesis, entregables, informes).
---

# Carátula profesional para documentos LaTeX

## Objetivo
Producir una portada institucional limpia, jerárquica y profesional,
adecuada para un entregable universitario.

## Elementos obligatorios (de arriba hacia abajo)
1. Logo de la institución centrado (usar \includegraphics, alto ~2.5cm).
2. Nombre de la universidad en mayúsculas, negrita, tamaño grande.
3. Facultad / Escuela profesional, un tamaño menor.
4. Título del trabajo: el elemento más prominente, centrado, negrita,
   con espacio en blanco generoso alrededor.
5. Subtítulo o línea (ej. nombre de la empresa caso de estudio).
6. Datos del autor / autores (nombres completos).
7. Docente / asesor.
8. Curso o línea de investigación.
9. Lugar y fecha al pie (ciudad, país, año).

## Reglas de diseño
- Usar `\begin{titlepage}` para aislar la portada del resto del documento.
- Jerarquía por tamaño: título > universidad > facultad > datos.
  No uses más de 3 o 4 tamaños de fuente distintos.
- Centrado con `\centering`; separa bloques con `\vspace` y `\vfill`
  en lugar de saltos de línea múltiples.
- Deja respirar el título: bastante espacio en blanco arriba y abajo.
- Nada de subrayados decorativos ni colores estridentes. Formal y sobrio.
- Si hay logo, verifica que el archivo exista antes de compilar.

## Plantilla base sugerida
\begin{titlepage}
    \centering
    \includegraphics[height=2.5cm]{logo-upeu.png}\par
    \vspace{1cm}
    {\LARGE\textbf{UNIVERSIDAD PERUANA UNIÓN}\par}
    \vspace{0.3cm}
    {\large Facultad de Ingeniería y Arquitectura\par}
    {\large Escuela Profesional de Ingeniería de Sistemas\par}
    \vfill
    {\Huge\textbf{Título del trabajo}\par}
    \vspace{0.5cm}
    {\Large Empresa caso de estudio: WISP\par}
    \vfill
    {\large\textbf{Autor(es):}\par Nombre Apellido\par}
    \vspace{0.5cm}
    {\large\textbf{Docente:}\par Nombre del asesor\par}
    \vspace{0.5cm}
    {\large Curso / Línea: Gestión de Tecnologías de Información\par}
    \vfill
    {\large Juliaca, Puno – Perú\par 2026\par}
\end{titlepage}

## Antes de terminar
- Compila y confirma que la portada ocupe exactamente una página.
- Revisa que ningún bloque quede pegado al borde ni demasiado apretado.
- Verifica que los datos (nombres, curso, fecha) coincidan con los del
  resto del documento.