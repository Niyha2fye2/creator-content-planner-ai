"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CalendarItem = {
  id: string;
  platform: string;
  viral_score: number | null;
  status: string | null;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const [totalPosts, setTotalPosts] = useState(0);
  const [postedCount, setPostedCount] = useState(0);

  const [avgScore, setAvgScore] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [bestPlatform, setBestPlatform] = useState("");
  const [bestPlatformScore, setBestPlatformScore] = useState(0);

  const [ideaCount, setIdeaCount] = useState(0);
  const [draftedCount, setDraftedCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);

  const [platformCounts, setPlatformCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("content_calendar")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    const posts = (data as CalendarItem[]) || [];

    setTotalPosts(posts.length);

    const posted = posts.filter(
      (p) => p.status === "posted"
    );

    const drafted = posts.filter(
      (p) => p.status === "drafted"
    );

    const scheduled = posts.filter(
      (p) => p.status === "scheduled"
    );

    const ideas = posts.filter(
      (p) => !p.status || p.status === "idea"
    );

    setPostedCount(posted.length);
    setDraftedCount(drafted.length);
    setScheduledCount(scheduled.length);
    setIdeaCount(ideas.length);

    const scores = posts
      .map((p) => p.viral_score || 0)
      .filter((score) => score > 0);

    const average =
      scores.length > 0
        ? Math.round(
            scores.reduce((a, b) => a + b, 0) /
              scores.length
          )
        : 0;

    setAvgScore(average);

    const highest =
      scores.length > 0
        ? Math.max(...scores)
        : 0;

    setTopScore(highest);

    const scoreTotal = scores.reduce(
      (a, b) => a + b,
      0
    );

    setTotalScore(scoreTotal);

    const platformMap: Record<
      string,
      {
        total: number;
        count: number;
      }
    > = {};

    const platformCounter: Record<
      string,
      number
    > = {};

    posts.forEach((post) => {
      if (!platformMap[post.platform]) {
        platformMap[post.platform] = {
          total: 0,
          count: 0,
        };
      }

      if (!platformCounter[post.platform]) {
        platformCounter[post.platform] = 0;
      }

      platformCounter[post.platform] += 1;

      platformMap[post.platform].total +=
        post.viral_score || 0;

      platformMap[post.platform].count += 1;
    });

    setPlatformCounts(platformCounter);

    let topPlatform = "";
    let topPlatformAvg = 0;

    Object.entries(platformMap).forEach(
      ([platform, values]) => {
        const avg = Math.round(
          values.total / values.count
        );

        if (avg > topPlatformAvg) {
          topPlatform = platform;
          topPlatformAvg = avg;
        }
      }
    );

    setBestPlatform(topPlatform);
    setBestPlatformScore(topPlatformAvg);

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      <div className="max-w-6xl mx-auto bg-white border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          Analytics Dashboard 📈
        </h1>

        <p className="text-gray-600">
          Track your content performance
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">
          Logged in as
        </p>

        <p className="font-semibold">
          {email}
        </p>
      </div>

      {loading ? (
        <div className="max-w-6xl mx-auto mt-6 bg-white rounded-3xl p-6 text-center">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto mt-6 grid md:grid-cols-4 gap-4">

            <Card title="Total Posts" value={totalPosts} />
            <Card title="Posted" value={postedCount} />
            <Card title="Average Score" value={avgScore} />
            <Card title="Best Score" value={topScore} />

          </div>

          <div className="max-w-6xl mx-auto mt-4 grid md:grid-cols-4 gap-4">

            <Card title="Ideas" value={ideaCount} />
            <Card title="Drafted" value={draftedCount} />
            <Card title="Scheduled" value={scheduledCount} />
            <Card title="Total Score" value={totalScore} />

          </div>

          <div className="max-w-6xl mx-auto mt-6 bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">

            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Best Platform 🚀
            </h2>

            <p className="text-gray-700">
              {bestPlatform
                ? `${bestPlatform} performs best with an average score of ${bestPlatformScore}/100`
                : "No platform data yet"}
            </p>

          </div>

          <div className="max-w-6xl mx-auto mt-6 bg-white rounded-3xl border border-pink-200 p-6 shadow-sm">

            <h2 className="text-xl font-bold text-pink-600 mb-4">
              Platform Breakdown
            </h2>

            <div className="space-y-3">

              {Object.entries(platformCounts).map(
                ([platform, count]) => (
                  <div
                    key={platform}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{platform}</span>
                    <span>{count} posts</span>
                  </div>
                )
              )}

            </div>

          </div>
        </>
      )}
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-pink-600 mt-2">
        {value}
      </h2>
    </div>
  );
}