"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type AIResult = {
  ideas: string[];
  hooks: string[];
  caption: string;
  hashtags: string[];
  viral_score?: number;
};

export default function GeneratePage() {
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
const [role, setRole] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("reuse_prompt");
if (role === "viewer") {
  window.location.href = "/dashboard";
  return;
}
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed?.ideas?.length) {
          setTopic(parsed.ideas[0]);
        }

        if (parsed?.caption) {
          setNiche(parsed.caption);
        }

        setResult(parsed);

        localStorage.removeItem("reuse_prompt");
      } catch (e) {
        console.log("reuse failed");
      }
    }
  }, []);

  async function generateContent() {
    setLoading(true);
    setResult(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        topic,
        niche,
        user_id: user.id,
      }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      setLoading(false);
      return;
    }

    setResult({
  ideas: data.result?.ideas ?? [],
  hooks: data.result?.hooks ?? [],
  caption: data.result?.caption ?? "",
  hashtags: data.result?.hashtags ?? [],
  viral_score: data.viral_score ?? 0,
});
    setLoading(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function copyAll() {
    if (!result) return;

    const full = `
IDEAS:
${result.ideas.join("\n")}

HOOKS:
${result.hooks.join("\n")}

CAPTION:
${result.caption}

HASHTAGS:
${result.hashtags.join(" ")}
    `;

    navigator.clipboard.writeText(full);
  }

  async function addToCalendar() {
    if (!result || !scheduledDate) {
      alert("Pick a date first");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      return;
    }

    const { error } = await supabase.from("content_calendar").insert({
  user_id: user.id,
  scheduled_date: scheduledDate,
  platform,
  content: result,
  viral_score: result.viral_score ?? null,
  status: "idea",
});

    if (error) {
      alert(error.message);
      return;
    }

    alert("Added to calendar 💕");
    setScheduledDate("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto bg-white/80 border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          AI Content Generator ✨
        </h1>
        <p className="text-gray-600 mt-1">
          Generate hooks, captions, ideas & hashtags instantly
        </p>
      </div>

      {/* INPUTS */}
      <div className="max-w-4xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-6 shadow-sm space-y-3">

        <input
          className="w-full border border-pink-200 p-3 rounded-xl"
          placeholder="Platform (TikTok, Instagram...)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <input
          className="w-full border border-pink-200 p-3 rounded-xl"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          className="w-full border border-pink-200 p-3 rounded-xl"
          placeholder="Niche"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />

        <button
          onClick={generateContent}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-semibold"
        >
          {loading ? "Generating..." : "Generate Content ✨"}
        </button>
      </div>

      {/* OUTPUT */}
      <div className="max-w-4xl mx-auto mt-6 space-y-4">

        {!loading && !result && (
          <div className="text-center text-gray-500">
            Your AI results will appear here 💕
          </div>
        )}

        {loading && (
          <div className="text-center text-pink-600 font-semibold">
            Generating...
          </div>
        )}

        {result && (
          <div className="bg-white border border-pink-200 rounded-3xl p-6 space-y-6 shadow-sm">

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2">

              <button onClick={() => copy(result.ideas.join("\n"))}
                className="bg-pink-100 px-3 py-1 rounded-xl text-sm"
              >
                Copy Ideas
              </button>

              <button onClick={() => copy(result.hooks.join("\n"))}
                className="bg-pink-100 px-3 py-1 rounded-xl text-sm"
              >
                Copy Hooks
              </button>

              <button onClick={() => copy(result.caption)}
                className="bg-pink-100 px-3 py-1 rounded-xl text-sm"
              >
                Copy Caption
              </button>

              <button onClick={() => copy(result.hashtags.join(" "))}
                className="bg-pink-100 px-3 py-1 rounded-xl text-sm"
              >
                Copy Hashtags
              </button>

              <button onClick={copyAll}
                className="bg-pink-500 text-white px-3 py-1 rounded-xl text-sm"
              >
                Copy All
              </button>

            </div>
            <div className="w-full mt-3">
  <div className="bg-pink-100 text-pink-600 font-bold text-center py-3 rounded-xl">
    🔥 Viral Score: {result.viral_score !== undefined ? result.viral_score : "--"}/100
  </div>
</div>

            {/* CONTENT */}
            <div>
              <h2 className="text-pink-600 font-bold">Ideas</h2>
              <ul className="list-disc ml-5">
                {result.ideas.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-pink-600 font-bold">Hooks</h2>
              <ul className="list-disc ml-5">
                {result.hooks.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-pink-600 font-bold">Caption</h2>
              <p>{result.caption}</p>
            </div>

            <div>
              <h2 className="text-pink-600 font-bold">Hashtags</h2>
              <p>{result.hashtags.join(" ")}</p>
            </div>

            {/* CALENDAR SECTION */}
            <div className="border border-pink-200 rounded-2xl p-4">
              <h3 className="font-bold text-pink-600 mb-2">
                Schedule to Calendar
              </h3>

              <input
                type="date"
                className="border p-2 rounded-xl w-full"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />

              <button
                onClick={addToCalendar}
                className="mt-3 w-full bg-pink-500 text-white p-2 rounded-xl"
              >
                Add to Calendar
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}