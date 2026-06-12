import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import TaskManager from "./TaskManager";

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-8">
        <div className="rounded-3xl bg-white p-10 shadow-xl max-w-xl text-center">
          <h1 className="text-3xl font-semibold">Please sign in</h1>
          <p className="mt-4 text-zinc-600">You need to sign in to view your tasks.</p>
          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-white"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Your tasks</h1>
            <p className="mt-2 text-sm text-zinc-500">Manage tasks with Neon and Clerk auth.</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-700"
          >
            Home
          </Link>
        </div>
        <TaskManager userId={userId} />
      </div>
    </div>
  );
}
