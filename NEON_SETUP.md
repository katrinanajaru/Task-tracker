# Neon Direct Connection Setup

## 1. Get Your Neon Connection String
1. Go to [neon.tech](https://neon.tech)
2. Sign in → Select your project
3. Copy the connection string (looks like: `postgresql://user:password@ep-xxxx.us-east-1.neon.tech/dbname?sslmode=require`)

## 2. Update .env.local
Replace with your actual Neon PostgreSQL connection string:

```
DATABASE_URL=your_neon_connection_string_here
```

## 3. Create Database Tables
Run the SQL from `prisma/init.sql` in Neon's SQL Editor:
1. Go to Neon dashboard
2. Click "SQL Editor"
3. Copy & paste contents of `prisma/init.sql`
4. Click "Execute"

OR use your database client (pgAdmin, DBeaver, etc.)

## 4. Test Connection
Your API endpoints are ready:
- GET `/api/tasks?userId=USER_ID` - List tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/[id]` - Update task
- DELETE `/api/tasks/[id]` - Delete task
