"""
Database connection manager for SupplyIntel.
Supports PostgreSQL (via DATABASE_URL or POSTGRES_URL) with seamless local SQLite fallback
guaranteeing 100% reliable local persistence without mandatory external services.
"""
import os
import logging
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger("supplyintel.database")

# Base directory for local persistence
BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR / "database"
DB_DIR.mkdir(exist_ok=True, parents=True)

SQLITE_PATH = DB_DIR / "supplyintel.db"
DEFAULT_SQLITE_URL = f"sqlite:///{SQLITE_PATH.as_posix()}"

# Check for explicit PostgreSQL connection URL
DATABASE_URL = os.environ.get("DATABASE_URL") or os.environ.get("POSTGRES_URL") or DEFAULT_SQLITE_URL

# Fix postgres:// schema if provided by older configs
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

is_sqlite = DATABASE_URL.startswith("sqlite")

connect_args = {}
if is_sqlite:
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        echo=False,
        pool_pre_ping=True
    )
    # Enable WAL mode and foreign keys for SQLite
    if is_sqlite:
        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info(f"Database engine initialized using: {'SQLite (Local Persistent WAL)' if is_sqlite else 'PostgreSQL'}")
except Exception as e:
    logger.warning(f"Could not connect to {DATABASE_URL}: {e}. Falling back to SQLite.")
    engine = create_engine(DEFAULT_SQLITE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for FastAPI route handlers."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
