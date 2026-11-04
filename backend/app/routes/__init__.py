from app.routes.health import router as health_router
from app.routes.dashboard import router as dashboard_router
from app.routes.tables import router as tables_router
from app.routes.customers import router as customers_router
from app.routes.waiters import router as waiters_router
from app.routes.reservations import router as reservations_router
from app.routes.allocations import router as allocations_router
from app.routes.policies import router as policies_router
from app.routes.simulation import router as simulation_router
from app.routes.analytics import router as analytics_router
from app.routes.ai import router as ai_router
from app.routes.system import router as system_router

__all__ = [
    "health_router",
    "dashboard_router",
    "tables_router",
    "customers_router",
    "waiters_router",
    "reservations_router",
    "allocations_router",
    "policies_router",
    "simulation_router",
    "analytics_router",
    "ai_router",
    "system_router",
]
