"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  async function getCurrentUserRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!data || data.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    setAuthorized(true);
    setCheckingAuth(false);
  }

  async function loadProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProfiles(data || []);
    setLoading(false);
  }

  async function updateRole(id: string, role: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProfiles();
  }

  useEffect(() => {
    getCurrentUserRole();
  }, []);

  useEffect(() => {
    if (authorized) {
      loadProfiles();
    }
  }, [authorized]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 flex items-center justify-center">
        <div className="bg-white border border-pink-200 rounded-3xl p-8 shadow-sm">
          <p className="text-pink-600 font-semibold">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-pink-50 p-6 font-sans">

      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-pink-200 rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-pink-600">
          Admin Panel
        </h1>

        <p className="text-gray-600 mt-1">
          Manage users and roles 👩‍💻
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-6">

        {loading ? (
          <div className="bg-white rounded-2xl p-6 border border-pink-200">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-4">

            {profiles.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-pink-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >
                <div>
                  <p className="font-semibold text-pink-600">
                    {user.email}
                  </p>

                  <p className="text-gray-600 text-sm">
                    Role: {user.role}
                  </p>
                </div>

                <select
                  value={user.role}
                  onChange={(e) =>
                    updateRole(user.id, e.target.value)
                  }
                  className="border border-pink-200 rounded-xl p-2"
                >
                  <option value="viewer">viewer</option>
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}