/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "@/lib/fetchJson";

export default function ManagePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const uid = user!.id;
    fetchJson(`/api/categories?userId=${uid}`)
      .then((cats) => setCategories(cats))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const createCategory = async () => {
    if (!name) return;
    const uid = user!.id;
    const payload = {
      createdAt: Date.now(),
      name,
      icon: "🗂️",
      type: "custom",
      userId: uid,
    };
    await fetchJson("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setName("");
    const cats = await fetchJson(`/api/categories?userId=${uid}`);
    setCategories(cats);
  };

  const deleteCategory = async (id: string) => {
    await fetchJson("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({ categoryId: id }),
    });
    const cats = await fetchJson(`/api/categories?userId=${user!.id}`);
    setCategories(cats);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6">
        <main className="mt-6">
          <h2 className="text-2xl font-semibold">Manage Categories</h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              {loading ? (
                <p>Loading...</p>
              ) : categories.length === 0 ? (
                <div className="p-6 rounded-xl bg-black/40 border border-white/6">
                  <p className="mb-3">No categories yet. Create one:</p>
                  <div className="flex gap-3">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Category name"
                      className="flex-1 rounded-lg bg-transparent border border-white/8 p-3"
                    />
                    <button
                      onClick={createCategory}
                      className="rounded-xl px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                      Create
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/6">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{c.icon}</div>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-sm text-gray-400">{c.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCategory(c._id)}
                        className="text-sm text-red-400">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Always available create form */}
            <div>
              <div className="p-6 rounded-xl bg-black/40 border border-white/6">
                <h3 className="font-semibold">Create Category</h3>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name"
                  className="mt-4 w-full rounded-lg bg-transparent border border-white/8 p-3"
                />
                <button
                  onClick={createCategory}
                  className="mt-4 w-full rounded-xl py-2 bg-gradient-to-r from-blue-500 to-purple-500">
                  Create
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
