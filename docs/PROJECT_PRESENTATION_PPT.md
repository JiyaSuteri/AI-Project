# Saffron & Sage AI Bistro — Capstone Presentation (CSE276)

**Project Name:** AI-Based Restaurant Table Allocation and Service Planner  
**Student:** Jiya Suteri | **Institution:** Lovely Professional University  
**Live App:** https://jiyasuteri.github.io/AI-Project/  
**GitHub:** https://github.com/JiyaSuteri/AI-Project  

---

## Slide 1: Title & Overview
- **Title:** AI-Based Restaurant Table Allocation & Service Planner (`Saffron & Sage AI Bistro`)
- **Core AI Modules:**
  - 5 Search Algorithms: `Rule-Based`, `Greedy`, `BFS`, `DFS`, `A*`
  - 4-Agent Simulator: `CustomerAgent`, `TableAgent`, `WaiterAgent`, `ManagerAgent`
  - Grounded RAG Assistant: Policy Search (`TF-IDF`) + Groq LPU
- **Quick Numbers:** `14` Tables • `6` Waiters • `5` Algorithms • `7` SQLite Tables • `17/17` Pytest Passing

> **What to say:** "Good morning Mam. My project is Saffron & Sage AI Bistro. Instead of hosts guessing where to seat guests, it uses 5 AI search algorithms including optimal A*, a Multi-Agent Simulator, and a grounded Groq AI Assistant."

---

## Slide 2: Problem Statement
1. **Wasted Table Capacity:** Seating 2 guests at a 6-seat or 8-seat table wastes up to 75% of seats during rush hour.
2. **Uneven Waiter Workload:** Overloading one waiter while another is free causes slow service and staff fatigue.
3. **Queue Walk-Outs (Reneging):** Long unoptimized waits cause guests to leave before being seated.
4. **Policy & Hygiene Mistakes:** Legacy booking tools only record bookings—they don't optimize seating or enforce cleaning turnover.

> **What to say:** "In busy restaurants, manual seating wastes seats, overloads certain waiters, and causes waiting guests to leave."

---

## Slide 3: Project Objectives
1. **Smart Table Matching:** Compare Rule-Based, Greedy, BFS, DFS, and A* on identical queues.
2. **Fair Waiter Balancing:** Keep each waiter under their max table cap (default 4) and pick the least busy server.
3. **Safe 5-State Table Lifecycle:** `AVAILABLE`, `OCCUPIED`, `RESERVED`, `CLEANING`, `UNAVAILABLE`.
4. **Zero-Hallucination AI Chat:** Ground answers in real SQLite data and 4 policy markdown files.

---

## Slide 4: 4-Tier System Architecture
- **Frontend UI:** React 19, Vite, Tailwind CSS, Recharts, custom Canvas 3D background (`Background3D.jsx`).
- **FastAPI Gateway:** 12 REST routers under `/api/*` with Pydantic v2 validation & Swagger `/docs`.
- **AI & Sim Core:** 5 Search Algorithms, 4 Agent classes, TF-IDF RAG Engine, Groq & Claude clients.
- **Data Storage:** SQLite (`restaurant_planner.db`), SQLAlchemy 2.0 ORM, 4 Policy `.md` files, and `mockData.js` for static GitHub Pages.

---

## Slide 5: 5 AI Search Algorithms Compared
| Algorithm | How It Works | Pros | Limitation |
| :--- | :--- | :--- | :--- |
| **Rule-Based** | Wait sort + IF/ELSE zone & smallest fit | Ultra-fast | Cannot trade off competing costs |
| **Greedy** | Lowest immediate cost per party | Fast + logs alternatives | Myopic; can trap later parties |
| **BFS** | Queue (`deque`) level-by-level | Fewest-step path | High memory; ignores cost weights |
| **DFS** | Stack exploring deep branches | Low memory | Often picks high-waste tables |
| **A* Search** | Min-Heap (`heapq`) with `f(n) = g(n) + h(n)` | **Optimal total cost** | Bounded at 6,000 nodes max |

---

