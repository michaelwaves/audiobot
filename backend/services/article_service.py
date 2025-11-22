from typing import List, Optional, Dict, Any
from database import db
from embeddings import model


class ArticleService:
    """Service for retrieving and managing articles from the vector database."""

    @staticmethod
    def get_articles_by_user_preferences(
        user_id: int,
        limit: int = 10,
        similarity_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Retrieve articles based on user preferences using vector similarity.

        Args:
            user_id: The user ID to get preferences for
            limit: Maximum number of articles to return
            similarity_threshold: Minimum cosine similarity score (0-1)

        Returns:
            List of article dictionaries with metadata
        """
        query = """
            SELECT
                a.id,
                a.text,
                a.summary,
                a.relevance_score,
                a.date_written,
                a.source,
                c.name as category_name,
                1 - (a.vector <=> s.preference_vector) as similarity_score
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            CROSS JOIN settings s
            WHERE s.user_id = %s
                AND s.preference_vector IS NOT NULL
              
                AND 1 - (a.vector <=> s.preference_vector) >= %s
            ORDER BY similarity_score DESC, a.date_written DESC
            LIMIT %s;
        """

        with db.get_cursor() as cursor:
            cursor.execute(query, (user_id, similarity_threshold, limit))
            return cursor.fetchall()

    @staticmethod
    def get_articles_by_category(
        category_ids: List[int],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Retrieve recent articles by category IDs.

        Args:
            category_ids: List of category IDs to filter by
            limit: Maximum number of articles to return

        Returns:
            List of article dictionaries
        """
        query = """
            SELECT
                a.id,
                a.text,
                a.summary,
                a.relevance_score,
                a.date_written,
                a.source,
                c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.category_id = ANY(%s)
            ORDER BY a.date_written DESC, a.relevance_score DESC
            LIMIT %s;
        """

        with db.get_cursor() as cursor:
            cursor.execute(query, (category_ids, limit))
            return cursor.fetchall()

    @staticmethod
    def get_articles_by_ids(article_ids: List[int]) -> List[Dict[str, Any]]:
        """
        Retrieve specific articles by their IDs.

        Args:
            article_ids: List of article IDs to retrieve

        Returns:
            List of article dictionaries
        """
        query = """
            SELECT
                a.id,
                a.text,
                a.summary,
                a.relevance_score,
                a.date_written,
                a.source,
                c.name as category_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE a.id = ANY(%s)
            ORDER BY a.date_written DESC;
        """

        with db.get_cursor() as cursor:
            cursor.execute(query, (article_ids,))
            return cursor.fetchall()

    @staticmethod
    def search_articles_by_text(
        query_text: str,
        limit: int = 10,
        category_ids: Optional[List[int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search articles using vector similarity to a query text.

        Args:
            query_text: The search query
            limit: Maximum number of articles to return
            category_ids: Optional list of category IDs to filter by

        Returns:
            List of article dictionaries with similarity scores
        """
        # Generate embedding for the query text
        query_embedding = model.encode_queries([query_text])[0].tolist()

        if category_ids:
            query = """
                SELECT
                    a.id,
                    a.text,
                    a.summary,
                    a.relevance_score,
                    a.date_written,
                    a.source,
                    c.name as category_name,
                    1 - (a.vector <=> %s::vector) as similarity_score
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.category_id = ANY(%s)
                ORDER BY similarity_score DESC, a.date_written DESC
                LIMIT %s;
            """
            params = (query_embedding, category_ids, limit)
        else:
            query = """
                SELECT
                    a.id,
                    a.text,
                    a.summary,
                    a.relevance_score,
                    a.date_written,
                    a.source,
                    c.name as category_name,
                    1 - (a.vector <=> %s::vector) as similarity_score
                FROM articles a
                LEFT JOIN categories c ON a.category_id = c.id
                ORDER BY similarity_score DESC, a.date_written DESC
                LIMIT %s;
            """
            params = (query_embedding, limit)

        with db.get_cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()

    @staticmethod
    def get_user_settings(user_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieve user settings including category preferences.

        Args:
            user_id: The user ID

        Returns:
            User settings dictionary or None if not found
        """
        query = """
            SELECT
                id,
                user_id,
                category_ids,
                created_at,
                updated_at
            FROM settings
            WHERE user_id = %s;
        """

        with db.get_cursor() as cursor:
            cursor.execute(query, (user_id,))
            return cursor.fetchone()
