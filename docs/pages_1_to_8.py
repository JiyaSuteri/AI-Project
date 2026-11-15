# -*- coding: utf-8 -*-
"""
Pages 1 to 8: Cover, Matrix, Declaration, Acknowledgements, Abstract, TOC, List of Tables, List of Figures
"""

def get_pages_1_to_8():
    return """
<!-- PAGE 1: COVER PAGE -->
<div class="report-page" style="padding: 38px 45px 35px 45px; justify-content: space-between;">
  <div style="text-align: center;">
    <div style="font-size: 20px; font-weight: 900; color: #0D2040; letter-spacing: 0.8px; margin-bottom: 4px;">LOVELY PROFESSIONAL UNIVERSITY</div>
    <div style="font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING</div>
    <div style="font-size: 10.5px; font-weight: 600; color: #475569; text-transform: uppercase; margin-bottom: 6px;">SCHOOL OF COMPUTER SCIENCE &amp; ENGINEERING</div>
    <div style="font-size: 12px; font-weight: 700; color: #D9531E; font-style: italic; margin-bottom: 18px;">Transforming Education, Transforming India</div>

    <div style="display: inline-block; background: #FFF7ED; border: 1.5px solid #FFEDD5; border-radius: 4px; padding: 4px 18px; margin-bottom: 14px;">
      <span style="font-size: 10.5px; font-weight: 800; color: #E65100; letter-spacing: 1px; text-transform: uppercase;">CAPSTONE PROJECT REPORT</span>
    </div>

    <div style="font-size: 23px; font-weight: 900; color: #0D2040; line-height: 1.25; margin-bottom: 10px; letter-spacing: -0.3px;">
      SAFFRON &amp; SAGE:<br>
      <span style="font-size: 17px; font-weight: 800; color: #D9531E;">AI-BASED RESTAURANT TABLE ALLOCATION &amp; DISCRETE-EVENT SERVICE PLANNER</span>
    </div>

    <div style="font-size: 11.5px; font-style: italic; color: #475569; max-width: 580px; margin: 0 auto 18px auto; line-height: 1.45;">
      An Autonomous Multi-Agent Dining Operations Platform with Classical State-Space Search Optimization, Grounded RAG Intelligence, and Real-Time Workload Balancing
    </div>

    <div style="font-size: 10.5px; color: #475569; margin-bottom: 18px;">
      Submitted in partial fulfillment of the requirements for the award of the degree of<br>
      <strong style="color: #0D2040; font-size: 11.5px;">BACHELOR OF TECHNOLOGY IN COMPUTER SCIENCE &amp; ENGINEERING</strong><br>
      <span style="font-size: 10px; color: #64748B;">(Specialization in Artificial Intelligence &amp; Machine Learning)</span>
    </div>
  </div>

  <!-- Dual Column Student & Faculty Box -->
  <div style="display: flex; border: 1.5px solid #0D2040; border-radius: 4px; overflow: hidden; margin-bottom: 16px;">
    <div style="flex: 1; border-right: 1.5px solid #0D2040;">
      <div style="background: #0D2040; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 6px 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        SUBMITTED BY (STUDENT)
      </div>
      <div style="padding: 12px 14px; background: #FFFFFF;">
        <div style="font-size: 12px; font-weight: 800; color: #0D2040;">1. Jiya Suteri</div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">Registration No. [Registration Number — REQUIRED]</div>
        <div style="font-size: 9.5px; color: #64748B; margin-top: 1px;">B.Tech CSE (AI &amp; ML), Section: CSE276</div>
      </div>
    </div>
    <div style="flex: 1;">
      <div style="background: #0D2040; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 6px 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        SUPERVISED BY (FACULTY MENTOR)
      </div>
      <div style="padding: 12px 14px; background: #FFFFFF;">
        <div style="font-size: 12px; font-weight: 800; color: #0D2040;">[Faculty Mentor Name — REQUIRED]</div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">Assistant Professor</div>
        <div style="font-size: 9.5px; color: #64748B; margin-top: 1px;">Department of Computer Science &amp; Engineering</div>
        <div style="font-size: 9.5px; color: #64748B;">Lovely Professional University</div>
      </div>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 14px;">
    <div style="font-size: 10.5px; font-weight: 800; color: #0D2040; text-transform: uppercase;">DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING</div>
    <div style="font-size: 10px; color: #475569;">LOVELY PROFESSIONAL UNIVERSITY, PUNJAB, INDIA</div>
    <div style="display: flex; justify-content: center; gap: 40px; margin-top: 8px;">
      <div>
        <div style="font-size: 9.5px; font-weight: 800; color: #E65100; text-transform: uppercase;">ACADEMIC SESSION</div>
        <div style="font-size: 10px; font-weight: 700; color: #0D2040;">2025 – 2026</div>
      </div>
      <div>
        <div style="font-size: 9.5px; font-weight: 800; color: #E65100; text-transform: uppercase;">DATE OF SUBMISSION</div>
        <div style="font-size: 10px; font-weight: 700; color: #0D2040;">NOVEMBER 2026</div>
      </div>
    </div>
  </div>

  <!-- Supervision Card -->
  <div style="background: #FFF7ED; border-left: 4.5px solid #E65100; padding: 8px 14px; border-radius: 3px;">
    <div style="font-size: 10.5px; font-weight: 800; color: #9A3412;">Project Supervision &amp; Faculty Guidance</div>
    <div style="font-size: 9.5px; color: #475569; margin-top: 2px;">
      <strong>[Faculty Mentor Name — REQUIRED]</strong>, Assistant Professor<br>
      Department of Computer Science &amp; Engineering, School of Computer Science &amp; Engineering<br>
      Lovely Professional University, Punjab, India
    </div>
  </div>
</div>

<!-- PAGE 2: STUDENT ROLE & TECHNICAL SPECIALIZATION MATRIX -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>STUDENT ROLE &amp; TECHNICAL SPECIALIZATION MATRIX</h1>
    </div>

    <table class="report-table" style="margin-top: 8px;">
      <thead>
        <tr>
          <th style="width: 5%;">S.No.</th>
          <th style="width: 17%;">Student Name</th>
          <th style="width: 17%;">Registration Number</th>
          <th style="width: 61%;">Role &amp; Technical Specialization</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center; font-weight: 800; color: #E65100; font-size: 13px; vertical-align: top;">1</td>
          <td style="font-weight: 800; color: #0D2040; vertical-align: top;">
            Jiya Suteri
          </td>
          <td style="color: #475569; vertical-align: top; font-family: monospace;">
            [Registration Number — REQUIRED]
          </td>
          <td>
            <div style="font-weight: 800; color: #0D2040; margin-bottom: 5px; font-size: 11px;">
              Lead System Architect, AI Optimization Engineer &amp; Full-Stack Developer
            </div>
            <ul style="margin: 0; padding-left: 14px; font-size: 9.5px; line-height: 1.45;">
              <li><strong>Core System Architecture:</strong> Engineered end-to-end decoupled architecture utilizing Python 3.14, FastAPI asynchronous REST gateway, and Pydantic v2 schemas.</li>
              <li><strong>Classical Search Allocation Engines:</strong> Designed and implemented five combinatorial table allocation algorithms: Rule-Based heuristic, Greedy Best-First Search, Breadth-First Search (BFS), Depth-First Search (DFS), and provably optimal A* Search with admissible cost heuristics.</li>
              <li><strong>Multi-Agent Simulation System:</strong> Constructed discrete-event multi-agent simulation framework modeling autonomous interactions between CustomerAgent, TableAgent, WaiterAgent, and ManagerAgent entities.</li>
              <li><strong>Grounded RAG Conversational Assistant:</strong> Developed hybrid conversational AI agent with TF-IDF vector retrieval over markdown restaurant policies, cosine similarity scoring, and Groq LPU inference (<code>openai/gpt-oss-120b</code>) with deterministic zero-hallucination live SQLite fallback.</li>
              <li><strong>Relational Persistence &amp; Integrity:</strong> Formulated normalized SQLite schema via SQLAlchemy 2.0 ORM, establishing strict atomic transactions for table assignments, waiter workload tracking, and customer queue transitions.</li>
              <li><strong>Frontend Presentation Architecture:</strong> Built responsive Single-Page Application (SPA) in React 19, Vite, and Tailwind CSS using a custom Warm Ivory, Sage Green, and Terracotta design system.</li>
              <li><strong>Tactile 2D Dining Floor Plan:</strong> Programmed interactive 2D table layout canvas providing visual real-time occupancy updates, capacity telemetry, and reservation indicators.</li>
              <li><strong>Reservation Seating &amp; Concurrency Guard:</strong> Engineered one-click atomic reservation seating endpoint enforcing strict HTTP 409 Conflict rejection against race conditions and duplicate allocations.</li>
              <li><strong>Automated Quality Assurance:</strong> Authored comprehensive automated test harness comprising 28 passing pytest test cases across agents, algorithms, API contracts, auth, and dashboard telemetry.</li>
              <li><strong>Production Cloud Deployment:</strong> Automated GitHub Actions CI/CD pipeline deploying production build to GitHub Pages and configured cloud container deployment via Render.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="highlight-card" style="margin-top: 10px;">
      <strong style="color: #9A3412;">Engineering Responsibility Summary:</strong>
      All architectural design decisions, mathematical cost function definitions, search algorithms, multi-agent state machines, RAG pipelines, frontend interfaces, REST API contracts, and empirical benchmarks presented in this report represent the sole and original engineering work of the author.
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 2</span>
  </div>
</div>

<!-- PAGE 3: DECLARATION -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>DECLARATION</h1>
    </div>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 16px;">
      I hereby declare that this capstone project report titled <strong>“SAFFRON &amp; SAGE: AI-BASED RESTAURANT TABLE ALLOCATION &amp; DISCRETE-EVENT SERVICE PLANNER”</strong>, submitted in partial fulfillment of the requirements for the award of the degree of <strong>Bachelor of Technology in Computer Science &amp; Engineering</strong> (with specialization in Artificial Intelligence and Machine Learning), is an authentic record of my original research, design, implementation, and empirical evaluation carried out under the academic supervision of <strong>[Faculty Mentor Name — REQUIRED]</strong>, Assistant Professor, Department of Computer Science &amp; Engineering, Lovely Professional University.
    </p>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 24px;">
      The material presented in this document has not been submitted in part or in full to any other University or Institute for the award of any degree or diploma. All software architectures, mathematical formulations, graph optimization algorithms, database schemas, multi-agent discrete-event simulation workflows, and empirical benchmarking documented herein are the result of my original research, implementation, and rigorous engineering.
    </p>

    <div style="border-left: 4px solid #0D2040; background: #F8FAFC; padding: 12px 18px; border-radius: 4px; margin-bottom: 30px;">
      <div style="font-size: 11.5px; font-weight: 800; color: #0D2040; margin-bottom: 10px;">Project Contributor</div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 8px;">
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #0D2040;">1. Jiya Suteri</div>
          <div style="font-size: 10.5px; color: #475569;">(Registration No. [Registration Number — REQUIRED])</div>
        </div>
        <div style="text-align: right; font-size: 10.5px; color: #64748B;">
          Signature: ___________________________________________
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #334155; margin-bottom: 35px; padding: 0 4px;">
      <div><strong>Date:</strong> November 15, 2026</div>
      <div><strong>Place:</strong> Lovely Professional University, Punjab, India</div>
    </div>

    <!-- Faculty Mentor Certification Box -->
    <div style="background: #FFF7ED; border: 1.5px solid #FFEDD5; border-radius: 4px; padding: 14px 18px;">
      <div style="font-size: 10.5px; font-weight: 800; color: #E65100; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
        CERTIFIED BY FACULTY MENTOR
      </div>
      <div style="font-size: 12px; font-weight: 800; color: #0D2040;">[Faculty Mentor Name — REQUIRED]</div>
      <div style="font-size: 10.5px; color: #475569; margin-top: 1px;">Assistant Professor</div>
      <div style="font-size: 10px; color: #64748B;">Department of Computer Science &amp; Engineering</div>
      <div style="font-size: 10px; color: #64748B;">School of Computer Science &amp; Engineering</div>
      <div style="font-size: 10px; color: #64748B;">Lovely Professional University, Punjab, India</div>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 10px; border-top: 1px dashed #CBD5E1;">
        <div style="font-size: 10.5px; color: #475569;">Signature: _________________________________________</div>
        <div style="font-size: 10.5px; color: #475569;">Date: _________________________</div>
      </div>
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 3</span>
  </div>
</div>

<!-- PAGE 4: ACKNOWLEDGEMENTS -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>ACKNOWLEDGEMENTS</h1>
    </div>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 14px;">
      I express my deepest and most sincere gratitude to my esteemed faculty mentor, <strong>[Faculty Mentor Name — REQUIRED]</strong>, Assistant Professor, Department of Computer Science &amp; Engineering, Lovely Professional University, for her invaluable guidance, continuous intellectual mentorship, constructive technical critiques, and steadfast encouragement throughout the ideation, mathematical formulation, architectural design, implementation, and evaluation of this capstone project. Her high standards of software engineering quality and academic rigour have been a constant source of inspiration.
    </p>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 14px;">
      I extend my sincere thanks to the Head of the Department and the academic leadership of the School of Computer Science &amp; Engineering, Lovely Professional University, for providing state-of-the-art computational infrastructure, digital library resources, cloud computing development environments, and an academic culture that fosters ambitious, production-grade engineering innovations.
    </p>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 14px;">
      I also gratefully acknowledge the open-source software engineering and machine learning communities for developing and maintaining the foundational frameworks that powered this work: <strong>FastAPI</strong>, <strong>SQLAlchemy</strong>, <strong>Pydantic v2</strong>, <strong>React 19</strong>, <strong>Vite</strong>, <strong>Tailwind CSS</strong>, <strong>Scikit-Learn</strong>, and <strong>Groq</strong> for providing ultra-high-throughput LPU inference access.
    </p>

    <p style="font-size: 11.5px; line-height: 1.65; margin-bottom: 22px;">
      Finally, I express my profound gratitude to my parents, family, and peers whose unwavering moral support, patience, and encouragement sustained my motivation during late-night debugging marathons and rigorous development sprints.
    </p>

    <div style="text-align: right; font-size: 12px; font-weight: 800; color: #0D2040; margin-bottom: 28px; padding-right: 12px;">
      — Jiya Suteri
    </div>

    <div style="border-top: 1.5px solid #E2E8F0; padding-top: 16px; margin-top: auto;">
      <div style="text-align: center; font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
        OPEN-SOURCE FOUNDATIONS ACKNOWLEDGED
      </div>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
        <span style="background: #0D2040; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">FastAPI</span>
        <span style="background: #0284C7; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">SQLAlchemy</span>
        <span style="background: #EA580C; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">Pydantic v2</span>
        <span style="background: #1E293B; color: #38BDF8; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">React 19</span>
        <span style="background: #7C3AED; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">Vite</span>
        <span style="background: #0EA5E9; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">Tailwind CSS</span>
        <span style="background: #F97316; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">Groq LPU</span>
        <span style="background: #F59E0B; color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 12px;">Scikit-Learn</span>
      </div>
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 4</span>
  </div>
</div>

<!-- PAGE 5: EXECUTIVE SUMMARY / ABSTRACT -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>EXECUTIVE SUMMARY / ABSTRACT</h1>
    </div>

    <p style="font-size: 10.5px; line-height: 1.55; margin-bottom: 8px;">
      In the modern hospitality and food service industry, high-volume dining establishments face intense operational friction. Conventional restaurant management relies heavily on manual host decisions, paper waitlists, and static point-of-sale (POS) systems. This lack of intelligent coordination leads to four pervasive operational failures: <strong>capacity mismatches</strong> (e.g., seating a two-person party at a premium eight-top table), <strong>server workload imbalances</strong> (causing waiter burnout, delayed orders, and degraded service), <strong>excessive customer queue reneging</strong> (guests abandoning lines due to unmanaged wait times), and <strong>uncoordinated reservation hold conflicts</strong>. Furthermore, conventional customer service chatbots deployed across hospitality portals are notoriously brittle—suffering from hallucinations, chain-of-thought leakage, and an inability to interrogate live database records.
    </p>

    <p style="font-size: 10.5px; line-height: 1.55; margin-bottom: 10px;">
      To resolve these systemic challenges, this capstone project presents <strong>SAFFRON &amp; SAGE | AI BISTRO</strong>, an enterprise-grade restaurant table allocation and discrete-event service planning platform. The system unifies classical state-space search algorithms with multi-agent simulation and a grounded Retrieval-Augmented Generation (RAG) assistant. The platform embodies five foundational computational subsystems:
    </p>

    <!-- 5 Numbered Subsystem Badges -->
    <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 10px;">
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">1</span>
        <div>
          <strong style="color: #0D2040; font-size: 10.5px;">Combinatorial Classical Search Optimization Engine</strong><br>
          <span style="font-size: 9.5px; color: #334155;">Implements five state-space allocation algorithms: Rule-Based heuristic, Greedy Best-First Search, Breadth-First Search (BFS), Depth-First Search (DFS), and A* Search. Utilizes a mathematically formulated multi-objective cost function balancing table capacity waste, server workload, customer waiting duration, and special dietary/seating preferences.</span>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">2</span>
        <div>
          <strong style="color: #0D2040; font-size: 10.5px;">Discrete-Event Multi-Agent Simulation Subsystem</strong><br>
          <span style="font-size: 9.5px; color: #334155;">Models dining room operations through communicating rational agents (CustomerAgent, TableAgent, WaiterAgent, ManagerAgent) operating over a verified 5-state Table Finite State Machine (<code class="badge-code">AVAILABLE &rarr; OCCUPIED &rarr; CLEANING &rarr; AVAILABLE</code>). Simulates stochastic customer arrivals, patience thresholds, dining turnover, and busboy sanitization sweeps.</span>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">3</span>
        <div>
          <strong style="color: #0D2040; font-size: 10.5px;">Interactive 2D Tactile Floor Plan Canvas &amp; Telemetry Dashboard</strong><br>
          <span style="font-size: 9.5px; color: #334155;">Constructed with React 19, Vite, and Tailwind CSS using an accessible Warm Ivory, Sage Green, and Terracotta design system. Provides real-time visual occupancy status, server assignment badges, customer waitlist tracking, and dynamic business telemetry with zero layout overlapping across mobile and desktop viewports.</span>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">4</span>
        <div>
          <strong style="color: #0D2040; font-size: 10.5px;">Grounded RAG Conversational AI Assistant &amp; Factuality Shield</strong><br>
          <span style="font-size: 9.5px; color: #334155;">Employs semantic TF-IDF vectorization and cosine similarity over markdown restaurant policies, integrating high-throughput Groq LPU inference (<code>openai/gpt-oss-120b</code>) with deterministic live SQLite tool calling and zero chain-of-thought monologue leakage.</span>
        </div>
      </div>

      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">5</span>
        <div>
          <strong style="color: #0D2040; font-size: 10.5px;">Robust Transactional Relational Backend Architecture</strong><br>
          <span style="font-size: 9.5px; color: #334155;">Engineered with Python 3.14 and FastAPI, exposing 25+ fully verified RESTful endpoints backed by SQLite and SQLAlchemy 2.0 ORM. Enforces atomic reservation seating and strict HTTP 409 Conflict rejection preventing duplicate allocations.</span>
        </div>
      </div>
    </div>

    <!-- Highlight Callout Box -->
    <div class="metric-card" style="margin-top: auto;">
      <strong style="color: #15803D; font-size: 10.5px;">Empirical Verification &amp; Production Deployment Summary:</strong><br>
      Automated benchmarking confirms sub-5 millisecond algorithm execution latency across all 5 search strategies, <strong>100% statement passing (28/28 tests)</strong> across the Pytest test suite, zero chain-of-thought leakage, and guaranteed absence of double-allocation race conditions. The production web application is deployed live to public cloud infrastructure on GitHub Pages with complete containerized FastAPI backend integration.
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 5</span>
  </div>
</div>

<!-- PAGE 6: TABLE OF CONTENTS (PART 1) -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>TABLE OF CONTENTS</h1>
    </div>

    <table style="width: 100%; font-size: 10px; border-collapse: collapse; line-height: 1.8;">
      <tbody>
        <tr>
          <td><strong>Student Role &amp; Technical Specialization Matrix</strong></td>
          <td style="text-align: right; font-family: monospace;">ii</td>
        </tr>
        <tr>
          <td><strong>Declaration</strong></td>
          <td style="text-align: right; font-family: monospace;">iii</td>
        </tr>
        <tr>
          <td><strong>Acknowledgements</strong></td>
          <td style="text-align: right; font-family: monospace;">iv</td>
        </tr>
        <tr>
          <td><strong>Executive Summary / Abstract</strong></td>
          <td style="text-align: right; font-family: monospace;">v</td>
        </tr>
        <tr>
          <td><strong>List of Tables</strong></td>
          <td style="text-align: right; font-family: monospace;">viii</td>
        </tr>
        <tr>
          <td><strong>List of Figures</strong></td>
          <td style="text-align: right; font-family: monospace;">ix</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 1: INTRODUCTION</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">1.1 Background of Restaurant Operations &amp; Service Automation</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.1.1 Evolution of Modern Dining Management Architectures</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.1.2 The In-Store Dining Room Table Allocation Dilemma</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.1.3 Limitations of Conventional POS Systems &amp; Chatbots</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">1.2 Problem Statement &amp; Research Motivation</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.2.1 Seating Capacity Waste &amp; Unbalanced Waiter Fatigue</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.2.2 The LLM Hallucination &amp; Chain-of-Thought Leakage Challenge</td>
          <td style="text-align: right; font-family: monospace;">10</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.2.3 Formal Mathematical Problem Formulation</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">1.3 Research Objectives &amp; Technical Scope</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.3.1 Primary Engineering Aims</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.3.2 Specific Measurable Objectives</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">1.3.3 Boundary Conditions &amp; Target Key Performance Indicators (KPIs)</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">1.4 Proposed Solution Overview &amp; Report Organization</td>
          <td style="text-align: right; font-family: monospace;">11</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 2: LITERATURE SURVEY &amp; THEORETICAL FOUNDATIONS</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">12</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">2.1 Combinatorial Optimization in Seating Logistics</td>
          <td style="text-align: right; font-family: monospace;">12</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">2.1.1 Classical State-Space Search (BFS, DFS, Greedy vs. A*)</td>
          <td style="text-align: right; font-family: monospace;">12</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">2.1.2 Admissible Heuristic Design &amp; Monotonicity Guarantees</td>
          <td style="text-align: right; font-family: monospace;">12</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">2.2 Rational Agent Framework: PEAS Modeling in Dining Management</td>
          <td style="text-align: right; font-family: monospace;">12</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">2.3 Multi-Agent Systems (MAS) in Service Operations</td>
          <td style="text-align: right; font-family: monospace;">13</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">2.4 Grounded Retrieval-Augmented Generation (RAG) Architectures</td>
          <td style="text-align: right; font-family: monospace;">13</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">2.5 Comparative Analysis: Existing Market Solutions vs. Saffron &amp; Sage</td>
          <td style="text-align: right; font-family: monospace;">13</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 3: SYSTEM ARCHITECTURE &amp; DATA ENGINEERING</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">3.1 End-to-End Multi-Tier Architectural Model</td>
          <td style="text-align: right; font-family: monospace;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">3.1.1 Presentation Tier (React 19, Vite, Tailwind CSS)</td>
          <td style="text-align: right; font-family: monospace;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">3.1.2 RESTful API Gateway &amp; Middleware Tier (FastAPI, JWT)</td>
          <td style="text-align: right; font-family: monospace;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">3.1.3 Cognitive Intelligence &amp; Search Engine Tier</td>
          <td style="text-align: right; font-family: monospace;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">3.1.4 Relational Persistence Tier (SQLAlchemy, SQLite)</td>
          <td style="text-align: right; font-family: monospace;">14</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">3.2 12-Stage Dining Service Lifecycle Pipeline</td>
          <td style="text-align: right; font-family: monospace;">15</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">3.3 Relational Database Schema &amp; Entity-Relationship Modeling</td>
          <td style="text-align: right; font-family: monospace;">16</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 4: CORE ALGORITHMIC SUBSYSTEMS &amp; MATHEMATICAL MODELS</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">4.1 Multi-Factor Weighted Cost Formulation</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 6</span>
  </div>
</div>

<!-- PAGE 7: TABLE OF CONTENTS (CONTINUED) -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>TABLE OF CONTENTS (CONTINUED)</h1>
    </div>

    <table style="width: 100%; font-size: 10px; border-collapse: collapse; line-height: 1.8;">
      <tbody>
        <tr>
          <td style="padding-left: 15px;">4.2 Uninformed &amp; Informed Classical Search Formulations</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.2.1 Rule-Based Heuristic Baseline</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.2.2 Greedy Best-First Search</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.2.3 Breadth-First Search (BFS)</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.2.4 Depth-First Search (DFS)</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.2.5 A* Search &amp; Admissible Heuristic Optimality Proof</td>
          <td style="text-align: right; font-family: monospace;">17</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">4.3 Multi-Agent Simulation Lifecycle &amp; Finite State Machine</td>
          <td style="text-align: right; font-family: monospace;">18</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">4.4 Grounded RAG Knowledge Retrieval Pipeline</td>
          <td style="text-align: right; font-family: monospace;">18</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.4.1 TF-IDF Vector Indexing &amp; Cosine Similarity Formulation</td>
          <td style="text-align: right; font-family: monospace;">18</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">4.4.2 Dual-Inference Groq LPU Engine &amp; Zero-Hallucination SQL Fallback</td>
          <td style="text-align: right; font-family: monospace;">18</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 5: DETAILED SYSTEM IMPLEMENTATION &amp; COMPONENT WORKFLOWS</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">5.1 Backend Modular Engineering &amp; Service-Oriented Architecture</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">5.2 Frontend Engineering &amp; UI/UX Implementation</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">5.2.1 React 19 Single Page Application Lifecycle</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">5.2.2 Interactive 2D Dining Floor Plan Canvas</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">5.2.3 Floating RAG Conversational AI Assistant</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td style="padding-left: 25px;">5.2.4 Multi-Option Authentication Portal (Google OAuth, Manager, Guest)</td>
          <td style="text-align: right; font-family: monospace;">19</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 6: REAL-WORLD ENGINEERING CHALLENGES &amp; BUG FIXES</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.1 Smart Table Allocation Layout Overlapping Collision Resolution</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.2 Reservation Seating Foreign Key &amp; State Desynchronization</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.3 Double-Allocation Race Condition &amp; HTTP 409 Conflict Prevention</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.4 Groq LLM Internal Chain-of-Thought Monologue Leakage Shield</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.5 Client-Side Simulation State Fallback on GitHub Pages</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">6.6 Pydantic v2 DateTime Parsing for Combined Reservation Timestamps</td>
          <td style="text-align: right; font-family: monospace;">20</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 7: VERIFICATION, TESTING &amp; QUALITY ASSURANCE</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">21</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">7.1 Automated Test Suite Architecture (Pytest Framework)</td>
          <td style="text-align: right; font-family: monospace;">21</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">7.2 Complete Verification Matrix Across All RESTful Endpoints</td>
          <td style="text-align: right; font-family: monospace;">22</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">7.3 Security Audits: Google OAuth, RBAC, and Secret Protection</td>
          <td style="text-align: right; font-family: monospace;">22</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 8: EXPERIMENTAL RESULTS, PERFORMANCE EVALUATION &amp; DISCUSSION</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">23</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">8.1 5-Algorithm Performance Benchmarks &amp; Comparative Analysis</td>
          <td style="text-align: right; font-family: monospace;">23</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">8.2 AI Conversational Latency &amp; Tool Execution Throughput</td>
          <td style="text-align: right; font-family: monospace;">23</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">8.3 End-to-End Table Utilization &amp; Server Load Balancing</td>
          <td style="text-align: right; font-family: monospace;">23</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 9: LIMITATIONS &amp; FUTURE ENHANCEMENTS</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">24</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">9.1 Current System Limitations</td>
          <td style="text-align: right; font-family: monospace;">24</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">9.2 Future Roadmap (Kitchen Display Systems, Twilio SMS, Deep Q-Networks)</td>
          <td style="text-align: right; font-family: monospace;">24</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">CHAPTER 10: CONCLUSION</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">24</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 8px;">
            <strong style="color: #0D2040; font-size: 11px;">REFERENCES &amp; APPENDICES</strong>
          </td>
          <td style="text-align: right; font-weight: 700;">25</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">Formal Academic References</td>
          <td style="text-align: right; font-family: monospace;">25</td>
        </tr>
        <tr>
          <td style="padding-left: 15px;">Appendix D: Production Deployment Links &amp; Verified Endpoints</td>
          <td style="text-align: right; font-family: monospace;">25</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 7</span>
  </div>
</div>

<!-- PAGE 8: LIST OF TABLES -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>LIST OF TABLES</h1>
    </div>

    <table class="report-table" style="font-size: 10px; margin-top: 8px;">
      <thead>
        <tr>
          <th style="width: 15%;">Table No.</th>
          <th style="width: 73%;">Title / Description</th>
          <th style="width: 12%; text-align: right;">Page</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 1.1</td>
          <td>Boundary Conditions &amp; Target Key Performance Indicators (KPIs)</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">11</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 2.1</td>
          <td>Comparative Feature Matrix: Commercial Restaurant Platforms vs. Saffron &amp; Sage</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">13</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 3.1</td>
          <td>Relational Database Schema Entity Specifications (SQLAlchemy Models)</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">16</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 4.1</td>
          <td>Search Algorithm Comparison Matrix: Strategy, Time, Space, and Optimality Guarantees</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">18</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 5.1</td>
          <td>Backend Service Modules &amp; APIRouter Endpoint Responsibilities</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">19</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 6.1</td>
          <td>Comprehensive Real-World Production Bug Resolution Log</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">20</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 7.1</td>
          <td>Automated Pytest Test Execution Matrix &amp; Coverage Summary (28/28 Passing)</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">21</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 7.2</td>
          <td>Complete RESTful API Endpoint Verification Matrix (25+ Endpoints)</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">22</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 8.1</td>
          <td>5-Algorithm Performance Benchmarking Across Identical Customer Batches</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">23</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table 8.2</td>
          <td>Groq LPU Conversational Latency and Tool Calling Execution Metrics</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">23</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #D9531E;">Table D.1</td>
          <td>Primary Production Deployment Links, Repositories, and Documentation Endpoints</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">25</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 8</span>
  </div>
</div>
"""
