"""
Full test run for the news with audio generation endpoint
Prompt: Give me the latest news on AI, Machine Learning, and Startups
Keywords: AI, Agentic, MCP, Context, HITL, RL
"""
import requests
import json
from datetime import datetime

# API endpoint
API_URL = "http://localhost:8001"
ENDPOINT = f"{API_URL}/news/generate-with-audio"

print("\n" + "="*80)
print("FULL TEST: News with Audio Generation")
print("="*80 + "\n")

# Request payload with your specific prompt
payload = {
    "query": "Give me the latest news on AI, Machine Learning, and Startups",
    "max_articles": 10,
    "category_id": None,
    "relevance_score": 9,
    "target_duration_minutes": 2,
    "voice_id": None  # Will use default voice
}

print("Request Payload:")
print(json.dumps(payload, indent=2))
print("\n" + "-"*80 + "\n")

print(f"Calling: POST {ENDPOINT}")
print("Keywords will be used: AI, Agentic, MCP, Context, HITL, RL")
print("\nThis will take several minutes...")
print("  - Searching for articles...")
print("  - Extracting full content...")
print("  - Generating 2-minute summaries...")
print("  - Creating audio files...")
print("  - Storing in database...")
print("\nPlease wait...\n")

start_time = datetime.now()

try:
    response = requests.post(ENDPOINT, json=payload, timeout=600)  # 10 min timeout

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    if response.status_code == 200:
        result = response.json()

        print("\n" + "="*80)
        print("✓ SUCCESS!")
        print("="*80 + "\n")

        print(f"Total Time: {duration:.1f} seconds ({duration/60:.1f} minutes)")
        print(f"\nQuery: {result['query']}")
        print(f"Articles Found: {result['articles_found']}")
        print(f"Articles Processed: {result['articles_processed']}")
        print(f"Articles with Audio: {result['articles_with_audio']}")

        print("\n" + "-"*80)
        print("GENERATED ARTICLES WITH AUDIO:")
        print("-"*80 + "\n")

        for idx, article in enumerate(result['articles'], 1):
            print(f"{idx}. Article ID: {article['article_id']}")
            print(f"   Title: {article['title']}")
            print(f"   Source URL: {article['source']}")
            print(f"   Audio File: {article['audio_filename']}")
            print(f"   Summary Length: {article['summary_word_count']} words (~{article['summary_word_count']/150:.1f} min audio)")
            print()

        if result['errors']:
            print("\n" + "-"*80)
            print("ERRORS/WARNINGS:")
            print("-"*80 + "\n")
            for error in result['errors']:
                print(f"  - {error}")

        print("\n" + "="*80)
        print(f"COMPLETE: Generated {result['articles_with_audio']} articles with 2-minute audio summaries")
        print(f"Audio files saved to: backend/generated_audio/")
        print(f"Database: Articles stored with URLs, embeddings, and summaries")
        print("="*80 + "\n")

    else:
        print(f"\n✗ Error: {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.Timeout:
    print("\n✗ Request timed out (took longer than 10 minutes)")
except requests.exceptions.ConnectionError:
    print("\n✗ Could not connect to server. Is it running on port 8001?")
except Exception as e:
    print(f"\n✗ Error: {str(e)}")
