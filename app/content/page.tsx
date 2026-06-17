"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("idea");

  const [ideas, setIdeas] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [role, setRole] = useState("viewer");

  async function loadIdeas() {
    const { data } = await supabase
      .from("content_ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setIdeas(data);
  }

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

    if (data) setRole(data.role);
  }

  async function createIdea() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("No user logged in");

    const { error } = await supabase.from("content_ideas").insert({
      title,
      description,
      platform,
      status,
      user_id: user.id,
    });

    if (error) return alert(error.message);

    clearForm();
    loadIdeas();
  }

  async function updateIdea() {
    if (!editingId) return;

    const { error } = await supabase
      .from("content_ideas")
      .update({
        title,
        description,
        platform,
        status,
      })
      .eq("id", editingId);

    if (error) return alert(error.message);

    clearForm();
    setEditingId(null);
    loadIdeas();
  }

  async function deleteIdea(id: number) {
    const { error } = await supabase
      .from("content_ideas")
      .delete()
      .eq("id", id);

    if (error) return alert(error.message);

    loadIdeas();
  }

  function startEdit(idea: any) {
    setEditingId(idea.id);
    setTitle(idea.title);
    setDescription(idea.description || "");
    setPlatform(idea.platform || "");
    setStatus(idea.status || "idea");
  }

  function clearForm() {
    setTitle("");
    setDescription("");
    setPlatform("");
    setStatus("idea");
  }

  useEffect(() => {
    loadIdeas();
    loadRole();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6 font-sans">

      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          Content Ideas ✨
        </h1>
        <p className="text-gray-600 mt-1">
          Create, edit, and organize your content ideas
        </p>

        <p className="mt-3 text-sm text-gray-500">
          Current Role: <span className="font-semibold">{role}</span>
        </p>
      </div>

      {/* Input Form */}
      {role !== "viewer" && (
        <div className="max-w-5xl mx-auto mt-6 bg-white border border-pink-200 rounded-3xl p-6 shadow-sm space-y-3">

          <input
            placeholder="Content Title"
            className="w-full border border-pink-200 p-3 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full border border-pink-200 p-3 rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            placeholder="Platform (TikTok, Instagram...)"
            className="w-full border border-pink-200 p-3 rounded-xl"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />

          <select
            className="w-full border border-pink-200 p-3 rounded-xl"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="idea">Idea</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>

          {editingId ? (
            <button
              onClick={updateIdea}
              className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl"
            >
              Update Idea
            </button>
          ) : (
            <button
              onClick={createIdea}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl"
            >
              Add Idea ✨
            </button>
          )}
        </div>
      )}

      {/* Ideas Grid */}
      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white border border-pink-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition"
          >

            <h2 className="text-lg font-bold text-pink-600">
              {idea.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {idea.description}
            </p>

            <div className="mt-3 text-sm text-gray-500 space-y-1">
              <p>Platform: {idea.platform}</p>
              <p>Status: {idea.status}</p>
            </div>

            {role !== "viewer" && (
              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => startEdit(idea)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-xl"
                >
                  Delete
                </button>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}