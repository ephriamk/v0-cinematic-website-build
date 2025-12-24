import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from database import init_db, get_latest_research, cleanup_old_research, get_all_topics
from agent import run_research, run_all_research, RESEARCH_TOPICS

# Scheduler for periodic research
scheduler = BackgroundScheduler()

def scheduled_research():
    """Background job to run research periodically"""
    print("Running scheduled research...")
    try:
        run_all_research(force=False)  # Use cache for scheduled runs
        cleanup_old_research(keep_count=100)
        print("Scheduled research completed")
    except Exception as e:
        print(f"Scheduled research error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Post-Labor Research Agent...")
    init_db()
    
    # Schedule research to run every 6 hours
    scheduler.add_job(scheduled_research, 'interval', hours=6, id='research_job')
    scheduler.start()
    print("Scheduler started - research runs every 6 hours")
    
    yield
    
    # Shutdown
    scheduler.shutdown()
    print("Scheduler stopped")

app = FastAPI(
    title="Post-Labor Research Agent API",
    description="AI-powered research agent for post-labor economics",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration - allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.onrender.com",
        "https://*.vercel.app",
        "*"  # Allow all for now - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - service status"""
    return {
        "status": "online",
        "service": "Post-Labor Research Agent",
        "version": "1.0.0",
        "endpoints": {
            "research": "/api/research",
            "trigger": "/api/research/run",
            "topics": "/api/research/topics",
            "history": "/api/research/history",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "service": "research-agent"}

@app.get("/api/research")
async def get_research(limit: int = Query(default=10, ge=1, le=50)):
    """Get the latest research updates"""
    try:
        updates = get_latest_research(limit)
        return {
            "updates": updates,
            "count": len(updates),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/research/run")
async def trigger_research(
    topic: str = Query(default=None),
    force: bool = Query(default=False, description="Force new research even if cached")
):
    """Manually trigger a research task
    
    Args:
        topic: Optional specific topic to research
        force: If True, bypass cache and force new research
    """
    try:
        if topic:
            # Research specific topic
            result = run_research(topic, force=force)
            return {
                "status": "completed",
                "topic": topic,
                "result": result,
                "cached": result.get("cached", False)
            }
        else:
            # Research all topics
            results = run_all_research(force=force)
            cached_count = sum(1 for r in results if r.get("cached", False))
            return {
                "status": "completed",
                "topics_researched": len(results),
                "cached_results": cached_count,
                "new_results": len(results) - cached_count,
                "results": results
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research error: {str(e)}")

@app.get("/api/research/topics")
async def get_topics():
    """Get the list of research topics being monitored"""
    return {
        "topics": RESEARCH_TOPICS,
        "count": len(RESEARCH_TOPICS)
    }

@app.get("/api/research/history")
async def get_research_history():
    """Get all unique topics that have been researched"""
    try:
        history = get_all_topics()
        return {
            "history": history,
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/ping")
async def ping():
    """Keep-alive endpoint to prevent service from sleeping"""
    return {"pong": True}

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
