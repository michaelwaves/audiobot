"""
Unified Parallel Service
Combines Search + Extract + Embed + Store into a single easy-to-use service
"""
import os
from parallel import Parallel
from dotenv import load_dotenv
import requests
from typing import List, Optional, Dict
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ParallelUnifiedService:
    """
    Unified service that wraps Parallel Search + Extract APIs

    Usage:
        service = ParallelUnifiedService()
        result = service.search_extract_and_store(
            query="Find articles about AI",
            max_articles=10
        )
    """

    def __init__(self, api_url: str = "http://localhost:8000"):
        """
        Initialize the unified service

        Args:
            api_url: FastAPI endpoint URL
        """
        self.parallel_client = Parallel(api_key=os.environ["PARALLEL_API_KEY"])
        self.api_url = api_url
        logger.info(f"Initialized ParallelUnifiedService with API: {api_url}")

    def search_extract_and_store(
        self,
        query: str,
        max_articles: int = 10,
        category_id: Optional[int] = None,
        relevance_score: int = 8,
        search_queries: Optional[List[str]] = None
    ) -> Dict:
        """
        Complete workflow: Search → Extract → Embed → Store

        Args:
            query: What you're looking for (e.g., "Latest AI news")
            max_articles: Maximum number of articles to process (default: 10)
            category_id: Optional category ID for articles
            relevance_score: Relevance score 1-10 (default: 8)
            search_queries: Optional custom search queries (auto-generated if not provided)

        Returns:
            Dict with results:
            {
                "success": bool,
                "query": str,
                "articles_found": int,
                "articles_extracted": int,
                "articles_stored": int,
                "article_ids": List[int],
                "errors": List[str]
            }
        """
        logger.info(f"Starting unified workflow for query: '{query}'")

        result = {
            "success": False,
            "query": query,
            "articles_found": 0,
            "articles_extracted": 0,
            "articles_stored": 0,
            "article_ids": [],
            "errors": []
        }

        try:
            # Step 1: Search
            logger.info("Step 1/3: Searching with Parallel Search API...")

            # Auto-generate search queries if not provided
            if search_queries is None:
                search_queries = self._generate_search_queries(query)

            search_result = self.parallel_client.beta.search(
                objective=query,
                search_queries=search_queries,
                max_results=max_articles,
                excerpts={
                    "max_chars_per_result": 8000
                }
            )

            result["articles_found"] = len(search_result.results)
            logger.info(f"✓ Found {result['articles_found']} articles")

            if not search_result.results:
                result["errors"].append("No articles found")
                return result

            # Extract URLs
            urls = [r.url for r in search_result.results][:max_articles]

            # Step 2: Extract
            logger.info(f"Step 2/3: Extracting content from {len(urls)} articles...")

            extract_result = self.parallel_client.beta.extract(
                urls=urls,
                objective=f"Extract detailed content for: {query}",
                excerpts={
                    "max_chars_per_result": 50000
                },
                full_content=True
            )

            result["articles_extracted"] = len(extract_result.results)
            logger.info(f"✓ Extracted {result['articles_extracted']} articles")

            if not extract_result.results:
                result["errors"].append("No content extracted")
                return result

            # Step 3: Embed and Store
            logger.info(f"Step 3/3: Generating embeddings and storing in database...")

            # Prepare batch payload
            results_data = []
            for r in extract_result.results:
                results_data.append({
                    "url": r.url if hasattr(r, 'url') else "",
                    "title": r.title if hasattr(r, 'title') else None,
                    "excerpts": r.excerpts if hasattr(r, 'excerpts') else [],
                    "full_content": r.full_content if hasattr(r, 'full_content') else None,
                    "publish_date": r.publish_date if hasattr(r, 'publish_date') else None,
                    "status": r.status if hasattr(r, 'status') else None
                })

            batch_payload = {
                "results": results_data,
                "default_category_id": category_id,
                "default_relevance_score": relevance_score
            }

            # Send to FastAPI
            response = requests.post(
                f"{self.api_url}/articles/batch/",
                json=batch_payload
            )

            if response.status_code == 200:
                api_result = response.json()
                result["articles_stored"] = api_result["articles_created"]
                result["article_ids"] = api_result["article_ids"]
                result["errors"].extend(api_result.get("errors", []))
                result["success"] = True

                logger.info(f"✓ Stored {result['articles_stored']} articles in database")
                logger.info(f"✓ Article IDs: {result['article_ids']}")
            else:
                error_msg = f"API error: {response.status_code} - {response.text}"
                result["errors"].append(error_msg)
                logger.error(error_msg)

        except Exception as e:
            error_msg = f"Workflow error: {str(e)}"
            result["errors"].append(error_msg)
            logger.error(error_msg, exc_info=True)

        return result

    def _generate_search_queries(self, query: str) -> List[str]:
        """
        Auto-generate search queries from main query

        Args:
            query: Main search query

        Returns:
            List of search queries
        """
        # Simple query generation - can be enhanced with LLM later
        queries = [query]

        # Add variations
        if "latest" in query.lower():
            queries.append(query.replace("latest", "recent"))
            queries.append(query.replace("latest", "new"))

        # Add year if not present
        if "2025" not in query:
            queries.append(f"{query} 2025")

        # Add "news" if searching for current events
        if "latest" in query.lower() or "recent" in query.lower():
            queries.append(f"{query} news")

        return queries[:4]  # Limit to 4 queries

    def search_only(self, query: str, max_articles: int = 10) -> List[Dict]:
        """
        Just search, return URLs (no extraction)

        Args:
            query: Search query
            max_articles: Maximum results

        Returns:
            List of search results with URLs
        """
        logger.info(f"Searching for: '{query}'")

        search_result = self.parallel_client.beta.search(
            objective=query,
            search_queries=self._generate_search_queries(query),
            max_results=max_articles,
            excerpts={
                "max_chars_per_result": 8000
            }
        )

        results = []
        for r in search_result.results:
            results.append({
                "url": r.url if hasattr(r, 'url') else "",
                "title": r.title if hasattr(r, 'title') else "No title",
                "excerpts": r.excerpts if hasattr(r, 'excerpts') else []
            })

        logger.info(f"✓ Found {len(results)} articles")
        return results
