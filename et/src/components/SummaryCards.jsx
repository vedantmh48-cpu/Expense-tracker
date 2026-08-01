import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatINR } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

export const SummaryCards = () => {
  const { transactions, monthlyBudget, setIsBudgetModalOpen } = useExpense();

  // Compute key stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  // Monthly Budget usage calculation (Current month expenses)
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && (t.date || '').startsWith(currentMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetUsedPercent = monthlyBudget > 0 ? Math.round((thisMonthExpenses / monthlyBudget) * 100) : 0;
  const isOverBudget = budgetUsedPercent > 100;
  const isNearBudget = budgetUsedPercent >= 80 && budgetUsedPercent <= 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance Card */}
      <div className="glass-card p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Net Balance</span>
          <div className="p-2.5 rounded-xl bg-[#E2E8F0]/20 text-[#4F46E5] border border-[#E2E8F0]/40">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
          {formatINR(netBalance)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B]">Savings Rate:</span>
          <span className="px-2 py-0.5 rounded-full bg-[#E2E8F0]/30 text-[#0F172A] font-bold border border-[#E2E8F0]">
            {savingsRate}% saved
          </span>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="glass-card p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Income</span>
          <div className="p-2.5 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-[#10B981] tracking-tight mb-2">
          {formatINR(totalIncome)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B]">Income Entries:</span>
          <span className="text-[#10B981] font-bold">{transactions.filter((t) => t.type === 'income').length} records</span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="glass-card p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Total Expenses</span>
          <div className="p-2.5 rounded-xl bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-[#F43F5E] tracking-tight mb-2">
          {formatINR(totalExpense)}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748B]">Expense Entries:</span>
          <span className="text-[#F43F5E] font-bold">{transactions.filter((t) => t.type === 'expense').length} records</span>
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className="glass-card p-5 relative overflow-hidden group cursor-pointer" onClick={() => setIsBudgetModalOpen(true)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Monthly Budget</span>
            {isOverBudget && <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />}
          </div>
          <div className={`p-2.5 rounded-xl border ${isOverBudget ? 'bg-rose-500/15 text-rose-600 border-rose-400' : isNearBudget ? 'bg-amber-500/15 text-amber-600 border-amber-400' : 'bg-[#F8FAFC] text-[#4F46E5] border-[#E2E8F0]'}`}>
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-lg font-bold text-[#0F172A]">{formatINR(thisMonthExpenses)}</span>
          <span className="text-xs text-[#64748B]">of {formatINR(monthlyBudget)}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#F8FAFC] border border-[#E2E8F0]/30 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 rounded-full ${isOverBudget
              ? 'bg-gradient-to-r from-rose-500 to-red-600'
              : isNearBudget
                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                : 'bg-gradient-to-r from-[#4F46E5] to-[#3B82F6]'
              }`}
            style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={isOverBudget ? 'text-rose-600 font-bold' : isNearBudget ? 'text-amber-600 font-semibold' : 'text-[#64748B]'}>
            {isOverBudget ? 'Over Limit!' : `${100 - budgetUsedPercent}% Left`}
          </span>
          <span className="font-bold text-[#0F172A]">{budgetUsedPercent}% used</span>
        </div>
      </div>
    </div>
  );
};