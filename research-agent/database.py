import os
import json
import psycopg
from datetime import datetime

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_connection():
    """Get a database connection"""
    return psycopg.connect(DATABASE_URL)

def init_db():
    """Create tables if they don't exist"""
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS research_updates (
            id SERIAL PRIMARY KEY,
            topic VARCHAR(255) NOT NULL,
            summary TEXT NOT NULL,
            sources JSONB DEFAULT '[]'::jsonb,
            key_stats JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized successfully")

def save_research(topic: str, summary: str, sources: list = None, key_stats: list = None):
    """Save a research update to the database"""
    conn = get_connection()
    cur = conn.cursor()
    
    sources_json = json.dumps(sources or [])
    stats_json = json.dumps(key_stats or [])
    
    cur.execute("""
        INSERT INTO research_updates (topic, summary, sources, key_stats)
        VALUES (%s, %s, %s::jsonb, %s::jsonb)
        RETURNING id
    """, (topic, summary, sources_json, stats_json))
    
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return result[0]

def get_latest_research(limit: int = 10):
    """Get the latest research updates"""
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, topic, summary, sources, key_stats, 
               created_at::text as created_at
        FROM research_updates
        ORDER BY created_at DESC
        LIMIT %s
    """, (limit,))
    
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    # Convert to list of dicts
    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "topic": row[1],
            "summary": row[2],
            "sources": row[3],
            "key_stats": row[4],
            "created_at": row[5]
        })
    return results

def cleanup_old_research(keep_count: int = 100):
    """Remove old research entries, keeping only the most recent ones"""
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        DELETE FROM research_updates
        WHERE id NOT IN (
            SELECT id FROM research_updates
            ORDER BY created_at DESC
            LIMIT %s
        )
    """, (keep_count,))
    
    deleted = cur.rowcount
    conn.commit()
    cur.close()
    conn.close()
    return deleted
