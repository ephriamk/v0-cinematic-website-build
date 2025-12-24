import os
import json
import random
import httpx
from datetime import datetime
from database import save_research, topic_exists_recently, get_similar_research, get_all_topics

# API Keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

# Large diverse pool of topics - agent will pick randomly and avoid repeats
TOPIC_POOL = [
    # AI & Automation
    "artificial intelligence replacing white collar jobs 2025",
    "AI agents autonomous workers news",
    "ChatGPT impact on employment statistics",
    "AI coding assistants replacing developers",
    "creative AI displacing artists designers",
    "autonomous vehicles trucking job losses",
    "warehouse automation robotics employment",
    "AI customer service job displacement",
    "legal AI paralegals lawyers automation",
    "medical AI diagnosis healthcare jobs",
    
    # UBI & Economic Policy
    "universal basic income pilot results 2025",
    "UBI experiments outcomes worldwide",
    "guaranteed income programs USA cities",
    "Alaska permanent fund dividend results",
    "Finland UBI experiment long term effects",
    "Kenya GiveDirectly basic income study",
    "Sam Altman universal basic income project",
    "Andrew Yang UBI policy updates",
    
    # Robot Taxation & Wealth
    "robot tax legislation proposals 2025",
    "automation tax policy debates",
    "AI company windfall tax proposals",
    "tech billionaire wealth tax automation",
    "wealth inequality AI economy",
    "corporate profits vs worker wages AI era",
    
    # Future of Work
    "four day work week trials results",
    "remote work AI productivity studies",
    "gig economy workers rights 2025",
    "freelance economy growth AI tools",
    "human AI collaboration workplace",
    "skills needed post-AI job market",
    "reskilling workforce automation",
    "education system AI job preparation",
    
    # Philosophical & Social
    "meaning purpose work AI age",
    "post-scarcity economics theory",
    "leisure society automation predictions",
    "mental health unemployment AI displacement",
    "social status without work identity",
    "universal basic services vs UBI debate",
    
    # Breaking News Triggers
    "AI layoffs announcements today",
    "tech company job cuts AI 2025",
    "automation union strikes protests",
    "government AI regulation employment",
    "AI startup funding workforce impact",
]

# Cache duration - check if similar topic researched recently
CACHE_HOURS = 48  # Increased to avoid repetition

def call_openai(messages: list, max_tokens: int = 1000) -> str:
    """Call OpenAI Chat API directly using httpx"""
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
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return ""

def generate_image(topic: str, summary: str) -> tuple[str, str]:
    """Generate an image using DALL-E 3 based on the research topic"""
    prompt_request = f"""Create a DALL-E image prompt (max 150 chars) for: "{topic}"

Style: Abstract, cinematic, futuristic. Dark moody atmosphere with ethereal glowing elements.
NO text, NO words, NO letters, NO numbers in the image.
Focus on mood and concept, not literal representation.

Return ONLY the prompt."""

    messages = [
        {"role": "system", "content": "You create evocative DALL-E prompts. Return only the prompt, nothing else."},
        {"role": "user", "content": prompt_request}
    ]
    
    image_prompt = call_openai(messages, max_tokens=80)
    
    if not image_prompt:
        image_prompt = f"Abstract futuristic digital art, dark atmosphere, glowing cyan and purple accents, volumetric lighting, cinematic, ethereal, no text"
    
    image_prompt = image_prompt.strip().strip('"').strip("'")[:400]
    
    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": image_prompt,
                    "n": 1,
                    "size": "1792x1024",
                    "quality": "standard",
                    "style": "vivid"
                }
            )
            response.raise_for_status()
            data = response.json()
            image_url = data["data"][0]["url"]
            revised_prompt = data["data"][0].get("revised_prompt", image_prompt)
            print(f"Generated image for: {topic[:50]}...")
            return image_url, revised_prompt
    except Exception as e:
        print(f"DALL-E API error: {e}")
        return None, image_prompt

