import os
import json
import psycopg
from datetime import datetime, timedelta

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
            image_url TEXT,
            image_prompt TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Add image columns if they don't exist (for existing databases)
    cur.execute("""
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='research_updates' AND column_name='image_url') THEN
                ALTER TABLE research_updates ADD COLUMN image_url TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='research_updates' AND column_name='image_prompt') THEN
                ALTER TABLE research_updates ADD COLUMN image_prompt TEXT;
            END IF;
        END $$;
    """)
    
    # Create index on topic for faster lookups
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_research_topic ON research_updates(topic)
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Database initialized successfully")

def topic_exists_recently(topic: str, hours: int = 24) -> bool:
    """Check if a topic has been researched within the last N hours"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Normalize topic for comparison (lowercase, trimmed)
    normalized_topic = topic.lower().strip()
    
    cur.execute("""
        SELECT COUNT(*) FROM research_updates
        WHERE LOWER(topic) LIKE %s
        AND created_at > NOW() - INTERVAL '%s hours'
    """, (f"%{normalized_topic}%", hours))
    
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count > 0

def get_similar_research(topic: str, limit: int = 1):
    """Get existing research similar to the given topic"""
    conn = get_connection()
    cur = conn.cursor()
    
    normalized_topic = topic.lower().strip()
    keywords = normalized_topic.split()[:3]  # Use first 3 words
    
    # Build search pattern
    pattern = '%' + '%'.join(keywords) + '%'
    
    cur.execute("""
        SELECT id, topic, summary, sources, key_stats, image_url, image_prompt, created_at::text
        FROM research_updates
        WHERE LOWER(topic) LIKE %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (pattern, limit))
    
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    if rows:
        row = rows[0]
        return {
            "id": row[0],
            "topic": row[1],
            "summary": row[2],
            "sources": row[3],
            "key_stats": row[4],
            "image_url": row[5],
            "image_prompt": row[6],
            "created_at": row[7]
        }
    return None

def save_research(topic: str, summary: str, sources: list = None, key_stats: list = None, 
                  image_url: str = None, image_prompt: str = None):
    """Save a research update to the database"""
    conn = get_connection()
    cur = conn.cursor()
    
    sources_json = json.dumps(sources or [])
    stats_json = json.dumps(key_stats or [])
    
    cur.execute("""
        INSERT INTO research_updates (topic, summary, sources, key_stats, image_url, image_prompt)
        VALUES (%s, %s, %s::jsonb, %s::jsonb, %s, %s)
        RETURNING id
    """, (topic, summary, sources_json, stats_json, image_url, image_prompt))
    
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
        SELECT id, topic, summary, sources, key_stats, image_url, image_prompt,
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
            "image_url": row[5],
            "image_prompt": row[6],
            "created_at": row[7]
        })
    return results

def get_all_topics():
    """Get all unique topics that have been researched"""
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT DISTINCT topic, MAX(created_at)::text as last_updated
        FROM research_updates
        GROUP BY topic
        ORDER BY MAX(created_at) DESC
    """)
    
    rows = cur.fetchall()
    cur.close()
    conn.close()
    
    return [{"topic": row[0], "last_updated": row[1]} for row in rows]

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
