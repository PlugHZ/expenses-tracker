import { Category } from "@/types/expense";
import { TimePeriod } from "@/components/expenses/FilterBar";
export function getDateRangeFromPeriod(period: TimePeriod): Date | null {
  if (period === "all") return null;
  const now = new Date();
  const map: Record<TimePeriod, number> = {
    "7days": 7,
    "30days": 30,
    "90days": 90,
    "6months": 180,
    "1year": 365,
    all: 0,
  };
  now.setDate(now.getDate() - map[period]);
  return now;
}
export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Shopping",
  "Housing",
  "Education",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Utilities: "#eab308",
  Health: "#ec4899",
  Shopping: "#06b6d4",
  Housing: "#84cc16",
  Education: "#14b8a6",
  Other: "#6b7280",
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
