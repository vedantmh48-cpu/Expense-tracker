import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { SmartInsights } from '../components/SmartInsights';
import { TransactionModal } from '../components/TransactionModal';
import { BudgetModal } from '../components/BudgetModal';
import { ExportImportModal } from '../components/ExportImportModal';
import { TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Activity, Sparkles, PlusCircle } from 'lucide-react';

export const DashboardPage = () => {
  const { transactions, monthlyBudget, setIsTransactionModalOpen } = useExpense();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;
  const budgetProgress = monthlyBudget ? (totalExpense / monthlyBudget) * 100 : 0;

  const recentTransactions = transactions.slice(0, 5);
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="dashboard-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentMonth}</span>
          </div>
          <h1 className="hero-title">Welcome back!</h1>
          <p className="hero-subtitle">Here's your financial snapshot for {currentMonth}</p>
          <div className="hero-balance">
            <span className="hero-balance-label">Total Balance</span>
            <span className={`hero-balance-value ${balance >= 0 ? 'positive' : 'negative'}`}>
              ₹{Math.abs(balance).toLocaleString('en-IN')}
            </span>
            <span className="hero-balance-sub">
              {balance >= 0 ? 'You are in good shape!' : 'Balance is negative'}
            </span>
          </div>
          <button onClick={() => setIsTransactionModalOpen(true)} className="hero-add-btn">
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
        <div className="hero-decoration">
          <div className="hero-orb orb-a" />
          <div className="hero-orb orb-b" />
          <div className="hero-orb orb-c" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <div className="summary-card primary">
          <div className="summary-card-icon">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="summary-card-content">
            <span className="summary-card-label">Total Balance</span>
            <span className="summary-card-value">
              ₹{Math.abs(balance).toLocaleString('en-IN')}
            </span>
            <span className="summary-card-sub">{balance >= 0 ? 'Positive' : 'Negative'} balance</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-icon income">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="summary-card-content">
            <span className="summary-card-label">Total Income</span>
            <span className="summary-card-value positive">₹{totalIncome.toLocaleString('en-IN')}</span>
            <span className="summary-card-sub">{transactions.filter(t => t.type === 'income').length} transactions</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-icon expense">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="summary-card-content">
            <span className="summary-card-label">Total Expenses</span>
            <span className="summary-card-value negative">₹{totalExpense.toLocaleString('en-IN')}</span>
            <span className="summary-card-sub">{transactions.filter(t => t.type === 'expense').length} transactions</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-icon budget">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div className="summary-card-content">
            <span className="summary-card-label">Monthly Budget</span>
            <span className="summary-card-value">{monthlyBudget ? `₹${monthlyBudget.toLocaleString('en-IN')}` : 'Not set'}</span>
            <div className="budget-bar">
              <div className={`budget-bar-fill ${budgetProgress >= 100 ? 'over-budget' : budgetProgress >= 80 ? 'near-budget' : ''}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }} />
            </div>
            <span className="summary-card-sub">{Math.round(budgetProgress)}% used</span>
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <SmartInsights />

      {/* Recent Transactions */}
      <div className="section-card">
        <div className="section-card-header">
          <div className="section-card-title-group">
            <div className="section-card-icon">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3>Recent Activity</h3>
              <p className="section-card-subtitle">Your latest transactions</p>
            </div>
          </div>
          {recentTransactions.length > 0 && (
            <span className="tx-count">{recentTransactions.length} of {transactions.length}</span>
          )}
        </div>
        <div className="recent-tx-list">
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Activity className="w-8 h-8" />
              </div>
              <h4>No transactions yet</h4>
              <p>Add your first transaction to get started</p>
              <button onClick={() => setIsTransactionModalOpen(true)} className="btn-primary empty-state-btn">
                <PlusCircle className="w-4 h-4" /> Add Transaction
              </button>
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className={`recent-tx-item ${tx.type}`}>
                <div className="tx-left">
                  <div className={`tx-type-icon ${tx.type}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="tx-info">
                    <span className="tx-category">{tx.category || 'Uncategorized'}</span>
                    <span className="tx-note">{tx.note || 'No description'}</span>
                  </div>
                </div>
                <div className="tx-right">
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </span>
                  <span className="tx-date">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TransactionModal />
      <BudgetModal />
      <ExportImportModal />
    </div>
  );
};