"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime


class ParallelExtractResult(BaseModel):
    """Schema for a single Parallel Extract API result"""
    url: str
    title: Optional[str] = None
    excerpts: Optional[List[str]] = []
    full_content: Optional[str] = None
    publish_date: Optional[str] = None
    status: Optional[str] = None


class ArticleCreate(BaseModel):
    """Schema for creating an article"""
    text: str = Field(..., description="Main text content (from Parallel excerpt)")
    summary: Optional[str] = Field(None, description="Summary of the article")
    relevance_score: Optional[int] = Field(None, ge=1, le=10, description="Relevance score 1-10")
    date_written: Optional[datetime] = Field(None, description="Date the article was written")
    source: Optional[str] = Field(None, description="Source URL or publication name")
    category_id: Optional[int] = Field(None, description="Category ID reference")


class ArticleResponse(BaseModel):
    """Schema for article response"""
    id: int
    text: str
    summary: Optional[str]
    relevance_score: Optional[int]
    date_written: Optional[datetime]
    date_created: datetime
    source: Optional[str]
    category_id: Optional[int]

    class Config:
        from_attributes = True


class ParallelExtractBatch(BaseModel):
    """Schema for batch processing Parallel Extract results"""
    results: List[ParallelExtractResult]
    default_category_id: Optional[int] = Field(None, description="Default category for all articles")
    default_relevance_score: Optional[int] = Field(5, ge=1, le=10, description="Default relevance score")


class BatchProcessResponse(BaseModel):
    """Response for batch processing"""
    success: bool
    articles_created: int
    article_ids: List[int]
    errors: List[str] = []
