import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Target, X, Check } from 'lucide-react';

export const BudgetModal = () => {
  const { isBudgetModalOpen, setIsBudgetModalOpen, monthlyBudget, setMonthlyBudget } = useExpense();
  const [budgetVal, setBudgetVal] = useState(monthlyBudget || 50000);

  if (!isBudgetModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (budgetVal > 0) {
      setMonthlyBudget(Number(budgetVal));
      setIsBudgetModalOpen(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card p-6 border-[#E2E8F0] shadow-2xl relative max-w-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E2E8F0]/40">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
              <Target className="w-5 h-5" />
            </span>
            Set Monthly Budget Target
          </h3>
          <button
            onClick={() => setIsBudgetModalOpen(false)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Monthly Budget Limit (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-lg font-bold text-[#64748B]">₹</span>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                className="form-input pl-8 text-xl font-bold text-[#0F172A]"
              />
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">
              The monthly budget bar turns warning orange at 80% and red if exceeded.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {[30000, 50000, 75000, 100000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudgetVal(preset)}
                className="btn-preset text-xs flex-1 text-center"
              >
                ₹{(preset / 1000).toFixed(0)}k
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full btn-primary justify-center py-2.5 text-sm mt-3"
          >
            <Check className="w-4 h-4" />
            <span>Update Target</span>
          </button>
        </form>
      </div>
    </div>
  );
};