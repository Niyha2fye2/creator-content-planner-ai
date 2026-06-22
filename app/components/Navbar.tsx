"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
  loadRole();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    loadRole();
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  async function loadRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER", user);

  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("ROLE DATA", data);
  console.log("ROLE ERROR", error);

  if (data) {
    setRole(data.role);
  }
}

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
  <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 py-4 border-b border-gray-800 bg-[#0b0f19]">

    {/* Top Row */}
    <div className="flex justify-between items-center w-full md:w-auto">
      <h1 className="font-bold text-lg text-white">
        CreatorFlow
      </h1>

      {/* Mobile Logout */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm md:hidden"
      >
        Logout
      </button>
    </div>

    {/* Navigation Links */}
    <div className="flex gap-4 text-sm text-white overflow-x-auto whitespace-nowrap w-full md:w-auto">

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

    {/* Desktop Logout */}
    <button
      onClick={logout}
      className="hidden md:block bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
    >
      Logout
    </button>

  </nav>
);
}