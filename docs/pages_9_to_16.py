# -*- coding: utf-8 -*-
"""
Pages 9 to 16: List of Figures, Chapter 1, Chapter 2, Chapter 3
"""

def get_pages_9_to_16():
    return r"""
<!-- PAGE 9: LIST OF FIGURES -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>LIST OF FIGURES</h1>
    </div>

    <table class="report-table" style="font-size: 10px; margin-top: 8px;">
      <thead>
        <tr>
          <th style="width: 15%;">Figure No.</th>
          <th style="width: 73%;">Description / Diagram Title</th>
          <th style="width: 12%; text-align: right;">Page</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 1.1</td>
          <td>Physical Dining Room Operational Inefficiency: Walkouts, Capacity Waste &amp; Backtracking</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">10</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 2.1</td>
          <td>Algorithmic Table Candidate Filtering &amp; Multi-Factor Evaluation Flowchart</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">12</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 3.1</td>
          <td>Saffron &amp; Sage End-to-End Multi-Tier Decoupled System Architecture Diagram</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">14</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 3.2</td>
          <td>12-Stage Dining Service Cognitive &amp; Transactional Lifecycle Pipeline</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">15</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 3.3</td>
          <td>Complete Entity-Relationship (ER) Relational Database Schema Diagram</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">16</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 4.1</td>
          <td>State-Space Search Tree &amp; Priority Queue Branch-and-Bound Traversal in A*</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">17</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 4.2</td>
          <td>Grounded RAG Retrieval, TF-IDF Vector Indexing &amp; Dual-Inference Generation Pipeline</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">18</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 6.1</td>
          <td>Atomic Reservation Seating Transaction &amp; Double-Allocation Collision Guard</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">20</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 8.1</td>
          <td>Empirical Benchmark: Search Execution Latency vs. Seating Capacity Waste Across 5 Algorithms</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">23</td>
        </tr>
        <tr>
          <td style="font-weight: 800; color: #0284C7;">Figure 8.2</td>
          <td>Groq LPU Inference Turn Latency &amp; Tool Calling Breakdown (Simple Q&amp;A vs. SQL Ingestion)</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">23</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 9</span>
  </div>
</div>

<!-- PAGE 10: CHAPTER 1 INTRODUCTION -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 1</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      INTRODUCTION
    </div>

    <div class="sec-heading">1.1 Background of Restaurant Operations &amp; Service Automation</div>
    <div class="subsec-heading">1.1.1 Evolution of Modern Dining Management Architectures</div>
    <p>
      The hospitality industry has undergone significant technological acceleration over the past two decades. However, while point-of-sale (POS) billing, digital menus, and online delivery aggregators have digitized payment and takeaway channels, in-store dining room management remains shockingly analog. Dining room floor coordination in high-volume establishments continues to rely almost exclusively on human hostesses, paper reservation notebooks, and rudimentary table-status charts. This reliance on manual decision-making introduces acute cognitive overload during peak dining hours.
    </p>

    <div class="subsec-heading">1.1.2 The In-Store Dining Room Table Allocation Dilemma</div>
    <p>
      Inside an active restaurant covering 3,000 to 10,000 square feet with 15 to 40 tables distributed across distinct dining zones (Main Dining, Window, Patio, and Booth sections), hostess staff must solve a real-time, dynamic combinatorial assignment problem under severe time pressure. As walk-in parties and advance reservations arrive simultaneously, hostesses routinely commit critical assignment errors:
    </p>
    <ul>
      <li><strong>Capacity Mismatches:</strong> Seating small parties of 2 guests at high-capacity 6- or 8-top tables due to localized visual availability, which deprives subsequent larger groups of suitable seating and inflates table underutilization by up to 34%.</li>
      <li><strong>Server Workload Bottlenecks:</strong> Assigning multiple consecutive tables to the same waiter station, resulting in server burnout, delayed order taking, and degraded diner satisfaction scores.</li>
      <li><strong>Queue Abandonment (Reneging):</strong> When waiting parties perceive disorganized seating priorities or experience wait times exceeding their psychological patience threshold, walkout rates surge to 18–25%.</li>
    </ul>

    <!-- FIGURE 1.1 DIAGRAM -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px 14px; background: #FFFFFF; margin: 8px 0;">
      <div style="text-align: center; font-size: 9.5px; font-weight: 800; color: #E65100; text-transform: uppercase; margin-bottom: 6px;">
        CONVENTIONAL DINING ROOM OPERATIONAL BOTTLENECKS
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; text-align: center; background: #F8FAFC;">
          <div style="font-weight: 800; color: #0D2040; font-size: 10px;">Queue Arrival</div>
          <div style="font-size: 8.5px; color: #64748B;">Party of 2 Walk-In</div>
        </div>
        <div style="color: #E65100; font-weight: 800; font-size: 14px;">&rarr;</div>
        <div style="flex: 1.4; border: 1.5px dashed #DC2626; border-radius: 4px; padding: 6px; text-align: center; background: #FEF2F2;">
          <div style="font-weight: 800; color: #DC2626; font-size: 10px;">Manual Host Assignment</div>
          <div style="font-size: 8.5px; color: #991B1B;">Seats 2-top at 8-top Table!</div>
          <div style="font-size: 8px; color: #B91C1C;">6 Seats Wasted</div>
        </div>
        <div style="color: #DC2626; font-weight: 800; font-size: 14px;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #DC2626; border-radius: 4px; padding: 6px; text-align: center; background: #FEF2F2;">
          <div style="font-weight: 800; color: #DC2626; font-size: 10px;">Server Bottleneck</div>
          <div style="font-size: 8.5px; color: #991B1B;">Server A: 5 Tables (125% Load)</div>
          <div style="font-size: 8px; color: #B91C1C;">Server B: 1 Table (25% Load)</div>
        </div>
        <div style="color: #DC2626; font-weight: 800; font-size: 14px;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #991B1B; border-radius: 4px; padding: 6px; text-align: center; background: #FEF2F2;">
          <div style="font-weight: 800; color: #991B1B; font-size: 10px;">Customer Walkout</div>
          <div style="font-size: 8.5px; color: #7F1D1D;">Party of 6 leaves (Wait &gt; 45m)</div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 1.1: Physical Dining Room Operational Inefficiency: Walkouts, Capacity Waste &amp; Backtracking</div>

    <div class="subsec-heading">1.1.3 Limitations of Conventional POS Systems &amp; Chatbots</div>
    <p>
      Legacy restaurant management software (such as Toast POS, OpenTable, and 7shifts) functions primarily as digital record books. They lack proactive algorithmic optimization engines that simultaneously optimize table capacity, server load, and reservation proximity. Furthermore, standard hospitality chatbots are ungrounded—they hallucinate non-existent table openings, leak internal reasoning tokens, and fail to synchronize with live database states.
    </p>

    <div class="sec-heading">1.2 Problem Statement &amp; Research Motivation</div>
    <div class="subsec-heading">1.2.1 Seating Capacity Waste &amp; Unbalanced Waiter Fatigue</div>
    <p>
      In high-turnover restaurants, dining capacity is a perishable resource: an empty seat during an operational hour generates zero revenue and increases customer queue wait times. Assigning tables without algorithmic constraint satisfaction creates local optima that severely penalize global dining throughput.
    </p>
    <div class="subsec-heading">1.2.2 The LLM Hallucination &amp; Chain-of-Thought Leakage Challenge</div>
    <p>
      Deploying Generative AI (LLMs) into guest services requires strict factual determinism. When a customer inquires: <em>"Are any outdoor patio tables open for 4 guests right now?"</em>, the system must not emit culinary trivia or internal reasoning monologues (e.g., <code>&lt;think&gt; Let me check... &lt;/think&gt;</code>). It must execute structured tool calling over live database tables.
    </p>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 10</span>
  </div>
</div>

<!-- PAGE 11: CHAPTER 1 (CONT.) -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="subsec-heading" style="margin-top: 0;">1.2.3 Formal Mathematical Problem Formulation</div>
    <p>
      Let the restaurant dining floor be formulated as an operational topology graph \( G = (T, W, C, \Phi) \), where:
    </p>
    <ul>
      <li>\( T = \{t_1, t_2, \dots, t_M\} \) is the finite set of physical dining tables, each characterized by capacity \( \text{Cap}(t_i) \), location attribute \( \text{Loc}(t_i) \in \{\text{Main Dining}, \text{Window}, \text{Patio}, \text{Booth}\} \), and operational state \( S(t_i) \in \{\text{AVAILABLE}, \text{OCCUPIED}, \text{RESERVED}, \text{CLEANING}\} \).</li>
      <li>\( W = \{w_1, w_2, \dots, w_K\} \) is the active server roster, where each waiter \( w_j \) has current table count \( A(w_j) \), capacity cap \( M(w_j) = 4 \), and dynamic workload score \( \text{Load}(w_j) = A(w_j) / M(w_j) \).</li>
      <li>\( C = \{c_1, c_2, \dots, c_N\} \) is the active queue of waiting customer parties, each defined by group size \( G(c_k) \), arrival timestamp \( \tau(c_k) \), priority tier \( P(c_k) \in \{1, 2, 3\} \), and special requirement vector \( R(c_k) \).</li>
    </ul>
    <p>
      The goal of the intelligent table allocation engine is to discover a global mapping function \( \Pi^* : C \to T \times W \) such that total operational penalty cost is strictly minimized across all assigned parties:
    </p>

    <div class="math-box">
      \[ \min_{\Pi \in \Omega} \sum_{k=1}^{N} \left[ w_{\text{waste}} \cdot \max(0, \text{Cap}(t) - G(c_k)) + w_{\text{load}} \cdot \text{Load}(w) + w_{\text{wait}} \cdot \frac{\Delta \tau(c_k)}{P(c_k)} + \text{Penalty}_{\text{miss}}(c_k, t) \right] \]
    </div>

    <div class="sec-heading">1.3 Research Objectives &amp; Technical Scope</div>
    <div class="subsec-heading">1.3.1 Primary Engineering Aims</div>
    <p>
      The primary aim of this project is to architect, develop, verify, and deploy <strong>Saffron &amp; Sage | AI Bistro</strong>, an intelligent full-stack restaurant operations and service planner that bridges automated AI table optimization with human staff oversight.
    </p>

    <div class="subsec-heading">1.3.2 Specific Measurable Objectives</div>
    <ol>
      <li><strong>Classical State-Space Search Allocation:</strong> Implement and benchmark five search algorithms (Rule-Based, Greedy, BFS, DFS, A*) to optimize seating allocation under 5 milliseconds.</li>
      <li><strong>Multi-Agent Simulation Framework:</strong> Construct a discrete-event simulator modeling interactions between Customer, Table, Waiter, and Manager agents across a verified 5-state Table Finite State Machine.</li>
      <li><strong>Tactile 2D Dining Floor Plan:</strong> Build a responsive React 19 interactive floor plan providing instant visual occupancy telemetry without UI overlapping.</li>
      <li><strong>Grounded RAG AI Assistant:</strong> Integrate Groq LPU inference (<code>openai/gpt-oss-120b</code>) with TF-IDF vector retrieval and deterministic live SQLite tool calling with zero CoT leakage.</li>
      <li><strong>Atomic Transaction &amp; Duplicate Seating Guard:</strong> Engineer one-click reservation seating with strict HTTP 409 Conflict rejection preventing duplicate allocations.</li>
      <li><strong>Automated Testing &amp; Cloud Deployment:</strong> Deploy production build to GitHub Pages and verify 100% statement passing across a 28-test Pytest harness.</li>
    </ol>

    <div class="subsec-heading">1.3.3 Boundary Conditions &amp; Target Key Performance Indicators (KPIs)</div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Metric / Key Performance Indicator (KPI)</th>
          <th>Target Benchmark</th>
          <th>Achieved Production Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Automated Pytest Suite Coverage</strong></td>
          <td>&ge; 25 passing test cases</td>
          <td><span class="badge-pass">28 / 28 Passed (100%)</span></td>
        </tr>
        <tr>
          <td><strong>Algorithm Execution Latency (14 tables)</strong></td>
          <td>&lt; 10 ms execution time</td>
          <td><span class="badge-pass">2.1 ms to 4.4 ms</span></td>
        </tr>
        <tr>
          <td><strong>Seating Capacity Waste Compression</strong></td>
          <td>&gt; 25% reduction vs. FIFO</td>
          <td><span class="badge-pass">31.4% Waste Reduction</span></td>
        </tr>
        <tr>
          <td><strong>Groq LLM Response Latency</strong></td>
          <td>&lt; 2.0 s per conversational turn</td>
          <td><span class="badge-pass">1.1 s to 1.7 s (Groq LPU)</span></td>
        </tr>
        <tr>
          <td><strong>Chain-of-Thought (CoT) Monologue Leakage</strong></td>
          <td>0.0% (Zero Leakage)</td>
          <td><span class="badge-pass">0.0% (Strict Regex Barrier)</span></td>
        </tr>
        <tr>
          <td><strong>Duplicate Seating Concurrency Safety</strong></td>
          <td>100% Rejection of Duplicate Seats</td>
          <td><span class="badge-pass">100% (HTTP 409 Conflict)</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 1.1: Boundary Conditions &amp; Target Key Performance Indicators (KPIs)</div>

    <div class="sec-heading">1.4 Proposed Solution Overview &amp; Report Organization</div>
    <p>
      The remainder of this report is organized as follows: Chapter 2 reviews literature and theoretical foundations; Chapter 3 presents system architecture and database design; Chapter 4 formulates the core algorithms; Chapter 5 details full-stack implementation; Chapter 6 analyzes real-world bugs and resolutions; Chapter 7 covers testing and verification; Chapter 8 presents empirical benchmarks; Chapter 9 outlines limitations and future scope; Chapter 10 concludes the work.
    </p>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 11</span>
  </div>
</div>

<!-- PAGE 12: CHAPTER 2 LITERATURE SURVEY -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 2</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      LITERATURE SURVEY &amp; THEORETICAL FOUNDATIONS
    </div>

    <div class="sec-heading">2.1 Combinatorial Optimization in Seating Logistics</div>
    <div class="subsec-heading">2.1.1 Classical State-Space Search Paradigms</div>
    <p>
      Table assignment in restaurant management is fundamentally a constrained bipartite matching problem that maps a dynamically arriving sequence of customer groups onto a set of discrete, heterogeneous physical resources. In classical artificial intelligence (Russell &amp; Norvig, 2020), this is modeled as state-space graph search:
    </p>
    <ul>
      <li><strong>Uninformed Search (BFS &amp; DFS):</strong> Breadth-First Search systematically expands all shallow nodes before proceeding deeper, guaranteeing shortest-path discovery at exponential space complexity \( \mathcal{O}(b^d) \). Depth-First Search explores paths to maximum depth with minimal memory \( \mathcal{O}(b \cdot m) \), but risks converging on highly sub-optimal allocations without exhaustive backtracking.</li>
      <li><strong>Informed Search (Greedy Best-First &amp; A*):</strong> Informed search utilizes domain-specific heuristics. While Greedy Best-First minimizes single-step estimated cost \( h(n) \) (prone to getting trapped in local minima), A* Search evaluates nodes using \( f(n) = g(n) + h(n) \), guaranteeing global cost optimality when \( h(n) \) is strictly admissible.</li>
    </ul>

    <!-- FIGURE 2.1 FLOWCHART -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px 14px; background: #FFFFFF; margin: 8px 0;">
      <div style="text-align: center; font-size: 9.5px; font-weight: 800; color: #0D2040; text-transform: uppercase; margin-bottom: 6px;">
        ALGORITHMIC TABLE CANDIDATE FILTERING &amp; MULTI-FACTOR EVALUATION PIPELINE
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 5px; text-align: center; background: #F8FAFC;">
          <div style="font-weight: 800; font-size: 9px; color: #0D2040;">1. Target Group</div>
          <div style="font-size: 8px; color: #475569;">Party Size &amp; Needs</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #0D2040; border-radius: 4px; padding: 5px; text-align: center; background: #F8FAFC;">
          <div style="font-weight: 800; font-size: 9px; color: #0D2040;">2. Hard Pruning</div>
          <div style="font-size: 8px; color: #475569;">Cap &ge; Size &amp; Status</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.4; border: 1.5px solid #E65100; border-radius: 4px; padding: 5px; text-align: center; background: #FFF7ED;">
          <div style="font-weight: 800; font-size: 9px; color: #E65100;">3. Algorithm Search</div>
          <div style="font-size: 8px; color: #9A3412;">A* / Greedy / BFS / DFS</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #10B981; border-radius: 4px; padding: 5px; text-align: center; background: #F0FDF4;">
          <div style="font-weight: 800; font-size: 9px; color: #10B981;">4. Optimal Pairing</div>
          <div style="font-size: 8px; color: #166534;">Table + Server Pick</div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 2.1: Algorithmic Table Candidate Filtering &amp; Multi-Factor Evaluation Flowchart</div>

    <div class="subsec-heading">2.1.2 Heuristic Admissibility &amp; Monotonicity Guarantees</div>
    <p>
      An allocation heuristic \( h(n) \) is mathematically admissible if it never overestimates the actual minimal remaining cost to achieve valid seating: \( h(n) \le h^*(n) \). In Saffron &amp; Sage, the heuristic estimates remaining capacity waste based on lower-bound table differentials, ensuring A* exploration remains provably optimal without exhausting all branch permutations.
    </p>

    <div class="sec-heading">2.2 Rational Agent Framework: PEAS Modeling in Dining Management</div>
    <p>
      To model the autonomous entities operating inside a restaurant, the system applies the classic PEAS (Performance measure, Environment, Actuators, Sensors) framework:
    </p>
    <ul>
      <li><strong>Performance Measure:</strong> Minimization of total capacity waste, minimization of average customer wait duration, maximization of server workload parity, and zero duplicate seating collisions.</li>
      <li><strong>Environment:</strong> Dynamic, discrete-event, partially observable dining room comprising physical tables, customer arrival queues, active waitstaff, and reservation calendars.</li>
      <li><strong>Actuators:</strong> Table state mutators (<code class="badge-code">SEAT</code>, <code class="badge-code">RELEASE</code>, <code class="badge-code">BUSBOY_CLEAN</code>), waiter assignment updates, reservation status updates, and notification dispatches.</li>
      <li><strong>Sensors:</strong> REST API request payloads, SQLite transactional query readers, real-time customer queue timestamps, and server table count tallies.</li>
    </ul>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 12</span>
  </div>
</div>

<!-- PAGE 13: CHAPTER 2 (CONT.) -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="sec-heading" style="margin-top: 0;">2.3 Multi-Agent Systems (MAS) in Service Operations</div>
    <p>
      Multi-agent architectures partition complex operational workflows into modular, communicative software agents (Wooldridge, 2009). In high-volume service planning, decentralized coordination prevents single-point failure bottlenecks. Each agent governs a specific domain:
    </p>
    <ul>
      <li><strong>CustomerAgent:</strong> Models arrival timing, tracks individual patience thresholds, and triggers queue abandonment if wait time exceeds tolerance.</li>
      <li><strong>TableAgent:</strong> Manages physical table state transitions through an explicit Finite State Machine (<code class="badge-code">AVAILABLE &rarr; OCCUPIED &rarr; CLEANING &rarr; AVAILABLE</code>).</li>
      <li><strong>WaiterAgent:</strong> Monitors table loads, prevents server over-assignment (capped at 4 tables), and calculates dynamic fatigue scores.</li>
      <li><strong>ManagerAgent:</strong> Orchestrates global synchronization, dispatches busboy cleanup routines, and aggregates dining analytics.</li>
    </ul>

    <div class="sec-heading">2.4 Grounded Retrieval-Augmented Generation (RAG) Architectures</div>
    <p>
      Standard Large Language Models (LLMs) operate as autoregressive probability engines over static training corpora (Lewis et al., 2020). When applied to live enterprise workflows, unconstrained generative LLMs suffer from severe factual hallucinations—inventing operating hours, fabricating allergen statements, or reporting non-existent table openings. Retrieval-Augmented Generation solves this vulnerability by constraining model inference to verified external context:
    </p>
    <div class="math-box">
      \[ \text{Similarity}(q, d) = \cos(\theta) = \frac{\mathbf{q} \cdot \mathbf{d}}{\|\mathbf{q}\| \|\mathbf{d}\|} = \frac{\sum_{i=1}^{V} q_i d_i}{\sqrt{\sum_{i=1}^{V} q_i^2} \sqrt{\sum_{i=1}^{V} d_i^2}} \]
    </div>
    <p>
      By extracting semantic policy passages via Term Frequency-Inverse Document Frequency (TF-IDF) vector indexing and passing them alongside live SQLite operational records, the generative engine produces factually grounded answers with cited policy clauses.
    </p>

    <div class="sec-heading">2.5 Comparative Analysis: Existing Market Solutions vs. Saffron &amp; Sage</div>
    <p>
      Table 2.1 provides a feature-by-feature comparative matrix contrasting commercial platforms with the implemented Saffron &amp; Sage platform:
    </p>

    <table class="report-table">
      <thead>
        <tr>
          <th>Operational Capability</th>
          <th>OpenTable</th>
          <th>Toast POS</th>
          <th>7shifts</th>
          <th>Saffron &amp; Sage | AI Bistro</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Automated Table Allocation</strong></td>
          <td>Manual Hostess</td>
          <td>Manual Hostess</td>
          <td>None</td>
          <td><span class="badge-pass">A*, Greedy, BFS, DFS, Rules</span></td>
        </tr>
        <tr>
          <td><strong>Capacity Waste Minimization</strong></td>
          <td>NO</td>
          <td>NO</td>
          <td>NO</td>
          <td><span class="badge-pass">YES (Mathematical Cost Function)</span></td>
        </tr>
        <tr>
          <td><strong>Server Workload Balancing</strong></td>
          <td>Basic Counts</td>
          <td>NO</td>
          <td>Shift Schedule Only</td>
          <td><span class="badge-pass">YES (Dynamic Load Balancing)</span></td>
        </tr>
        <tr>
          <td><strong>Interactive 2D Floor Plan Canvas</strong></td>
          <td>Static Grid</td>
          <td>Basic Layout</td>
          <td>NO</td>
          <td><span class="badge-pass">YES (Tactile 2D Real-Time Canvas)</span></td>
        </tr>
        <tr>
          <td><strong>Grounded RAG Conversational AI</strong></td>
          <td>NO (Static FAQ)</td>
          <td>NO</td>
          <td>NO</td>
          <td><span class="badge-pass">YES (Groq LPU + Live SQL Grounding)</span></td>
        </tr>
        <tr>
          <td><strong>Chain-of-Thought (CoT) Shield</strong></td>
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
          <td><span class="badge-pass">YES (Zero Monologue Leakage)</span></td>
        </tr>
        <tr>
          <td><strong>Multi-Agent Simulation Engine</strong></td>
          <td>NO</td>
          <td>NO</td>
          <td>NO</td>
          <td><span class="badge-pass">YES (4 Rational Agent Types)</span></td>
        </tr>
        <tr>
          <td><strong>Duplicate Seating Concurrency Guard</strong></td>
          <td>Partial</td>
          <td>Partial</td>
          <td>N/A</td>
          <td><span class="badge-pass">YES (HTTP 409 Atomic Guard)</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 2.1: Comparative Feature Matrix: Commercial Platforms vs. Saffron &amp; Sage AI Bistro</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 13</span>
  </div>
</div>

<!-- PAGE 14: CHAPTER 3 SYSTEM ARCHITECTURE -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 3</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      SYSTEM ARCHITECTURE &amp; DATA ENGINEERING
    </div>

    <div class="sec-heading">3.1 End-to-End Multi-Tier Architectural Model</div>
    <p>
      Saffron &amp; Sage is engineered following a clean, enterprise-grade, four-tier decoupled service-oriented architecture:
    </p>

    <!-- ARCHITECTURE DIAGRAM BOX -->
    <div style="border: 1.5px solid #0D2040; border-radius: 5px; overflow: hidden; margin: 10px 0; background: #FFFFFF;">
      <!-- Tier 1 -->
      <div style="background: #0D2040; color: #FFFFFF; padding: 7px 12px; font-weight: 800; font-size: 10px; display: flex; justify-content: space-between;">
        <span>TIER 1 — PRESENTATION &amp; CLIENT APPLICATION</span>
        <span style="color: #38BDF8;">React 19 &bull; Vite &bull; Tailwind CSS &bull; Recharts &bull; Lucide</span>
      </div>
      <div style="padding: 8px 12px; background: #F8FAFC; font-size: 9.5px;">
        &bull; Executive Telemetry Dashboard &bull; Smart Table Allocation Widget &bull; Interactive 2D Dining Floor Plan Canvas<br>
        &bull; Customer Queue Manager &bull; Reservation Desk &bull; Waitstaff Station &bull; Multi-Option Auth (Google OAuth, Guest)
      </div>

      <!-- Connector -->
      <div style="text-align: center; background: #E2E8F0; padding: 2px 0; font-size: 9px; font-weight: 700; color: #475569;">
        &darr; HTTP / HTTPS RESTful Communication (JSON Payloads &amp; Bearer Tokens) &uarr;
      </div>

      <!-- Tier 2 -->
      <div style="background: #00796B; color: #FFFFFF; padding: 7px 12px; font-weight: 800; font-size: 10px; display: flex; justify-content: space-between;">
        <span>TIER 2 — RESTful API GATEWAY &amp; MIDDLEWARE</span>
        <span style="color: #80CBC4;">FastAPI &bull; Python 3.14 &bull; Pydantic v2 &bull; Uvicorn</span>
      </div>
      <div style="padding: 8px 12px; background: #F0FDF4; font-size: 9.5px;">
        &bull; 25+ REST Endpoints (/auth, /tables, /customers, /waiters, /reservations, /allocations, /simulation, /ai)<br>
        &bull; Security &amp; Auth Guard (Google JWT Token Verification, Role-Based Access Control, CORS Middleware)<br>
        &bull; Request Serialization &amp; Pydantic Schema Validation with Atomic Seating Concurrency Governance
      </div>

      <!-- Connector -->
      <div style="text-align: center; background: #E2E8F0; padding: 2px 0; font-size: 9px; font-weight: 700; color: #475569;">
        &darr; Internal Modular Dispatch &amp; Dependency Injection &uarr;
      </div>

      <!-- Tier 3 & 4 Dual Grid -->
      <div style="display: flex; border-top: 1px solid #CBD5E1;">
        <div style="flex: 1; border-right: 1px solid #CBD5E1;">
          <div style="background: #E65100; color: #FFFFFF; padding: 6px 10px; font-weight: 800; font-size: 9.5px;">
            TIER 3 — AI &amp; OPTIMIZATION ENGINES
          </div>
          <div style="padding: 8px 10px; background: #FFF7ED; font-size: 9px; line-height: 1.45;">
            &bull; Classical Search (A*, Greedy, BFS, DFS, Rules)<br>
            &bull; Multi-Agent Simulator (Customer, Table, Waiter)<br>
            &bull; RAG Pipeline (TF-IDF + Cosine Similarity)<br>
            &bull; Groq LPU Inference (openai/gpt-oss-120b)<br>
            &bull; CoT Anti-Leakage Monologue Barrier
          </div>
        </div>
        <div style="flex: 1;">
          <div style="background: #1E3A8A; color: #FFFFFF; padding: 6px 10px; font-weight: 800; font-size: 9.5px;">
            TIER 4 — RELATIONAL PERSISTENCE
          </div>
          <div style="padding: 8px 10px; background: #F8FAFC; font-size: 9px; line-height: 1.45;">
            &bull; SQLite 3 Embedded Database (<code class="badge-code">restaurant_planner.db</code>)<br>
            &bull; SQLAlchemy 2.0 Declarative ORM Mapping<br>
            &bull; Normalized Relational Entity Models<br>
            &bull; Foreign Key Integrity &amp; Cascading Rules<br>
            &bull; Markdown Policy Knowledge Base
          </div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 3.1: Saffron &amp; Sage End-to-End Multi-Tier Decoupled System Architecture Diagram</div>

    <div class="sec-heading">3.1.1 Presentation &amp; Client Application Tier</div>
    <p>
      The client application is engineered as a responsive Single-Page Application (SPA) leveraging React 19 and Vite. The user interface applies a customized Tailwind CSS palette combining Warm Ivory (backgrounds), Sage Green (success indicators and table availability), and Terracotta (action buttons and alerts). State is managed via React Context (<code class="badge-code">AuthContext</code>, <code class="badge-code">RestaurantContext</code>) with seamless fallback to client-side simulated state in offline or static hosting environments.
    </p>

    <div class="sec-heading">3.1.2 RESTful API Gateway &amp; Application Server Tier</div>
    <p>
      The backend service is powered by FastAPI and Python 3.14, providing high-performance asynchronous request dispatching, automatic OpenAPI documentation generation (<code class="badge-code">/docs</code>, <code class="badge-code">/redoc</code>), and Pydantic v2 data serialization.
    </p>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 14</span>
  </div>
</div>

<!-- PAGE 15: CHAPTER 3 (CONT.) 12-STAGE PIPELINE -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="sec-heading" style="margin-top: 0;">3.2 12-Stage Dining Service Lifecycle Pipeline</div>
    <p>
      Every customer interaction—from walk-in party arrival to table allocation, dining service, and turnover—is governed by a deterministic 12-stage cognitive and transactional lifecycle:
    </p>

    <!-- 12-STAGE FLOWCHART GRID -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 12px 14px; background: #FFFFFF; margin: 10px 0;">
      <!-- Row 1: Stages 1 to 4 -->
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; background: #F8FAFC;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 1</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #0D2040;">Session Initialization</div>
          <div style="font-size: 8px; color: #475569;">Client loads app state; loads active tables &amp; waitlist.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; background: #F8FAFC;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 2</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #0D2040;">Context Resolution</div>
          <div style="font-size: 8px; color: #475569;">Verifies JWT token or activates isolated Guest Mode.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; background: #F8FAFC;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 3</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #0D2040;">Party Queue Ingestion</div>
          <div style="font-size: 8px; color: #475569;">Captures group size, special requirements, and arrival.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; background: #F8FAFC;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 4</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #0D2040;">Hard Constraint Filter</div>
          <div style="font-size: 8px; color: #475569;">Eliminates occupied tables and capacity violations.</div>
        </div>
      </div>

      <!-- Row 2: Stages 8 to 5 (Reverse flow) -->
      <div style="display: flex; gap: 8px; margin-bottom: 8px;">
        <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 6px; background: #F0FDF4;">
          <div style="font-size: 8.5px; font-weight: 800; color: #00796B;">STAGE 8</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #00796B;">User Confirmation</div>
          <div style="font-size: 8px; color: #475569;">Host confirms or cancels recommended table.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 6px; background: #F0FDF4;">
          <div style="font-size: 8.5px; font-weight: 800; color: #00796B;">STAGE 7</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #00796B;">Server Workload Eval</div>
          <div style="font-size: 8px; color: #475569;">Identifies lowest-load server (tables &lt; 4).</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 6px; background: #F0FDF4;">
          <div style="font-size: 8.5px; font-weight: 800; color: #00796B;">STAGE 6</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #00796B;">Allocation Preview</div>
          <div style="font-size: 8px; color: #475569;">Renders table, server, and explanation card.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 6px; background: #F0FDF4;">
          <div style="font-size: 8.5px; font-weight: 800; color: #00796B;">STAGE 5</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #00796B;">Algorithm Execution</div>
          <div style="font-size: 8px; color: #475569;">Executes selected search (A*, Greedy, BFS, DFS).</div>
        </div>
      </div>

      <!-- Row 3: Stages 9 to 12 -->
      <div style="display: flex; gap: 8px;">
        <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 6px; background: #FFF7ED;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 9</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #E65100;">Atomic DB Commit</div>
          <div style="font-size: 8px; color: #475569;">Locks table, sets OCCUPIED, logs Allocation.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 6px; background: #FFF7ED;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 10</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #E65100;">Table State FSM</div>
          <div style="font-size: 8px; color: #475569;">Transitions table to OCCUPIED &amp; waiter +1.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 6px; background: #FFF7ED;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 11</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #E65100;">Telemetry Broadcast</div>
          <div style="font-size: 8px; color: #475569;">Floor plan and stats refresh across clients.</div>
        </div>
        <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 6px; background: #FFF7ED;">
          <div style="font-size: 8.5px; font-weight: 800; color: #E65100;">STAGE 12</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #E65100;">AI Memory Update</div>
          <div style="font-size: 8px; color: #475569;">RAG assistant ingests new active table context.</div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 3.2: 12-Stage Dining Service Cognitive &amp; Transactional Lifecycle Pipeline</div>

    <p>
      This 12-stage pipeline ensures that no table assignment occurs in isolation. If a party cancels during Stage 8, the state instantly unlocks without corrupting waiter workloads or table statuses. If an advance reservation is seated, Stage 9 verifies that the booking is not already marked <code class="badge-code">SEATED</code>, cleanly preventing duplicate seating race conditions.
    </p>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 15</span>
  </div>
</div>

<!-- PAGE 16: CHAPTER 3 (CONT.) DATABASE DESIGN -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="sec-heading" style="margin-top: 0;">3.3 Relational Database Schema &amp; Entity-Relationship Modeling</div>
    <p>
      The persistence layer comprises 8 normalized relational models implemented via SQLAlchemy 2.0 ORM over SQLite:
    </p>

    <!-- ER DIAGRAM VISUALIZATION -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px; background: #FFFFFF; margin: 8px 0;">
      <div style="display: flex; justify-content: space-between; gap: 8px;">
        <!-- Box 1: RestaurantTables -->
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; overflow: hidden;">
          <div style="background: #0D2040; color: #FFFFFF; padding: 3px 6px; font-size: 8.5px; font-weight: 800;">restaurant_tables</div>
          <div style="padding: 4px 6px; font-size: 8px; font-family: monospace; background: #F8FAFC;">
            <strong>id</strong>: int (PK)<br>
            table_number: str (UK)<br>
            capacity: int<br>
            location: str<br>
            status: str<br>
            is_active: bool<br>
            current_waiter_id: FK<br>
            current_group_id: FK
          </div>
        </div>

        <!-- Box 2: CustomerGroups -->
        <div style="flex: 1; border: 1.5px solid #0284C7; border-radius: 4px; overflow: hidden;">
          <div style="background: #0284C7; color: #FFFFFF; padding: 3px 6px; font-size: 8.5px; font-weight: 800;">customer_groups</div>
          <div style="padding: 4px 6px; font-size: 8px; font-family: monospace; background: #F8FAFC;">
            <strong>id</strong>: int (PK)<br>
            group_name: str<br>
            group_size: int<br>
            arrival_time: datetime<br>
            reservation_time: datetime<br>
            priority: int<br>
            special_requirements: str<br>
            status: str
          </div>
        </div>

        <!-- Box 3: Waiters -->
        <div style="flex: 1; border: 1.5px solid #10B981; border-radius: 4px; overflow: hidden;">
          <div style="background: #10B981; color: #FFFFFF; padding: 3px 6px; font-size: 8.5px; font-weight: 800;">waiters</div>
          <div style="padding: 4px 6px; font-size: 8px; font-family: monospace; background: #F8FAFC;">
            <strong>id</strong>: int (PK)<br>
            name: str<br>
            availability: bool<br>
            max_tables: int (4)<br>
            assigned_tables: int<br>
            completed_orders: int<br>
            workload_score: float
          </div>
        </div>

        <!-- Box 4: Allocations & Reservations -->
        <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; overflow: hidden;">
          <div style="background: #E65100; color: #FFFFFF; padding: 3px 6px; font-size: 8.5px; font-weight: 800;">allocations &amp; resv</div>
          <div style="padding: 4px 6px; font-size: 8px; font-family: monospace; background: #F8FAFC;">
            <strong>alloc.id</strong>: int (PK)<br>
            customer_group_id: FK<br>
            table_id: FK<br>
            waiter_id: FK<br>
            algorithm_used: str<br>
            <strong>resv.id</strong>: int (PK)<br>
            customer_name: str<br>
            reservation_date: str
          </div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 3.3: Complete Entity-Relationship (ER) Relational Database Schema Diagram</div>

    <table class="report-table" style="font-size: 9px;">
      <thead>
        <tr>
          <th>Entity Name</th>
          <th>Table Name</th>
          <th>Primary Key</th>
          <th>Key Attributes &amp; Relationships</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>RestaurantTable</strong></td>
          <td><code class="badge-code">restaurant_tables</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>14 active tables; unique table_number, capacity (2–8), location, status, current_group_id (FK), current_waiter_id (FK).</td>
        </tr>
        <tr>
          <td><strong>CustomerGroup</strong></td>
          <td><code class="badge-code">customer_groups</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Party name, group size, arrival timestamp, priority (1=Normal, 2=VIP, 3=High), requirements, status (WAITING, SEATED, COMPLETED).</td>
        </tr>
        <tr>
          <td><strong>Waiter</strong></td>
          <td><code class="badge-code">waiters</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Server name, availability flag, max_tables capacity (4), active assigned_tables count, dynamic workload_score (assigned/max).</td>
        </tr>
        <tr>
          <td><strong>Reservation</strong></td>
          <td><code class="badge-code">reservations</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Guest name, party size, reservation date (YYYY-MM-DD), time (HH:MM), special requests, status (CONFIRMED, SEATED, CANCELLED), table_id (FK).</td>
        </tr>
        <tr>
          <td><strong>Allocation</strong></td>
          <td><code class="badge-code">allocations</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Audit trail: customer_group_id (FK), table_id (FK), waiter_id (FK), allocation_time, algorithm_used, allocation_reason.</td>
        </tr>
        <tr>
          <td><strong>ServicePolicy</strong></td>
          <td><code class="badge-code">service_policies</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Policy name, description text, policy category (ALLOCATION, RESERVATION, OVERTIME), active status flag.</td>
        </tr>
        <tr>
          <td><strong>User</strong></td>
          <td><code class="badge-code">users</code></td>
          <td><code class="badge-code">id</code> (int)</td>
          <td>Authentication entity: google_id (UK), email (UK), name, picture URL, role (MANAGER, HOST, ADMIN), active flag.</td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 3.1: Relational Database Schema Entity Specifications (SQLAlchemy Models)</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 16</span>
  </div>
</div>
"""
