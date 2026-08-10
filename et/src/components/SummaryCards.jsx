import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatINR } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

export const SummaryCards = () => {
  const { transactions, monthlyBudget, setIsBudgetModalOpen } = useExpense();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && (t.date || '').startsWith(currentMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetUsedPercent = monthlyBudget > 0 ? Math.round((thisMonthExpenses / monthlyBudget) * 100) : 0;
  const isOverBudget = budgetUsedPercent > 100;
  const isNearBudget = budgetUsedPercent >= 80 && budgetUsedPercent <= 100;

  return (
    <div className="dashboard-grid">
      {/* Total Balance Card */}
      <div className="summary-card">
        <div className="summary-card-icon">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Total Net Balance</span>
          <span className="summary-card-value">{formatINR(netBalance)}</span>
          <span className="summary-card-sub">Savings Rate: {savingsRate}% saved</span>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="summary-card">
        <div className="summary-card-icon income">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Total Income</span>
          <span className="summary-card-value positive">{formatINR(totalIncome)}</span>
          <span className="summary-card-sub">{transactions.filter((t) => t.type === 'income').length} records</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="summary-card">
        <div className="summary-card-icon expense">
          <TrendingDown className="w-5 h-5" />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">Total Expenses</span>
          <span className="summary-card-value negative">{formatINR(totalExpense)}</span>
          <span className="summary-card-sub">{transactions.filter((t) => t.type === 'expense').length} records</span>
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className="summary-card cursor-pointer" onClick={() => setIsBudgetModalOpen(true)}>
        <div className={`summary-card-icon ${isOverBudget ? 'expense' : isNearBudget ? 'budget' : ''}`}>
          <Target className="w-5 h-5" />
        </div>
        <div className="summary-card-content">
          <span className="summary-card-label">
            Monthly Budget
            {isOverBudget && <AlertTriangle className="w-3.5 h-3.5 inline ml-1 text-[var(--accent-danger)]" />}
          </span>
          <span className="summary-card-value">{formatINR(thisMonthExpenses)}</span>
          <span className="summary-card-sub">of {formatINR(monthlyBudget)} ({budgetUsedPercent}% used)</span>
          <div className="budget-bar">
            <div
              className={`budget-bar-fill ${isOverBudget ? 'over-budget' : isNearBudget ? 'near-budget' : ''}`}
              style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};