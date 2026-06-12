import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-blue-100">
        <h1 className="text-2xl font-semibold text-blue-900">Sign in to Task Tracker</h1>
        <p className="mt-2 text-sm text-blue-600">Use your email to sign in and connect your Neon tasks.</p>
        <div className="mt-8">
          <SignIn routing="hash" />
        </div>
      </div>
    </div>
  );
}
