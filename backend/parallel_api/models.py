"""
SQLAlchemy models for articles database
"""
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from database import Base


class Category(Base):
    """Category model"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)


class Article(Base):
    """Article model matching your database schema"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)  # Maps to Parallel's excerpt
    summary = Column(Text, nullable=True)
    relevance_score = Column(Integer, nullable=True)  # 1-10
    date_written = Column(TIMESTAMP(timezone=True), nullable=True)
    date_created = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    source = Column(Text, nullable=True)
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True
    )
    vector = Column(Vector(1536), nullable=True)  # pgvector for embeddings
