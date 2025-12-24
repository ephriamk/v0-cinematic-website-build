import os
import json
import httpx
from database import save_research, topic_exists_recently, get_similar_research

# API Keys
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

# Pre-defined research topics
RESEARCH_TOPICS = [
    "AI job automation statistics 2025",
    "Universal Basic Income UBI trials results 2025",
    "robot taxation policy proposals 2025",
    "AI workforce displacement news today",
    "post-labor economics developments 2025"
]

# Cache duration in hours - don't re-research same topic within this window
CACHE_HOURS = 12

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
    """Generate an image using DALL-E 3 based on the research topic
    
    Returns:
        tuple: (image_url, prompt_used)
    """
    # Create a cinematic, abstract prompt based on the topic
    prompt_request = f"""Create a short DALL-E image prompt (max 200 chars) for this research topic: "{topic}"

The image should be:
- Abstract and cinematic, NOT literal
- Futuristic, ethereal atmosphere
- Dark moody background with glowing accents
- No text, no words, no letters
- Style: digital art, volumetric lighting, atmospheric

Return ONLY the prompt, nothing else."""

    messages = [
        {"role": "system", "content": "You are an expert at creating evocative DALL-E prompts. Return only the prompt."},
        {"role": "user", "content": prompt_request}
    ]
    
    image_prompt = call_openai(messages, max_tokens=100)
    
    if not image_prompt:
        # Fallback prompt
        image_prompt = f"Abstract futuristic digital art representing {topic[:50]}, dark moody atmosphere, glowing blue and purple accents, volumetric lighting, cinematic, no text"
    
    # Clean up the prompt
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
                    "size": "1792x1024",  # Wide format for cards
                    "quality": "standard",
                    "style": "vivid"
                }
            )
            response.raise_for_status()
            data = response.json()
            image_url = data["data"][0]["url"]
            # DALL-E might revise the prompt
            revised_prompt = data["data"][0].get("revised_prompt", image_prompt)
            print(f"Generated image for: {topic}")
            return image_url, revised_prompt
    except Exception as e:
        print(f"DALL-E API error: {e}")
        return None, image_prompt

def search_web(query: str, max_results: int = 5) -> list:
    """Search the web using Tavily REST API directly"""
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
    
    # Format search results for the prompt
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
    
    prompt = f"""You are a Post-Labor Economics Research Analyst. Analyze the following search results about "{topic}" and provide:

1. A comprehensive 2-3 paragraph SUMMARY of the key findings
2. A list of 3-5 KEY STATISTICS (specific numbers, percentages, dates)
3. The most important INSIGHT or trend

Search Results:
{results_text}

Respond in this exact JSON format:
{{
    "summary": "Your 2-3 paragraph summary here...",
    "key_stats": ["Statistic 1", "Statistic 2", "Statistic 3"],
    "insight": "The main insight or trend"
}}

Focus on 2024-2025 data only. Be factual and cite specific numbers."""

    messages = [
        {"role": "system", "content": "You are a research analyst specializing in post-labor economics, AI automation, and the future of work. Always respond with valid JSON."},
        {"role": "user", "content": prompt}
    ]
    
    content = call_openai(messages)
    
    if not content:
        return {
            "summary": f"Research on {topic} is being processed.",
            "key_stats": [],
            "insight": "",
            "sources": sources
        }
    
    # Try to parse JSON from the response
    try:
        # Handle potential markdown code blocks
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
        # Fallback: use the raw content as summary
        return {
            "summary": content,
            "key_stats": [],
            "insight": "",
            "sources": sources
        }

def run_research(topic: str, force: bool = False, generate_images: bool = True) -> dict:
    """Execute a complete research task on a specific topic
    
    Args:
        topic: The topic to research
        force: If True, bypass cache and force new research
        generate_images: If True, generate a DALL-E image for the research
    """
    print(f"Researching: {topic}")
    
    # Check if we already have recent research on this topic
    if not force and topic_exists_recently(topic, hours=CACHE_HOURS):
        existing = get_similar_research(topic)
        if existing:
            print(f"Using cached research for: {topic}")
            return {
                "topic": topic,
                "status": "cached",
                "record_id": existing["id"],
                "summary_preview": existing["summary"][:200] + "..." if len(existing["summary"]) > 200 else existing["summary"],
                "image_url": existing.get("image_url"),
                "cached": True
            }
    
    # Step 1: Search the web
    search_results = search_web(topic)
    
    if not search_results:
        return {
            "topic": topic,
            "status": "no_results",
            "message": "No search results found"
        }
    
    # Step 2: Analyze and summarize
    analysis = analyze_and_summarize(topic, search_results)
    
    # Step 3: Generate image with DALL-E
    image_url = None
    image_prompt = None
    if generate_images:
        image_url, image_prompt = generate_image(topic, analysis["summary"])
    
    # Step 4: Save to database
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
            "summary_preview": analysis["summary"][:200] + "..." if len(analysis["summary"]) > 200 else analysis["summary"],
            "image_url": image_url,
            "cached": False
        }
    except Exception as e:
        return {
            "topic": topic,
            "status": "error",
            "message": str(e)
        }

def run_all_research(force: bool = False, generate_images: bool = True) -> list:
    """Run research on all predefined topics
    
    Args:
        force: If True, bypass cache and force new research on all topics
        generate_images: If True, generate DALL-E images for each research
    """
    results = []
    for topic in RESEARCH_TOPICS:
        result = run_research(topic, force=force, generate_images=generate_images)
        results.append(result)
        status = "cached" if result.get("cached") else result["status"]
        print(f"Completed: {topic} - Status: {status}")
    return results

if __name__ == "__main__":
    # Test run
    from dotenv import load_dotenv
    load_dotenv()
    
    print("Testing research agent...")
    result = run_research("AI job automation 2025", generate_images=True)
    print(json.dumps(result, indent=2))
