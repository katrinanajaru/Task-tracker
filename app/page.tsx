import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-blue-50 font-sans px-6 py-12">
      <main className="w-full max-w-3xl rounded-[2rem] border border-blue-100 bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-700 shadow-sm">
            <span className="text-2xl font-bold">TT</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-blue-900">
            {userId ? "Welcome back!" : "Welcome to Task Tracker"}
          </h1>
          {userId ? (
            <p className="max-w-2xl text-lg leading-8 text-blue-600">
              You are signed in. Visit the tasks page to view your Neon-backed tasks.
            </p>
          ) : null}
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          {userId ? (
            <Link
              href="/tasks"
              className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Tasks
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full border border-blue-200 bg-white px-6 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
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
