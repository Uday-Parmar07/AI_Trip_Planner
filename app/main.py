import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator

from agent.agentic_workflow import GraphBuilder
from .database import get_recent_trips, init_db, save_trip

# Load environment variables early to support azure app settings
load_dotenv()

# Allow selecting model provider via env var (defaults to groq)
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "groq")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_BUILD_DIR = BASE_DIR / "frontend" / "build"
SERVE_FRONTEND = FRONTEND_BUILD_DIR.exists() and (FRONTEND_BUILD_DIR / "index.html").exists()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TripDetails(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    number_of_people: Optional[int] = Field(default=None, alias="numberOfPeople")
    duration: Optional[str] = None
    budget: Optional[str] = None
    travel_dates: Optional[str] = Field(default=None, alias="travelDates")
    accommodation: Optional[str] = None
    trip_type: Optional[str] = Field(default=None, alias="tripType")
    transportation: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask the AI agent")
    trip_details: Optional[TripDetails] = Field(default=None, alias="tripDetails")

    @validator("question")
    def validate_question(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Question cannot be empty")
        return value.strip()

    class Config:
        allow_population_by_field_name = True


class QueryResponse(BaseModel):
    answer: str
    processing_time: float
    timestamp: datetime


class TripSummary(BaseModel):
    id: int
    origin: Optional[str]
    destination: Optional[str]
    travel_dates: Optional[str]
    number_of_people: Optional[int]
    duration: Optional[str]
    budget: Optional[str]
    accommodation: Optional[str]
    trip_type: Optional[str]
    transportation: Optional[str]
    excerpt: Optional[str]
    answer: str
    processing_time: Optional[float]
    created_at: datetime

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AI agent...")
    try:
        logger.info("Preparing database...")
        init_db()
        logger.info("Database ready")
        app.state.graph_builder = GraphBuilder(model_provider=MODEL_PROVIDER)
        app.state.react_app = app.state.graph_builder()
        logger.info("AI agent initialized successfully")
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to initialize AI agent: %s", exc)
        app.state.graph_builder = None
        app.state.react_app = None

    yield

    logger.info("Shutting down application")


app = FastAPI(
    title="AI Agent API",
    description="REST API for AI agent with multiple tools",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if SERVE_FRONTEND:
    static_directory = FRONTEND_BUILD_DIR / "static"
    if static_directory.exists():
        app.mount("/static", StaticFiles(directory=static_directory), name="static")


if SERVE_FRONTEND:

    @app.get("/", include_in_schema=False)
    async def root_index() -> FileResponse:
        return FileResponse(FRONTEND_BUILD_DIR / "index.html")

else:

    @app.get("/")
    async def root() -> dict:
        return {"message": "AI Agent API is running"}


@app.get("/api")
async def api_root() -> dict:
    return {"message": "AI Agent API is running"}


@app.get("/health")
async def health_check() -> dict:
    return {"status": "healthy", "timestamp": datetime.now()}


async def _process_query(query: QueryRequest) -> QueryResponse:
    start_time = datetime.now()
    logger.info("Processing query: %s...", query.question[:100])

    if not getattr(app.state, "react_app", None):
        raise HTTPException(status_code=503, detail="AI agent not initialized or unavailable")

    try:
        messages = {"messages": [query.question]}
        output = app.state.react_app.invoke(messages)

        if isinstance(output, dict) and "messages" in output:
            final_output = output["messages"][-1].content
        else:
            final_output = str(output)

        processing_time = (datetime.now() - start_time).total_seconds()
        logger.info("Query processed successfully in %.2fs", processing_time)

        response = QueryResponse(
            answer=final_output,
            processing_time=processing_time,
            timestamp=datetime.now(),
        )

        trip_payload = {}
        if query.trip_details:
            trip_payload = query.trip_details.dict(by_alias=False, exclude_none=True)

        excerpt = next((line.strip() for line in final_output.splitlines() if line.strip()), None)

        async def _persist() -> None:
            try:
                await save_trip(
                    question=query.question,
                    answer=final_output,
                    processing_time=processing_time,
                    excerpt=excerpt,
                    **trip_payload,
                )
            except Exception as db_error:  # noqa: BLE001
                logger.error("Failed to store trip data: %s", db_error)

        asyncio.create_task(_persist())

        return response

    except ValueError:
        logger.error("Invalid input received")
        raise HTTPException(status_code=400, detail="Invalid input provided")

    except Exception as exc:  # noqa: BLE001
        error_text = str(exc)
        logger.error("Error processing query: %s", error_text)
        if "model_decommissioned" in error_text:
            raise HTTPException(
                status_code=503,
                detail="Configured LLM model is unavailable. Please update the backend configuration.",
            )
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/query", response_model=QueryResponse)
async def query_travel_agent(query: QueryRequest) -> QueryResponse:
    return await _process_query(query)


@app.post("/api/query", response_model=QueryResponse)
async def query_travel_agent_v1(query: QueryRequest) -> QueryResponse:
    return await _process_query(query)


@app.get("/api/trips", response_model=List[TripSummary])
async def list_recent_trips(limit: int = 20) -> List[TripSummary]:
    trips = await get_recent_trips(limit=limit)
    return [
        TripSummary(
            id=trip.id,
            origin=trip.origin,
            destination=trip.destination,
            travel_dates=trip.travel_dates,
            number_of_people=trip.number_of_people,
            duration=trip.duration,
            budget=trip.budget,
            accommodation=trip.accommodation,
            trip_type=trip.trip_type,
            transportation=trip.transportation,
            excerpt=trip.excerpt,
            answer=trip.answer,
            processing_time=trip.processing_time,
            created_at=trip.created_at,
        )
        for trip in trips
    ]


if SERVE_FRONTEND:

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str) -> FileResponse:
        candidate = FRONTEND_BUILD_DIR / full_path
        if candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(FRONTEND_BUILD_DIR / "index.html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
