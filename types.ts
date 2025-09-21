export enum Page {
  Dashboard = 'dashboard',
  Income = 'income',
  Expenses = 'expenses',
  Budgets = 'budgets',
  Reports = 'reports',
  Settings = 'settings',
}

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  alertsEnabled: boolean;
  alertThreshold: number;
}

export interface AIInsight {
  overallStatus: string;
  positiveHighlights: string[];
  areasForImprovement: string[];
  actionableTips: string[];
}