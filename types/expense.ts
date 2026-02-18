export type Category =
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Utilities"
  | "Health"
  | "Shopping"
  | "Housing"
  | "Education"
  | "Other";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
  created_at: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
}
