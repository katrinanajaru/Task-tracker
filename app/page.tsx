import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/tasks");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center px-6 py-10">
        <section className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Simple daily planning
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {userId ? "Welcome back to your task tracker." : "Track your tasks without losing your day."}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Keep your important work in one clean place. Add tasks, describe the next step,
            mark progress, and come back to a list that still makes sense tomorrow.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="block text-2xl font-semibold text-slate-950">01</span>
              Capture new tasks before they disappear.
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="block text-2xl font-semibold text-slate-950">02</span>
              Filter what is done and what still needs action.
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <span className="block text-2xl font-semibold text-slate-950">03</span>
              Save your list securely with your account.
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Log in or sign up
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
