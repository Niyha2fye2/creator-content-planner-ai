"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [joined, setJoined] = useState("");

  const [totalGenerations, setTotalGenerations] =
    useState(0);

  const [totalScheduled, setTotalScheduled] =
    useState(0);

  const [avgScore, setAvgScore] =
    useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    setJoined(
      new Date(
        user.created_at
      ).toLocaleDateString()
    );

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile) {
      setRole(profile.role);
    }

    const { data: generations } =
      await supabase
        .from("ai_generations")
        .select("id, viral_score")
        .eq("user_id", user.id);

    const { data: calendar } =
      await supabase
        .from("content_calendar")
        .select("id")
        .eq("user_id", user.id);

    setTotalGenerations(
      generations?.length || 0
    );

    setTotalScheduled(
      calendar?.length || 0
    );

    const scores =
      generations
        ?.map(
          (g) =>
            g.viral_score || 0
        )
        .filter(
          (score) => score > 0
        ) || [];

    const avg =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (a, b) => a + b,
              0
            ) / scores.length
          )
        : 0;

    setAvgScore(avg);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="max-w-5xl mx-auto bg-white border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          Profile 👤
        </h1>

        <p className="text-gray-600">
          Your CreatorFlow account
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-6 grid md:grid-cols-2 gap-4">

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            Email
          </p>

          <h2 className="font-bold text-lg">
            {email}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            Role
          </p>

          <h2 className="font-bold text-lg capitalize">
            {role}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            Joined
          </p>

          <h2 className="font-bold text-lg">
            {joined}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            Avg Viral Score
          </p>

          <h2 className="font-bold text-lg">
            🔥 {avgScore}/100
          </h2>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-6 grid md:grid-cols-2 gap-4">

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            AI Generations
          </p>

          <h2 className="text-4xl font-bold text-pink-600">
            {totalGenerations}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">
          <p className="text-gray-500">
            Scheduled Posts
          </p>

          <h2 className="text-4xl font-bold text-pink-600">
            {totalScheduled}
          </h2>
        </div>

      </div>

    </div>
  );
}