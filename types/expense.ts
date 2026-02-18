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

export type TransactionType = "income" | "expense";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes?: string;
  created_at: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
  notes?: string;
}
