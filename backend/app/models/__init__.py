from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"

    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(String(20), unique=True, index=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    location = Column(String(50), default="Main Dining")  # Window, Patio, Booth, Main Dining
    status = Column(String(20), default="AVAILABLE")  # AVAILABLE, OCCUPIED, RESERVED, CLEANING, UNAVAILABLE
    is_active = Column(Boolean, default=True)
    current_waiter_id = Column(Integer, ForeignKey("waiters.id", ondelete="SET NULL"), nullable=True)
    current_group_id = Column(Integer, ForeignKey("customer_groups.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    assigned_waiter = relationship("Waiter", back_populates="tables", foreign_keys=[current_waiter_id])
    seated_group = relationship("CustomerGroup", back_populates="assigned_table", foreign_keys=[current_group_id])
    allocations = relationship("Allocation", back_populates="table", cascade="all, delete-orphan")


class CustomerGroup(Base):
    __tablename__ = "customer_groups"

    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String(100), nullable=False)
    group_size = Column(Integer, nullable=False)
    arrival_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    reservation_time = Column(DateTime, nullable=True)
    priority = Column(Integer, default=1)  # 1: Normal, 2: VIP, 3: High Priority
    special_requirements = Column(String(255), nullable=True)
    status = Column(String(20), default="WAITING")  # WAITING, SEATED, COMPLETED, CANCELLED

    # Relationships
    assigned_table = relationship("RestaurantTable", back_populates="seated_group", foreign_keys="RestaurantTable.current_group_id", uselist=False)
    allocations = relationship("Allocation", back_populates="customer_group", cascade="all, delete-orphan")


class Waiter(Base):
    __tablename__ = "waiters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    availability = Column(Boolean, default=True)
    max_tables = Column(Integer, default=4)
    assigned_tables = Column(Integer, default=0)
    completed_orders = Column(Integer, default=0)
    workload_score = Column(Float, default=0.0)

    # Relationships
    tables = relationship("RestaurantTable", back_populates="assigned_waiter", foreign_keys="RestaurantTable.current_waiter_id")
    allocations = relationship("Allocation", back_populates="waiter", cascade="all, delete-orphan")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    group_size = Column(Integer, nullable=False)
    reservation_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    reservation_time = Column(String(20), nullable=False)  # HH:MM
    special_requests = Column(String(255), nullable=True)
    status = Column(String(20), default="CONFIRMED")  # CONFIRMED, SEATED, CANCELLED, NO_SHOW
    table_id = Column(Integer, ForeignKey("restaurant_tables.id", ondelete="SET NULL"), nullable=True)


class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)
    customer_group_id = Column(Integer, ForeignKey("customer_groups.id", ondelete="CASCADE"), nullable=False)
    table_id = Column(Integer, ForeignKey("restaurant_tables.id", ondelete="CASCADE"), nullable=False)
    waiter_id = Column(Integer, ForeignKey("waiters.id", ondelete="CASCADE"), nullable=False)
    allocation_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    algorithm_used = Column(String(50), nullable=False)
    allocation_reason = Column(Text, nullable=False)

    # Relationships
    customer_group = relationship("CustomerGroup", back_populates="allocations")
    table = relationship("RestaurantTable", back_populates="allocations")
    waiter = relationship("Waiter", back_populates="allocations")


class ServicePolicy(Base):
    __tablename__ = "service_policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)


class SimulationRecord(Base):
    __tablename__ = "simulation_records"

    id = Column(Integer, primary_key=True, index=True)
    simulation_name = Column(String(150), nullable=False)
    algorithm = Column(String(50), nullable=False)
    total_customers = Column(Integer, nullable=False)
    successful_allocations = Column(Integer, nullable=False)
    average_waiting_time = Column(Float, default=0.0)
    execution_time = Column(Float, default=0.0)  # in ms
    utilization = Column(Float, default=0.0)     # percentage
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
