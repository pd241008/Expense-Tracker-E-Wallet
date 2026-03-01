"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchJson } from "../../lib/fetchJson";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Trash2, Plus, Loader2, Lock } from "lucide-react";

// 1. Import the JSON directly
import defaultCategoriesData from "@/data/defaultCategories.json";

export interface Category {
  _id: string;
  name: string;
  icon: string;
  type: string;
  userId: string;
  createdAt: number;
}

// Cast the imported JSON to your strict TypeScript interface
const DEFAULT_CATEGORIES = defaultCategoriesData as Category[];

export default function ManagePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

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

  // 2. Merge JSON defaults with fetched user categories
  const allCategories = [...DEFAULT_CATEGORIES, ...categories];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight text-foreground">
          Manage Categories
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border bg-card shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Your Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : allCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
                  No categories found. Create one to get started.
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2">
                  {allCategories.map((c) => (
                    <div
                      key={c._id}
                      className="group flex items-center justify-between p-3 rounded-md border border-border bg-background hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                          <Folder className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none text-foreground">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                            {c.type}
                          </p>
                        </div>
                      </div>

                      {c.type === "default" ? (
                        <div
                          className="p-2 text-muted-foreground/50"
                          title="System categories cannot be deleted">
                          <Lock className="h-4 w-4" />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCategory(c._id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border bg-card shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                New Custom Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Hobby, Subscriptions..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button
                onClick={createCategory}
                disabled={!name.trim()}
                className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Category
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
