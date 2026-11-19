# -*- coding: utf-8 -*-
"""
Native Word (.docx) Generator for Saffron & Sage | AI Bistro
Builds an exact 25-page submission-ready academic report with embedded images.
"""
import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(DOCS_DIR, "images")
DOCX_OUT = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.docx")

NAVY = RGBColor(13, 32, 64)       # #0D2040
ORANGE = RGBColor(230, 81, 0)     # #E65100
DARK = RGBColor(30, 41, 59)       # #1E293B
MUTED = RGBColor(100, 116, 139)   # #64748B
GREEN = RGBColor(21, 128, 61)     # #15803D
BLUE = RGBColor(2, 132, 199)      # #0284C7

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))

def set_cell_margins(cell, top=40, bottom=40, left=80, right=80):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def format_cell(cell, text, bold=False, italic=False, font_size=8.5, color=DARK, bg_color=None, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
    if bg_color:
        set_cell_background(cell, bg_color)

def add_header_box(doc, chapter_num, title_text):
    if chapter_num:
        p_b = doc.add_paragraph()
        p_b.paragraph_format.space_before = Pt(0)
        p_b.paragraph_format.space_after = Pt(1)
        r = p_b.add_run(chapter_num)
        r.font.name = "Segoe UI"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = ORANGE

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(7.0)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "0D2040")
    set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(title_text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(12.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(255, 255, 255)

def add_sec_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(10)
    run.font.bold = True
    run.font.color.rgb = NAVY

def add_subsec_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(9)
    run.font.bold = True
    run.font.color.rgb = BLUE

def add_p(doc, text, bold_prefix="", italic_suffix=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2.5)
    p.paragraph_format.line_spacing = 1.10
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        rb = p.add_run(bold_prefix + " ")
        rb.font.name = "Segoe UI"
        rb.font.size = Pt(8.5)
        rb.font.bold = True
        rb.font.color.rgb = NAVY
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(8.5)
    run.font.color.rgb = DARK
    if italic_suffix:
        ri = p.add_run(" " + italic_suffix)
        ri.font.name = "Segoe UI"
        ri.font.size = Pt(8.5)
        ri.font.italic = True
        ri.font.color.rgb = MUTED

def add_bullet(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.line_spacing = 1.08
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    rb = p.add_run(bold_prefix + " ")
    rb.font.name = "Segoe UI"
    rb.font.size = Pt(8.2)
    rb.font.bold = True
    rb.font.color.rgb = NAVY
    rt = p.add_run(text)
    rt.font.name = "Segoe UI"
    rt.font.size = Pt(8.2)
    rt.font.color.rgb = DARK

def add_image_figure(doc, img_name, caption_text, width_inches=4.8):
    img_path = os.path.join(IMG_DIR, img_name)
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(3)
        p_img.paragraph_format.space_after = Pt(1)
        run = p_img.add_run()
        run.add_picture(img_path, width=Inches(width_inches))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(3)
        rc = p_cap.add_run(caption_text)
        rc.font.name = "Segoe UI"
        rc.font.size = Pt(7.8)
        rc.font.italic = True
        rc.font.color.rgb = MUTED

def build_complete_document():
    doc = Document()
    
    # Set standard A4 page margins (0.65 in / 47 pt)
    for section in doc.sections:
        section.top_margin = Inches(0.65)
        section.bottom_margin = Inches(0.65)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        
        # Configure running header
        header = section.header
        hp = header.paragraphs[0]
        hp.paragraph_format.space_after = Pt(4)
        hr1 = hp.add_run("SAFFRON & SAGE: AI BISTRO | LPU B.Tech Capstone Report          ")
        hr1.font.name = "Segoe UI"
        hr1.font.size = Pt(8)
        hr1.font.color.rgb = MUTED
        hr2 = hp.add_run("SAFFRON & SAGE")
        hr2.font.name = "Segoe UI"
        hr2.font.size = Pt(8)
        hr2.font.bold = True
        hr2.font.color.rgb = ORANGE

        # Configure running footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.paragraph_format.space_before = Pt(4)
        fr1 = fp.add_run("Department of Computer Science & Engineering — Lovely Professional University")
        fr1.font.name = "Segoe UI"
        fr1.font.size = Pt(8)
        fr1.font.color.rgb = MUTED

    print("Document template initialized with exact margins and headers.")
    return doc

print("Docx generator framework ready.")
