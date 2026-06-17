"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data) {
      setRole(data.role);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0b0f19]">

      <h1 className="font-bold text-lg text-white">
        CreatorFlow
      </h1>

      <div className="flex gap-6 text-sm text-white">
  <Link className="hover:text-pink-400" href="/dashboard">
    Dashboard
  </Link>

  <Link className="hover:text-pink-400" href="/content">
    Ideas
  </Link>

  <Link className="hover:text-pink-400" href="/calendar">
    Calendar
  </Link>

  <Link className="hover:text-pink-400" href="/analytics">
    Analytics
  </Link>

  {(role === "editor" || role === "admin") && (
    <Link className="hover:text-pink-400" href="/generate">
      AI
    </Link>
  )}

  <Link
    className="hover:text-pink-400 font-semibold"
    href="/history"
  >
    History
  </Link>

  <Link className="hover:text-pink-400" href="/profile">
    Profile
  </Link>

  {role === "admin" && (
    <Link
      className="hover:text-pink-400"
      href="/admin"
    >
      Admin
    </Link>
  )}
</div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
      >
        Logout
      </button>
    </nav>
  );
}