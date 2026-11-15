# -*- coding: utf-8 -*-
"""
Assemble and compile 25-page report into HTML, PDF, and DOCX
"""
import os
import subprocess
from pages_1_to_8 import get_pages_1_to_8
from pages_9_to_16 import get_pages_9_to_16
from pages_17_to_25 import get_pages_17_to_25

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.html")
PDF_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.pdf")
DOCX_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.docx")

def generate_html():
    from build_report_files import build_html
    header = build_html()
    p1_8 = get_pages_1_to_8()
    p9_16 = get_pages_9_to_16()
    p17_25 = get_pages_17_to_25()

    full_html = header + p1_8 + p9_16 + p17_25
    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"Generated HTML report at: {HTML_PATH} (Length: {len(full_html)} chars)")
    return HTML_PATH

def generate_pdf():
    edge_bin = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not os.path.exists(edge_bin):
        print("Edge binary not found at default path, trying alternate...")
        edge_bin = "msedge.exe"

    cmd = [
        edge_bin,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_PATH}",
        HTML_PATH
    ]
    print(f"Executing: {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(PDF_PATH):
        print(f"Successfully created PDF: {PDF_PATH} ({os.path.getsize(PDF_PATH)} bytes)")
    else:
        print(f"PDF creation failed: {res.stderr}")

if __name__ == "__main__":
    generate_html()
    generate_pdf()
