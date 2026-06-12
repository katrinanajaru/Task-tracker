import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-6 py-12">
      <main className="w-full max-w-3xl rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {userId ? "Welcome back!" : "Welcome to Task Tracker"}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {userId
              ? "You are signed in. Visit the tasks page to view your Neon-backed tasks."
              : "Sign in or sign up to access your task list and connect it with Neon."}
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          {userId ? (
            <Link
              href="/tasks"
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-900"
            >
              View Tasks
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
