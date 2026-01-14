import asyncio
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from contextlib import asynccontextmanager
from datetime import datetime
import logging
import os
from dotenv import load_dotenv

from agent.agentic_workflow import GraphBuilder

# Load environment variables
load_dotenv()

from database import get_recent_trips, init_db, save_trip

# Allow selecting model provider via env var (defaults to groq)
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "groq")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
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

    @validator('question')
    def validate_question(cls, v):
        if not v.strip():
            raise ValueError('Question cannot be empty')
        return v.strip()

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

# Application lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing AI agent...")
    try:
        logger.info("Preparing database...")
        init_db()
        logger.info("Database ready")
        app.state.graph_builder = GraphBuilder(model_provider=MODEL_PROVIDER)
        app.state.react_app = app.state.graph_builder()
        logger.info("AI agent initialized successfully")
    except Exception as e:
        # If the AI components fail to initialize (for example a model
        # is decommissioned or API keys are missing) keep the server
        # running so health checks work and surface a helpful message
        # when clients attempt to use `/query`.
        logger.warning(f"Failed to initialize AI agent: {e}")
        app.state.graph_builder = None
        app.state.react_app = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")

# Create FastAPI app
app = FastAPI(
    title="AI Agent API",
    description="REST API for AI agent with multiple tools",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Agent API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

async def _process_query(query: QueryRequest) -> QueryResponse:
    """Shared query handler used by both /query and /api/query endpoints."""
    start_time = datetime.now()
    logger.info(f"Processing query: {query.question[:100]}...")
    
    if not getattr(app.state, "react_app", None):
        raise HTTPException(status_code=503, detail="AI agent not initialized or unavailable")

    try:
        # Process the query
        messages = {"messages": [query.question]}
        output = app.state.react_app.invoke(messages)
        
        # Extract the response
        if isinstance(output, dict) and "messages" in output:
            final_output = output["messages"][-1].content
        else:
            final_output = str(output)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        logger.info(f"Query processed successfully in {processing_time:.2f}s")
        
        response = QueryResponse(
            answer=final_output,
            processing_time=processing_time,
            timestamp=datetime.now()
        )

        # Persist trip details asynchronously; failures shouldn't block API response
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
                    **trip_payload
                )
            except Exception as db_error:
                logger.error(f"Failed to store trip data: {db_error}")

        asyncio.create_task(_persist())

        return response
        
    except ValueError as e:
        logger.error(f"Invalid input: {e}")
        raise HTTPException(status_code=400, detail="Invalid input provided")
        
    except Exception as e:
        error_text = str(e)
        logger.error(f"Error processing query: {error_text}")
        if "model_decommissioned" in error_text:
            raise HTTPException(
                status_code=503,
                detail="Configured LLM model is unavailable. Please update the backend configuration."
            )
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/query", response_model=QueryResponse)
async def query_travel_agent(query: QueryRequest):
    """Process travel planning requests for legacy clients."""
    return await _process_query(query)


@app.post("/api/query", response_model=QueryResponse)
async def query_travel_agent_v1(query: QueryRequest):
    """Process travel planning requests for frontend proxy calls."""
    return await _process_query(query)


@app.get("/api/trips", response_model=List[TripSummary])
async def list_recent_trips(limit: int = 20):
    """Return recently generated trips for display in the frontend."""
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)