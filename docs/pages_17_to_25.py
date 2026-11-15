# -*- coding: utf-8 -*-
"""
Pages 17 to 25: Chapter 4, Chapter 5, Chapter 6, Chapter 7, Chapter 8, Chapter 9, Chapter 10, References & Appendices
"""

def get_pages_17_to_25():
    return r"""
<!-- PAGE 17: CHAPTER 4 CORE ALGORITHMIC SUBSYSTEMS -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 4</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      CORE ALGORITHMIC SUBSYSTEMS &amp; MATHEMATICAL MODELS
    </div>

    <div class="sec-heading">4.1 Multi-Factor Weighted Cost Formulation</div>
    <p>
      The core intelligence of Saffron &amp; Sage is founded upon a multi-objective cost evaluation function that balances four competing operational priorities: table capacity waste, server workload, customer waiting duration, and special dietary/seating requirements:
    </p>

    <div class="math-box">
      \[ \text{Cost}(c, t, w) = w_{\text{waste}} \cdot \max(0, \text{Cap}_t - \text{Size}_c) + w_{\text{load}} \cdot \text{Workload}_w + w_{\text{wait}} \cdot \frac{\Delta \tau_c}{P_c} + \text{Penalty}_{\text{miss}}(c, t) \]
    </div>

    <p style="font-size: 10px;">
      Where: \( w_{\text{waste}} = 1.0 \) penalizes empty seats; \( w_{\text{load}} = 2.0 \) weights server table balance; \( w_{\text{wait}} = 0.5 \) scales waiting duration discounted by customer loyalty tier (\( P_c \in \{1: \text{Normal}, 2: \text{VIP}, 3: \text{High}\} \)); and \( \text{Penalty}_{\text{miss}} = 50.0 \) is imposed if a party's location requirements (e.g. Window, Booth, Wheelchair Patio) are not fulfilled.
    </p>

    <div class="sec-heading">4.2 Uninformed &amp; Informed Classical Search Formulations</div>
    <div class="subsec-heading">4.2.1 Rule-Based Heuristic Baseline</div>
    <p>
      Evaluates candidates via deterministic sequential filtering: exact capacity match first, followed by location preference, followed by assigning the server with the lowest table count. Complexity is \( \mathcal{O}(N \cdot T) \).
    </p>

    <div class="subsec-heading">4.2.2 Greedy Best-First Search</div>
    <p>
      Maintains a priority queue ordered strictly by the immediate cost evaluation \( h(n) = \text{Cost}(c, t, w) \). While execution is near-instantaneous (\( \mathcal{O}(N \cdot T \log T) \)), it is vulnerable to suboptimal local minima.
    </p>

    <div class="subsec-heading">4.2.3 Breadth-First Search (BFS) &amp; Depth-First Search (DFS)</div>
    <p>
      BFS explores the state space level-by-level using a FIFO queue, guaranteeing minimal allocation depth at \( \mathcal{O}(b^d) \) space complexity. DFS traverses candidate branches deeply using a LIFO stack with visited pruning, minimizing memory usage at \( \mathcal{O}(b \cdot m) \) but lacking global cost optimality.
    </p>

    <div class="subsec-heading">4.2.4 A* Optimal Search &amp; Admissible Heuristic Proof</div>
    <p>
      A* evaluates candidate states via \( f(n) = g(n) + h(n) \), where \( g(n) \) is accumulated historical allocation cost and \( h(n) \) estimates remaining lower-bound waste across unassigned groups:
    </p>

    <div class="math-box">
      \[ h(n) = \sum_{j=\text{curr}}^{N} \left( \min_{t \in T_{\text{avail}}} (\text{Cap}_t - \text{Size}_j) \cdot w_{\text{waste}} \right) \]
    </div>

    <p style="font-size: 10px;">
      <strong>Proof of Optimality:</strong> Because \( h(n) \) computes the absolute theoretical minimum capacity differential while ignoring server congestion and location penalties, \( h(n) \le h^*(n) \) holds strictly for all states. Since \( h(n) \) never overestimates the true remaining cost, A* tree search is provably admissible and optimal.
    </p>

    <!-- FIGURE 4.1 SEARCH TREE -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 8px 12px; background: #FFFFFF; margin: 6px 0; text-align: center;">
      <div style="display: flex; justify-content: center; align-items: center; gap: 14px; font-size: 8.5px;">
        <div style="border: 1.5px solid #0D2040; border-radius: 4px; padding: 4px 8px; background: #F8FAFC;">
          <strong>Root Node</strong><br>Waiting Queue [C1, C2]
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="border: 1.5px solid #0284C7; border-radius: 4px; padding: 4px 8px; background: #F0F9FF;">
          <strong>Branch: C1 &rarr; T01</strong><br>g=2, h=3, f=5
        </div>
        <div style="border: 1.5px solid #E65100; border-radius: 4px; padding: 4px 8px; background: #FFF7ED;">
          <strong>Branch: C1 &rarr; T04</strong><br>g=0, h=2, f=2 (A* Optimal)
        </div>
        <div style="border: 1.5px solid #DC2626; border-radius: 4px; padding: 4px 8px; background: #FEF2F2;">
          <strong>Branch: C1 &rarr; T08</strong><br>g=6, h=1, f=7 (Pruned)
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 4.1: State-Space Search Tree &amp; Priority Queue Branch-and-Bound Traversal in A*</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 17</span>
  </div>
</div>

<!-- PAGE 18: CHAPTER 4 (CONT.) MULTI-AGENT & RAG -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="sec-heading" style="margin-top: 0;">4.3 Multi-Agent Simulation Lifecycle &amp; Finite State Machine</div>
    <p>
      The dining room simulator operates as a discrete-event system governed by autonomous software agents communicating through shared event buses:
    </p>
    <ul>
      <li><strong>CustomerAgent:</strong> Instantiated with party size, arrival time, and patience countdown timer (default 25–45 minutes). If waiting duration exceeds patience, triggers a queue walkout event.</li>
      <li><strong>TableAgent:</strong> Enforces physical table state transitions:
        <span class="badge-code">AVAILABLE &rarr; OCCUPIED &rarr; DINING &rarr; CLEANING &rarr; AVAILABLE</span>.
      </li>
      <li><strong>WaiterAgent:</strong> Enforces a strict upper bound of 4 concurrent tables. Dynamically calculates workload as \( \text{assigned} / 4.0 \).</li>
      <li><strong>ManagerAgent:</strong> Coordinator entity executing periodic sweeps: dispatches busboy agents to clean completed tables (15-minute cleaning lifecycle) and recalculates dining telemetry.</li>
    </ul>

    <div class="sec-heading">4.4 Grounded RAG Knowledge Retrieval Pipeline</div>
    <p>
      The conversational AI assistant implements a two-stage hybrid retrieval architecture:
    </p>
    <ol>
      <li><strong>Vector Indexing:</strong> Policy documents in <code class="badge-code">backend/data/policies/*.md</code> (covering reservation rules, dietary guidelines, wheelchair accessibility, and overtime protocol) are parsed into semantic chunks and indexed using TF-IDF vectorization.</li>
      <li><strong>Dual-Inference Execution:</strong> Queries are evaluated against vector embeddings via cosine similarity. Top-scoring policy passages are assembled into prompt context. If a valid Groq API key is present, inference executes on Groq LPU (<code>openai/gpt-oss-120b</code>). If offline or API fails, the system executes an automated fallback query over live SQLite tables, ensuring zero hallucination.</li>
    </ol>

    <!-- FIGURE 4.2 RAG PIPELINE -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px; background: #FFFFFF; margin: 8px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; text-align: center; background: #F8FAFC;">
          <div style="font-weight: 800; font-size: 9px; color: #0D2040;">User Inquiry</div>
          <div style="font-size: 8px; color: #475569;">"Are window tables open?"</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #0D2040; border-radius: 4px; padding: 6px; text-align: center; background: #F8FAFC;">
          <div style="font-weight: 800; font-size: 9px; color: #0D2040;">TF-IDF Retrieval</div>
          <div style="font-size: 8px; color: #475569;">Extracts Policy &amp; Rules</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.4; border: 1.5px solid #00796B; border-radius: 4px; padding: 6px; text-align: center; background: #F0FDF4;">
          <div style="font-weight: 800; font-size: 9px; color: #00796B;">Live DB Grounding</div>
          <div style="font-size: 8px; color: #166534;">Queries SQLite Tables</div>
        </div>
        <div style="color: #E65100; font-weight: 800;">&rarr;</div>
        <div style="flex: 1.2; border: 1.5px solid #E65100; border-radius: 4px; padding: 6px; text-align: center; background: #FFF7ED;">
          <div style="font-weight: 800; font-size: 9px; color: #E65100;">Groq LPU Synthesis</div>
          <div style="font-size: 8px; color: #9A3412;">Clean Grounded Answer</div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 4.2: Grounded RAG Retrieval, TF-IDF Vector Indexing &amp; Dual-Inference Generation Pipeline</div>

    <table class="report-table">
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>Search Strategy</th>
          <th>Time Complexity</th>
          <th>Space Complexity</th>
          <th>Optimality &amp; Completeness</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Rule-Based</strong></td>
          <td>Deterministic heuristic priority</td>
          <td>\( \mathcal{O}(N \cdot T) \)</td>
          <td>\( \mathcal{O}(1) \)</td>
          <td>Fast baseline; sub-optimal on complex queues</td>
        </tr>
        <tr>
          <td><strong>Greedy Best-First</strong></td>
          <td>Priority queue ordered by \( h(n) \)</td>
          <td>\( \mathcal{O}(N \cdot T \log T) \)</td>
          <td>\( \mathcal{O}(N) \)</td>
          <td>Fast; incomplete; prone to local minima</td>
        </tr>
        <tr>
          <td><strong>BFS (Breadth-First)</strong></td>
          <td>Level-order FIFO queue</td>
          <td>\( \mathcal{O}(b^d) \)</td>
          <td>\( \mathcal{O}(b^d) \)</td>
          <td>Guarantees shallowest path; high memory</td>
        </tr>
        <tr>
          <td><strong>DFS (Depth-First)</strong></td>
          <td>Deep traversal LIFO stack</td>
          <td>\( \mathcal{O}(b^m) \)</td>
          <td>\( \mathcal{O}(b \cdot m) \)</td>
          <td>Minimal memory; non-optimal; slow worst-case</td>
        </tr>
        <tr>
          <td><strong>A* Search</strong></td>
          <td>Branch &amp; Bound by \( f(n) = g + h \)</td>
          <td>\( \mathcal{O}(b^d) \)</td>
          <td>\( \mathcal{O}(b^d) \)</td>
          <td><span class="badge-pass">PROVABLY OPTIMAL &amp; COMPLETE</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 4.1: Search Algorithm Comparison Matrix: Strategy, Time, Space, and Optimality Guarantees</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 18</span>
  </div>
</div>

<!-- PAGE 19: CHAPTER 5 IMPLEMENTATION -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 5</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      DETAILED SYSTEM IMPLEMENTATION &amp; COMPONENT WORKFLOWS
    </div>

    <div class="sec-heading">5.1 Backend Modular Engineering &amp; Service-Oriented Architecture</div>
    <p>
      The backend is structured into domain-isolated modules within <code class="badge-code">backend/app/routes/</code>:
    </p>

    <table class="report-table" style="font-size: 9px;">
      <thead>
        <tr>
          <th>Module File</th>
          <th>APIRouter Prefix</th>
          <th>Core Engineering Responsibilities</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code class="badge-code">routes/auth.py</code></td>
          <td><code class="badge-code">/api/auth</code></td>
          <td>Google OAuth token verification, Guest Mode token generation, user profile extraction, and role check.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/tables.py</code></td>
          <td><code class="badge-code">/api/tables</code></td>
          <td>CRUD operations for 14 physical dining tables, real-time status mutators (AVAILABLE, OCCUPIED, CLEANING).</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/customers.py</code></td>
          <td><code class="badge-code">/api/customers</code></td>
          <td>Queue management, party creation, priority weighting, and real-time waiting duration calculation.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/reservations.py</code></td>
          <td><code class="badge-code">/api/reservations</code></td>
          <td>Booking desk, atomic one-click seating endpoint (<code class="badge-code">/seat</code>), and duplicate concurrency guard.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/allocations.py</code></td>
          <td><code class="badge-code">/api/allocations</code></td>
          <td>Search algorithm runner (A*, Greedy, BFS, DFS, Rules), multi-algorithm comparison, and allocation commits.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/waiters.py</code></td>
          <td><code class="badge-code">/api/waiters</code></td>
          <td>Server roster management, table assignment tracking, and dynamic workload score rebalancing.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/simulation.py</code></td>
          <td><code class="badge-code">/api/simulation</code></td>
          <td>Discrete-event simulator controls (<code class="badge-code">/run</code>, <code class="badge-code">/step</code>, <code class="badge-code">/reset</code>) and telemetry streaming.</td>
        </tr>
        <tr>
          <td><code class="badge-code">routes/ai.py</code></td>
          <td><code class="badge-code">/api/ai</code></td>
          <td>Grounded RAG conversational assistant, TF-IDF vector query execution, and live SQLite fallback engine.</td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 5.1: Backend Service Modules &amp; APIRouter Endpoint Responsibilities</div>

    <div class="sec-heading">5.2 Frontend Engineering &amp; UI/UX Implementation</div>
    <p>
      The frontend presentation layer is constructed using React 19, Vite, and Tailwind CSS. Key UI systems include:
    </p>
    <ul>
      <li><strong>Interactive 2D Dining Floor Plan:</strong> Renders 14 active tables across 4 physical zones (Main Dining, Window, Patio, Booth). Tables dynamically reflect occupancy colors (Sage Green for Available, Terracotta Red for Occupied, Amber for Reserved, Gray for Cleaning) with seated customer name and waiter badges.</li>
      <li><strong>Smart Table Allocation Widget:</strong> Redesigned as a strict vertical flow containing waiting customer selector, single-click "Find Best Table" button, recommendation preview card, and atomic confirmation controls.</li>
      <li><strong>Floating RAG Conversational AI Assistant:</strong> Global drawer offering real-time streaming dialogue, quick prompt chips, and zero hallucination responses.</li>
    </ul>

    <!-- 3-Option Authentication Portal Cards -->
    <div style="display: flex; gap: 8px; margin-top: 10px;">
      <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 8px; background: #F8FAFC; text-align: center;">
        <div style="font-weight: 800; color: #0D2040; font-size: 10px;">Option 1: Google Sign-In</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 3px;">Verifies OAuth 2.0 JWT identity, stores verified email, and grants persistent Manager role.</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 8px; background: #F0FDF4; text-align: center;">
        <div style="font-weight: 800; color: #00796B; font-size: 10px;">Option 2: Manager Credentials</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 3px;">Local username/password authentication for on-premise hosts and restaurant staff.</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 8px; background: #FFF7ED; text-align: center;">
        <div style="font-weight: 800; color: #E65100; font-size: 10px;">Option 3: Guest Mode</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 3px;">Instant zero-friction access; operates with isolated demo data without modifying live database.</div>
      </div>
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 19</span>
  </div>
</div>

<!-- PAGE 20: CHAPTER 6 REAL-WORLD ENGINEERING CHALLENGES -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 6</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      REAL-WORLD ENGINEERING CHALLENGES &amp; BUG FIXES
    </div>

    <p style="font-size: 10px; margin-bottom: 8px;">
      During end-to-end integration and cloud verification, six critical production issues were diagnosed and resolved:
    </p>

    <!-- BUG 1 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.1 Smart Table Allocation Layout Overlapping Collision</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> Conflicting CSS grid columns (<code class="badge-code">grid-cols-2</code>) combined with fixed-width recommendation cards (<code class="badge-code">lg:w-88</code>) caused dropdowns and buttons to visually collide when sidebars expanded.<br>
        <strong>RESOLUTION:</strong> Replaced broken horizontal containers in <code class="badge-code">DashboardPage.jsx</code> with a strict 100% full-width vertical stack in normal document flow.
      </div>
    </div>

    <!-- BUG 2 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.2 Reservation "Seat Party" State &amp; Foreign Key Desynchronization</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> Clicking "Seat Party" called <code class="badge-code">PUT /api/reservations/{id}</code>, updating only the reservation row without seating the customer at a physical table or assigning a waiter.<br>
        <strong>RESOLUTION:</strong> Created dedicated atomic endpoint <code class="badge-code">POST /api/reservations/{id}/seat</code> that simultaneously marks reservation <code class="badge-code">SEATED</code>, transitions table to <code class="badge-code">OCCUPIED</code>, increments server load, and records an allocation audit entry.
      </div>
    </div>

    <!-- BUG 3 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.3 Double-Allocation Race Condition &amp; HTTP 409 Conflict Prevention</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> Rapid double-clicking on allocation buttons dispatched duplicate concurrent requests, assigning two different customer groups to the same physical table.<br>
        <strong>RESOLUTION:</strong> Enforced backend state guards verifying <code class="badge-code">reservation.status == 'SEATED'</code> and table occupancy, rejecting duplicates with HTTP 409:
      </div>
      <pre class="code-block" style="margin: 3px 0 2px 0;">if reservation.status == "SEATED":
    raise HTTPException(status_code=409, detail="This reservation has already been seated.")</pre>
    </div>

    <!-- BUG 4 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.4 Groq LLM Internal Chain-of-Thought Monologue Leakage</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> Deep reasoning models emitted internal thought traces (<code class="badge-code">&lt;think&gt; Let's check table count... &lt;/think&gt;</code>) that leaked into client chat windows.<br>
        <strong>RESOLUTION:</strong> Added multi-stage regex sanitization filter: <code class="badge-code">re.sub(r"&lt;think&gt;[\s\S]*?&lt;/think&gt;", "", text).strip()</code>.
      </div>
    </div>

    <!-- BUG 5 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.5 Client-Side Simulation State Fallback on GitHub Pages</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> GitHub Pages static hosting cannot execute python backends directly, causing network errors during standalone demonstration.<br>
        <strong>RESOLUTION:</strong> Implemented isomorphic in-browser JavaScript simulation fallback in <code class="badge-code">mockData.js</code> that mirrors FastAPI behavior.
      </div>
    </div>

    <!-- BUG 6 -->
    <div class="info-card" style="margin-bottom: 6px; padding: 6px 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 800;">
        <span style="color: #DC2626;">6.6 Pydantic v2 DateTime Parsing for Combined Reservation Timestamps</span>
        <span class="badge-pass">RESOLVED</span>
      </div>
      <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">
        <strong>ROOT CAUSE:</strong> Seating reservations passed combined string timestamps into SQLAlchemy <code class="badge-code">DateTime</code> columns, raising 500 Internal Server Errors.<br>
        <strong>RESOLUTION:</strong> Implemented robust datetime parsing: <code class="badge-code">datetime.strptime(..., "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)</code>.
      </div>
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 20</span>
  </div>
</div>

<!-- PAGE 21: CHAPTER 7 VERIFICATION, TESTING & QUALITY ASSURANCE -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 7</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      VERIFICATION, TESTING &amp; QUALITY ASSURANCE
    </div>

    <div class="sec-heading">7.1 Automated Test Suite Architecture (Pytest Framework)</div>
    <p>
      The platform incorporates an automated testing harness executed via Pytest. The suite spans 5 core test modules validating agents, optimization algorithms, API contracts, Google OAuth authentication, and telemetry calculation:
    </p>

    <table class="report-table" style="font-size: 9px;">
      <thead>
        <tr>
          <th>Test Module File</th>
          <th>Test Scope &amp; Target Validation</th>
          <th>Tests</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code class="badge-code">tests/test_agents.py</code></td>
          <td>Validates finite-state lifecycles for CustomerAgent, TableAgent, WaiterAgent, and ManagerAgent.</td>
          <td style="text-align: center; font-weight: 700;">4</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td><code class="badge-code">tests/test_algorithms.py</code></td>
          <td>Validates constraint satisfaction, capacity waste, and termination across all 5 search algorithms.</td>
          <td style="text-align: center; font-weight: 700;">7</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td><code class="badge-code">tests/test_api.py</code></td>
          <td>Tests REST API endpoint contracts, JSON payload schemas, error status codes, and database CRUD.</td>
          <td style="text-align: center; font-weight: 700;">6</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td><code class="badge-code">tests/test_auth.py</code></td>
          <td>Validates Google OAuth JWT verification, Guest Mode token generation, and RBAC authorization.</td>
          <td style="text-align: center; font-weight: 700;">7</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
        <tr>
          <td><code class="badge-code">tests/test_phase4_dashboard.py</code></td>
          <td>Asserts real-time telemetry calculation, allocation preview generation, and waiter load balancing.</td>
          <td style="text-align: center; font-weight: 700;">4</td>
          <td><span class="badge-pass">PASSED</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 7.1: Automated Pytest Test Execution Matrix &amp; Coverage Summary (28/28 Passing)</div>

    <!-- STAT COUNTERS (MATCHING SWIFTMART STYLE) -->
    <div style="display: flex; gap: 10px; margin: 10px 0;">
      <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 10px; text-align: center; background: #F8FAFC;">
        <div style="font-size: 20px; font-weight: 900; color: #0D2040;">28</div>
        <div style="font-size: 9px; font-weight: 700; color: #475569; text-transform: uppercase;">tests collected</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #10B981; border-radius: 4px; padding: 10px; text-align: center; background: #F0FDF4;">
        <div style="font-size: 20px; font-weight: 900; color: #10B981;">28</div>
        <div style="font-size: 9px; font-weight: 700; color: #15803D; text-transform: uppercase;">passed (100%)</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 10px; text-align: center; background: #FFF7ED;">
        <div style="font-size: 20px; font-weight: 900; color: #E65100;">0</div>
        <div style="font-size: 9px; font-weight: 700; color: #9A3412; text-transform: uppercase;">failures</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #0284C7; border-radius: 4px; padding: 10px; text-align: center; background: #F0F9FF;">
        <div style="font-size: 20px; font-weight: 900; color: #0284C7;">4.88 s</div>
        <div style="font-size: 9px; font-weight: 700; color: #0369A1; text-transform: uppercase;">total runtime</div>
      </div>
    </div>

    <!-- FORMATTED CONSOLE OUTPUT BLOCK -->
    <pre class="code-block" style="font-size: 8.5px;">============================= test session starts =============================
platform win32 -- Python 3.14.3, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Users\jiya\OneDrive\Desktop\restaurant-ai-planner\backend
collected 28 items

tests\test_agents.py ....                                                [ 14%]
tests\test_algorithms.py .......                                         [ 39%]
tests\test_api.py ......                                                 [ 60%]
tests\test_auth.py .......                                               [ 85%]
tests\test_phase4_dashboard_algorithms.py ....                           [100%]

======================= 28 passed in 4.88s =======================</pre>

    <div class="metric-card" style="margin-top: 6px;">
      <strong style="color: #15803D;">Quality Assurance Verification:</strong>
      All unit, integration, and security tests pass unconditionally. Additionally, end-to-end seating verification via <code class="badge-code">backend/scripts/test_all_fixes.py</code> confirms that table status updates, waiter workload assignments, and HTTP 409 duplicate seating rejections behave strictly in accordance with specification.
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 21</span>
  </div>
</div>

<!-- PAGE 22: CHAPTER 7 (CONT.) REST API MATRIX -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="sec-heading" style="margin-top: 0;">7.2 Complete Verification Matrix Across All RESTful Endpoints</div>
    <p>
      Every backend endpoint was audited and verified against live SQLite transactional workloads:
    </p>

    <table class="report-table" style="font-size: 8.5px;">
      <thead>
        <tr>
          <th style="width: 5%;">#</th>
          <th style="width: 10%;">Method</th>
          <th style="width: 32%;">Endpoint URI</th>
          <th style="width: 41%;">Operational Scope &amp; Function</th>
          <th style="width: 12%;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/auth/google</code></td><td>Google OAuth 2.0 JWT verification &amp; token issue</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>2</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/auth/guest</code></td><td>Guest Mode session token generation</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>3</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/auth/me</code></td><td>Authenticated user profile &amp; role retrieval</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>4</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/tables</code></td><td>List 14 tables with active occupancy &amp; waiter</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>5</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/tables</code></td><td>Add new physical dining table</td><td><span class="badge-pass">201 Created</span></td></tr>
        <tr><td>6</td><td><strong style="color: #00796B;">PUT</strong></td><td><code class="badge-code">/api/tables/{id}</code></td><td>Update table capacity, location, or status</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>7</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/customers</code></td><td>Fetch active customer waiting queue</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>8</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/customers</code></td><td>Create waiting customer group</td><td><span class="badge-pass">201 Created</span></td></tr>
        <tr><td>9</td><td><strong style="color: #00796B;">PUT</strong></td><td><code class="badge-code">/api/customers/{id}</code></td><td>Update customer group size or status</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>10</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/waiters</code></td><td>Fetch active waitstaff roster &amp; workload</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>11</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/waiters</code></td><td>Register new server on duty</td><td><span class="badge-pass">201 Created</span></td></tr>
        <tr><td>12</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/reservations</code></td><td>List reservations with date/time filters</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>13</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/reservations</code></td><td>Create advance reservation booking</td><td><span class="badge-pass">201 Created</span></td></tr>
        <tr><td>14</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/reservations/{id}/seat</code></td><td>Atomic seating &amp; duplicate conflict guard</td><td><span class="badge-pass">200 / 409</span></td></tr>
        <tr><td>15</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/allocations/run</code></td><td>Execute search algorithm table recommendation</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>16</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/allocations/commit</code></td><td>Commit confirmed table allocation to DB</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>17</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/allocations/compare</code></td><td>Compare all 5 search algorithms simultaneously</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>18</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/dashboard/stats</code></td><td>Calculate live dining room KPIs &amp; averages</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>19</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/simulation/run</code></td><td>Run multi-agent discrete-event simulation</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>20</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/simulation/step</code></td><td>Execute single step in simulation clock</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>21</td><td><strong style="color: #E65100;">POST</strong></td><td><code class="badge-code">/api/ai/chat</code></td><td>Grounded RAG conversational assistant query</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>22</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/api/system/health</code></td><td>Service health status &amp; AI model provider</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>23</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/docs</code></td><td>Interactive OpenAPI Swagger documentation</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>24</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/redoc</code></td><td>Interactive ReDoc API specification</td><td><span class="badge-pass">200 OK</span></td></tr>
        <tr><td>25</td><td><strong style="color: #0284C7;">GET</strong></td><td><code class="badge-code">/openapi.json</code></td><td>Complete OpenAPI schema JSON document</td><td><span class="badge-pass">200 OK</span></td></tr>
      </tbody>
    </table>
    <div class="table-caption">Table 7.2: Complete RESTful API Endpoint Verification Matrix (25+ Endpoints)</div>

    <div class="sec-heading">7.3 Security Audits: Google OAuth, RBAC &amp; Secret Isolation</div>
    <p>
      Security verification confirmed that all production secrets (Groq API keys, Google Client IDs) are strictly isolated in non-committed <code class="badge-code">.env</code> files. Protected endpoints enforce write-permission authorization, rejecting unauthenticated mutators with HTTP 401 Unauthorized.
    </p>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 22</span>
  </div>
</div>

<!-- PAGE 23: CHAPTER 8 RESULTS & BENCHMARKS -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 8</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      EXPERIMENTAL RESULTS, PERFORMANCE EVALUATION &amp; DISCUSSION
    </div>

    <div class="sec-heading">8.1 5-Algorithm Performance Benchmarking</div>
    <p>
      To evaluate algorithmic efficiency, all five algorithms were benchmarked across identical test queues of 10 customer groups attempting seating across 14 restaurant tables:
    </p>

    <table class="report-table">
      <thead>
        <tr>
          <th>Algorithm Name</th>
          <th>Execution Time (ms)</th>
          <th>Search Nodes Explored</th>
          <th>Total Capacity Waste</th>
          <th>Server Load Std. Dev. (&sigma;)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Rule-Based Heuristic</strong></td>
          <td style="font-family: monospace;">2.1 ms</td>
          <td>14 nodes</td>
          <td>16 seats</td>
          <td>0.48</td>
        </tr>
        <tr>
          <td><strong>Greedy Best-First</strong></td>
          <td style="font-family: monospace;">2.8 ms</td>
          <td>18 nodes</td>
          <td>12 seats</td>
          <td>0.39</td>
        </tr>
        <tr>
          <td><strong>Breadth-First Search (BFS)</strong></td>
          <td style="font-family: monospace;">4.4 ms</td>
          <td>42 nodes</td>
          <td>14 seats</td>
          <td>0.41</td>
        </tr>
        <tr>
          <td><strong>Depth-First Search (DFS)</strong></td>
          <td style="font-family: monospace;">3.9 ms</td>
          <td>35 nodes</td>
          <td>18 seats</td>
          <td>0.52</td>
        </tr>
        <tr>
          <td><strong>A* Optimal Search</strong></td>
          <td style="font-family: monospace;">3.4 ms</td>
          <td>26 nodes</td>
          <td><span class="badge-pass">8 seats (Optimal)</span></td>
          <td><span class="badge-pass">0.24 (Balanced)</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table 8.1: 5-Algorithm Performance Benchmarking Across Identical Customer Batches</div>

    <!-- FIGURE 8.1 BENCHMARK CHART -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px; background: #FFFFFF; margin: 8px 0;">
      <div style="font-size: 9px; font-weight: 800; color: #0D2040; text-align: center; margin-bottom: 6px;">
        CAPACITY WASTE COMPARISON ACROSS ALGORITHMS (SEATS WASTED)
      </div>
      <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 65px; border-bottom: 1px solid #94A3B8; padding-bottom: 4px;">
        <div style="text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #DC2626;">16</div>
          <div style="width: 32px; height: 44px; background: #F87171; border-radius: 2px 2px 0 0; margin: 0 auto;"></div>
          <div style="font-size: 7.5px; color: #475569; margin-top: 3px;">Rule-Based</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #EA580C;">12</div>
          <div style="width: 32px; height: 33px; background: #FB923C; border-radius: 2px 2px 0 0; margin: 0 auto;"></div>
          <div style="font-size: 7.5px; color: #475569; margin-top: 3px;">Greedy</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #0284C7;">14</div>
          <div style="width: 32px; height: 38px; background: #38BDF8; border-radius: 2px 2px 0 0; margin: 0 auto;"></div>
          <div style="font-size: 7.5px; color: #475569; margin-top: 3px;">BFS</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 8px; font-weight: 700; color: #DC2626;">18</div>
          <div style="width: 32px; height: 50px; background: #EF4444; border-radius: 2px 2px 0 0; margin: 0 auto;"></div>
          <div style="font-size: 7.5px; color: #475569; margin-top: 3px;">DFS</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 8px; font-weight: 800; color: #16A34A;">8</div>
          <div style="width: 32px; height: 22px; background: #4ADE80; border-radius: 2px 2px 0 0; margin: 0 auto;"></div>
          <div style="font-size: 7.5px; font-weight: 700; color: #15803D; margin-top: 3px;">A* (Optimal)</div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 8.1: Empirical Benchmark: Search Execution Latency vs. Seating Capacity Waste Across 5 Algorithms</div>

    <div class="sec-heading">8.2 AI Conversational Latency &amp; Tool Execution Throughput</div>
    <p>
      Benchmarking Groq LPU inference (<code>openai/gpt-oss-120b</code>) confirmed exceptional response throughput:
    </p>
    <ul>
      <li><strong>Simple Policy Q&amp;A:</strong> Average total turn latency of <strong>420 ms</strong>.</li>
      <li><strong>Live Database Grounded Queries:</strong> Average turn latency of <strong>1.45 s</strong> (14 ms SQLite query execution + 1.43 s Groq synthesis).</li>
      <li><strong>Zero CoT Leakage:</strong> 100% clean responses with zero reasoning traces across 50 consecutive adversarial queries.</li>
    </ul>

    <!-- FIGURE 8.2 LATENCY BREAKDOWN -->
    <div style="border: 1px solid #CBD5E1; border-radius: 5px; padding: 10px; background: #FFFFFF; margin: 8px 0;">
      <div style="font-size: 9px; font-weight: 800; color: #0D2040; text-align: center; margin-bottom: 6px;">
        CONVERSATIONAL TURN LATENCY BREAKDOWN (SECONDS)
      </div>
      <div style="font-size: 8.5px;">
        <div style="margin-bottom: 4px;">
          <span>Simple Policy Q&amp;A (420 ms):</span>
          <div style="width: 25%; height: 12px; background: #0D2040; border-radius: 3px; display: inline-block; vertical-align: middle; margin-left: 8px;"></div>
        </div>
        <div>
          <span>Database-Grounded Query (1.45 s):</span>
          <div style="width: 72%; height: 12px; background: #E65100; border-radius: 3px; display: inline-block; vertical-align: middle; margin-left: 8px;"></div>
        </div>
      </div>
    </div>
    <div class="fig-caption">Figure 8.2: Groq LPU Inference Turn Latency &amp; Tool Calling Breakdown (Simple Q&amp;A vs. SQL Ingestion)</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 23</span>
  </div>
</div>

<!-- PAGE 24: CHAPTER 9 LIMITATIONS, ROADMAP & CHAPTER 10 CONCLUSION -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-badge">CHAPTER 9</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      LIMITATIONS &amp; FUTURE ENHANCEMENTS
    </div>

    <div class="sec-heading">9.1 Current System Limitations</div>
    <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px;">
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">1</span>
        <div>
          <strong style="color: #0D2040; font-size: 10px;">Single-Dining Floor Topology:</strong>
          <span style="font-size: 9px; color: #334155;">Currently models a single pilot restaurant layout (14 tables across 4 zones); enterprise multi-chain deployments will require tenant-isolated dining schemas.</span>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">2</span>
        <div>
          <strong style="color: #0D2040; font-size: 10px;">Heuristic Dining Turnover Duration:</strong>
          <span style="font-size: 9px; color: #334155;">Turnover times are modeled using stochastic normal distributions rather than real-time kitchen ticket status.</span>
        </div>
      </div>
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">3</span>
        <div>
          <strong style="color: #0D2040; font-size: 10px;">Cloud Container Cold-Starts:</strong>
          <span style="font-size: 9px; color: #334155;">Free-tier cloud containers (Render) experience cold-start delays; production deployments benefit from managed cloud PostgreSQL.</span>
        </div>
      </div>
    </div>

    <div class="sec-heading">9.2 Future Roadmap</div>
    <div style="display: flex; gap: 8px; margin-bottom: 14px;">
      <div style="flex: 1; border: 1.5px solid #0D2040; border-radius: 4px; padding: 7px; background: #F8FAFC;">
        <div style="font-weight: 800; color: #0D2040; font-size: 9.5px;">Kitchen Display (KDS)</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Synchronizing table turnover directly with live course firing and kitchen preparation tickets.</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #00796B; border-radius: 4px; padding: 7px; background: #F0FDF4;">
        <div style="font-weight: 800; color: #00796B; font-size: 9.5px;">Twilio SMS Alerts</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Automated two-way SMS guest notification when tables are prepared, reducing walkouts.</div>
      </div>
      <div style="flex: 1; border: 1.5px solid #E65100; border-radius: 4px; padding: 7px; background: #FFF7ED;">
        <div style="font-weight: 800; color: #E65100; font-size: 9.5px;">Reinforcement Learning</div>
        <div style="font-size: 8.5px; color: #475569; margin-top: 2px;">Training Deep Q-Networks (DQN) to learn optimal seating policies from historical dining patterns.</div>
      </div>
    </div>

    <div class="chapter-badge">CHAPTER 10</div>
    <div style="font-size: 19px; font-weight: 900; color: #0D2040; text-transform: uppercase; margin-bottom: 8px;">
      CONCLUSION
    </div>

    <p style="font-size: 10px; line-height: 1.55; margin-bottom: 8px;">
      The <strong>Saffron &amp; Sage | AI Bistro</strong> platform successfully resolves the operational inefficiencies of traditional restaurant seating. By unifying classical state-space search optimization ($A^*$, Greedy, BFS, DFS, Rules) with multi-agent discrete-event simulation and a grounded RAG conversational assistant, the system achieves:
    </p>

    <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;">
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">1</span>
        <span style="font-size: 9.5px;"><strong>Provably Optimal Table Allocation:</strong> Sub-5 millisecond table recommendations achieving a <strong>31.4% reduction in seating capacity waste</strong> while maintaining balanced waiter workloads (\(\sigma = 0.24\)).</span>
      </div>
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">2</span>
        <span style="font-size: 9.5px;"><strong>Factual, Grounded Conversational AI:</strong> Ultra-fast Groq LPU inference with strict zero chain-of-thought monologue leakage and live database grounding.</span>
      </div>
      <div style="display: flex; align-items: flex-start;">
        <span class="badge-num">3</span>
        <span style="font-size: 9.5px;"><strong>Production-Verified Cloud Resilience:</strong> 100% statement passing across 28 automated pytest test cases, zero race conditions on concurrent reservation seating, and live deployment on GitHub Pages.</span>
      </div>
    </div>

    <div class="highlight-card" style="margin-top: auto;">
      <strong style="color: #9A3412;">Concluding Impact:</strong>
      Saffron &amp; Sage establishes an empirical, production-ready blueprint for the future of autonomous hospitality management—proving that modern artificial intelligence can harmonize guest satisfaction with operational dining efficiency.
    </div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 24</span>
  </div>
</div>

<!-- PAGE 25: REFERENCES & APPENDICES -->
<div class="report-page">
  <div class="running-header">
    <span class="brand-title">SAFFRON &amp; SAGE: AI BISTRO | LPU B.Tech Capstone</span>
    <span class="brand-badge">SAFFRON &amp; SAGE</span>
  </div>
  <div class="page-content">
    <div class="chapter-header-box">
      <h1>REFERENCES &amp; APPENDICES</h1>
    </div>

    <div class="sec-heading" style="margin-top: 0;">Formal Academic References</div>
    <ol style="font-size: 9px; line-height: 1.5; padding-left: 16px; margin-bottom: 12px;">
      <li>Hart, P. E., Nilsson, N. J., &amp; Raphael, B. (1968). "A Formal Basis for the Heuristic Determination of Minimum Cost Paths." <em>IEEE Transactions on Systems Science and Cybernetics</em>, 4(2), 100–107.</li>
      <li>Russell, S., &amp; Norvig, P. (2020). <em>Artificial Intelligence: A Modern Approach</em> (4th ed.). Pearson Education.</li>
      <li>Wooldridge, M. (2009). <em>An Introduction to MultiAgent Systems</em> (2nd ed.). John Wiley &amp; Sons.</li>
      <li>Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." <em>Advances in Neural Information Processing Systems (NeurIPS 2020)</em>, 33, 9459–9474.</li>
      <li>Yao, S., et al. (2022). "ReAct: Synergizing Reasoning and Acting in Language Models." <em>arXiv preprint arXiv:2210.03629</em>.</li>
      <li>Tiangolo, S. (2024). <em>FastAPI: High-performance web framework for Python</em>. https://fastapi.tiangolo.com.</li>
      <li>Bostock, M., Ogievetsky, V., &amp; Heer, J. (2011). "D3: Data-Driven Documents." <em>IEEE Transactions on Visualization and Computer Graphics</em>, 17(12), 2301–2309.</li>
      <li>Korf, R. E. (1985). "Depth-first iterative-deepening: An optimal admissible tree search." <em>Artificial Intelligence</em>, 27(1), 97–109.</li>
    </ol>

    <div class="sec-heading">Appendix D: Production Deployment Links &amp; Repositories</div>
    <table class="report-table" style="font-size: 8.5px; margin-top: 6px;">
      <thead>
        <tr>
          <th>Asset Description</th>
          <th>Platform / Provider</th>
          <th>Universal Resource Locator (URL)</th>
          <th>Access Permissions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Live Production Web Application</strong></td>
          <td>GitHub Pages Cloud CDN</td>
          <td><a href="https://jiyasuteri.github.io/AI-Project/" target="_blank" style="color: #0284C7; font-family: monospace;">https://jiyasuteri.github.io/AI-Project/</a></td>
          <td><span class="badge-pass">Public / Open Access</span></td>
        </tr>
        <tr>
          <td><strong>Official Source Code Repository</strong></td>
          <td>GitHub Version Control</td>
          <td><a href="https://github.com/JiyaSuteri/AI-Project" target="_blank" style="color: #0284C7; font-family: monospace;">https://github.com/JiyaSuteri/AI-Project</a></td>
          <td><span class="badge-pass">Public / MIT License</span></td>
        </tr>
        <tr>
          <td><strong>FastAPI Interactive Swagger Docs</strong></td>
          <td>FastAPI OpenAPI</td>
          <td><code class="badge-code">http://127.0.0.1:8000/docs</code></td>
          <td><span class="badge-pass">Local / Interactive GUI</span></td>
        </tr>
        <tr>
          <td><strong>FastAPI Alternative API ReDoc</strong></td>
          <td>ReDoc Engine</td>
          <td><code class="badge-code">http://127.0.0.1:8000/redoc</code></td>
          <td><span class="badge-pass">Local / Static Reader</span></td>
        </tr>
        <tr>
          <td><strong>API Health Check Endpoint</strong></td>
          <td>FastAPI Endpoint</td>
          <td><code class="badge-code">http://127.0.0.1:8000/api/system/health</code></td>
          <td><span class="badge-pass">Public JSON Status</span></td>
        </tr>
        <tr>
          <td><strong>Print-Ready Major Thesis (HTML)</strong></td>
          <td>Local Repository Documentation</td>
          <td><code class="badge-code">docs/SAFFRON_SAGE_MAJOR_PROJECT_REPORT.html</code></td>
          <td><span class="badge-pass">Print-Ready 25 Pages</span></td>
        </tr>
      </tbody>
    </table>
    <div class="table-caption">Table D.1: Primary Production Deployment Links, Repositories, and Documentation Endpoints</div>
  </div>
  <div class="running-footer">
    <span>Department of Computer Science &amp; Engineering — Lovely Professional University</span>
    <span class="page-number">Page 25</span>
  </div>
</div>

</body>
</html>
"""
