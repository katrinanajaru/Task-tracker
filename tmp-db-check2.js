const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found');
  process.exit(1);
}
const env = fs.readFileSync(envPath, 'utf8');
const DATABASE_URL = env
  .split(/\r?\n/)
  .find((line) => line.startsWith('DATABASE_URL='))
  ?.split('=')[1];
if (!DATABASE_URL) {
  console.error('DATABASE_URL missing in .env.local');
  process.exit(1);
}

(async () => {
  const testUser = 'test-user-' + Date.now();
  try {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const client = await pool.connect();

    console.log('Inserting user', testUser);
    await client.query(
      'INSERT INTO "user" (id, created_at, updated_at) VALUES ($1, NOW(), NOW()) ON CONFLICT (id) DO NOTHING',
      [testUser]
    );

    const insert = await client.query(
      'INSERT INTO task (title, description, user_id, completed, created_at, updated_at) VALUES ($1, $2, $3, false, NOW(), NOW()) RETURNING *',
      ['Debug task', 'Test insert from script', testUser]
    );
    console.log('INSERT OK', JSON.stringify(insert.rows[0], null, 2));
    await client.release();
    await pool.end();
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
