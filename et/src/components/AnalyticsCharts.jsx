import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS, formatINR } from '../utils/formatters';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, TrendingUp, BarChart2, CreditCard, BarChart3 } from 'lucide-react';

export const AnalyticsCharts = () => {
  const { transactions } = useExpense();
  const [activeTab, setActiveTab] = useState('trend'); // 'trend' | 'category' | 'monthly' | 'payment'

  // Prepare Data 1: Income vs Expense Trend timeline (Grouped by date)
  const dateMap = {};
  transactions.forEach((t) => {
    const d = t.date || 'Unknown';
    if (!dateMap[d]) {
      dateMap[d] = { date: d, income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      dateMap[d].income += Number(t.amount);
    } else {
      dateMap[d].expense += Number(t.amount);
    }
  });

  const trendData = Object.values(dateMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)
    .map((item) => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    }));

  // Prepare Data 2: Category Breakdown Donut Chart
  const categoryMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });

  const categoryData = Object.entries(categoryMap).map(([catKey, total]) => {
    const meta = CATEGORIES.find((c) => c.id === catKey) || { name: catKey, color: '#E2E8F0' };
    return {
      name: meta.name,
      value: total,
      color: meta.color,
    };
  });

  // Prepare Data 3: Monthly Expenses Bar Chart
  const monthMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const monthKey = (t.date || '').substring(0, 7);
      if (monthKey) {
        monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(t.amount);
      }
    });

  const monthlyData = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([m, total]) => {
      const dateObj = new Date(`${m}-01`);
      const monthLabel = dateObj.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      return { month: monthLabel, amount: total };
    });

  // Prepare Data 4: Payment Method Breakdown Chart
  const paymentMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const pm = t.paymentMethod || 'upi';
      paymentMap[pm] = (paymentMap[pm] || 0) + Number(t.amount);
    });

  const paymentColors = {
    upi: '#4F46E5',
    credit: '#3B82F6',
    debit: '#64748B',
    netbanking: '#10B981',
    cash: '#F59E0B',
  };

  const paymentData = Object.entries(paymentMap).map(([pmKey, total]) => {
    const pmMeta = PAYMENT_METHODS.find((pm) => pm.id === pmKey) || { name: pmKey };
    return {
      name: pmMeta.name,
      value: total,
      color: paymentColors[pmKey] || '#E2E8F0',
    };
  });

  // Custom Glassmorphism Tooltip with Palette Styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-xs shadow-xl border-[#E2E8F0]/40 bg-[#FFFFFF]/95">
          <p className="font-bold text-[#0F172A] mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }} className="font-semibold">
              {entry.name}: {formatINR(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Zero state when no transactions exist
  if (transactions.length === 0) {
    return (
      <div id="analytics" className="glass-card p-5 mb-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]/30">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
              Interactive Financial Analytics
            </h3>
            <p className="text-xs text-[#64748B]">4 distinct visualization views analyzing cash flow & habits</p>
          </div>

          {/* Tab Controls (disabled in zero state) */}
          <div className="flex flex-wrap items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]/40 text-xs opacity-50 pointer-events-none">
            <button className="px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-[#0F172A]">
              <TrendingUp className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button className="px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-[#0F172A]">
              <PieIcon className="w-3.5 h-3.5" />
              Category
            </button>
            <button className="px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-[#0F172A]">
              <BarChart2 className="w-3.5 h-3.5" />
              Monthly
            </button>
            <button className="px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 text-[#0F172A]">
              <CreditCard className="w-3.5 h-3.5" />
              Payment Mode
            </button>
          </div>
        </div>

        <div className="zero-state py-16">
          <div className="zero-state-icon">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h4 className="zero-state-title">No Analytics Yet</h4>
          <p className="zero-state-description">
            Once you add transactions, you'll see beautiful interactive charts here —
            spending trends, category breakdowns, and payment insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="analytics" className="glass-card p-5 mb-8 scroll-mt-24">
      {/* Chart Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]/30">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
            Interactive Financial Analytics
          </h3>
          <p className="text-xs text-[#64748B]">4 distinct visualization views analyzing cash flow & habits</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]/40 text-xs">
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'trend'
              ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-md'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/20'
              }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'category'
              ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-md'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/20'
              }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Category
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'monthly'
              ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-md'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/20'
              }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Monthly
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'payment'
              ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-md'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/20'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payment Mode
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full">
        {activeTab === 'trend' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="formattedDate" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#F43F5E" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'category' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#F8FAFC" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'monthly' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" name="Monthly Expenses" radius={[6, 6, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill="#4F46E5" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'payment' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`pm-cell-${index}`} fill={entry.color} stroke="#F8FAFC" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};