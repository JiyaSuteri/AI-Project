# -*- coding: utf-8 -*-
"""
Build Complete 25-Page Academic Project Report
For: Saffron & Sage | AI Bistro
Student: Jiya Suteri
University: Lovely Professional University
"""
import os
import sys
import subprocess

DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
HTML_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.html")
PDF_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.pdf")
DOCX_PATH = os.path.join(DOCS_DIR, "SAFFRON_SAGE_MAJOR_PROJECT_REPORT.docx")

def build_html():
    pages = []

    # Common HTML header
    html_start = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Saffron &amp; Sage | AI Bistro - Capstone Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #E2E8F0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1E293B;
    font-size: 11px;
    line-height: 1.52;
  }
  .report-page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    margin: 0 auto;
    background: #FFFFFF;
    position: relative;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  @media screen {
    .report-page {
      margin: 20px auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
    }
  }
  .running-header {
    background-color: #0D2040;
    color: #FFFFFF;
    padding: 8px 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-bottom: 3.5px solid #E65100;
  }
  .running-header .brand-title { color: #FFFFFF; }
  .running-header .brand-badge { color: #FF7043; font-weight: 800; letter-spacing: 1px; }

  .page-content {
    flex: 1;
    padding: 22px 38px 14px 38px;
    display: flex;
    flex-direction: column;
  }
  .running-footer {
    padding: 7px 38px 12px 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #64748B;
    border-top: 1px solid #E2E8F0;
    margin-top: auto;
  }
  .running-footer .page-number { font-weight: 700; color: #0D2040; }

  .chapter-badge {
    color: #E65100;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }
  .chapter-header-box {
    background-color: #0D2040;
    color: #FFFFFF;
    padding: 10px 16px;
    border-radius: 4px;
    border-left: 6px solid #E65100;
    margin-bottom: 12px;
  }
  .chapter-header-box h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .sec-heading {
    color: #0D2040;
    font-size: 13px;
    font-weight: 800;
    margin-top: 9px;
    margin-bottom: 5px;
    border-left: 3.5px solid #E65100;
    padding-left: 8px;
  }
  .subsec-heading {
    color: #1E3A8A;
    font-size: 11px;
    font-weight: 700;
    margin-top: 6px;
    margin-bottom: 3px;
  }

  p { margin: 0 0 6px 0; text-align: justify; }
  ul, ol { margin: 0 0 6px 0; padding-left: 17px; }
  li { margin-bottom: 2.5px; text-align: justify; }

  table.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5px;
    margin-top: 5px;
    margin-bottom: 7px;
    background: #FFFFFF;
  }
  table.report-table th {
    background-color: #0D2040;
    color: #FFFFFF;
    font-weight: 700;
    padding: 5px 8px;
    text-align: left;
    border: 1px solid #0D2040;
  }
  table.report-table td {
    padding: 4.5px 8px;
    border: 1px solid #E2E8F0;
    color: #1E293B;
  }
  table.report-table tr:nth-child(even) td { background-color: #F8FAFC; }

  .info-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 5px;
    padding: 8px 12px;
    margin-bottom: 7px;
  }
  .highlight-card {
    background: #FFF7ED;
    border: 1px solid #FFEDD5;
    border-left: 4px solid #E65100;
    border-radius: 4px;
    padding: 7px 11px;
    margin-bottom: 7px;
    font-size: 10px;
  }
  .metric-card {
    background: #F0FDF4;
    border: 1px solid #DCFCE7;
    border-left: 4px solid #10B981;
    border-radius: 4px;
    padding: 7px 11px;
    margin-bottom: 7px;
    font-size: 10px;
  }
  .badge-pass {
    background-color: #DCFCE7;
    color: #15803D;
    font-weight: 700;
    padding: 1.5px 6px;
    border-radius: 10px;
    font-size: 8.5px;
    display: inline-block;
  }
  .badge-code {
    background-color: #F1F5F9;
    color: #0F172A;
    font-family: monospace;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 9px;
  }
  .badge-num {
    background-color: #0D2040;
    color: #FFFFFF;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 9.5px;
    margin-right: 7px;
    flex-shrink: 0;
  }
  pre.code-block {
    background-color: #0F172A;
    color: #E2E8F0;
    padding: 7px 10px;
    border-radius: 4px;
    font-size: 9px;
    font-family: Consolas, "Courier New", monospace;
    overflow-x: hidden;
    margin: 4px 0 7px 0;
    line-height: 1.35;
  }
  .fig-caption {
    font-size: 9px;
    color: #64748B;
    font-style: italic;
    text-align: center;
    margin-top: 3px;
    margin-bottom: 6px;
  }
  .table-caption {
    font-size: 9px;
    color: #64748B;
    font-style: italic;
    text-align: center;
    margin-top: 3px;
    margin-bottom: 5px;
  }
  .math-box {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 4px;
    padding: 6px 10px;
    text-align: center;
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 11px;
    font-style: italic;
    margin: 5px 0;
    color: #0D2040;
  }
  .grid-2col { display: flex; gap: 10px; }
  .grid-2col > div { flex: 1; }
  .grid-3col { display: flex; gap: 8px; }
  .grid-3col > div { flex: 1; }
</style>
</head>
<body>
"""

    return html_start

print("Builder base prepared.")
