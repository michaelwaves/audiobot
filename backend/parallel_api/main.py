"""
FastAPI application for processing Parallel Extract API results and storing in PostgreSQL
"""
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from database import get_db, engine
from models import Base, Article
from schemas import (
    ArticleCreate,
    ArticleResponse,
    ParallelExtractBatch,
    BatchProcessResponse,
    ParallelExtractResult
)
from embedding_service import get_embedding_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Parallel Extract to Database API",
    description="API to process Parallel Extract results and store them in PostgreSQL",
    version="1.0.0"
)


@app.on_event("startup")
async def startup_event():
    """Create tables on startup if they don't exist"""
    logger.info("Creating database tables if they don't exist...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Parallel Extract to Database API is running",
        "version": "1.0.0"
    }


@app.post("/articles/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    """
    Create a single article with embedding
    """
    try:
        # Generate embedding for the text
        embedding_service = get_embedding_service()
        embedding = embedding_service.generate_embedding(article.text)

        # Create article with embedding
        article_dict = article.model_dump()
        article_dict['vector'] = embedding

        db_article = Article(**article_dict)
        db.add(db_article)
        db.commit()
        db.refresh(db_article)

        logger.info(f"Created article with ID: {db_article.id} (embedding: {len(embedding) if embedding else 0} dims)")
        return db_article

    except Exception as e:
        db.rollback()
        logger.error(f"Error creating article: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating article: {str(e)}"
        )


@app.post("/articles/batch/", response_model=BatchProcessResponse)
async def process_parallel_extract_batch(
    batch: ParallelExtractBatch,
    db: Session = Depends(get_db)
):
    """
    Process a batch of Parallel Extract API results and create articles

    This endpoint takes the output from Parallel Extract API and maps:
    - excerpts[0] -> article.text (main content)
    - url -> article.source
    - publish_date -> article.date_written
    """
    created_articles = []
    article_ids = []
    errors = []

    try:
        for idx, result in enumerate(batch.results):
            try:
                # Extract the first excerpt as the main text
                # Parallel returns excerpts as a list, we'll use the first one
                text_content = None

                if result.excerpts and len(result.excerpts) > 0:
                    text_content = result.excerpts[0]
                elif result.full_content:
                    # If no excerpts, use full_content (truncate if too long)
                    text_content = result.full_content[:10000]  # Limit to 10k chars
                else:
                    errors.append(f"Result {idx}: No text content available")
                    continue

                # Parse publish_date if available
                date_written = None
                if result.publish_date:
                    try:
                        date_written = datetime.fromisoformat(result.publish_date.replace('Z', '+00:00'))
                    except Exception as e:
                        logger.warning(f"Could not parse date {result.publish_date}: {e}")

                # Generate embedding for the text
                embedding_service = get_embedding_service()
                embedding = embedding_service.generate_embedding(text_content)

                # Create article with embedding
                article = Article(
                    text=text_content,
                    summary=result.title,  # Use title as summary
                    relevance_score=batch.default_relevance_score,
                    date_written=date_written,
                    source=result.url,
                    category_id=batch.default_category_id,
                    vector=embedding
                )

                db.add(article)
                db.flush()  # Flush to get the ID

                created_articles.append(article)
                article_ids.append(article.id)

                logger.info(f"Prepared article {article.id} from {result.url}")

            except Exception as e:
                error_msg = f"Result {idx} ({result.url if hasattr(result, 'url') else 'unknown'}): {str(e)}"
                errors.append(error_msg)
                logger.error(error_msg)

        # Commit all articles
        db.commit()

        logger.info(f"Successfully created {len(created_articles)} articles")

        return BatchProcessResponse(
            success=len(created_articles) > 0,
            articles_created=len(created_articles),
            article_ids=article_ids,
            errors=errors
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Batch processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch processing failed: {str(e)}"
        )


@app.get("/articles/", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all articles with pagination
    """
    articles = db.query(Article).offset(skip).limit(limit).all()
    return articles


@app.get("/articles/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """
    Get a single article by ID
    """
    article = db.query(Article).filter(Article.id == article_id).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article with ID {article_id} not found"
        )

    return article


@app.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: int, db: Session = Depends(get_db)):
    """
    Delete an article by ID
    """
    article = db.query(Article).filter(Article.id == article_id).first()

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article with ID {article_id} not found"
        )

    db.delete(article)
    db.commit()

    logger.info(f"Deleted article with ID: {article_id}")
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
