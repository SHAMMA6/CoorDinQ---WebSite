import pool from './pool.js'

const migrateSQL = `
-- Add new image/video columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='featured_image') THEN
    ALTER TABLE projects ADD COLUMN featured_image VARCHAR(500);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='images') THEN
    ALTER TABLE projects ADD COLUMN images TEXT[] NOT NULL DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='video_url') THEN
    ALTER TABLE projects ADD COLUMN video_url VARCHAR(500);
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
