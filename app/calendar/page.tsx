"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CalendarItem = {
  id: string;
  scheduled_date: string;
  platform: string;
  user_id: string;
  content: any;
  viral_score: number;
  status: string;
};

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
    const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadUser();
    loadData();
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

  async function loadData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("content_calendar")
    .select("*")
    .order("scheduled_date", { ascending: true });

  if (profile?.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return;
  }

  setItems((data as CalendarItem[]) || []);
  setLoading(false);
}

  async function deleteItem(id: string) {
    await supabase
      .from("content_calendar")
      .delete()
      .eq("id", id);

    loadData();
  }
  async function updateStatus(
  id: string,
  status: string
) {
  const { error } = await supabase
    .from("content_calendar")
    .update({ status })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadData();
}

  async function markPosted(id: string) {
    await supabase
      .from("content_calendar")
      .update({
        status: "posted",
      })
      .eq("id", id);

    loadData();
  }

  function parseContent(content: any) {
    if (!content) return null;

    if (typeof content === "object") {
      return content;
    }

    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }

    return null;
  }

  function groupByDate(items: CalendarItem[]) {
    const grouped: Record<string, CalendarItem[]> = {};

    items.forEach((item) => {
      if (!grouped[item.scheduled_date]) {
        grouped[item.scheduled_date] = [];
      }

      grouped[item.scheduled_date].push(item);
    });

    return grouped;
  }

 const filteredItems =
  filter === "all"
    ? items
    : items.filter(
        (item) =>
          (item.status || "idea").toLowerCase() ===
          filter
      );

const grouped = groupByDate(filteredItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          Content Calendar 📅
        </h1>

        <p className="text-gray-600 mt-1">
          Manage your scheduled content
        </p>
      </div>

      {/* USER */}
      <div className="max-w-5xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-5 shadow-sm">
        <p className="text-gray-500 text-sm">Logged in as</p>
        <p className="font-semibold">{email}</p>
      </div>

      <div className="max-w-5xl mx-auto mt-6 flex flex-wrap gap-2">

  <button
    onClick={() => setFilter("all")}
    className={`px-4 py-2 rounded-xl ${
      filter === "all"
        ? "bg-pink-500 text-white"
        : "bg-white border border-pink-200"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("idea")}
    className={`px-4 py-2 rounded-xl ${
      filter === "idea"
        ? "bg-pink-500 text-white"
        : "bg-white border border-pink-200"
    }`}
  >
    Ideas
  </button>

  <button
    onClick={() => setFilter("draft")}
    className={`px-4 py-2 rounded-xl ${
      filter === "draft"
        ? "bg-pink-500 text-white"
        : "bg-white border border-pink-200"
    }`}
  >
    Drafts
  </button>

  <button
    onClick={() => setFilter("scheduled")}
    className={`px-4 py-2 rounded-xl ${
      filter === "scheduled"
        ? "bg-pink-500 text-white"
        : "bg-white border border-pink-200"
    }`}
  >
    Scheduled
  </button>

  <button
    onClick={() => setFilter("posted")}
    className={`px-4 py-2 rounded-xl ${
      filter === "posted"
        ? "bg-pink-500 text-white"
        : "bg-white border border-pink-200"
    }`}
  >
    Posted
  </button>

</div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto mt-6 space-y-6">

        {loading ? (
          <div className="bg-white border border-pink-200 rounded-3xl p-6 text-center">
            Loading calendar...
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-white border border-pink-200 rounded-3xl p-6 text-center">
            No scheduled content yet 📭
          </div>
        ) : (
          Object.entries(grouped).map(([date, posts]) => (
            <div
              key={date}
              className="bg-white border border-pink-200 rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-pink-600 mb-4">
                {date}
              </h2>

              <div className="space-y-4">

                {posts.map((post) => {
                  const content = parseContent(post.content);

                  return (
                    <div
                      key={post.id}
                      className="border border-pink-100 rounded-2xl p-5"
                    >

                      {/* TOP */}
                      <div className="flex justify-between items-center">

                        <p className="font-bold text-pink-500">
                          {post.platform}
                        </p>

                        <div className="flex gap-2">

                          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-xl text-sm font-semibold">
                            🔥 {post.viral_score ?? 0}/100
                          </span>

                          {role === "viewer" ? (
  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-xl text-sm font-semibold capitalize">
    {post.status || "idea"}
  </span>
) : (
  <select
    value={post.status || "idea"}
    onChange={(e) =>
      updateStatus(post.id, e.target.value)
    }
    className="border border-pink-200 rounded-xl px-3 py-1"
  >
    <option value="idea">Idea</option>
    <option value="draft">Draft</option>
    <option value="scheduled">Scheduled</option>
    <option value="posted">Posted</option>
  </select>
)}

                        </div>
                      </div>

                      {/* IDEAS */}
                      {content?.ideas?.length > 0 && (
                        <div className="mt-4">
                          <p className="font-bold text-pink-600">
                            Ideas
                          </p>

                          <ul className="list-disc ml-5 text-gray-700">
                            {content.ideas.map(
                              (idea: string, i: number) => (
                                <li key={i}>{idea}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* HOOKS */}
                      {content?.hooks?.length > 0 && (
                        <div className="mt-4">
                          <p className="font-bold text-pink-600">
                            Hooks
                          </p>

                          <ul className="list-disc ml-5 text-gray-700">
                            {content.hooks.map(
                              (hook: string, i: number) => (
                                <li key={i}>{hook}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* CAPTION */}
                      <div className="mt-4">
                        <p className="font-bold text-pink-600">
                          Caption
                        </p>

                        <p className="text-gray-700">
                          {content?.caption || "No caption"}
                        </p>
                      </div>

                      {/* HASHTAGS */}
                      <div className="mt-4">
                        <p className="font-bold text-pink-600">
                          Hashtags
                        </p>

                        <p className="text-gray-500">
                          {content?.hashtags?.join(" ") ||
                            "No hashtags"}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex justify-end gap-2 mt-5">

  {role !== "viewer" && (
    <button
      onClick={() => deleteItem(post.id)}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
    >
      Delete
    </button>
  )}

</div>
                    </div>
                  );
                })}

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}