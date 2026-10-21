-- ShopSphere başlangıç veritabanı şeması (Neon / PostgreSQL)
-- Neon SQL Editor'de bu dosyanın tamamını çalıştırabilirsiniz.

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  source_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0
    CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0
    CHECK (rating >= 0 AND rating <= 5),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  thumbnail TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx
  ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_active_idx
  ON refresh_tokens (token_hash, expires_at)
  WHERE revoked_at IS NULL;
