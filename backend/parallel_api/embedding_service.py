"""
Embedding service using Azure OpenAI
Generates vector embeddings for text content
"""
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import logging
from typing import List, Optional

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service to generate embeddings using Azure OpenAI"""

    def __init__(self):
        """Initialize Azure OpenAI client"""
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

        self.embedding_model = os.getenv(
            "AZURE_OPENAI_EMBEDDING_DEPLOYMENT_FAST",
            "text-embedding-3-small"
        )

        logger.info(f"Initialized EmbeddingService with model: {self.embedding_model}")

    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding vector for a single text

        Args:
            text: Text to generate embedding for

        Returns:
            List of floats (1536 dimensions) or None if error
        """
        if not text or not text.strip():
            logger.warning("Empty text provided for embedding")
            return None

        try:
            # Truncate text if too long (max ~8000 tokens for text-embedding-3-small)
            max_chars = 30000  # Rough estimate
            if len(text) > max_chars:
                logger.warning(f"Text too long ({len(text)} chars), truncating to {max_chars}")
                text = text[:max_chars]

            response = self.client.embeddings.create(
                input=text,
                model=self.embedding_model
            )

            embedding = response.data[0].embedding

            logger.info(f"Generated embedding with {len(embedding)} dimensions")

            return embedding

        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            return None

    def generate_embeddings_batch(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts

        Args:
            texts: List of texts to generate embeddings for

        Returns:
            List of embeddings (or None for failed items)
        """
        if not texts:
            return []

        embeddings = []

        for idx, text in enumerate(texts):
            try:
                embedding = self.generate_embedding(text)
                embeddings.append(embedding)
                logger.info(f"Generated embedding {idx+1}/{len(texts)}")

            except Exception as e:
                logger.error(f"Error generating embedding for text {idx}: {str(e)}")
                embeddings.append(None)

        return embeddings


# Global singleton instance
_embedding_service = None


def get_embedding_service() -> EmbeddingService:
    """
    Get or create embedding service singleton

    Returns:
        EmbeddingService instance
    """
    global _embedding_service

    if _embedding_service is None:
        _embedding_service = EmbeddingService()

    return _embedding_service
