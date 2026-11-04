# CSE276 Capstone Viva Preparation & Project Report Notes

## Project Title
**AI-Based Restaurant Table Allocation and Service Planner**

---

## 1. Executive Summary & Problem Formulation
In high-volume restaurant management, suboptimal table allocation leads to:
1. **Severe capacity waste**: Seating small parties of 2 at 6- or 8-top tables.
2. **Waiter burnout and customer wait bottlenecks**: Uneven workload distribution among service staff.
3. **Queue abandonment (reneging)**: Customer patience exhaustion due to unprioritized or delayed seating.
4. **Policy violations**: Failing to hold reservation grace periods or adhere to wheelchair accessibility requirements.

This project implements a full-stack automated restaurant service planner and simulator that combines discrete-event multi-agent simulation, classical AI state-space search algorithms (Rule-Based, Greedy Best-First, BFS, DFS, A*), and a grounded Retrieval-Augmented Generation (RAG) assistant.

---

## 2. Core AI Algorithms: Viva Questions & Answers

### Q1: Why is A* Search superior to Greedy and BFS for table allocation?
**Answer:**
- **BFS** explores state graphs level-by-level without considering cost functions. It guarantees the shortest path in terms of transition steps (i.e., seating customer groups), but ignores capacity waste and waiter workloads.
- **Greedy Search** chooses the locally lowest-cost assignment step-by-step without backtracking. If an early party takes the only 8-top table greedily, a later large party may be left completely unallocated (local minimum).
- **A\* Search** evaluates both the accumulated cost $g(n)$ and an admissible heuristic estimate of remaining cost $h(n)$:
  $$f(n) = g(n) + h(n)$$
  Because $h(n)$ provides an admissible lower bound ($h(n) \le h^*(n)$), A* prunes suboptimal branches and guarantees minimal total weighted service cost.

### Q2: What is the cost function used by the system?
**Answer:**
The cost for assigning a customer group $c$ to table $t$ and waiter $w$ is defined as:
$$\text{Cost} = w_{\text{waste}} \cdot \max(0, \text{Capacity}_t - \text{Size}_c) + w_{\text{workload}} \cdot \text{Load}_w + w_{\text{wait}} \cdot \frac{\text{WaitTime}_c}{\text{Priority}_c} + \text{Penalty}_{\text{mismatch}}$$
- $\text{Capacity Waste}$: Penalizes empty seats to preserve larger tables for subsequent large arrivals.
- $\text{Waiter Workload}$: Penalizes overburdened servers to maintain prompt table service.
- $\text{Wait Time}$: Scaled inversely by customer priority (VIP / delayed reservations).
- $\text{Penalty}_{\text{mismatch}}$: Added if requested zones (Window, Booth, Patio) are unmet.

### Q3: How is the admissible heuristic $h(n)$ designed?
**Answer:**
For any search state where $k$ groups remain unallocated:
$$h(n) = \sum_{i=\text{next}}^{\text{end}} \left( \min_{t \in \text{FreeTables, } \text{Cap}_t \ge \text{Size}_i} (\text{Cap}_t - \text{Size}_i) \cdot w_{\text{waste}} + \text{BaseWaitPenalty}_i \right)$$
Because this calculation ignores waiter workloads and location constraints (which can only *increase* true cost), $h(n)$ never overestimates the true remaining cost ($h(n) \le h^*(n)$). Hence, $h(n)$ is admissible.

---

## 3. Multi-Agent System Architecture

| Agent Type | State Machine & Responsibilities | Interaction Pattern |
| :--- | :--- | :--- |
| **Customer Agent** | States: `ARRIVED` $\to$ `WAITING` $\to$ `SEATED` $\to$ `COMPLETED` / `RENEGED`. Maintains party size, patience timer, and special requests. | Communicates arrival and queue renege events to Manager Agent. |
| **Table Agent** | States: `AVAILABLE` $\to$ `OCCUPIED` $\to$ `CLEANING` $\to$ `AVAILABLE`. Tracks capacity, location, and sanitation turnover timer. | Reports availability status to Manager Agent; locks during dining and cleaning. |
| **Waiter Agent** | Tracks assigned tables, workload scores, and completed orders. Max threshold (default 4 tables). | Accepts or rejects table assignments from Manager Agent based on threshold. |
| **Manager Agent** | High-level coordinator. Queries available tables and waiters; triggers AI search algorithms; enforces policies. | Mediates between all agents, logs events to live timeline and database. |

---

## 4. Grounded RAG Architecture & Fallback Mode

1. **Policy Document Store**: Indexed markdown files in `data/policies/` covering table allocation, reservations, waiter balancing, accessibility, and sanitation.
2. **Chunking & Indexing**: Documents are split by structural markdown headers and converted to term-frequency inverse-document frequency (TF-IDF) vector embeddings.
3. **Semantic Retrieval**: Queries calculate cosine similarity across all indexed policy chunks to extract top relevant sections.
4. **Live Grounding**: Real-time SQLite database states (free tables, current queue, waiter workloads) are injected into the context.
5. **Dual Mode Generation**:
   - **Claude API Mode**: When `ANTHROPIC_API_KEY` is configured, prompts Claude 3.5 Sonnet with injected live JSON state and policy chunks under strict non-hallucination instructions.
   - **Local Grounded Fallback**: When offline or without an API key, the system extracts factual parameters from live SQLite database models and matches policy rules directly, formatting structured outputs with direct answers, citations, and actionable recommendations.
