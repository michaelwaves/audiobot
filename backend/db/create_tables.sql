-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Auth.js tables (already exist, shown for completeness)
CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

-- ---------------------------------------------------------
-- Audiobot schema
-- ---------------------------------------------------------

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    summary TEXT,
    relevance_score INTEGER,                     -- 1–10
    date_written TIMESTAMPTZ,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    vector VECTOR(1536)                          -- adjust dimension to your model
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    text TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE podcasts (
    id SERIAL PRIMARY KEY,
    script TEXT NOT NULL,
    spotify_link TEXT,
    s3_link TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_ids INTEGER[] NOT NULL DEFAULT '{}',
    preference_vector VECTOR(1536),
    "language" TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Useful indexes
CREATE INDEX idx_articles_date_written ON articles(date_written DESC);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_articles_vector ON articles USING ivfflat (vector vector_cosine_ops);
