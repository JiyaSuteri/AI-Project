import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models import RestaurantTable, Waiter, CustomerGroup, Reservation, Allocation
from app.ai.rag_engine import rag_engine
from app.ai.groq_client import groq_client
from app.ai.claude_client import claude_client
from app.schemas import AIChatResponse

def get_live_restaurant_context(db: Session) -> Dict[str, Any]:
    tables = db.query(RestaurantTable).all()
    waiters = db.query(Waiter).all()
    queue = db.query(CustomerGroup).filter(CustomerGroup.status == "WAITING").all()
    reservations = db.query(Reservation).filter(Reservation.status == "CONFIRMED").all()
    allocations = db.query(Allocation).order_by(Allocation.id.desc()).limit(5).all()

    avail_tables = [
        {"table": t.table_number, "capacity": t.capacity, "location": t.location}
        for t in tables if t.status == "AVAILABLE" and t.is_active
    ]
    occupied_tables = [
        {"table": t.table_number, "capacity": t.capacity, "waiter": t.assigned_waiter.name if t.assigned_waiter else "Unassigned"}
        for t in tables if t.status == "OCCUPIED"
    ]
    cleaning_tables = [t.table_number for t in tables if t.status == "CLEANING"]

    waiter_loads = [
        {"name": w.name, "assigned": w.assigned_tables, "max": w.max_tables, "score": round(w.workload_score, 2)}
        for w in waiters
    ]

    waiting_list = [
        {"group": c.group_name, "size": c.group_size, "priority": c.priority, "special": c.special_requirements}
        for c in queue
    ]

    return {
        "total_tables": len(tables),
        "available_tables": avail_tables,
        "occupied_tables": occupied_tables,
        "cleaning_tables": cleaning_tables,
        "waiters": waiter_loads,
        "waiting_queue": waiting_list,
        "confirmed_reservations_count": len(reservations),
        "recent_allocations": [
            {"group": a.customer_group.group_name if a.customer_group else "N/A", "table": a.table.table_number, "algorithm": a.algorithm_used}
            for a in allocations
        ]
    }

