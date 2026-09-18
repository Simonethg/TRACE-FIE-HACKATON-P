from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
root = Path(__file__).resolve().parents[1]
output = root / 'out' / 'TRACE-deck.pdf'
pdf = canvas.Canvas(str(output), pagesize=(960, 540), pageCompression=1)
pdf.setTitle('TRACE - Ver el recorrido. Entender la conexión.')
pdf.setAuthor('TRACE')
pdf.setSubject('Pitch de hackatón: prototipo visual con datos simulados. Fuentes y guion en TRACE-guion.txt.')
for number in range(1, 10):
    path = root / 'out' / f'slide-{number:02d}.png'
    if not path.exists():
        raise FileNotFoundError(path)
    pdf.drawImage(ImageReader(str(path)), 0, 0, width=960, height=540)
    pdf.bookmarkPage(f'slide-{number}')
    pdf.addOutlineEntry(f'TRACE - Escena {number}', f'slide-{number}', 0)
    pdf.linkURL('https://github.com/mindsetwhite/TRACE-FIE-HACKATON-P', (45, 12, 230, 36), relative=0)
    pdf.showPage()
pdf.save()
print(output)