def search_web(query: str, max_results: int = 5) -> list:
    """Search the web using Tavily REST API"""
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                "https://api.tavily.com/search",
                headers={"Content-Type": "application/json"},
                json={
                    "api_key": TAVILY_API_KEY,
                    "query": query,
                    "max_results": max_results,
                    "search_depth": "basic"
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("results", [])
    except Exception as e:
        print(f"Tavily search error: {e}")
        return []

def analyze_and_summarize(topic: str, search_results: list) -> dict:
    """Use OpenAI to analyze search results and create a summary"""
    results_text = ""
    sources = []
    for i, result in enumerate(search_results, 1):
        results_text += f"\n{i}. Title: {result.get('title', 'N/A')}\n"
        results_text += f"   URL: {result.get('url', 'N/A')}\n"
        results_text += f"   Content: {result.get('content', 'N/A')[:500]}...\n"
        sources.append({
            "title": result.get("title", ""),
            "url": result.get("url", ""),
            "date": "2025"
        })
    
    prompt = f"""Analyze these search results about "{topic}" for a post-labor economics research feed.

Search Results:
{results_text}

Provide:
1. A 2-3 paragraph SUMMARY focusing on what's NEW and SIGNIFICANT
2. 3-5 KEY STATISTICS with specific numbers
3. The most important INSIGHT

Respond in JSON format:
{{
    "summary": "Your summary...",
    "key_stats": ["Stat 1", "Stat 2", "Stat 3"],
    "insight": "Main insight"
}}

Focus on 2024-2025 data. Be specific with numbers and dates."""

    messages = [
        {"role": "system", "content": "You are a research analyst for post-labor economics. Always respond with valid JSON."},
        {"role": "user", "content": prompt}
    ]
    
    content = call_openai(messages)
    
    if not content:
        return {"summary": f"Research on {topic}.", "key_stats": [], "insight": "", "sources": sources}
    
    try:
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        parsed = json.loads(content.strip())
        return {
            "summary": parsed.get("summary", ""),
            "key_stats": parsed.get("key_stats", []),
            "insight": parsed.get("insight", ""),
            "sources": sources
        }
    except json.JSONDecodeError:
        return {"summary": content, "key_stats": [], "insight": "", "sources": sources}

def get_fresh_topics(count: int = 3) -> list:
    """Select topics that haven't been researched recently"""
    # Get already researched topics
    existing = get_all_topics()
    existing_keywords = set()
    for item in existing:
        # Extract key words from existing topics
        words = item["topic"].lower().split()
        existing_keywords.update(words[:3])
    
    # Filter pool to find fresh topics
    fresh_topics = []
    shuffled_pool = TOPIC_POOL.copy()
    random.shuffle(shuffled_pool)
    
    for topic in shuffled_pool:
        topic_words = set(topic.lower().split()[:3])
        # Check if this topic overlaps too much with existing
        overlap = len(topic_words & existing_keywords)
        if overlap < 2:  # Allow if less than 2 words overlap
            if not topic_exists_recently(topic, hours=CACHE_HOURS):
                fresh_topics.append(topic)
                if len(fresh_topics) >= count:
                    break
    
    # Fallback: if not enough fresh topics, pick random ones
    while len(fresh_topics) < count:
        topic = random.choice(TOPIC_POOL)
        if topic not in fresh_topics:
            fresh_topics.append(topic)
    
    return fresh_topics

def run_research(topic: str, force: bool = False, generate_images: bool = True) -> dict:
    """Execute a complete research task on a specific topic"""
    print(f"Researching: {topic}")
    
    if not force and topic_exists_recently(topic, hours=CACHE_HOURS):
        existing = get_similar_research(topic)
        if existing:
            print(f"Using cached research for: {topic}")
            return {
                "topic": topic,
                "status": "cached",
                "record_id": existing["id"],
                "summary_preview": existing["summary"][:200] + "...",
                "image_url": existing.get("image_url"),
                "cached": True
            }
    
    search_results = search_web(topic)
    
    if not search_results:
        return {"topic": topic, "status": "no_results", "message": "No search results found"}
    
    analysis = analyze_and_summarize(topic, search_results)
    
    image_url = None
    image_prompt = None
    if generate_images:
        image_url, image_prompt = generate_image(topic, analysis["summary"])
    
    try:
        record_id = save_research(
            topic=topic,
            summary=analysis["summary"],
            sources=analysis["sources"],
            key_stats=analysis["key_stats"],
            image_url=image_url,
            image_prompt=image_prompt
        )
        
        return {
            "topic": topic,
            "status": "success",
            "record_id": record_id,
            "summary_preview": analysis["summary"][:200] + "...",
            "image_url": image_url,
            "cached": False
        }
    except Exception as e:
        return {"topic": topic, "status": "error", "message": str(e)}

def run_scheduled_research(generate_images: bool = True) -> list:
    """Run research on fresh, diverse topics - called by scheduler"""
    # Get 3 fresh topics that haven't been covered recently
    topics = get_fresh_topics(count=3)
    
    print(f"Scheduled research on {len(topics)} fresh topics:")
    for t in topics:
        print(f"  - {t}")
    
    results = []
    for topic in topics:
        result = run_research(topic, force=False, generate_images=generate_images)
        results.append(result)
        status = "cached" if result.get("cached") else result["status"]
        print(f"Completed: {topic[:40]}... - Status: {status}")
    
    return results

def run_all_research(force: bool = False, generate_images: bool = True) -> list:
    """Run research on fresh topics - for manual triggers"""
    topics = get_fresh_topics(count=5 if force else 3)
    
    results = []
    for topic in topics:
        result = run_research(topic, force=force, generate_images=generate_images)
        results.append(result)
    
    return results

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    print("Testing fresh topic selection...")
    topics = get_fresh_topics(5)
    for t in topics:
        print(f"  - {t}")
