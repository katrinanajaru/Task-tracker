import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// GET all tasks
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await db.query(
      "SELECT * FROM task WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST create task
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, userId } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Title and userId required" },
        { status: 400 }
      );
    }

    // Ensure a user row exists for the foreign key. Try to fetch metadata from Clerk
    // so we can populate the required `email` column. Fall back to a synthetic
    // email if Clerk is unavailable.
    let email: string | null = null;
    let name: string | null = null;
    try {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
      name = clerkUser.firstName || clerkUser.lastName || clerkUser.fullName || null;
    } catch (e) {
      console.warn("Could not fetch Clerk user metadata, will use fallback email", e);
    }

    if (!email) {
      email = `${userId}@no-email.local`;
    }

    await db.query(
      'INSERT INTO "user" (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email',
      [userId, email, name]
    );

    const result = await db.query(
      "INSERT INTO task (title, description, user_id, completed, created_at, updated_at) VALUES ($1, $2, $3, false, NOW(), NOW()) RETURNING *",
      [title, description || null, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
