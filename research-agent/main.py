import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from database import init_db, get_latest_research, cleanup_old_research, get_all_topics, clear_all_research
from agent import run_research, run_all_research, run_scheduled_research, TOPIC_POOL

# Scheduler for periodic research
scheduler = BackgroundScheduler()

def scheduled_research():
    """Background job to run research daily on fresh topics"""
    print("=" * 50)
    print("Running scheduled research (daily job)")
    print("=" * 50)
    try:
        results = run_scheduled_research(generate_images=True)
        success_count = sum(1 for r in results if r.get("status") == "success")
        print(f"Scheduled research completed: {success_count}/{len(results)} successful")
        
        # Cleanup old entries (keep last 50)
        deleted = cleanup_old_research(keep_count=50)
        if deleted > 0:
            print(f"Cleaned up {deleted} old research entries")
    except Exception as e:
        print(f"Scheduled research error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Post-Labor Research Agent...")
    init_db()
    
    # Schedule research to run every 24 HOURS (was 6)
    scheduler.add_job(
        scheduled_research, 
        'interval', 
        hours=24,  # Once per day
        id='daily_research_job',
        next_run_time=None  # Don't run immediately on startup
    )
    scheduler.start()
    print("Scheduler started - research runs every 24 hours")
    print(f"Topic pool size: {len(TOPIC_POOL)} diverse topics")
    
    yield
    
    # Shutdown
    scheduler.shutdown()
    print("Scheduler stopped")

app = FastAPI(
    title="Post-Labor Research Agent API",
    description="AI-powered research agent for post-labor economics with DALL-E image generation",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "version": "2.0.0",
        "features": ["DALL-E images", "Dynamic topics", "48h cache"],
        "schedule": "Every 24 hours",
        "topic_pool_size": len(TOPIC_POOL),
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
    return {"status": "healthy", "service": "research-agent", "version": "2.0.0"}

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
    topic: str = Query(default=None, description="Specific topic to research"),
    force: bool = Query(default=False, description="Force new research even if cached"),
    count: int = Query(default=3, ge=1, le=5, description="Number of topics to research")
):
    """Manually trigger research on fresh topics or a specific topic"""
    try:
        if topic:
            result = run_research(topic, force=force, generate_images=True)
            return {
                "status": "completed",
                "topic": topic,
                "result": result,
                "cached": result.get("cached", False)
            }
        else:
            results = run_all_research(force=force, generate_images=True)
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
async def get_topic_pool():
    """Get the pool of potential research topics"""
    return {
        "topic_pool": TOPIC_POOL,
        "pool_size": len(TOPIC_POOL),
        "description": "Topics are randomly selected, avoiding recent duplicates"
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

@app.delete("/api/research/clear")
async def clear_research():
    """Delete ALL research entries and start fresh"""
    try:
        deleted = clear_all_research()
        return {
            "status": "cleared",
            "deleted_count": deleted,
            "message": "All research entries have been deleted"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing research: {str(e)}")

@app.get("/api/ping")
async def ping():
    """Keep-alive endpoint"""
    return {"pong": True, "timestamp": str(__import__('datetime').datetime.now())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
