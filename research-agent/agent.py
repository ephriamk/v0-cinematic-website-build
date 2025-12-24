import os
import json
import random
import hashlib
import httpx
import base64
from datetime import datetime
from database import save_research, topic_exists_recently, get_similar_research, get_all_topics, get_latest_research

# API Keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

# Breaking news focused queries - rotates through these
NEWS_QUERIES = [
    "AI automation jobs breaking news today",
    "artificial intelligence layoffs announced",
    "UBI universal basic income news today",
    "robot tax automation policy news",
    "AI replacing workers latest news",
    "tech layoffs AI automation today",
    "future of work AI announcement",
    "automation unemployment news today",
    "AI workforce impact latest",
    "basic income trial results news",
]

# Broader topic pool for variety
TOPIC_POOL = [
    "artificial intelligence replacing white collar jobs",
    "AI agents autonomous workers",
    "ChatGPT impact on employment",
    "AI coding assistants replacing developers",
    "creative AI displacing artists designers",
    "autonomous vehicles trucking job losses",
    "warehouse automation robotics employment",
    "universal basic income pilot results",
    "UBI experiments outcomes worldwide",
    "guaranteed income programs USA",
    "robot tax legislation proposals",
    "automation tax policy debates",
    "four day work week trials results",
    "gig economy workers rights",
    "human AI collaboration workplace",
    "post-scarcity economics theory",
    "meaning purpose work AI age",
]

# Cache settings
CACHE_HOURS = 6  # Don't re-research same topic within 6 hours

def call_openai(messages: list, max_tokens: int = 1000) -> str:
    """Call OpenAI Chat API"""
    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": max_tokens
                }
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return ""

def download_image_as_base64(image_url: str) -> str:
    """Download image from URL and return as base64 string"""
    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.get(image_url)
            response.raise_for_status()
            image_data = response.content
            return base64.b64encode(image_data).decode('utf-8')
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

def generate_image(topic: str, summary: str) -> tuple[str, str, str]:
    """Generate an image using DALL-E 3 and return base64 data for storage"""
    prompt_request = f"""Create a DALL-E prompt (max 150 chars) for: "{topic}"
Style: Abstract, cinematic, futuristic. Dark moody with ethereal glowing elements.
NO text/words/letters. Focus on mood, not literal.
Return ONLY the prompt."""

    image_prompt = call_openai([
        {"role": "system", "content": "Create evocative DALL-E prompts. Return only the prompt."},
        {"role": "user", "content": prompt_request}
    ], max_tokens=80)
    
    if not image_prompt:
        image_prompt = "Abstract futuristic digital art, dark atmosphere, glowing cyan purple accents, volumetric lighting, cinematic, no text"
    
    image_prompt = image_prompt.strip().strip('"\'')[:400]
    
    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(
                "https://api.openai.com/v1/images/generations",
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
                json={"model": "dall-e-3", "prompt": image_prompt, "n": 1, "size": "1792x1024", "quality": "standard", "style": "vivid"}
            )
            response.raise_for_status()
            data = response.json()
            temp_url = data["data"][0]["url"]
            revised_prompt = data["data"][0].get("revised_prompt", image_prompt)
            
            # Download and convert to base64 for permanent storage in PostgreSQL
            image_base64 = download_image_as_base64(temp_url)
            if image_base64:
                print(f"  ✓ Image downloaded and converted to base64 ({len(image_base64) // 1024}KB)")
            
            return image_base64, revised_prompt
    except Exception as e:
        print(f"DALL-E error: {e}")
        return None, image_prompt

def search_news(query: str, max_results: int = 5) -> list:
    """Search for recent news using Tavily with freshness focus"""
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                "https://api.tavily.com/search",
                headers={"Content-Type": "application/json"},
                json={
                    "api_key": TAVILY_API_KEY,
                    "query": query,
                    "max_results": max_results,
                    "search_depth": "basic",
                    "include_domains": [],  # All domains
                    "exclude_domains": []
                }
            )
            response.raise_for_status()
            return response.json().get("results", [])
    except Exception as e:
        print(f"Tavily error: {e}")
        return []

def is_content_fresh(search_results: list, existing_research: list) -> bool:
    """Check if search results contain genuinely new content"""
    if not search_results:
        return False
    
    # Get URLs from existing research
    existing_urls = set()
    for research in existing_research:
        if research.get("sources"):
            for source in research["sources"]:
                if isinstance(source, dict):
                    existing_urls.add(source.get("url", ""))
    
    # Check if any new URLs
    new_urls = 0
    for result in search_results:
        if result.get("url") not in existing_urls:
            new_urls += 1
    
    # Consider fresh if at least 2 new sources
    return new_urls >= 2

