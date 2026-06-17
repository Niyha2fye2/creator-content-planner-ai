"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AIItem = {
  id: string;
  created_at: string;
  content?: any;
  response?: any;
  viral_score?: number;
};

export default function HistoryPage() {
  const [items, setItems] = useState<AIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    loadUser();
    loadHistory();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      setRole(profile.role);
    }
  }

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("ai_generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  async function deleteItem(id: string) {
    await supabase
      .from("ai_generations")
      .delete()
      .eq("id", id);

    loadHistory();
  }

  function normalizeContent(item: any) {
    if (!item) return null;

    if (item.ideas && item.hooks) {
      return item;
    }

    if (item.response) {
      try {
        return typeof item.response === "string"
          ? JSON.parse(item.response)
          : item.response;
      } catch {
        return null;
      }
    }

    return item.content || null;
  }

  function reuseItem(item: AIItem) {
    const content = normalizeContent(item);

    if (!content) return;

    localStorage.setItem(
      "reuse_prompt",
      JSON.stringify(content)
    );

    window.location.href = "/generate";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white/80 border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          AI History 📖
        </h1>

        <p className="text-gray-600 mt-1">
          View and reuse your generated content
        </p>
      </div>

      {/* USER */}
      <div className="max-w-5xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">
          Logged in as
        </p>

        <p className="font-semibold">
          {email}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-6 space-y-4">

        {loading ? (
          <div className="bg-white border border-pink-200 rounded-3xl p-6 text-center">
            Loading history...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-pink-200 rounded-3xl p-6 text-center">
            No history yet 💭
          </div>
        ) : (
          items.map((item) => {
            const content = normalizeContent(item);

            if (!content) return null;

            return (
              <div
                key={item.id}
                className="bg-white border border-pink-200 rounded-3xl p-6 shadow-sm space-y-4"
              >

                {/* IDEAS */}
                <div>
                  <p className="font-bold text-pink-600">
                    Ideas
                  </p>

                  <ul className="list-disc ml-5 text-gray-700">
                    {content.ideas?.map(
                      (x: string, i: number) => (
                        <li key={i}>{x}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* HOOKS */}
                <div>
                  <p className="font-bold text-pink-600">
                    Hooks
                  </p>

                  <ul className="list-disc ml-5 text-gray-700">
                    {content.hooks?.map(
                      (x: string, i: number) => (
                        <li key={i}>{x}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* CAPTION */}
                <div>
                  <p className="font-bold text-pink-600">
                    Caption
                  </p>

                  <p className="text-gray-700">
                    {content.caption}
                  </p>
                </div>

                {/* HASHTAGS */}
                <div>
                  <p className="font-bold text-pink-600">
                    Hashtags
                  </p>

                  <p className="text-gray-600">
                    {content.hashtags?.join(" ")}
                  </p>
                </div>

                {/* ACTIONS */}
                <div>
                  <div className="flex justify-end">
                    {role !== "viewer" && (
                      <>
                        <button
                          onClick={() => reuseItem(item)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl"
                        >
                          Reuse
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {/* VIRAL SCORE */}
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-pink-100 text-pink-600 font-bold px-4 py-2 rounded-xl">
                      🔥 Viral Score: {item.viral_score ?? 0}/100
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}

      </div>
    </div>
  );
}