import pool from './pool.js'

const migrateSQL = `
-- Ensure binary asset table exists
CREATE TABLE IF NOT EXISTS project_assets (
  id            BIGSERIAL PRIMARY KEY,
  filename      VARCHAR(255),
  mime_type     VARCHAR(120) NOT NULL,
  data          BYTEA        NOT NULL,
  byte_size     INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Ensure projects table exists (for fresh databases)
CREATE TABLE IF NOT EXISTS projects (
  id                   SERIAL PRIMARY KEY,
  title                VARCHAR(120) NOT NULL,
  category             VARCHAR(60)  NOT NULL,
  description          TEXT         NOT NULL,
  tech                 TEXT[]       NOT NULL DEFAULT '{}',
  gradient             VARCHAR(200) NOT NULL,
  status               VARCHAR(20)  NOT NULL DEFAULT 'In Progress',
  year                 INTEGER      NOT NULL,
  client               VARCHAR(120),
  duration             VARCHAR(40),
  highlights           TEXT[]       NOT NULL DEFAULT '{}',
  sort_order           INTEGER      NOT NULL DEFAULT 0,
  website_url          VARCHAR(500),
  featured_asset_id    BIGINT REFERENCES project_assets(id) ON DELETE SET NULL,
  featured_external_url VARCHAR(1000),
  images_asset_ids     BIGINT[]     NOT NULL DEFAULT '{}',
  images_external_urls TEXT[]       NOT NULL DEFAULT '{}',
  video_asset_id       BIGINT REFERENCES project_assets(id) ON DELETE SET NULL,
  video_external_url   VARCHAR(1000),
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Add PostgreSQL media columns to projects
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='featured_asset_id') THEN
    ALTER TABLE projects ADD COLUMN featured_asset_id BIGINT REFERENCES project_assets(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='featured_external_url') THEN
    ALTER TABLE projects ADD COLUMN featured_external_url VARCHAR(1000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images_asset_ids') THEN
    ALTER TABLE projects ADD COLUMN images_asset_ids BIGINT[] NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images_external_urls') THEN
    ALTER TABLE projects ADD COLUMN images_external_urls TEXT[] NOT NULL DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video_asset_id') THEN
    ALTER TABLE projects ADD COLUMN video_asset_id BIGINT REFERENCES project_assets(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video_external_url') THEN
    ALTER TABLE projects ADD COLUMN video_external_url VARCHAR(1000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='website_url') THEN
    ALTER TABLE projects ADD COLUMN website_url VARCHAR(500);
  END IF;
END $$;

-- Best-effort migration from old URL columns (only when old columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='featured_image') THEN
    UPDATE projects
    SET featured_external_url = featured_image
    WHERE featured_asset_id IS NULL
      AND COALESCE(featured_external_url, '') = ''
      AND featured_image IS NOT NULL
      AND featured_image <> '';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='image_url') THEN
    UPDATE projects
    SET featured_external_url = image_url
    WHERE featured_asset_id IS NULL
      AND COALESCE(featured_external_url, '') = ''
      AND image_url IS NOT NULL
      AND image_url <> '';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video_url') THEN
    UPDATE projects
    SET video_external_url = video_url
    WHERE video_asset_id IS NULL
      AND COALESCE(video_external_url, '') = ''
      AND video_url IS NOT NULL
      AND video_url <> '';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images') THEN
    UPDATE projects
    SET images_external_urls = images
    WHERE COALESCE(array_length(images_external_urls, 1), 0) = 0
      AND images IS NOT NULL
      AND COALESCE(array_length(images, 1), 0) > 0;
  END IF;
END $$;
`

async function migrate() {
  try {
    await pool.query(migrateSQL)
    console.log('Migration completed successfully.')
  } catch (err) {
    console.error('Migration failed:', err.message)
  } finally {
    await pool.end()
  }
}

migrate()
