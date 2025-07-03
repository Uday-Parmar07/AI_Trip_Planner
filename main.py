from fastapi import FastAPI, HTTPException, Request
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="The question to ask the AI agent")
    
    @validator('question')
    def validate_question(cls, v):
        if not v.strip():
            raise ValueError('Question cannot be empty')
        return v.strip()

class QueryResponse(BaseModel):
    answer: str
    processing_time: float
    timestamp: datetime

# Application lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing AI agent...")
    try:
        app.state.graph_builder = GraphBuilder(model_provider="groq")
        app.state.react_app = app.state.graph_builder()
        logger.info("AI agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize AI agent: {e}")
        raise
    
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

@app.post("/query", response_model=QueryResponse)
async def query_travel_agent(query: QueryRequest):
    """
    Process a question using the AI agent with multiple tools.
    """
    start_time = datetime.now()
    logger.info(f"Processing query: {query.question[:100]}...")
    
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
        
        return QueryResponse(
            answer=final_output,
            processing_time=processing_time,
            timestamp=datetime.now()
        )
        
    except ValueError as e:
        logger.error(f"Invalid input: {e}")
        raise HTTPException(status_code=400, detail="Invalid input provided")
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)