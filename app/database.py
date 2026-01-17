import asyncio
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy.engine import URL
from sqlalchemy.engine.url import make_url


DEFAULT_SQLITE_URL = "sqlite:///data/trips.db"
RAW_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)


def _parse_database_url(raw_url: str) -> URL:
    try:
        return make_url(raw_url)
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Invalid DATABASE_URL provided: {raw_url}") from exc


def _coerce_int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        logging.warning("Invalid integer for %s, using default %s", name, default)
        return default


def _prepare_sqlite_directory(url: URL) -> None:
    if url.get_backend_name() != "sqlite":
        return

    database_path = url.database
    if not database_path or database_path == ":memory:":
        return

    directory = os.path.dirname(os.path.abspath(database_path))
    if directory:
        os.makedirs(directory, exist_ok=True)


def _build_engine_kwargs(url: URL) -> Dict[str, object]:
    engine_kwargs: Dict[str, object] = {"echo": False, "pool_pre_ping": True}

    if url.get_backend_name() == "sqlite":
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        return engine_kwargs

    pool_size = _coerce_int_env("DATABASE_POOL_SIZE", 5)
    max_overflow = _coerce_int_env("DATABASE_MAX_OVERFLOW", 10)
    pool_timeout = _coerce_int_env("DATABASE_POOL_TIMEOUT", 30)
    pool_recycle = _coerce_int_env("DATABASE_POOL_RECYCLE", 1800)

    engine_kwargs.update(
        pool_size=pool_size,
        max_overflow=max_overflow,
        pool_timeout=pool_timeout,
        pool_recycle=pool_recycle,
    )

    ssl_mode = os.getenv("DATABASE_SSL_MODE")
    ssl_root_cert = os.getenv("DATABASE_SSL_ROOT_CERT")
    connect_args: Dict[str, str] = {}

    if ssl_mode:
        connect_args["sslmode"] = ssl_mode
    if ssl_root_cert:
        connect_args["sslrootcert"] = ssl_root_cert

    if connect_args:
        engine_kwargs["connect_args"] = connect_args

    return engine_kwargs


def _normalize_driver(url: URL) -> URL:
    backend = url.get_backend_name()
    driver = url.get_driver_name()

    if backend == "postgresql" and driver in (None, "", "psycopg2"):
        return url.set(drivername="postgresql+psycopg")

    return url


PARSED_DATABASE_URL = _normalize_driver(_parse_database_url(RAW_DATABASE_URL))
_prepare_sqlite_directory(PARSED_DATABASE_URL)

engine = create_engine(str(PARSED_DATABASE_URL), **_build_engine_kwargs(PARSED_DATABASE_URL))


class Trip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    number_of_people: Optional[int] = None
    duration: Optional[str] = None
    budget: Optional[str] = None
    travel_dates: Optional[str] = None
    accommodation: Optional[str] = None
    trip_type: Optional[str] = None
    transportation: Optional[str] = None
    processing_time: Optional[float] = None
    excerpt: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


def init_db() -> None:
    _prepare_sqlite_directory(PARSED_DATABASE_URL)
    SQLModel.metadata.create_all(engine)


def _persist_trip(trip: Trip) -> Trip:
    with Session(engine) as session:
        session.add(trip)
        session.commit()
        session.refresh(trip)
    return trip


async def save_trip(**trip_data) -> Trip:
    trip = Trip(**trip_data)
    return await asyncio.to_thread(_persist_trip, trip)


def _fetch_recent_trips(limit: int) -> List[Trip]:
    with Session(engine) as session:
        statement = select(Trip).order_by(Trip.created_at.desc()).limit(limit)
        return list(session.exec(statement))


async def get_recent_trips(limit: int = 20) -> List[Trip]:
    return await asyncio.to_thread(_fetch_recent_trips, limit)
