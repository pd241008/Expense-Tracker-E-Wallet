"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "../../lib/fetchJson";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2, Lock, Tag, LayoutGrid } from "lucide-react";
import defaultCategoriesData from "@/data/defaultCategories.json";

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type: string;
  userId: string;
  createdAt: number;
}

const DEFAULT_CATEGORIES = defaultCategoriesData as Category[];

export default function ManagePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const uid = user!.id;
    setLoading(true);
    fetchJson(`/api/categories?userId=${uid}`)
      .then((cats) => setCategories(cats || []))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const createCategory = async () => {
    if (!name.trim()) return;
    const uid = user!.id;
    const newName = name.trim();
    setSaving(true);

    const newCategory: Category = {
      _id: crypto.randomUUID(),
      createdAt: Date.now(),
      name: newName,
      icon: "tag",
      type: "custom",
      userId: uid,
    };

    setCategories((prev) => [...prev, newCategory]);
    setName("");

    await fetchJson("/api/categories", {
      method: "POST",
      body: JSON.stringify(newCategory),
    });

    const cats = await fetchJson(`/api/categories?userId=${uid}`);
    setCategories(cats);
    setSaving(false);
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c._id !== id));
    await fetchJson("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({ categoryId: id }),
    });
    const cats = await fetchJson(`/api/categories?userId=${user!.id}`);
    setCategories(cats);
  };

  const allCategories = [...DEFAULT_CATEGORIES, ...categories];
  const defaultCount = DEFAULT_CATEGORIES.length;
  const customCount = categories.length;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-foreground">
          Manage Categories
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List — left, 2/3 */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Your Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : allCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-background/50">
                  <LayoutGrid className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm font-medium text-foreground">
                    No categories yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a custom category to get started.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
                  {allCategories.map((c) => {
                    const isDefault = c.type === "default";
                    return (
                      <div
                        key={c._id}
                        className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isDefault
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                            }`}>
                            {isDefault ? (
                              <LayoutGrid className="h-5 w-5" />
                            ) : (
                              <Tag className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {c.name}
                            </p>
                            <span
                              className={`inline-block mt-1 px-1.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${
                                isDefault
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary text-muted-foreground"
                              }`}>
                              {c.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isDefault ? (
                            <div
                              className="p-2 text-muted-foreground/40"
                              title="System categories cannot be deleted">
                              <Lock className="h-4 w-4" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCategory(c._id)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Category Form — right sticky column, 1/3 */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                New Custom Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {defaultCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                    Default
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {customCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                    Custom
                  </p>
                </div>
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createCategory()}
                placeholder="e.g., Hobby, Subscriptions..."
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              />

              <Button
                onClick={createCategory}
                disabled={!name.trim() || saving}
                className="w-full h-11 gap-2">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