## Slide 6: Cost Function & Why A* Is Optimal
- **Cost Formula (`cost_function.py`):**  
  `Cost = 12.0 * EmptySeats + 25.0 * WaiterLoadRatio + 0.5 * (WaitMins / 10) / Priority + 20.0 * ZoneMiss`
- **Why Heuristic `h(n)` Is Admissible (`a_star.py`):**
  - `h(n)` only estimates minimum possible seat waste and wait cost for remaining groups.
  - It omits waiter workload and zone penalties (`>= 0`).
  - Therefore `h(n) <= h*(n)` always—guaranteeing the lowest-cost solution!

---

## Slide 7: 5 Table States & 4 Collaborating Agents
- **Table Lifecycle:** `AVAILABLE` → `RESERVED` → `OCCUPIED` → `CLEANING` → `AVAILABLE` (plus `UNAVAILABLE`).
- **4 Agents:**
  - `CustomerAgent`: Tracks party size, priority, wait time, and `RENEGED` status.
  - `TableAgent`: Manages seat capacity, zone, and cleaning cooldown.
  - `WaiterAgent`: Enforces max table cap (4) and tracks completed orders.
  - `ManagerAgent`: Coordinates all agents and runs the chosen search algorithm.

---

## Slide 8: Discrete-Event Simulator
- **File:** `backend/app/simulation/simulator.py` & `SimulationPage.jsx`.
- **Controls:** Run Full Simulation, Step `+1s`, Reset, configurable party count, algorithm, intervals, and random seed.
- **Each Step:** Processes `ARRIVAL` → checks `RENEGED` → moves finished tables to `CLEANING` → returns clean tables to `AVAILABLE` → runs `ManagerAgent`.
- **Saved Metrics:** Logs `simulation_records` into SQLite (`total_customers`, `successful_allocations`, `average_waiting_time`, `execution_time`, `utilization`).

---

## Slide 9: Grounded RAG AI Assistant
1. **Policy Indexing:** Loads `data/policies/*.md` and indexes sections with Scikit-Learn `TfidfVectorizer` + `cosine_similarity`.
2. **Live DB Context:** Pulls current open tables, queue, and waiter loads from SQLite.
3. **LLM Inference:** Sends both to **Groq LPU** (`openai/gpt-oss-120b`, `temperature=0.2`), with **Claude 3.5 Sonnet** optional.
4. **Offline Fallback:** Local deterministic Python rules answer accurately even without API keys.

---

## Slide 10: Database (7 Tables) & REST API
- **7 SQLite Tables:** `restaurant_tables`, `customer_groups`, `waiters`, `reservations`, `allocations`, `service_policies`, `simulation_records`.
- **Key Endpoints (`/api`):**
  - `GET /health`, `GET /dashboard/stats`
  - `CRUD /tables` + `PUT /tables/{id}/status` + `POST /tables/{id}/reset`
  - `CRUD /customers`, `/waiters`, `/reservations` (duplicate guard returns `400`), `/policies`
  - `POST /allocations/run`, `GET /allocations/compare`
  - `POST /simulation/start`, `step`, `reset`, `GET /history`
  - `POST /ai/chat`, `POST /system/reset-db`

---

## Slide 11: Testing (17/17 Passing) & Challenges Solved
- **Pytest Suite (17/17 Passing):**
  - 7 Algorithm tests (`test_algorithms.py`)
  - 4 Multi-Agent tests (`test_agents.py`)
  - 6 API Integration tests (`test_api.py`)
- **Challenges Solved:**
  - Moved API keys safely to `.env` via `pydantic-settings`.
  - Fixed Tailwind/PostCSS build errors in `index.css`.
  - Synced `mockData.js` schemas so AI Allocation and Simulation work seamlessly on GitHub Pages.

---

## Slide 12: Live Demo & Future Scope
- **5-Step Live Demo:** Dashboard → Click Table → Run `A*` Allocation → Compare 5 Algorithms → Ask AI Assistant.
- **Honest Limitations:** No user login/JWT auth yet; single-table seating only (no auto-merging two small tables yet).
- **Future Scope:** Dynamic table-merging in A*, Reinforcement Learning for dining duration, POS/SMS integration, and PostgreSQL scaling.
