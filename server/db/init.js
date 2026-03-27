import pool from './pool.js'

const initSQL = `
-- Binary assets are stored in PostgreSQL (images/videos)
CREATE TABLE IF NOT EXISTS project_assets (
  id            BIGSERIAL PRIMARY KEY,
  filename      VARCHAR(255),
  mime_type     VARCHAR(120) NOT NULL,
  data          BYTEA        NOT NULL,
  byte_size     INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Projects table (PostgreSQL-only storage)
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

-- Seed data (only if table is empty)
INSERT INTO projects (
  title, category, description, tech, gradient, status, year, client, duration, highlights, sort_order
)
SELECT * FROM (VALUES
  (
    'Pulse Commerce',
    'Web Platform',
    'A high-performance e-commerce platform built for scale. Features real-time inventory management, AI-powered recommendations, and seamless payment integration across 40+ countries.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
    'from-teal/30 via-navy-light/40 to-navy-dark/90',
    'Live',
    2025,
    'Pulse Retail Inc.',
    '6 months',
    ARRAY['3x faster load times', '40% increase in conversions', '99.9% uptime'],
    1
  ),
  (
    'Orbit HQ',
    'Custom Software',
    'Enterprise workspace management platform that unifies team communication, project tracking, and resource allocation into a single intelligent dashboard.',
    ARRAY['Next.js', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    'from-[#2D7D74]/40 via-[#243447]/50 to-[#111C27]/95',
    'Live',
    2024,
    'Orbit Technologies',
    '8 months',
    ARRAY['500+ daily active users', '60% reduction in meeting time', 'Custom analytics engine'],
    2
  ),
  (
    'FleetFlow App',
    'Mobile Application',
    'Real-time fleet management mobile app with GPS tracking, route optimization, and predictive maintenance alerts for logistics companies.',
    ARRAY['React Native', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API'],
    'from-[#3ABFB0]/35 via-[#2A9A8D]/30 to-[#111C27]/95',
    'Live',
    2025,
    'FleetFlow Logistics',
    '5 months',
    ARRAY['Real-time GPS tracking', '25% fuel cost reduction', '10K+ deliveries tracked daily'],
    3
  ),
  (
    'Peak Studio',
    'UI/UX System',
    'A comprehensive design system and component library powering 12 products. Includes Figma integration, accessibility-first components, and automated documentation.',
    ARRAY['Figma', 'Storybook', 'React', 'Tailwind CSS', 'Chromatic'],
    'from-[#415A77]/45 via-[#243447]/50 to-[#0E1721]/95',
    'Live',
    2024,
    'Peak Digital Group',
    '4 months',
    ARRAY['200+ reusable components', 'WCAG 2.1 AA compliant', '70% faster design-to-dev handoff'],
    4
  ),
  (
    'Signal Reach',
    'Digital Marketing',
    'Full-funnel digital marketing platform with campaign automation, audience segmentation, multi-channel attribution, and real-time performance dashboards.',
    ARRAY['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Google Ads API'],
    'from-[#2A9A8D]/45 via-[#1B2838]/55 to-[#111C27]/96',
    'In Progress',
    2025,
    'Signal Media Co.',
    '7 months',
    ARRAY['4.2x ROAS average', 'Multi-channel attribution', 'AI-driven audience targeting'],
    5
  )
) AS seed(title, category, description, tech, gradient, status, year, client, duration, highlights, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);
`

async function init() {
  try {
    await pool.query(initSQL)
    console.log('Database initialized successfully.')
  } catch (err) {
    console.error('Database initialization failed:', err.message)
  } finally {
    await pool.end()
  }
}

init()
