"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleReset(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Password updated successfully 💕"
    );

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="bg-white border border-pink-200 rounded-3xl p-8 shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-bold text-pink-600 text-center">
          New Password 🔒
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Create your new password
        </p>

        <form
          onSubmit={handleReset}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border border-pink-200 p-3 rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="border border-pink-200 p-3 rounded-xl"
            required
          />

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-semibold"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}