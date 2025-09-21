
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Transaction, TransactionType, Budget, AIInsight } from '../types';

const SummaryCard: React.FC<{ title: string; value: string; icon: string; colorClass: string; }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4">
        <div className={`text-3xl p-4 rounded-full ${colorClass}`}>
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <h3 className="text-md font-medium text-text-secondary-light dark:text-text-secondary-dark">{title}</h3>
            <p className="text-3xl font-bold text-text-light dark:text-text-dark">{value}</p>
        </div>
    </div>
);

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  onGetAIInsights: () => void;
  isAILoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, onGetAIInsights, isAILoading }) => {
    const { totalRevenue, totalExpenses, profitOrLoss } = useMemo(() => {
        const totalRevenue = transactions
            .filter(t => t.type === TransactionType.Income)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter(t => t.type === TransactionType.Expense)
            .reduce((sum, t) => sum + t.amount, 0);
        const profitOrLoss = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, profitOrLoss };
    }, [transactions]);

    const expenseByCategory = useMemo(() => {
        const data: { [key: string]: number } = {};
        transactions
            .filter(t => t.type === TransactionType.Expense)
            .forEach(t => {
                data[t.category] = (data[t.category] || 0) + t.amount;
            });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [transactions]);
    
    const monthlyData = useMemo(() => {
      const months: { [key: string]: { income: number, expense: number } } = {};
      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!months[month]) {
          months[month] = { income: 0, expense: 0 };
        }
        if (t.type === TransactionType.Income) {
          months[month].income += t.amount;
        } else {
          months[month].expense += t.amount;
        }
      });
       return Object.entries(months)
        .map(([name, values]) => ({ name, ...values }))
        .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }, [transactions]);


    const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">Dashboard</h2>
                <button 
                  onClick={onGetAIInsights}
                  disabled={isAILoading}
                  className="bg-secondary text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center space-x-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  {isAILoading ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-magic-wand-sparkles"></i>
                  )}
                  <span>Get AI Insights</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Revenue" value={currencyFormatter.format(totalRevenue)} icon="fa-arrow-up" colorClass="bg-positive/20 text-positive" />
                <SummaryCard title="Total Expenses" value={currencyFormatter.format(totalExpenses)} icon="fa-arrow-down" colorClass="bg-negative/20 text-negative" />
                <SummaryCard title="Profit / Loss" value={currencyFormatter.format(profitOrLoss)} icon={profitOrLoss >= 0 ? 'fa-scale-balanced' : 'fa-weight-hanging'} colorClass={profitOrLoss >= 0 ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Income vs Expenses</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" stroke="currentColor" className="text-xs"/>
                            <YAxis stroke="currentColor" className="text-xs"/>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                            <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">Expense Breakdown</h3>
                     {expenseByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
                            No expense data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
