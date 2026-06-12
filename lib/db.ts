import { Pool } from "@neondatabase/serverless";

let pool: Pool | null = null;

function getConnectionString(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local."
    );
  }
  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    throw new Error(
      `DATABASE_URL is invalid. It should start with postgres:// or postgresql://, got: ${url}`
    );
  }
  return url;
}

function getPool(): Pool {
  if (!pool) {
    const connectionString = getConnectionString();
    pool = new Pool({
      connectionString,
      max: 20,
    });
  }
  return pool;
}

export const db = {
  query: async (query: string, params?: any[]) => {
    try {
      const client = await getPool().connect();
      try {
        const result = await client.query(query, params);
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },
};
