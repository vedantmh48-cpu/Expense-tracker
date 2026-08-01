import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS, UPI_APPS } from '../utils/formatters';
import { X, CheckCircle, IndianRupee, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const TransactionModal = () => {
  const {
    isTransactionModalOpen,
    closeTransactionModal,
    editingTransaction,
    addTransaction,
    updateTransaction,
  } = useExpense();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiTag, setUpiTag] = useState('GPay');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingTransaction.paymentMethod || 'upi');
      setUpiTag(editingTransaction.upiTag || '');
      setNote(editingTransaction.note || '');
    } else {
      setAmount('');
      setType('expense');
      setCategory('food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('upi');
      setUpiTag('GPay');
      setNote('');
    }
  }, [editingTransaction, isTransactionModalOpen]);

  if (!isTransactionModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const payload = {
      amount: Number(amount),
      type,
      category,
      date,
      paymentMethod,
      upiTag: paymentMethod === 'upi' ? upiTag : '',
      note,
    };

    if (editingTransaction) {
      updateTransaction({ ...payload, id: editingTransaction.id });
    } else {
      addTransaction(payload);
    }

    closeTransactionModal();
  };

  const handlePresetClick = (val) => {
    setAmount((prev) => (Number(prev) || 0) + val);
  };

  const filteredCategories = CATEGORIES.filter(
    (c) => c.type === type || c.id === 'other' || (type === 'expense' && c.type === 'expense')
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card p-6 border-[#E2E8F0] shadow-2xl relative bg-[#FFFFFF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]/30">
          <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
              <IndianRupee className="w-5 h-5" />
            </span>
            {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button
            onClick={closeTransactionModal}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Switcher (Income vs Expense) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/40">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('food');
              }}
              className={`py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${type === 'expense'
                ? 'bg-[#F43F5E] text-white shadow-sm'
                : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
            >
              <ArrowDownCircle className="w-4 h-4" /> Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('salary');
              }}
              className={`py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${type === 'income'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
            >
              <ArrowUpCircle className="w-4 h-4" /> Income
            </button>
          </div>

          {/* Amount Field + Quick Presets */}
          <div>
            <label className="form-label">Amount (₹ INR) *</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-lg font-bold text-[#64748B]">₹</span>
              <input
                type="number"
                required
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input pl-8 text-xl font-bold text-[#0F172A]"
              />
            </div>
            {/* Quick Add Preset Buttons */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[#64748B]">Presets:</span>
              {[100, 500, 2000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  className="btn-preset"
                >
                  +₹{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method & UPI Quick Tagging */}
          <div>
            <label className="form-label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-select mb-2"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>

            {/* UPI Quick Tag Buttons */}
            {paymentMethod === 'upi' && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-[#64748B]">UPI App:</span>
                {UPI_APPS.map((app) => (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => setUpiTag(app.name)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${upiTag === app.name
                      ? 'bg-[#4F46E5] text-[#FFFFFF] shadow-sm'
                      : 'bg-[#F8FAFC] text-[#0F172A] hover:bg-[#E2E8F0]'
                      }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Notes Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Note / Tag</label>
              <input
                type="text"
                placeholder="e.g. Swiggy lunch, Rent..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full btn-primary justify-center py-3 text-base shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-[#FFFFFF]" />
              <span>{editingTransaction ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};