"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Password reset email sent. Check your inbox 💕"
    );

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="bg-white border border-pink-200 rounded-3xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Reset Password 🔑
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your email to receive a reset link
        </p>

        <form
          onSubmit={handleReset}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="border border-pink-200 p-3 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-semibold"
          >
            {loading
              ? "Sending..."
              : "Send Reset Email"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm">
            {message}
          </p>
        )}

        <Link
          href="/login"
          className="block text-center mt-6 text-pink-600 hover:text-pink-700"
        >
          Back to Login
        </Link>

      </div>

    </div>
  );
}