
import React, { useMemo, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';
import html2pdf from 'html2pdf.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

interface ReportsPageProps {
  transactions: Transaction[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ transactions }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const monthlyBreakdown = useMemo(() => {
    const data: { [key: string]: { income: number, expenses: number } } = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!data[month]) {
        data[month] = { income: 0, expenses: 0 };
      }
      if (t.type === TransactionType.Income) {
        data[month].income += t.amount;
      } else {
        data[month].expenses += t.amount;
      }
    });
    return Object.entries(data).map(([name, values]) => ({ name, ...values })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [transactions]);
  
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Description', 'Category', 'Amount'];
    const rows = transactions.map(t => [t.id, t.date, t.type, t.description, t.category, t.amount].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (element) {
        const opt = {
            margin:       0.5,
            filename:     'financial_statement.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    }
  };


  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-text-light dark:text-text-dark">Reports & Analytics</h2>
          <div className="flex space-x-4">
              <button onClick={handleExportCSV} className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">Export as CSV</button>
              <button onClick={handleDownloadPDF} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Download PDF Statement</button>
          </div>
      </div>
      
      <div ref={reportRef} className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-text-light dark:text-text-dark">Monthly Breakdown</h3>
        <p className="mb-6 text-text-secondary-light dark:text-text-secondary-dark">A summary of your income and expenses over the past few months.</p>
        <div style={{width: '100%', height: 400}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBreakdown} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="currentColor"/>
              <YAxis stroke="currentColor" tickFormatter={(value) => currencyFormatter.format(value as number)}/>
              <Tooltip formatter={(value) => currencyFormatter.format(value as number)} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}/>
              <Legend />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
