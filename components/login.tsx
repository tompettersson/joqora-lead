"use client";

import { useState } from "react";
import { useAuth } from "./auth";
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (login(username, password)) {
      // Reload to show protected content
      window.location.reload();
    } else {
      setError("Ungültige Anmeldedaten");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/joqora-logo.svg"
            alt="JOQORA Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Anmeldung
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Bitte melden Sie sich an, um die Präsentation zu sehen.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Benutzername
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-md"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

