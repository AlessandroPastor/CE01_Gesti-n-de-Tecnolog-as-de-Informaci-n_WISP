---
name: revisar-latex
description: Usar cuando el usuario quiera revisar, compilar o corregir su documento LaTeX. Compila main.tex, detecta errores de compilación y revisa consistencia de la redacción, referencias, tablas y figuras.
---

# Revisión de documento LaTeX

## Instrucciones

1. Compila el documento con `latexmk -pdf -interaction=nonstopmode main.tex`.
2. Revisa el log en busca de errores y warnings (referencias rotas, 
   overfull hbox, citas sin resolver).
3. Revisa el contenido: coherencia de la redacción, tablas bien 
   formadas, figuras referenciadas en el texto.
4. Reporta los problemas encontrados de forma clara y, si el usuario 
   lo pide, corrígelos.