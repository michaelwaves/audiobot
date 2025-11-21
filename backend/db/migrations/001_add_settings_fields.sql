-- Add additional settings fields for podcast preferences
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS length INTEGER DEFAULT 10 CHECK (length IN (5, 10, 15)),
ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'spotify' CHECK (delivery_method IN ('spotify', 'rss')),
ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly'));
