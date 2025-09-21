
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

interface TransactionsPageProps {
  type: TransactionType;
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'type' | 'date'>) => void;
  onDeleteTransaction: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const dateFormatter = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

const TransactionsPage: React.FC<TransactionsPageProps> = ({ type, transactions, onAddTransaction, onDeleteTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const isIncome = type === TransactionType.Income;
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useState(() => {
    if(categories.length > 0) {
      setCategory(categories[0].value);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      alert('Please fill all fields');
      return;
    }
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      category,
    });
    setDescription('');
    setAmount('');
  };

  const filteredTransactions = transactions.filter(t => t.type === type).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold mb-6 text-text-light dark:text-text-dark">{isIncome ? 'Income' : 'Expenses'} Management</h2>
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-center">
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 rounded-lg border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary">
            {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
          <button type="submit" className={`text-white p-3 rounded-lg font-semibold transition-colors ${isIncome ? 'bg-positive hover:bg-green-600' : 'bg-negative hover:bg-red-600'}`}>
            Add {isIncome ? 'Income' : 'Expense'}
          </button>
        </form>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-4 whitespace-nowrap text-sm">{dateFormatter.format(new Date(t.date))}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">{t.description}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">{categories.find(c=>c.value === t.category)?.label}</td>
                  <td className={`py-4 px-4 whitespace-nowrap text-sm font-semibold text-right ${isIncome ? 'text-positive' : 'text-negative'}`}>{currencyFormatter.format(t.amount)}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <button onClick={() => onDeleteTransaction(t.id)} className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && <p className="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">No transactions recorded yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
