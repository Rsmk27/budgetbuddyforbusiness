// FIX: Provide full implementation for the main App component.
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import BudgetsPage from './components/BudgetsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import AIInsightModal from './components/AIInsightModal';
import { getFinancialInsights } from './services/geminiService';
import { Transaction, Budget, TransactionType, Page, AIInsight } from './types';

function App() {
  const { currentUser, logout } = useAuth();
  
  const transactionsKey = currentUser ? `transactions_${currentUser}` : 'transactions';
  const budgetsKey = currentUser ? `budgets_${currentUser}` : 'budgets';

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(transactionsKey, []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(budgetsKey, []);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('isDarkMode', false);

  const [isAIInsightModalOpen, setIsAIInsightModalOpen] = useState(false);
  const [aiInsight, setAIInsight] = useState<AIInsight | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Reset page to dashboard on login/logout
  useEffect(() => {
    setCurrentPage(Page.Dashboard);
  }, [currentUser]);


  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'type' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: currentPage === Page.Income ? TransactionType.Income : TransactionType.Expense,
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const handleSetBudget = (budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === budget.category);
      if (existing) {
        return prev.map(b => b.category === budget.category ? { ...b, ...budget } : b);
      }
      return [...prev, { ...budget, id: crypto.randomUUID() }];
    });
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const handleClearData = () => {
    setTransactions([]);
    setBudgets([]);
  };

  const handleGetAIInsights = async () => {
    setIsAILoading(true);
    setAIError(null);
    setAIInsight(null);
    setIsAIInsightModalOpen(true);
    try {
      if (transactions.length === 0 && budgets.length === 0) {
        throw new Error("There is no financial data to analyze. Please add some transactions or budgets first.");
      }
      const insights = await getFinancialInsights(transactions, budgets);
      setAIInsight(insights);
    } catch (error: any) {
      setAIError(error.message || "An unknown error occurred.");
    } finally {
      setIsAILoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard transactions={transactions} budgets={budgets} onGetAIInsights={handleGetAIInsights} isAILoading={isAILoading} />;
      case Page.Income:
        return <TransactionsPage type={TransactionType.Income} transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      case Page.Expenses:
        return <TransactionsPage type={TransactionType.Expense} transactions={transactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />;
      case Page.Budgets:
        return <BudgetsPage budgets={budgets} transactions={transactions} onSetBudget={handleSetBudget} onDeleteBudget={handleDeleteBudget} />;
      case Page.Reports:
        return <ReportsPage transactions={transactions} />;
      case Page.Settings:
        return <SettingsPage onClearData={handleClearData} onLogout={logout} currentUser={currentUser!} />;
      default:
        return <Dashboard transactions={transactions} budgets={budgets} onGetAIInsights={handleGetAIInsights} isAILoading={isAILoading} />;
    }
  };

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(prev => !prev)}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderPage()}
      </main>
      <AIInsightModal 
        isOpen={isAIInsightModalOpen || isAILoading}
        onClose={() => { if (!isAILoading) setIsAIInsightModalOpen(false); }}
        insight={aiInsight}
        error={aiError}
      />
    </div>
  );
}

export default App;
