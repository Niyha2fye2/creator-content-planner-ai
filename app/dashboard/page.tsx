"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PlatformCount = {
  platform: string;
  count: number;
};

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("loading");

  const [totalAI, setTotalAI] = useState(0);
  const [totalScheduled, setTotalScheduled] = useState(0);
  const [thisWeek, setThisWeek] = useState(0);

  const [platformStats, setPlatformStats] = useState<PlatformCount[]>([]);
  const [topPlatform, setTopPlatform] = useState("");

  const [avgViralScore, setAvgViralScore] = useState(0);
  const [bestViralScore, setBestViralScore] = useState(0);
  const [postedCount, setPostedCount] = useState(0);

  useEffect(() => {
    loadUser();
    loadStats();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data) setRole(data.role);
  }

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: aiData } = await supabase
      .from("ai_generations")
      .select("*")
      .eq("user_id", user.id);

    setTotalAI(aiData?.length || 0);

    const { data: calData } = await supabase
      .from("content_calendar")
      .select("*")
      .eq("user_id", user.id);

    setTotalScheduled(calData?.length || 0);

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const weekly = calData?.filter((item: any) => {
      return new Date(item.scheduled_date) >= weekAgo;
    });

    setThisWeek(weekly?.length || 0);

    const posted =
      calData?.filter(
        (item: any) => item.status === "posted"
      ) || [];

    setPostedCount(posted.length);

    const scores =
      calData
        ?.map((item: any) => item.viral_score || 0)
        .filter((score: number) => score > 0) || [];

    if (scores.length > 0) {
      const avg = Math.round(
        scores.reduce((a: number, b: number) => a + b, 0) /
          scores.length
      );

      const best = Math.max(...scores);

      setAvgViralScore(avg);
      setBestViralScore(best);
    }

    const stats: Record<string, number> = {};

    calData?.forEach((item: any) => {
      const p = item.platform || "unknown";
      stats[p] = (stats[p] || 0) + 1;
    });

    const formatted = Object.entries(stats).map(
      ([platform, count]) => ({
        platform,
        count,
      })
    );

    setPlatformStats(formatted);

    if (formatted.length > 0) {
      const top = formatted.reduce((a, b) =>
        a.count > b.count ? a : b
      );

      setTopPlatform(top.platform);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="max-w-6xl mx-auto bg-white/80 border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          CreatorFlow Dashboard 💕
        </h1>

        <p className="text-gray-600 mt-1">
          Your content performance overview
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">
          Logged in as
        </p>

        <p className="font-semibold">{email}</p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 grid md:grid-cols-3 lg:grid-cols-6 gap-4">

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            AI Generations
          </p>

          <p className="text-3xl font-bold text-pink-600">
            {totalAI}
          </p>
        </div>

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Scheduled Posts
          </p>

          <p className="text-3xl font-bold text-pink-600">
            {totalScheduled}
          </p>
        </div>

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            This Week
          </p>

          <p className="text-3xl font-bold text-pink-600">
            {thisWeek}
          </p>
        </div>

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Posted
          </p>

          <p className="text-3xl font-bold text-green-500">
            {postedCount}
          </p>
        </div>

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Avg Viral
          </p>

          <p className="text-3xl font-bold text-orange-500">
            {avgViralScore}
          </p>
        </div>

        <div className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">
            Best Score
          </p>

          <p className="text-3xl font-bold text-purple-500">
            {bestViralScore}
          </p>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-6 shadow-sm">

        <h2 className="text-pink-600 font-bold text-lg mb-4">
          Platform Breakdown 📊
        </h2>

        {platformStats.length === 0 ? (
          <p className="text-gray-500">
            No data yet
          </p>
        ) : (
          platformStats.map((p, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2"
            >
              <span className="capitalize">
                {p.platform}
              </span>

              <span className="font-bold text-pink-600">
                {p.count}
              </span>
            </div>
          ))
        )}

      </div>

      <div className="max-w-6xl mx-auto mt-6 bg-pink-500 text-white rounded-3xl p-6 shadow-sm">

        <h2 className="font-bold text-lg">
          🔥 Creator Insight
        </h2>

        <p className="mt-2">
          {topPlatform
            ? `Your strongest platform is ${topPlatform}. Your average viral score is ${avgViralScore}/100 and your best performing content scored ${bestViralScore}/100. Focus on creating more content for ${topPlatform}.`
            : "Generate and schedule content to unlock insights."}
        </p>

      </div>

    </div>
  );
}