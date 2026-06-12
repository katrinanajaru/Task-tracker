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
  try {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const client = await pool.connect();
    const tables = await client.query(
      "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
    );
    console.log('TABLES', JSON.stringify(tables.rows, null, 2));

    const cols = await client.query(
      "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema='public' AND table_name='task' ORDER BY ordinal_position;"
    );
    console.log('COLUMNS', JSON.stringify(cols.rows, null, 2));

    const cons = await client.query(
      "SELECT conname, contype, pg_get_constraintdef(c.oid) AS def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'task';"
    );
    console.log('CONSTRAINTS', JSON.stringify(cons.rows, null, 2));

    try {
      const insert = await client.query(
        'INSERT INTO task (title, description, user_id, completed, created_at, updated_at) VALUES ($1, $2, $3, false, NOW(), NOW()) RETURNING *',
        ['Debug task', 'Test insert', 'test-user']
      );
      console.log('INSERT OK', JSON.stringify(insert.rows[0], null, 2));
    } catch (e) {
      console.error('INSERT ERROR', e);
    }

    await client.release();
    await pool.end();
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
})();
