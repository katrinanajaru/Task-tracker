import AuthPanel from "@/components/AuthPanel";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center">
        <AuthPanel />
      </div>
    </div>
  );
}
