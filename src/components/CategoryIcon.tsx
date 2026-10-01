import {
  Home,
  ShoppingCart,
  Car,
  Zap,
  Smile,
  MoreHorizontal,
  Tag,
  Utensils,
  Plane,
  HeartPulse,
  GraduationCap,
  Gift,
  Briefcase,
  Dumbbell,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Maps icon keys (stored on category records) to Lucide icons.
 * Unknown keys fall back to Tag.
 */
const ICONS: Record<string, LucideIcon> = {
  home: Home,
  "shopping-cart": ShoppingCart,
  car: Car,
  zap: Zap,
  smile: Smile,
  "more-horizontal": MoreHorizontal,
  tag: Tag,
  utensils: Utensils,
  plane: Plane,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  gift: Gift,
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  "piggy-bank": PiggyBank,
};

export const CATEGORY_ICON_KEYS = Object.keys(ICONS);

export function categoryIconLabel(key: string) {
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CategoryIcon({
  icon,
  className,
}: {
  icon?: string;
  className?: string;
}) {
  const Icon = (icon && ICONS[icon]) || Tag;
  return <Icon className={cn("h-4 w-4", className)} />;
}
