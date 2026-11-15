# -*- coding: utf-8 -*-
"""
HTML Report Generator for Saffron & Sage | AI Bistro
Matches LPU Capstone Project Report Reference Formatting (25 Pages)
"""
import os
import subprocess

def get_html_report():
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Saffron & Sage | AI Bistro - Capstone Project Report</title>
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
    line-height: 1.55;
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

  /* Screen preview margin */
  @media screen {
    .report-page {
      margin: 20px auto;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
  }

  /* Running Header */
  .running-header {
    background-color: #0D2040;
    color: #FFFFFF;
    padding: 9px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-bottom: 3.5px solid #E65100;
  }
  .running-header .brand-title {
    color: #FFFFFF;
  }
  .running-header .brand-badge {
    color: #FF7043;
    font-weight: 800;
    letter-spacing: 1px;
  }

  /* Page Content Container */
  .page-content {
    flex: 1;
    padding: 24px 42px 16px 42px;
    display: flex;
    flex-direction: column;
  }

  /* Running Footer */
  .running-footer {
    padding: 8px 42px 14px 42px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #64748B;
    border-top: 1px solid #E2E8F0;
    margin-top: auto;
  }
  .running-footer .page-number {
    font-weight: 700;
    color: #0D2040;
  }

  /* Chapter Title Header Box */
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
    padding: 11px 18px;
    border-radius: 4px;
    border-left: 6px solid #E65100;
    margin-bottom: 14px;
  }
  .chapter-header-box h1 {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  /* Section Headings */
  .sec-heading {
    color: #0D2040;
    font-size: 13.5px;
    font-weight: 800;
    margin-top: 10px;
    margin-bottom: 6px;
    border-left: 4px solid #E65100;
    padding-left: 8px;
    display: flex;
    align-items: center;
  }
  .subsec-heading {
    color: #1E3A8A;
    font-size: 11.5px;
    font-weight: 700;
    margin-top: 7px;
    margin-bottom: 4px;
  }

  p {
    margin: 0 0 7px 0;
    text-align: justify;
  }
  ul, ol {
    margin: 0 0 7px 0;
    padding-left: 18px;
  }
  li {
    margin-bottom: 3px;
  }

  /* Tables */
  table.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
    margin-top: 6px;
    margin-bottom: 8px;
    background: #FFFFFF;
  }
  table.report-table th {
    background-color: #0D2040;
    color: #FFFFFF;
    font-weight: 700;
    padding: 6px 8px;
    text-align: left;
    border: 1px solid #0D2040;
  }
  table.report-table td {
    padding: 5px 8px;
    border: 1px solid #E2E8F0;
    color: #1E293B;
  }
  table.report-table tr:nth-child(even) td {
    background-color: #F8FAFC;
  }
  table.report-table tr:hover td {
    background-color: #F1F5F9;
  }

  /* Cards and Boxes */
  .info-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 8px;
  }
  .highlight-card {
    background: #FFF7ED;
    border: 1px solid #FFEDD5;
    border-left: 4px solid #E65100;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 8px;
    font-size: 10.5px;
  }
  .metric-card {
    background: #F0FDF4;
    border: 1px solid #DCFCE7;
    border-left: 4px solid #10B981;
    border-radius: 4px;
    padding: 8px 12px;
    margin-bottom: 8px;
    font-size: 10.5px;
  }

  /* Badges & Pills */
  .badge-pass {
    background-color: #DCFCE7;
    color: #15803D;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 12px;
    font-size: 9px;
    display: inline-block;
  }
  .badge-code {
    background-color: #F1F5F9;
    color: #0F172A;
    font-family: monospace;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 9.5px;
  }
  .badge-num {
    background-color: #0D2040;
    color: #FFFFFF;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 10px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  /* Code blocks */
  pre.code-block {
    background-color: #0F172A;
    color: #E2E8F0;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 9.5px;
    font-family: Consolas, "Courier New", monospace;
    overflow-x: hidden;
    margin: 5px 0 8px 0;
    line-height: 1.4;
  }

  /* Captions */
  .fig-caption {
    font-size: 9.5px;
    color: #64748B;
    font-style: italic;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 8px;
  }
  .table-caption {
    font-size: 9.5px;
    color: #64748B;
    font-style: italic;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 6px;
  }

  /* Math formulas */
  .math-box {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 4px;
    padding: 7px 12px;
    text-align: center;
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 11.5px;
    font-style: italic;
    margin: 6px 0;
    color: #0D2040;
  }

  /* Flex row layout */
  .grid-2col {
    display: flex;
    gap: 12px;
  }
  .grid-2col > div {
    flex: 1;
  }
  .grid-3col {
    display: flex;
    gap: 10px;
  }
  .grid-3col > div {
    flex: 1;
  }
</style>
</head>
<body>
"""

print("Generator module loaded successfully.")
