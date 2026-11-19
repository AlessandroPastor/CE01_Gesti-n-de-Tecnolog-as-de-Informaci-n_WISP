"""Recorta figuras TikZ del PDF ubicando su pie ("Figura X.Y:") y uniendo los trazos encima."""
import sys, os, pymupdf

PDF = r"C:\Users\USER\Documents\ProyectoEPE\TI\main.pdf"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fig")
os.makedirs(OUT, exist_ok=True)
GAP = float(os.environ.get("GAP", "28"))
FIGS = sys.argv[1:]

doc = pymupdf.open(PDF)
for fig in FIGS:
    clave = f"Figura {fig}:"
    hecho = False
    for pno in range(len(doc)):
        page = doc[pno]
        hits = page.search_for(clave)
        if not hits:
            continue
        cap = hits[0]
        # bloques de texto de cuerpo (fuera de la figura) encima del pie, para acotar
        rects = [d["rect"] for d in page.get_drawings() if d["rect"].y1 <= cap.y0 + 1 and d["rect"].width < page.rect.width * 0.98]
        rects += [page.get_image_bbox(i) for i in page.get_images(full=True)] if page.get_images() else []
        rects = [r for r in rects if r.y1 <= cap.y0 + 1 and r.y0 > 50 and r.height < 700]
        if not rects:
            continue
        rects.sort(key=lambda r: -r.y1)
        box = pymupdf.Rect(rects[0])
        for r in rects[1:]:
            if r.y1 >= box.y0 - GAP:
                box |= r
        box = pymupdf.Rect(box.x0 - 4, box.y0 - 4, box.x1 + 4, box.y1 + 4) & page.rect
        pix = page.get_pixmap(matrix=pymupdf.Matrix(4, 4), clip=box, alpha=False)
        nombre = os.path.join(OUT, f"f{fig.replace('.', '_')}.png")
        pix.save(nombre)
        print("ok", fig, "pág", pno + 1, f"{box.width:.0f}x{box.height:.0f}pt")
        hecho = True
        break
    if not hecho:
        print("NO", fig)
