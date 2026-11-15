import re
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import RestaurantTable, Waiter, CustomerGroup, Reservation, Allocation
from app.ai.rag_engine import rag_engine
from app.ai.groq_client import groq_client
from app.ai.claude_client import claude_client
from app.schemas import AIChatResponse

def get_live_restaurant_context(db: Session, is_guest: bool = False) -> Dict[str, Any]:
    """
    Extracts structured context for the AI assistant.
    For authenticated users: queries live persistent SQLite database.
    For guest mode: returns isolated demonstration snapshot without exposing private records.
    """
    if is_guest:
        # Isolated Guest Demonstration Snapshot
        return {
            "mode": "GUEST_SANDBOX",
            "is_guest": True,
            "total_tables": 14,
            "available_tables": [
                {"table": "T02", "capacity": 2, "location": "Window"},
                {"table": "T04", "capacity": 4, "location": "Main Dining"},
                {"table": "T05", "capacity": 4, "location": "Main Dining"},
                {"table": "T07", "capacity": 6, "location": "Booth Zone"},
                {"table": "T08", "capacity": 8, "location": "Main Dining"},
                {"table": "T10", "capacity": 4, "location": "Patio"},
                {"table": "T12", "capacity": 10, "location": "Private Dining"},
                {"table": "T13", "capacity": 2, "location": "Window"},
                {"table": "T14", "capacity": 4, "location": "Main Dining"},
            ],
            "occupied_tables": [
                {"table": "T01", "capacity": 2, "group": "Miller Party", "size": 2, "waiter": "Julian Hayes"},
                {"table": "T03", "capacity": 4, "group": "Davies Business", "size": 4, "waiter": "Elena Rostova"},
                {"table": "T06", "capacity": 6, "group": "Patel Family", "size": 5, "waiter": "Marcus Chen"},
            ],
            "cleaning_tables": [{"table": "T09", "capacity": 4, "location": "Patio"}],
            "reserved_tables": [{"table": "T11", "capacity": 6, "location": "Booth Zone"}],
            "waiters": [
                {"name": "Julian Hayes", "assigned": 2, "max": 4, "score": 0.50, "availability": True},
                {"name": "Elena Rostova", "assigned": 1, "max": 4, "score": 0.25, "availability": True},
                {"name": "Marcus Chen", "assigned": 2, "max": 4, "score": 0.50, "availability": True},
                {"name": "Sofia Rossi", "assigned": 0, "max": 4, "score": 0.00, "availability": True},
                {"name": "Lucas Dubois", "assigned": 1, "max": 4, "score": 0.25, "availability": True},
                {"name": "Amina Al-Mansoor", "assigned": 1, "max": 4, "score": 0.25, "availability": True},
            ],
            "waiting_queue": [
                {"group": "Henderson Party", "size": 4, "priority": 1, "waited_minutes": 8, "special": "Quiet table requested"},
                {"group": "Zhang Couple", "size": 2, "priority": 2, "waited_minutes": 12, "special": "Window preferred"},
                {"group": "Vanderbilt Group", "size": 6, "priority": 3, "waited_minutes": 15, "special": "VIP Loyalty Member"},
            ],
            "confirmed_reservations": [
                {"customer": "Senator Collins", "size": 6, "time": "19:00", "table": "T11", "requests": "VIP quiet booth"},
                {"customer": "Claire Redfield", "size": 2, "time": "19:30", "table": "T02", "requests": "Window view anniversary"},
                {"customer": "Robert Thorne", "size": 8, "time": "20:00", "table": "T08", "requests": "Corporate dining"},
            ],
            "recent_allocations": [
                {"group": "Miller Party", "table": "T01", "waiter": "Julian Hayes", "algorithm": "A_STAR", "reason": "Exact 2-seat match at Window, 0 waste"},
                {"group": "Davies Business", "table": "T03", "waiter": "Elena Rostova", "algorithm": "A_STAR", "reason": "Optimal 4-seat Main Dining match"},
            ]
        }

    # Authenticated Live SQLite Database Query
    tables = db.query(RestaurantTable).all()
    waiters = db.query(Waiter).all()
    queue = db.query(CustomerGroup).filter(CustomerGroup.status == "WAITING").all()
    reservations = db.query(Reservation).filter(Reservation.status == "CONFIRMED").all()
    allocations = db.query(Allocation).order_by(Allocation.id.desc()).limit(8).all()

    avail_tables = [
        {"table": t.table_number, "capacity": t.capacity, "location": t.location}
        for t in tables if t.status == "AVAILABLE" and t.is_active
    ]
    occupied_tables = [
        {
            "table": t.table_number,
            "capacity": t.capacity,
            "location": t.location,
            "group": t.seated_group.group_name if t.seated_group else "Seated Party",
            "size": t.seated_group.group_size if t.seated_group else t.capacity,
            "waiter": t.assigned_waiter.name if t.assigned_waiter else "Unassigned"
        }
        for t in tables if t.status == "OCCUPIED"
    ]
    cleaning_tables = [
        {"table": t.table_number, "capacity": t.capacity, "location": t.location}
        for t in tables if t.status == "CLEANING"
    ]
    reserved_tables = [
        {"table": t.table_number, "capacity": t.capacity, "location": t.location}
        for t in tables if t.status == "RESERVED"
    ]

    waiter_loads = [
        {
            "name": w.name,
            "assigned": w.assigned_tables,
            "max": w.max_tables,
            "score": round(w.workload_score, 2),
            "availability": w.availability
        }
        for w in waiters
    ]

    waiting_list = []
    now_utc = datetime.now(timezone.utc)
    for c in queue:
        waited = 0
        if c.arrival_time:
            dt = c.arrival_time if c.arrival_time.tzinfo else c.arrival_time.replace(tzinfo=timezone.utc)
            waited = max(0, int((now_utc - dt).total_seconds() / 60))
        waiting_list.append({
            "id": c.id,
            "group": c.group_name,
            "size": c.group_size,
            "priority": c.priority,
            "waited_minutes": waited,
            "special": c.special_requirements or "None"
        })

    confirmed_res = [
        {
            "customer": r.customer_name,
            "size": r.group_size,
            "time": r.reservation_time,
            "date": r.reservation_date,
            "table": f"Table #{r.table_id}" if r.table_id else "Auto-assign on arrival",
            "requests": r.special_requests or "None"
        }
        for r in reservations
    ]

    recent_alloc = [
        {
            "group": a.customer_group.group_name if a.customer_group else f"Group #{a.customer_group_id}",
            "table": a.table.table_number if a.table else f"Table #{a.table_id}",
            "waiter": a.waiter.name if a.waiter else (f"Staff #{a.waiter_id}" if a.waiter_id else "Unassigned"),
            "algorithm": a.algorithm_used,
            "reason": a.allocation_reason
        }
        for a in allocations
    ]

    return {
        "mode": "AUTHENTICATED_LIVE",
        "is_guest": False,
        "total_tables": len(tables),
        "available_tables": avail_tables,
        "occupied_tables": occupied_tables,
        "cleaning_tables": cleaning_tables,
        "reserved_tables": reserved_tables,
        "waiters": waiter_loads,
        "waiting_queue": waiting_list,
        "confirmed_reservations": confirmed_res,
        "recent_allocations": recent_alloc
    }

