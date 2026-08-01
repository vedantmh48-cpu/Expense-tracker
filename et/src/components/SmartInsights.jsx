import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, formatINR } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Lightbulb, AlertTriangle, CreditCard, Target } from 'lucide-react';

export const SmartInsights = () => {
  const { transactions, monthlyBudget } = useExpense();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // If no expenses recorded, show starter tip
  if (expenses.length === 0) {
    return (
      <div className="glass-card p-4 mb-8 border-[#E2E8F0]/20 bg-[#FFFFFF] flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <p className="text-sm text-[#0F172A]">
          <span className="font-semibold text-[#4F46E5]">Smart Tip:</span> Add your first income or expense transaction to unlock personalized AI financial insights and cash flow analysis!
        </p>
      </div>
    );
  }

  // Calculate highest spend category
  const categoryTotals = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  let topCategoryKey = '';
  let topCategoryAmount = 0;

  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategoryKey = cat;
    }
  });

  const topCatMeta = CATEGORIES.find((c) => c.id === topCategoryKey) || { name: topCategoryKey, iconId: 'other' };
  const topCatPercent = totalExpense > 0 ? Math.round((topCategoryAmount / totalExpense) * 100) : 0;

  // Calculate UPI share
  const upiCount = transactions.filter((t) => t.paymentMethod === 'upi').length;
  const upiPercent = transactions.length > 0 ? Math.round((upiCount / transactions.length) * 100) : 0;

  // Monthly Budget status
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = expenses
    .filter((t) => (t.date || '').startsWith(currentMonthStr))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const budgetPercent = monthlyBudget > 0 ? Math.round((thisMonthExpenses / monthlyBudget) * 100) : 0;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Insight Banner */}
      <div className="glass-card p-4 border-[#E2E8F0]/20 bg-[#FFFFFF] flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#0F172A] font-bold mb-0.5 flex items-center gap-1.5">
            <span>Top Spending Area</span>
          </h4>
          <p className="text-sm text-[#0F172A] flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 font-semibold text-[#4F46E5]">
              <CategoryIcon iconId={topCatMeta.iconId || 'other'} className="w-4 h-4 text-[#4F46E5] inline" />
              {topCatMeta.name}
            </span>{' '}
            accounts for <span className="font-bold text-[#4F46E5]">{topCatPercent}%</span> of your total expenses ({formatINR(topCategoryAmount)}).
          </p>
        </div>
      </div>

      {/* Budget or UPI Payment Pattern Banner */}
      {monthlyBudget && budgetPercent >= 80 ? (
        <div className="glass-card p-4 border-rose-500/30 bg-[#FFFFFF] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-rose-500 font-bold mb-0.5">Budget Alert</h4>
            <p className="text-sm text-[#0F172A]">
              {budgetPercent > 100
                ? `🚨 You have exceeded your monthly limit by ${formatINR(thisMonthExpenses - monthlyBudget)}!`
                : `⚠️ Careful! You have consumed ${budgetPercent}% of your ₹${(monthlyBudget / 1000).toFixed(0)}k monthly target.`}
            </p>
          </div>
        </div>
      ) : !monthlyBudget ? (
        <div className="glass-card p-4 border-[#E2E8F0]/20 bg-[#FFFFFF] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#0F172A] font-bold mb-0.5">Budget Not Set</h4>
            <p className="text-sm text-[#0F172A]">
              Set a <span className="font-semibold text-[#4F46E5]">monthly budget</span> to get real-time alerts and smarter spending insights.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 border-[#E2E8F0]/20 bg-[#FFFFFF] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#0F172A] font-bold mb-0.5">Payment Insights</h4>
            <p className="text-sm text-[#0F172A]">
              <span className="font-semibold text-[#4F46E5]">{upiPercent}% of transactions</span> were processed via UPI (GPay / PhonePe / Paytm).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};