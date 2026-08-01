import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Download, Settings, ArrowDown, TrendingUp, Wallet, IndianRupee, BookOpen } from 'lucide-react';

export const Header = () => {
  const {
    setIsTransactionModalOpen,
    setIsBudgetModalOpen,
    setIsExportModalOpen,
    transactions,
  } = useExpense();
  const { currentUser } = useAuth();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const scrollToDashboard = () => {
    const element = document.getElementById('dashboard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Animated background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#4F46E5]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#3B82F6]/5 blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/5 border border-[#E2E8F0]/50 text-[#4F46E5] text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Welcome back, {currentUser?.name?.split(' ')[0] || 'there'}!
        </div>

        <h1 className="hero-title">
          Track Every Rupee<br />
          <span className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">
            Grow Every Day
          </span>
        </h1>

        <p className="hero-subtitle">
          Smart personal expense & cash flow analytics built for India. Track UPI payments,
          SIP investments, house rent, and daily expenses with intelligent insights.
        </p>

        <div className="hero-cta">
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="btn-primary text-sm px-6 py-3 shadow-lg shadow-[#4F46E5]/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => {
              const element = document.getElementById('how-to-use');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-secondary text-sm px-5 py-3 flex items-center gap-2 hover:border-[#4F46E5]/40 hover:text-[#4F46E5]"
          >
            <BookOpen className="w-4 h-4" />
            <span>How to Use</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="btn-secondary text-sm px-5 py-3 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="btn-secondary text-sm px-5 py-3 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Budget</span>
          </button>
        </div>

        {/* Hero Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value flex items-center justify-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {totalIncome.toLocaleString('en-IN')}
            </div>
            <div className="hero-stat-label">Total Income</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value flex items-center justify-center gap-1 text-[#F43F5E]">
              <IndianRupee className="w-5 h-5" />
              {totalExpenses.toLocaleString('en-IN')}
            </div>
            <div className="hero-stat-label">Total Expenses</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value flex items-center justify-center gap-1">
              <Wallet className="w-5 h-5" />
              {(totalIncome - totalExpenses).toLocaleString('en-IN')}
            </div>
            <div className="hero-stat-label">Net Balance</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5" />
              {transactions.length}
            </div>
            <div className="hero-stat-label">Transactions</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={scrollToDashboard}>
        <span>Scroll to explore</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </section>
  );
};