def answer_ai_query(message: str, db: Session, is_guest: bool = False) -> AIChatResponse:
    try:
        msg_clean = message.strip()
        msg_lower = msg_clean.lower()

        # 1. Natural Greeting & Conversational Pleasantries Detection
        is_greeting = bool(re.match(r'^(hi+|hey+|hello+|howdy|greetings|good\s+(morning|afternoon|evening|day))[\s!.]*$', msg_lower))
        is_how_are_you = bool(re.search(r'\bhow\s+are\s+you\b|\bhow\s+are\s+you\s+doing\b|\bhow\'s\s+it\s+going\b|\bhow\s+do\s+you\s+do\b', msg_lower))
        is_who_are_you = bool(re.search(r'\bwho\s+are\s+you\b|\bwhat\s+are\s+you\b|\bwhat\s+can\s+you\s+do\b', msg_lower))
        is_thanks = bool(re.match(r'^(thanks?(\s+you)?|thank\s+you(\s+so\s+much)?|thx)[\s!.]*$', msg_lower))
        is_bye = bool(re.match(r'^(bye|goodbye|see\s+you|cya)[\s!.]*$', msg_lower))

        active_model = getattr(groq_client, "active_model", None) or "Groq LPU"

        if is_greeting:
            return AIChatResponse(
                reply="Hello! Welcome to Saffron & Sage. How can I assist you with floor operations, tables, or reservations today?",
                relevant_info=[],
                sources=[],
                explanation="Conversational greeting response.",
                suggested_action="",
                is_fallback=False,
                grounding_type="CONVERSATIONAL",
                model_used=active_model
            )

        if is_how_are_you:
            return AIChatResponse(
                reply="I am doing very well, thank you! How can I assist you with our tables, staff, or reservations today?",
                relevant_info=[],
                sources=[],
                explanation="Conversational pleasantry response.",
                suggested_action="",
                is_fallback=False,
                grounding_type="CONVERSATIONAL",
                model_used=active_model
            )

        if is_who_are_you:
            return AIChatResponse(
                reply="I am the Saffron & Sage AI Bistro Concierge, assisting you with table allocations, waiter workloads, and restaurant policies.",
                relevant_info=[],
                sources=[],
                explanation="Conversational identity response.",
                suggested_action="",
                is_fallback=False,
                grounding_type="CONVERSATIONAL",
                model_used=active_model
            )

        if is_thanks:
            return AIChatResponse(
                reply="You are very welcome! Let me know if you need any further assistance with your dining operations.",
                relevant_info=[],
                sources=[],
                explanation="Conversational acknowledgment.",
                suggested_action="",
                is_fallback=False,
                grounding_type="CONVERSATIONAL",
                model_used=active_model
            )

        if is_bye:
            return AIChatResponse(
                reply="Goodbye! Have a wonderful dining service shift at Saffron & Sage.",
                relevant_info=[],
                sources=[],
                explanation="Conversational sign-off.",
                suggested_action="",
                is_fallback=False,
                grounding_type="CONVERSATIONAL",
                model_used=active_model
            )

        # 2. Extract structured restaurant context
        live_ctx = get_live_restaurant_context(db, is_guest=is_guest)

        # 3. Targeted Policy Retrieval (RAG) - only when relevant
        policy_keywords = [
            "policy", "rule", "cancel", "reservation", "hold", "holding", "grace",
            "queue", "turnover", "sanitation", "cleaning", "allocate", "allocation",
            "wheelchair", "priority", "allergy", "algorithm", "greedy", "a*"
        ]
        is_policy_query = any(kw in msg_lower for kw in policy_keywords)

        rag_matches = []
        if is_policy_query:
            rag_matches = rag_engine.retrieve(message, top_k=2)

        sources = [f"{c.doc_name} ({c.title})" for c, score in rag_matches if score >= 0.12]
        policy_texts = "\n\n".join([f"[{c.title}]: {c.content}" for c, score in rag_matches if score >= 0.12])

        mode_label = "Guest Demonstration Sandbox" if is_guest else "Live SQLite Production Database"

        avail_count = len(live_ctx['available_tables'])
        avail_names = ", ".join([t['table'] for t in live_ctx['available_tables']]) or "none"
        queue_count = len(live_ctx['waiting_queue'])

        system_prompt = f"""
You are the AI Restaurant Concierge for 'Saffron & Sage | AI Bistro'.
ACTIVE DATA MODE: {mode_label}

KEY DATABASE METRICS (LIVE REAL-TIME):
- Available Tables: {avail_count} open tables ({avail_names})
- Waiting Queue: {queue_count} customer parties waiting
- Active Waiters: {len(live_ctx['waiters'])} staff on duty
- Confirmed Reservations: {len(live_ctx.get('confirmed_reservations', []))}

CRITICAL RULES:
1. Answer the user's exact question directly using natural, conversational English in 1 to 2 sentences.
2. If the user asks a greeting or social question, respond politely without mentioning table counts or restaurant statistics.
3. Only provide table counts, server workloads, queue lengths, or reservation details if the user explicitly asks about them.
4. Do NOT generate numbered lists, bullet points, headers, or follow-up tips unless explicitly requested.
5. Ground your answer strictly on the provided Restaurant Database State and Policy Documents.
6. For table availability: state the exact count ({avail_count}) and available table names ({avail_names}).
7. NEVER fabricate data or invent restaurant records. If information is unavailable, say so clearly.

Current Restaurant Database State ({mode_label}):
{live_ctx}

Retrieved Policy Documents:
{policy_texts}
"""

        # 4. Try Groq API (High-Speed LPU Inference)
        if groq_client.is_configured():
            try:
                groq_reply = groq_client.generate_response(system_prompt, message)
                if groq_reply and groq_reply.strip():
                    # Calculate relevant_info strictly based on question topic
                    relevant_info = []
                    if any(k in msg_lower for k in ["table", "capacity", "seat"]):
                        relevant_info.append(f"Available: {len(live_ctx['available_tables'])} tables")
                    if any(k in msg_lower for k in ["queue", "customer", "waiting", "parties"]):
                        relevant_info.append(f"Queue: {len(live_ctx['waiting_queue'])} parties")
                    if any(k in msg_lower for k in ["waiter", "server", "staff", "workload"]):
                        relevant_info.append(f"Active Waiters: {len(live_ctx['waiters'])}")
                    if any(k in msg_lower for k in ["reservation", "booking"]):
                        relevant_info.append(f"Reservations: {len(live_ctx.get('confirmed_reservations', []))}")

                    return AIChatResponse(
                        reply=groq_reply.strip(),
                        relevant_info=relevant_info,
                        sources=sources,
                        explanation=f"Powered by Groq High-Speed LPU Inference ({groq_client.active_model or active_model}).",
                        suggested_action="",
                        is_fallback=False,
                        grounding_type="LIVE_DATABASE" if not is_guest else "GUEST_SANDBOX",
                        model_used=groq_client.active_model or active_model
                    )
            except Exception as e:
                print(f"Groq API error caught: {e}")

        # 5. Try Claude API (if configured)
        if claude_client.is_configured():
            try:
                claude_reply = claude_client.generate_response(system_prompt, message)
                if claude_reply and claude_reply.strip():
                    return AIChatResponse(
                        reply=claude_reply.strip(),
                        relevant_info=[f"Available tables: {len(live_ctx['available_tables'])}"],
                        sources=sources,
                        explanation=f"Generated via Claude API grounded on {mode_label}.",
                        suggested_action="",
                        is_fallback=False,
                        grounding_type="LIVE_DATABASE" if not is_guest else "GUEST_SANDBOX",
                        model_used="claude-3-5-sonnet"
                    )
            except Exception as e:
                print(f"Claude API error caught: {e}")

        # 6. Grounded Deterministic Engine (Offline Local Grounder)
        avail = live_ctx["available_tables"]
        queue = live_ctx["waiting_queue"]
        waiters = live_ctx["waiters"]
        reservations = live_ctx.get("confirmed_reservations", [])

        # Table Capacity & Availability
        if any(kw in msg_lower for kw in ["available table", "how many table", "which table", "free table", "open table", "accommodate", "capacity"]):
            num_match = re.search(r'\b(\d+)\b', msg_lower)
            target_size = int(num_match.group(1)) if num_match else None
            word_to_num = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "ten": 10}
            for word, val in word_to_num.items():
                if re.search(rf'\b{word}\b', msg_lower):
                    target_size = val
                    break

            if target_size:
                suitable = [t for t in avail if t["capacity"] >= target_size]
                if suitable:
                    suitable_sorted = sorted(suitable, key=lambda t: t["capacity"])
                    best = suitable_sorted[0]
                    reply = f"Table {best['table']} ({best['capacity']} seats in {best['location']}) is available and is the best fit for a party of {target_size}."
                else:
                    reply = f"There are currently no available tables with capacity for {target_size} guests."
            else:
                table_names = ", ".join([t["table"] for t in avail]) or "none"
                reply = f"There are currently {len(avail)} available tables ready for seating: {table_names}."

            return AIChatResponse(
                reply=reply,
                relevant_info=[f"Available: {len(avail)} tables"],
                sources=sources,
                explanation=f"Grounded directly in {mode_label} table status records.",
                suggested_action="",
                is_fallback=True,
                grounding_type="DETERMINISTIC_FALLBACK"
            )

        # Waiter Workload & Lowest / Highest Load
        if any(kw in msg_lower for kw in ["waiter", "server", "workload", "lowest work", "highest work", "busiest", "staff"]):
            if waiters:
                sorted_by_load = sorted(waiters, key=lambda w: (w["score"], w["assigned"]))
                lowest = sorted_by_load[0]
                if "highest" in msg_lower or "busiest" in msg_lower:
                    highest = sorted_by_load[-1]
                    reply = f"{highest['name']} currently has the highest workload with {highest['assigned']} assigned tables."
                else:
                    reply = f"{lowest['name']} currently has the lowest workload with {lowest['assigned']} assigned tables."
            else:
                reply = "There are currently no active waiters on duty."

            return AIChatResponse(
                reply=reply,
                relevant_info=[f"Active Waiters: {len(waiters)}"],
                sources=sources,
                explanation=f"Grounded directly in {mode_label} staff workload scores.",
                suggested_action="",
                is_fallback=True,
                grounding_type="DETERMINISTIC_FALLBACK"
            )

        # Customer Waiting Queue
        if any(kw in msg_lower for kw in ["how many customer", "customer waiting", "waiting queue", "waiting customer", "parties waiting", "queue"]):
            if queue:
                reply = f"There are currently {len(queue)} customer parties waiting in the queue."
            else:
                reply = "There are currently no customer parties waiting in the queue."

            return AIChatResponse(
                reply=reply,
                relevant_info=[f"Queue Length: {len(queue)} parties"],
                sources=sources,
                explanation=f"Grounded directly in {mode_label} customer queue records.",
                suggested_action="",
                is_fallback=True,
                grounding_type="DETERMINISTIC_FALLBACK"
            )

        # Reservations
        if any(kw in msg_lower for kw in ["reservation", "scheduled", "booking", "advance booking"]):
            if reservations:
                reply = f"There are currently {len(reservations)} confirmed reservations scheduled."
            else:
                reply = "There are currently no confirmed reservations scheduled for this shift."

            return AIChatResponse(
                reply=reply,
                relevant_info=[f"Confirmed Reservations: {len(reservations)}"],
                sources=sources,
                explanation=f"Grounded directly in {mode_label} reservations records.",
                suggested_action="",
                is_fallback=True,
                grounding_type="DETERMINISTIC_FALLBACK"
            )

        # Reservation Holding Policy / Grace Period
        if any(kw in msg_lower for kw in ["hold", "holding policy", "grace period", "late", "cancellation policy", "reserve policy"]):
            reply = "Reserved tables are held for a 15-minute grace period past the scheduled booking time before being released to walk-in guests."
            return AIChatResponse(
                reply=reply,
                relevant_info=["Grace Period: 15 minutes"],
                sources=sources or ["reservation_policy.md (Reservation 15-Minute Grace Window)"],
                explanation="Grounded in restaurant reservation holding policy.",
                suggested_action="",
                is_fallback=True,
                grounding_type="POLICY_RAG"
            )

        # What happens when all tables are occupied
        if any(kw in msg_lower for kw in ["all table", "full", "occupied", "no table", "congestion", "what happens when"]):
            reply = "When all tables are occupied, walk-in guests are enrolled in the priority FIFO queue with an average wait tolerance of 25 minutes while bussing staff accelerate table sanitation."
            return AIChatResponse(
                reply=reply,
                relevant_info=["Tolerance Limit: 25 mins", "Turnover Window: 4 mins"],
                sources=sources or ["customer_queue_policy.md (Customer Queue & Wait Tolerance)"],
                explanation="Grounded in restaurant operational policies and queue management protocols.",
                suggested_action="",
                is_fallback=True,
                grounding_type="POLICY_RAG"
            )

        # How AI table allocation works
        if any(kw in msg_lower for kw in ["how ai table allocation", "how does allocation work", "how does table allocation work", "explain how"]):
            reply = "Our AI Table Allocation uses search algorithms to balance customer party sizes with table capacities, server workloads, and zone preferences while minimizing empty seats."
            return AIChatResponse(
                reply=reply,
                relevant_info=["Cost Function: 4-Factor Weighted Optimization"],
                sources=sources or ["table_allocation_policy.md (Capacity Fit Principle)"],
                explanation="Overview of the AI Allocation engine.",
                suggested_action="",
                is_fallback=True,
                grounding_type="POLICY_RAG"
            )

        # General inquiry fallback: Answer exact inquiry naturally without unsolicited table stats!
        reply = "I am here to assist with Saffron & Sage floor operations. You can ask me about available tables, waiter assignments, the waiting queue, or service policies."
        return AIChatResponse(
            reply=reply,
            relevant_info=[],
            sources=sources,
            explanation=f"Grounded response based on {mode_label}.",
            suggested_action="",
            is_fallback=True,
            grounding_type="LIVE_DATABASE" if not is_guest else "GUEST_SANDBOX"
        )

    except Exception as exc:
        print(f"Unhandled error in answer_ai_query: {exc}")
        return AIChatResponse(
            reply="I am here to assist with Saffron & Sage operations. Please ask about table availability, waiter assignments, or service policies.",
            relevant_info=[],
            sources=[],
            explanation="Safe fallback response.",
            suggested_action="",
            is_fallback=True,
            grounding_type="LIVE_DATABASE" if not is_guest else "GUEST_SANDBOX"
        )
