import React, { useState, useMemo, useEffect } from 'react';
import { Budget, Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';

interface BudgetsPageProps {
  budgets: Budget[];
  transactions: Transaction[];
  onSetBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const BudgetsPage: React.FC<BudgetsPageProps> = ({ budgets, transactions, onSetBudget, onDeleteBudget }) => {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
  const [amount, setAmount] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('80');

  // Effect to update form when category changes to reflect existing budget settings
  useEffect(() => {
    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
      setAmount(String(existingBudget.amount));
      setAlertsEnabled(existingBudget.alertsEnabled ?? true);
      setAlertThreshold(String(existingBudget.alertThreshold ?? 80));
    } else {
      // Reset form for a new budget entry
      setAmount('');
      setAlertsEnabled(true);
      setAlertThreshold('80');
    }
  }, [category, budgets]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) {
      alert('Please select a category and enter an amount.');
      return;
    }
    const threshold = parseInt(alertThreshold, 10);
    if (isNaN(threshold) || threshold < 1 || threshold > 100) {
      alert('Please enter a valid alert threshold between 1 and 100.');
      return;
    }
    onSetBudget({ 
        category, 
        amount: parseFloat(amount),
        alertsEnabled,
        alertThreshold: threshold,
    });
  };

  const budgetData = useMemo(() => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === TransactionType.Expense && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      const remaining = budget.amount - spent;
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      const categoryName = EXPENSE_CATEGORIES.find(c => c.value === budget.category)?.label || budget.category;
      const effectiveAlertsEnabled = budget.alertsEnabled ?? false;
      const effectiveAlertThreshold = budget.alertThreshold ?? 80;

      let alertStatus: 'ok' | 'warning' | 'danger' = 'ok';
      if (effectiveAlertsEnabled) {
          if (progress >= 100) {
              alertStatus = 'danger';
          } else if (progress >= effectiveAlertThreshold) {
              alertStatus = 'warning';
          }
      }
      
      return { ...budget, spent, remaining, progress, categoryName, alertStatus, alertsEnabled: effectiveAlertsEnabled, alertThreshold: effectiveAlertThreshold };
    });
  }, [budgets, transactions]);

  // Effect for handling browser notifications
  useEffect(() => {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        return;
    }

    if (Notification.permission === 'denied') {
        return;
    }

    budgetData.forEach(b => {
      if (b.alertStatus === 'ok') return;

      const title = b.alertStatus === 'danger' ? `Budget Exceeded for ${b.categoryName}!` : `Budget Alert for ${b.categoryName}`;
      const body = b.alertStatus === 'danger'
        ? `You have spent ${currencyFormatter.format(b.spent)} which is over your budget of ${currencyFormatter.format(b.amount)}.`
        : `You have spent ${currencyFormatter.format(b.spent)} (${b.progress.toFixed(0)}%) of your ${currencyFormatter.format(b.amount)} budget.`;
      
      const notificationKey = `notif_${b.id}_${b.alertStatus}`;
      if (sessionStorage.getItem(notificationKey)) {
          return;
      }

      Notification.requestPermission().then(permission => {
          if (permission === "granted") {
              const notification = new Notification(title, { body });
              sessionStorage.setItem(notificationKey, 'true');
          }
      });
    });
  }, [budgetData]);


  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold mb-6 text-text-light dark:text-text-dark">Budgets & Alerts</h2>
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Set or Update Budget</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <select value={category} onChange={e => setCategory(e.target.value)} className="lg:col-span-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary">
            {EXPENSE_CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Budget Amount" required className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent">
            <input type="checkbox" id="alertsEnabled" checked={alertsEnabled} onChange={e => setAlertsEnabled(e.target.checked)} className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300"/>
            <label htmlFor="alertsEnabled" className="text-sm font-medium">Alerts</label>
            <input type="number" value={alertThreshold} onChange={e => setAlertThreshold(e.target.value)} disabled={!alertsEnabled} min="1" max="100" placeholder="%" className="w-16 p-1 text-center rounded-md border border-border-light dark:border-border-dark bg-transparent disabled:opacity-50" />
          </div>
          <button type="submit" className="bg-primary text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Set Budget
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetData.map(b => (
          <div key={b.id} className={`bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md relative border-2 transition-all ${
            b.alertStatus === 'danger' ? 'border-red-500' :
            b.alertStatus === 'warning' ? 'border-yellow-500' :
            'border-transparent'
          }`}>
             {b.alertStatus !== 'ok' && (
                <div className={`absolute top-4 left-4 text-xl ${b.alertStatus === 'danger' ? 'text-red-500' : 'text-yellow-500'}`}>
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
             )}
             <button onClick={() => onDeleteBudget(b.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
              <i className="fas fa-times-circle"></i>
            </button>
            <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">{b.categoryName}</h4>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Budget: {currencyFormatter.format(b.amount)}</p>
             {b.alertsEnabled && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-4">Alert at {b.alertThreshold}%</p>}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className={`h-4 rounded-full ${b.progress > 100 ? 'bg-red-500' : (b.progress > 75 ? 'bg-yellow-500' : 'bg-green-500')}`}
                style={{ width: `${Math.min(b.progress, 100)}%` }}>
              </div>
            </div>
            <div className="flex justify-between text-sm">
                <span>Spent: {currencyFormatter.format(b.spent)}</span>
                <span className={b.remaining < 0 ? 'text-red-500 font-semibold' : ''}>{b.remaining >= 0 ? `Remaining: ${currencyFormatter.format(b.remaining)}` : `Overspent: ${currencyFormatter.format(Math.abs(b.remaining))}`}</span>
            </div>
          </div>
        ))}
        {budgetData.length === 0 && <p className="col-span-full text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">No budgets set yet.</p>}
      </div>
    </div>
  );
};

export default BudgetsPage;