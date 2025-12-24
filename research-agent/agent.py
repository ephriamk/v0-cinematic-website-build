import os
import json
import httpx
from tavily import TavilyClient
from database import save_research

# Initialize clients
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
tavily_client = TavilyClient(api_key=os.environ.get("TAVILY_API_KEY"))

# Pre-defined research topics
RESEARCH_TOPICS = [
    "AI job automation statistics 2025",
    "Universal Basic Income UBI trials results 2025",
    "robot taxation policy proposals 2025",
    "AI workforce displacement news today",
    "post-labor economics developments 2025"
]

def call_openai(messages: list, max_tokens: int = 1000) -> str:
    """Call OpenAI API directly using httpx"""
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

def search_web(query: str, max_results: int = 5) -> list:
    """Search the web for information using Tavily"""
    try:
        results = tavily_client.search(query, max_results=max_results)
        return results.get("results", [])
    except Exception as e:
        print(f"Search error: {e}")
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

def run_research(topic: str) -> dict:
    """Execute a complete research task on a specific topic"""
    print(f"Researching: {topic}")
    
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
    
    # Step 3: Save to database
    try:
        record_id = save_research(
            topic=topic,
            summary=analysis["summary"],
            sources=analysis["sources"],
            key_stats=analysis["key_stats"]
        )
        
        return {
            "topic": topic,
            "status": "success",
            "record_id": record_id,
            "summary_preview": analysis["summary"][:200] + "..." if len(analysis["summary"]) > 200 else analysis["summary"]
        }
    except Exception as e:
        return {
            "topic": topic,
            "status": "error",
            "message": str(e)
        }

def run_all_research() -> list:
    """Run research on all predefined topics"""
    results = []
    for topic in RESEARCH_TOPICS:
        result = run_research(topic)
        results.append(result)
        print(f"Completed: {topic} - Status: {result['status']}")
    return results

if __name__ == "__main__":
    # Test run
    from dotenv import load_dotenv
    load_dotenv()
    
    print("Testing research agent...")
    result = run_research("AI job automation 2025")
    print(json.dumps(result, indent=2))
