'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function AuthPanel() {
  const [mode, setMode] = useState<'signin' | 'signup'>(() =>
    typeof window !== 'undefined' && window.location.hash === '#signup' ? 'signup' : 'signin',
  );

  useEffect(() => {
    const handleHashChange = () => {
      setMode(window.location.hash === '#signup' ? 'signup' : 'signin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10">
      <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`rounded px-4 py-2 text-sm font-semibold transition ${
            mode === 'signin'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`rounded px-4 py-2 text-sm font-semibold transition ${
            mode === 'signup'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Sign up
        </button>
      </div>

      <div className="mt-6">
        {mode === 'signin' ? (
          <SignIn
            routing="hash"
            signUpUrl="/login#signup"
            fallbackRedirectUrl="/tasks"
            forceRedirectUrl="/tasks"
          />
        ) : (
          <SignUp
            routing="hash"
            signInUrl="/login"
            fallbackRedirectUrl="/tasks"
            forceRedirectUrl="/tasks"
          />
        )}
      </div>
    </div>
  );
}
