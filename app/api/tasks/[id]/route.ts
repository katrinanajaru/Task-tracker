import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// PUT update task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, completed } = body;

    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (completed !== undefined) {
      updateFields.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE task SET ${updateFields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query("DELETE FROM task WHERE id = $1", [id]);

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
