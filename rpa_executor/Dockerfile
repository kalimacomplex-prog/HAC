FROM mcr.microsoft.com/playwright/python:v1.47.0-jammy

WORKDIR /app

# A imagem base só traz o necessário pro Chromium/Firefox/WebKit — este
# executor roda qualquer script de RPA de tenant (não só os que usam
# browser), precisa dos binários que algumas libs do requirements.txt
# chamam por fora do Python:
#   tesseract-ocr(+por) -> pytesseract (OCR, com idioma português)
#   poppler-utils       -> pdf2image (rasteriza PDF em imagem)
#   libzbar0            -> pyzbar (leitura de código de barras/QR)
#   ffmpeg              -> ffmpeg-python
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr tesseract-ocr-por \
    poppler-utils \
    libzbar0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
