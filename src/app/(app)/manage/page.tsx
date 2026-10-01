"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { fetchJson } from "@/lib/fetchJson";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CategoryIcon,
  CATEGORY_ICON_KEYS,
  categoryIconLabel,
} from "@/components/CategoryIcon";
import defaultCategoriesData from "@/data/defaultCategories.json";
import type { Category } from "@/lib/types";
import { Lock, Plus, Trash2 } from "lucide-react";

const DEFAULT_CATEGORIES = defaultCategoriesData as Category[];

type LoadState = "loading" | "ready" | "error";

export default function ManagePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [state, setState] = React.useState<LoadState>("loading");
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("tag");
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    let cancelled = false;
    setState("loading");
    fetchJson<Category[]>(`/api/categories?userId=${user.id}`)
      .then((cats) => {
        if (!cancelled) {
          setCategories(Array.isArray(cats) ? cats : []);
          setState("ready");
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  const allCategories = React.useMemo(
    () => [...DEFAULT_CATEGORIES, ...categories],
    [categories],
  );

  const trimmedName = name.trim();
  const isDuplicate = allCategories.some(
    (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
  );
  const canCreate =
    trimmedName.length > 0 && !isDuplicate && !saving && !!user;

  const createCategory = async () => {
    if (!canCreate || !user) return;
    setSaving(true);
    try {
      await fetchJson("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          name: trimmedName,
          icon,
          type: "custom",
        }),
      });
      const cats = await fetchJson<Category[]>(
        `/api/categories?userId=${user.id}`,
      );
      setCategories(Array.isArray(cats) ? cats : []);
      setName("");
      setIcon("tag");
      toast.success(`Category “${trimmedName}” created`);
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error("Couldn't create the category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string, categoryName: string) => {
    if (!user) return;
    setDeletingId(id);
    const prev = categories;
    setCategories((cur) => cur.filter((c) => c._id !== id));
    try {
      await fetchJson("/api/categories", {
        method: "DELETE",
        body: JSON.stringify({ categoryId: id }),
      });
      toast.success(`Category “${categoryName}” deleted`);
    } catch {
      setCategories(prev);
      toast.error("Couldn't delete the category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoaded || state === "loading") {
    return (
      <div>
        <PageHeader
          title="Categories"
          description="Organize transactions into groups that make sense to you."
        />
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div>
        <PageHeader title="Categories" />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <p className="font-medium">Couldn&apos;t load categories</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Something went wrong. Check your connection and try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-16 md:pb-0">
      <PageHeader
        title="Categories"
        description="Organize transactions into groups that make sense to you."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your categories</CardTitle>
              <CardDescription>
                {DEFAULT_CATEGORIES.length} default ·{" "}
                {categories.length} custom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {allCategories.map((c) => {
                const isDefault = c.type === "default";
                return (
                  <div
                    key={c._id}
                    className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-accent/40"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        isDefault
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <CategoryIcon icon={c.icon} className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <span
                        className={`mt-0.5 inline-block rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wider ${
                          isDefault
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDefault ? "Default" : "Custom"}
                      </span>
                    </div>

                    {isDefault ? (
                      <div
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground/40"
                        title="System categories can't be deleted"
                      >
                        <Lock className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${c.name}`}
                            disabled={deletingId === c._id}
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete “{c.name}”?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Existing transactions keep their category name,
                              but you won&apos;t be able to pick it for new
                              ones. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => deleteCategory(c._id, c.name)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Create form */}
        <div>
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle>New category</CardTitle>
              <CardDescription>
                Pick a name and an icon that fits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="cat-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Name
                </label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createCategory()}
                  placeholder="e.g., Subscriptions"
                  maxLength={60}
                  aria-invalid={isDuplicate}
                />
                {isDuplicate && (
                  <p className="mt-1.5 text-xs text-destructive">
                    A category with this name already exists.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Icon
                </label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger className="w-full">
                    <span className="flex items-center gap-2">
                      <CategoryIcon icon={icon} className="h-4 w-4" />
                      {categoryIconLabel(icon)}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ICON_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <CategoryIcon icon={key} className="h-4 w-4" />
                          {categoryIconLabel(key)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={createCategory}
                disabled={!canCreate}
              >
                <Plus className="h-4 w-4" />
                {saving ? "Creating…" : "Create category"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
