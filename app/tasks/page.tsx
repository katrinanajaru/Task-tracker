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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100">
      <TaskManager userId={userId} />
    </div>
  );
}
