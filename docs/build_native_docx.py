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

# Brand colors
NAVY = RGBColor(13, 32, 64)       # #0D2040
ORANGE = RGBColor(230, 81, 0)     # #E65100
DARK = RGBColor(30, 41, 59)       # #1E293B
MUTED = RGBColor(100, 116, 139)   # #64748B
GREEN = RGBColor(21, 128, 61)     # #15803D
BLUE = RGBColor(2, 132, 199)      # #0284C7

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))

def set_table_borders(table, hex_color="E2E8F0"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="{hex_color}"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{hex_color}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{hex_color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def format_cell(cell, text, bold=False, italic=False, font_size=9, color=DARK, bg_color=None, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    if bg_color:
        set_cell_background(cell, bg_color)

def add_header_box(doc, chapter_num, title_text):
    if chapter_num:
        p_badge = doc.add_paragraph()
        p_badge.paragraph_format.space_before = Pt(4)
        p_badge.paragraph_format.space_after = Pt(1)
        r_b = p_badge.add_run(chapter_num)
        r_b.font.name = "Segoe UI"
        r_b.font.size = Pt(9.5)
        r_b.font.bold = True
        r_b.font.color.rgb = ORANGE

    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.8)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "0D2040")
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(title_text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(255, 255, 255)
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(3)

def add_sec_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = NAVY

def add_subsec_heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(10)
    run.font.bold = True
    run.font.color.rgb = BLUE

def add_p(doc, text, bold_prefix="", italic_suffix=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.font.name = "Segoe UI"
        r_b.font.size = Pt(9.5)
        r_b.font.bold = True
        r_b.font.color.rgb = NAVY
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(9.5)
    run.font.color.rgb = DARK
    if italic_suffix:
        r_i = p.add_run(italic_suffix)
        r_i.font.name = "Segoe UI"
        r_i.font.size = Pt(9.5)
        r_i.font.italic = True
        r_i.font.color.rgb = MUTED

def add_bullet(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2.5)
    p.paragraph_format.line_spacing = 1.12
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_b = p.add_run(bold_prefix + " ")
    r_b.font.name = "Segoe UI"
    r_b.font.size = Pt(9)
    r_b.font.bold = True
    r_b.font.color.rgb = NAVY
    r_t = p.add_run(text)
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(9)
    r_t.font.color.rgb = DARK

def add_callout(doc, title, text, bg_color="F8FAFC", border_color="0D2040"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.columns[0].width = Inches(6.8)
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_color)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.12
    r_t = p.add_run(title + "\n")
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(9.5)
    r_t.font.bold = True
    r_t.font.color.rgb = NAVY
    r_b = p.add_run(text)
    r_b.font.name = "Segoe UI"
    r_b.font.size = Pt(9)
    r_b.font.color.rgb = DARK

def add_image_figure(doc, img_name, caption_text, width_inches=5.8):
    img_path = os.path.join(IMG_DIR, img_name)
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(2)
        run = p_img.add_run()
        run.add_picture(img_path, width=Inches(width_inches))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(6)
        r_c = p_cap.add_run(caption_text)
        r_c.font.name = "Segoe UI"
        r_c.font.size = Pt(8.5)
        r_c.font.italic = True
        r_c.font.color.rgb = MUTED

print("Word Generator Helpers defined.")
