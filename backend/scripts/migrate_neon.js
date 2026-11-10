const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_8MUvaT7eqHsE@ep-quiet-poetry-beapn4tq-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('Connecting to Neon DB...');
  const client = await pool.connect();
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../neon-schema.sql'), 'utf-8');
    console.log('Running neon-schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema migration completed successfully!');

    // Test querying data
    const resConfig = await client.query('SELECT * FROM site_config WHERE id = 1');
    console.log('Site Config:', resConfig.rows[0]?.hero_title);

    const resProjects = await client.query('SELECT COUNT(*) FROM projects');
    console.log('Total Projects in Neon:', resProjects.rows[0].count);

    const resSkills = await client.query('SELECT COUNT(*) FROM skills');
    console.log('Total Skills in Neon:', resSkills.rows[0].count);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
