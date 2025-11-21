from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ArticleResponse(BaseModel):
    """Response model for article data."""
    id: int
    text: str
    summary: Optional[str] = None
    relevance_score: Optional[int] = None
    date_written: Optional[datetime] = None
    source: Optional[str] = None
    category_name: Optional[str] = None
    similarity_score: Optional[float] = None


class GeneratePodcastRequest(BaseModel):
    """Request model for generating a podcast from user preferences."""
    user_id: int = Field(..., description="User ID to fetch preferences for")
    limit: int = Field(10, ge=1, le=50, description="Number of articles to include")
    similarity_threshold: float = Field(0.7, ge=0.0, le=1.0, description="Minimum similarity score")
    voice_id: Optional[str] = Field(None, description="Optional custom voice ID")


class GeneratePodcastFromArticlesRequest(BaseModel):
    """Request model for generating a podcast from specific article IDs."""
    article_ids: List[int] = Field(..., description="List of article IDs to convert to audio")
    voice_id: Optional[str] = Field(None, description="Optional custom voice ID")


class GeneratePodcastFromCategoriesRequest(BaseModel):
    """Request model for generating a podcast from categories."""
    category_ids: List[int] = Field(..., description="List of category IDs")
    limit: int = Field(10, ge=1, le=50, description="Number of articles to include")
    voice_id: Optional[str] = Field(None, description="Optional custom voice ID")


class GenerateAudioFromTextRequest(BaseModel):
    """Request model for generating audio from raw text."""
    text: str = Field(..., min_length=1, description="Text to convert to speech")
    voice_id: Optional[str] = Field(None, description="Optional custom voice ID")
    filename: Optional[str] = Field(None, description="Optional custom filename")


class SearchArticlesRequest(BaseModel):
    """Request model for searching articles."""
    query: str = Field(..., min_length=1, description="Search query text")
    limit: int = Field(10, ge=1, le=50, description="Number of results to return")
    category_ids: Optional[List[int]] = Field(None, description="Optional category filter")


class PodcastResponse(BaseModel):
    """Response model for podcast generation."""
    success: bool
    audio_path: str
    filename: str
    article_count: int
    message: Optional[str] = None


class VoiceInfo(BaseModel):
    """Response model for voice information."""
    id: str
    name: str
    category: Optional[str] = None


class VoicesResponse(BaseModel):
    """Response model for available voices."""
    voices: List[VoiceInfo]
