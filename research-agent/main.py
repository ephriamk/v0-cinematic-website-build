import os
import base64
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from database import init_db, get_latest_research, cleanup_old_research, get_all_topics, clear_all_research, get_image_data
from agent import run_research, run_all_research, run_news_check, NEWS_QUERIES, TOPIC_POOL

scheduler = BackgroundScheduler()
check_count = 0

def scheduled_news_check():
    """Check for fresh news every 20 minutes"""
    global check_count
    check_count += 1
    print(f"\n{'='*50}")
    print(f"Scheduled check #{check_count}")
    print(f"{'='*50}")
    
    try:
        result = run_news_check(generate_images=True)
        print(f"Result: {result['status']}")
        
        # Cleanup old entries periodically (every 10 checks)
        if check_count % 10 == 0:
            deleted = cleanup_old_research(keep_count=100)
            if deleted > 0:
                print(f"Cleaned up {deleted} old entries")
    except Exception as e:
        print(f"Error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Post-Labor Research Agent v3...")
    init_db()
    
    # Check for news every 20 MINUTES
    scheduler.add_job(
        scheduled_news_check,
        'interval',
        minutes=20,
        id='news_check',
        next_run_time=None  # Don't run immediately
    )
    scheduler.start()
    print("Scheduler: Checking for fresh news every 20 minutes")
    print(f"News queries: {len(NEWS_QUERIES)} | Topic pool: {len(TOPIC_POOL)}")
    
    yield
    scheduler.shutdown()

app = FastAPI(
    title="Post-Labor Research Agent",
    description="AI news monitoring with freshness detection",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Post-Labor Research Agent",
        "version": "3.0.0",
        "schedule": "Every 20 minutes (only saves if fresh)",
        "checks_since_start": check_count
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/research")
async def get_research(
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Get research with pagination"""
    try:
        # Get total count first
        all_research = get_latest_research(limit=1000)
        total = len(all_research)
        
        # Get paginated results
        updates = get_latest_research(limit=limit + offset)
        paginated = updates[offset:offset + limit] if offset < len(updates) else []
        
        return {
            "updates": paginated,
            "count": len(paginated),
            "total": total,
            "offset": offset,
            "limit": limit,
            "has_more": offset + limit < total
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/research/all")
async def get_all_research():
    """Get ALL research entries for archive view"""
    try:
        updates = get_latest_research(limit=500)
        return {
            "updates": updates,
            "total": len(updates)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/research/run")
async def trigger_research(
    topic: str = Query(default=None),
    force: bool = Query(default=False)
):
    """Manually trigger research"""
    try:
        if topic:
            result = run_research(topic, force=force, generate_images=True)
            return {"status": "completed", "result": result}
        else:
            results = run_all_research(force=force, generate_images=True)
            return {"status": "completed", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/research/check")
async def trigger_news_check():
    """Manually trigger a news freshness check"""
    try:
        result = run_news_check(generate_images=True)
        return {"status": "completed", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/research/history")
async def get_history():
    """Get unique topics researched"""
    try:
        return {"history": get_all_topics(), "count": len(get_all_topics())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/research/clear")
async def clear_research():
    """Clear all research"""
    try:
        deleted = clear_all_research()
        return {"status": "cleared", "deleted": deleted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ping")
async def ping():
    return {"pong": True}

@app.get("/api/research/{research_id}/image")
async def get_research_image(research_id: int):
    """Serve image for a research entry from PostgreSQL"""
    try:
        image_data = get_image_data(research_id)
        if not image_data:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Decode base64 and return as PNG
        image_bytes = base64.b64decode(image_data)
        return Response(content=image_bytes, media_type="image/png")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