def create_content_hash(summary: str) -> str:
    """Create a hash of content to detect duplicates"""
    # Use first 200 chars normalized
    normalized = summary.lower().replace(" ", "")[:200]
    return hashlib.md5(normalized.encode()).hexdigest()[:16]

def analyze_and_summarize(topic: str, search_results: list) -> dict:
    """Analyze search results and create summary"""
    results_text = ""
    sources = []
    for i, result in enumerate(search_results, 1):
        results_text += f"\n{i}. {result.get('title', 'N/A')}\n   {result.get('content', '')[:400]}...\n"
        sources.append({"title": result.get("title", ""), "url": result.get("url", ""), "date": "2025"})
    
    prompt = f"""Analyze these search results about "{topic}" for a post-labor economics news feed.

{results_text}

Provide a JSON response:
{{
    "summary": "2-3 paragraph summary of what's NEW and significant",
    "key_stats": ["3-5 specific statistics with numbers"],
    "is_breaking": true/false (is this genuinely new/breaking news?)
}}

Focus on 2024-2025 content. Be specific with numbers."""

    content = call_openai([
        {"role": "system", "content": "Research analyst for post-labor economics. Respond with valid JSON."},
        {"role": "user", "content": prompt}
    ])
    
    if not content:
        return {"summary": "", "key_stats": [], "is_breaking": False, "sources": sources}
    
    try:
        if "```" in content:
            content = content.split("```")[1].replace("json", "").strip()
        parsed = json.loads(content.strip())
        parsed["sources"] = sources
        return parsed
    except:
        return {"summary": content, "key_stats": [], "is_breaking": False, "sources": sources}

def run_news_check(generate_images: bool = True) -> dict:
    """Check for fresh news - called every 20 minutes"""
    print(f"[{datetime.now().strftime('%H:%M')}] Checking for fresh news...")
    
    # Pick a random news query
    query = random.choice(NEWS_QUERIES)
    print(f"  Query: {query}")
    
    # Search for news
    results = search_news(query)
    if not results:
        print("  No results found")
        return {"status": "no_results", "query": query}
    
    # Check if content is actually fresh
    existing = get_latest_research(limit=20)
    if not is_content_fresh(results, existing):
        print("  No fresh content detected")
        return {"status": "not_fresh", "query": query}
    
    # Analyze the results
    analysis = analyze_and_summarize(query, results)
    
    # Skip if not breaking/significant
    if not analysis.get("is_breaking") and not analysis.get("summary"):
        print("  Content not significant enough")
        return {"status": "not_significant", "query": query}
    
    # Generate image (returns base64 data)
    image_data, image_prompt = None, None
    if generate_images and analysis.get("summary"):
        image_data, image_prompt = generate_image(query, analysis["summary"])
    
    # Save to database (image_url will be set after we have the ID)
    try:
        record_id = save_research(
            topic=query,
            summary=analysis.get("summary", ""),
            sources=analysis.get("sources", []),
            key_stats=analysis.get("key_stats", []),
            image_url=None,  # Will be constructed by frontend using ID
            image_prompt=image_prompt,
            image_data=image_data
        )
        print(f"  ✓ Saved new research (ID: {record_id})")
        return {
            "status": "saved",
            "query": query,
            "record_id": record_id,
            "image_generated": image_data is not None
        }
    except Exception as e:
        print(f"  Error saving: {e}")
        return {"status": "error", "query": query, "error": str(e)}

def run_research(topic: str, force: bool = False, generate_images: bool = True) -> dict:
    """Run research on a specific topic"""
    print(f"Researching: {topic}")
    
    if not force and topic_exists_recently(topic, hours=CACHE_HOURS):
        existing = get_similar_research(topic)
        if existing:
            return {"topic": topic, "status": "cached", "record_id": existing["id"], "cached": True}
    
    results = search_news(topic)
    if not results:
        return {"topic": topic, "status": "no_results"}
    
    analysis = analyze_and_summarize(topic, results)
    
    image_data, image_prompt = None, None
    if generate_images:
        image_data, image_prompt = generate_image(topic, analysis.get("summary", ""))
    
    try:
        record_id = save_research(
            topic=topic,
            summary=analysis.get("summary", ""),
            sources=analysis.get("sources", []),
            key_stats=analysis.get("key_stats", []),
            image_url=None,  # URL constructed by frontend using ID
            image_prompt=image_prompt,
            image_data=image_data
        )
        return {"topic": topic, "status": "success", "record_id": record_id, "has_image": image_data is not None, "cached": False}
    except Exception as e:
        return {"topic": topic, "status": "error", "message": str(e)}

def run_all_research(force: bool = False, generate_images: bool = True) -> list:
    """Run research on multiple fresh topics"""
    topics = random.sample(TOPIC_POOL, min(3, len(TOPIC_POOL)))
    return [run_research(t, force=force, generate_images=generate_images) for t in topics]
