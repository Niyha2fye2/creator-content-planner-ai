"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: "viewer",
        });

      if (profileError) {
        setMessage(profileError.message);
        return;
      }
    }

    setMessage("Account created successfully! Check your email if confirmation is enabled.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">
      <div className="bg-white border border-pink-200 rounded-3xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Create Account 💕
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Join CreatorFlow
        </p>

        <form
          onSubmit={handleSignup}
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

          <input
            type="password"
            placeholder="Password"
            className="border border-pink-200 p-3 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">

          <Link
            href="/login"
            className="text-center bg-gray-100 hover:bg-gray-200 p-3 rounded-xl font-medium"
          >
            Already have an account? Login
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