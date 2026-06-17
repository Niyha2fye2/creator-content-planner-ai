"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="bg-white border border-pink-200 rounded-3xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Welcome Back 💕
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Login to CreatorFlow
        </p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="border border-pink-200 p-3 rounded-xl"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-pink-200 p-3 rounded-xl"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-semibold"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">

          <Link
            href="/signup"
            className="text-center bg-gray-100 hover:bg-gray-200 p-3 rounded-xl font-medium"
          >
            Need an account? Sign Up
          </Link>

          <Link
            href="/forgot-password"
            className="text-center text-pink-600 hover:text-pink-700 font-medium"
          >
            Forgot Password?
          </Link>

        </div>

      </div>

    </div>
  );
}