def answer_ai_query(message: str, db: Session) -> AIChatResponse:
    live_ctx = get_live_restaurant_context(db)
    rag_matches = rag_engine.retrieve(message, top_k=3)
    
    sources = [f"{c.doc_name} ({c.title})" for c, _ in rag_matches]
    policy_texts = "\n\n".join([f"[{c.title}]: {c.content}" for c, _ in rag_matches])

    system_prompt = f"""
You are the executive AI Restaurant Service Planner & Assistant for 'Saffron & Sage AI Bistro'.
RULES:
1. Ground your answer STRICTLY on the provided Live Restaurant Database State and Retrieved Policy Documents.
2. NEVER invent non-existent table numbers, fake servers, or imaginary waiting counts.
3. Be professional, concise, and helpful.
4. Reference policy names where appropriate.

Live Restaurant Database State:
{live_ctx}

Retrieved Policies:
{policy_texts}
"""

    # 1. Try Groq API (High-speed LPU inference)
    if groq_client.is_configured():
        groq_reply = groq_client.generate_response(system_prompt, message)
        if groq_reply:
            return AIChatResponse(
                reply=groq_reply,
                relevant_info=[
                    f"Available: {len(live_ctx['available_tables'])} tables",
                    f"Waiting Queue: {len(live_ctx['waiting_queue'])} parties",
                    f"Active Servers: {len(live_ctx['waiters'])}"
                ],
                sources=sources or ["table_allocation_policy.md (Capacity Fit Principle)"],
                explanation="Powered by Groq High-Speed LPU Inference grounded on live SQLite records and policy RAG retrieval.",
                suggested_action="Review the interactive floor plan or trigger AI allocation if new guests arrive.",
                is_fallback=False
            )

    # 2. Try Claude API
    if claude_client.is_configured():
        claude_reply = claude_client.generate_response(system_prompt, message)
        if claude_reply:
            return AIChatResponse(
                reply=claude_reply,
                relevant_info=[f"Available tables: {len(live_ctx['available_tables'])}", f"Waiting queue: {len(live_ctx['waiting_queue'])}"],
                sources=sources,
                explanation="Generated via Claude 3.5 Sonnet grounded on live SQLite records and policy RAG retrieval.",
                suggested_action="Review floor plan and trigger AI allocation if new customers arrive.",
                is_fallback=False
            )

    # 3. Grounded Local Deterministic Engine (Offline Fallback)
    msg_lower = message.lower()
    
    # Check table availability questions
    if any(kw in msg_lower for kw in ["available table", "which table", "free table", "open table"]):
        num_match = re.search(r'\b(\d+)\b', msg_lower)
        target_size = int(num_match.group(1)) if num_match else None
        if "seven" in msg_lower: target_size = 7
        if "six" in msg_lower: target_size = 6
        if "four" in msg_lower: target_size = 4
        if "two" in msg_lower: target_size = 2
        if "eight" in msg_lower: target_size = 8

        avail = live_ctx["available_tables"]
        if target_size:
            suitable = [t for t in avail if t["capacity"] >= target_size]
            if suitable:
                reply = f"For a party of {target_size}, currently available table(s) include: " + ", ".join([f"**Table {t['table']}** ({t['capacity']} seats, {t['location']})" for t in suitable]) + "."
                suggested = f"Allocate {suitable[0]['table']} to minimize capacity waste ({suitable[0]['capacity'] - target_size} unused seats)."
            else:
                reply = f"There are currently **no available single tables** with capacity for {target_size} guests. Available tables are smaller: " + (", ".join([f"{t['table']} ({t['capacity']} seats)" for t in avail]) or "None") + "."
                suggested = "Consult Large Group Seating Protocol to evaluate combining adjacent tables or placing the party on priority wait."
        else:
            if avail:
                table_list = ", ".join([f"**{t['table']}** ({t['capacity']} seats, {t['location']})" for t in avail])
                reply = f"There are currently **{len(avail)} available tables**: {table_list}."
                suggested = "Use the AI Allocation tab to seat waiting customer groups into these open tables."
            else:
                reply = f"Currently, all active tables are occupied, cleaning ({len(live_ctx['cleaning_tables'])}), or reserved. Zero tables are immediately available."
                suggested = "Monitor tables undergoing sanitation turnover to re-open seats."

        return AIChatResponse(
            reply=reply,
            relevant_info=[f"Available: {len(avail)}", f"Occupied: {len(live_ctx['occupied_tables'])}", f"Cleaning turnover: {len(live_ctx['cleaning_tables'])}"],
            sources=sources or ["table_allocation_policy.md (Capacity Fit Principle)"],
            explanation="Grounded in real-time restaurant_tables database state.",
            suggested_action=suggested,
            is_fallback=True
        )

    # Waiter workload questions
    if any(kw in msg_lower for kw in ["waiter", "workload", "highest work", "busiest", "staff"]):
        waiters = live_ctx["waiters"]
        if waiters:
            sorted_waiters = sorted(waiters, key=lambda w: (-w["score"], -w["assigned"]))
            busiest = sorted_waiters[0]
            lightest = sorted_waiters[-1]
            reply = (
                f"**{busiest['name']}** currently holds the highest workload with {busiest['assigned']}/{busiest['max']} tables "
                f"assigned (workload score: {busiest['score']}). In contrast, **{lightest['name']}** has the lightest load with "
                f"{lightest['assigned']}/{lightest['max']} tables."
            )
            suggested = f"Route forthcoming seating allocations to {lightest['name']} to balance section turnover."
        else:
            reply = "No active waiters found in the system."
            suggested = "Activate staff in Waiter Management."

        return AIChatResponse(
            reply=reply,
            relevant_info=[f"{w['name']}: {w['assigned']}/{w['max']} tables" for w in live_ctx["waiters"]],
            sources=sources or ["waiter_assignment_policy.md (Waiter Workload Balancing)"],
            explanation="Grounded in live waiters table workload scores.",
            suggested_action=suggested,
            is_fallback=True
        )

    # Recent allocation explanation
    if any(kw in msg_lower for kw in ["why was", "allocated", "reason", "assigned"]):
        allocations = db.query(Allocation).order_by(Allocation.id.desc()).limit(3).all()
        if allocations:
            recent_reasons = []
            for a in allocations:
                cname = a.customer_group.group_name if a.customer_group else f"Group #{a.customer_group_id}"
                tnum = a.table.table_number if a.table else f"Table #{a.table_id}"
                recent_reasons.append(f"• **{cname}** -> **{tnum}** via {a.algorithm_used}: {a.allocation_reason}")
            reply = "Recent allocation decisions logged in the database:\n" + "\n".join(recent_reasons)
            suggested = "Inspect the AI Allocation page for detailed decision trees and rejected alternatives."
        else:
            reply = "No allocation events have been executed yet in the active session."
            suggested = "Trigger an allocation from the AI Allocation tab."

        return AIChatResponse(
            reply=reply,
            relevant_info=[f"Logged allocations: {len(allocations)}"],
            sources=sources or ["table_allocation_policy.md (Capacity Fit Principle)"],
            explanation="Extracted directly from allocations table history.",
            suggested_action=suggested,
            is_fallback=True
        )

    # General / Policy inquiry
    policy_summary = "\n".join([f"• **{c.title}**: {c.content[:200]}..." for c, _ in rag_matches])
    reply = (
        f"**Saffron & Sage AI Operations Overview**:\n"
        f"• **Tables**: {len(live_ctx['available_tables'])} available, {len(live_ctx['occupied_tables'])} occupied, {len(live_ctx['cleaning_tables'])} cleaning.\n"
        f"• **Waiting Queue**: {len(live_ctx['waiting_queue'])} parties waiting.\n"
        f"• **Active Staff**: {len(live_ctx['waiters'])} servers.\n\n"
        f"**Relevant Policy Guidelines**:\n{policy_summary or 'Standard dining and table allocation policies apply.'}"
    )
    return AIChatResponse(
        reply=reply,
        relevant_info=[f"Tables: {live_ctx['total_tables']}", f"Queue: {len(live_ctx['waiting_queue'])}"],
        sources=sources or ["table_allocation_policy.md"],
        explanation="Real-time SQLite database operational status response.",
        suggested_action="Ask specific inquiries regarding available tables, waiter workloads, or policy rules.",
        is_fallback=True
    )
