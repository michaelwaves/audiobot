import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Generator
from config import settings


class Database:
    """Database connection manager for PostgreSQL with pgvector support."""

    def __init__(self, connection_string: str):
        self.connection_string = connection_string

    @contextmanager
    def get_connection(self) -> Generator[psycopg2.extensions.connection, None, None]:
        """Context manager for database connections."""
        conn = None
        try:
            conn = psycopg2.connect(self.connection_string)
            yield conn
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    @contextmanager
    def get_cursor(self, cursor_factory=RealDictCursor) -> Generator[psycopg2.extensions.cursor, None, None]:
        """Context manager for database cursors with automatic connection handling."""
        with self.get_connection() as conn:
            cursor = conn.cursor(cursor_factory=cursor_factory)
            try:
                yield cursor
            finally:
                cursor.close()


# Global database instance
db = Database(settings.database_url)
