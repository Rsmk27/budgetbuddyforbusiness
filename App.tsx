
import React, { useState, useEffect } from 'react';
import { Page, Transaction, TransactionType, Budget, AIInsight } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getFinancialInsights } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import BudgetsPage from './components/BudgetsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import AIInsightModal from './components/AIInsightModal';

const MainApp: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('theme', false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  
  // User-specific data storage
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`transactions_${currentUser}`, []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(`budgets_${currentUser}`, []);

  const [isAILoading, setIsAILoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'type' | 'date'>, type: TransactionType) => {
    setTransactions(prev => [...prev, {
      ...newTransaction,
      id: crypto.randomUUID(),
      type: type,
      date: new Date().toISOString(),
    }]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const handleSetBudget = (newBudget: Omit<Budget, 'id'>) => {
    setBudgets(prev => {
      const existingIndex = prev.findIndex(b => b.category === newBudget.category);
      if (existingIndex > -1) {
        const updatedBudgets = [...prev];
        updatedBudgets[existingIndex] = { ...updatedBudgets[existingIndex], ...newBudget };
        return updatedBudgets;
      }
      return [...prev, { ...newBudget, id: crypto.randomUUID() }];
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
      setAiError(null);
      setAiInsight(null);
      setIsModalOpen(true);
      try {
        const insights = await getFinancialInsights(transactions, budgets);
        setAiInsight(insights);
      } catch (error) {
        setAiError((error as Error).message);
      } finally {
        setIsAILoading(false);
      }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard: return <Dashboard transactions={transactions} budgets={budgets} onGetAIInsights={handleGetAIInsights} isAILoading={isAILoading && isModalOpen} />;
      case Page.Income: return <TransactionsPage type={TransactionType.Income} transactions={transactions} onAddTransaction={(t) => handleAddTransaction(t, TransactionType.Income)} onDeleteTransaction={handleDeleteTransaction} />;
      case Page.Expenses: return <TransactionsPage type={TransactionType.Expense} transactions={transactions} onAddTransaction={(t) => handleAddTransaction(t, TransactionType.Expense)} onDeleteTransaction={handleDeleteTransaction} />;
      case Page.Budgets: return <BudgetsPage budgets={budgets} transactions={transactions} onSetBudget={handleSetBudget} onDeleteBudget={handleDeleteBudget}/>;
      case Page.Reports: return <ReportsPage transactions={transactions} />;
      case Page.Settings: return <SettingsPage onClearData={handleClearData} onLogout={logout} currentUser={currentUser!} />;
      default: return <Dashboard transactions={transactions} budgets={budgets} onGetAIInsights={handleGetAIInsights} isAILoading={isAILoading && isModalOpen} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        isDarkMode={isDarkMode} 
        onThemeToggle={() => setIsDarkMode(!isDarkMode)} 
      />
      <main className="flex-1 p-6 md:p-10 transition-transform duration-300">
        {renderPage()}
      </main>
      <AIInsightModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insight={aiInsight}
        error={aiError}
      />
      {isAILoading && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="text-white text-center">
                  <i className="fas fa-spinner animate-spin text-5xl mb-4"></i>
                  <p className="text-lg">Analyzing your finances...</p>
              </div>
          </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
    const { currentUser } = useAuth();
    return currentUser ? <MainApp /> : <LoginPage />;
}

export default App;
