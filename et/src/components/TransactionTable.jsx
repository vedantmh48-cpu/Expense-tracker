import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS, formatINR, formatDate } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Search, Filter, Edit2, Trash2, Calendar, FileSpreadsheet, PlusCircle } from 'lucide-react';

export const TransactionTable = () => {
  const {
    transactions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedPayment,
    setSelectedPayment,
    dateRange,
    setDateRange,
    openEditModal,
    deleteTransaction,
    setIsTransactionModalOpen,
  } = useExpense();

  // Filter Logic
  const filteredTransactions = transactions.filter((t) => {
    // 1. Search Query
    const searchLower = searchTerm.toLowerCase().trim();
    if (searchLower) {
      const catMeta = CATEGORIES.find((c) => c.id === t.category);
      const catName = catMeta ? catMeta.name.toLowerCase() : '';
      const noteLower = (t.note || '').toLowerCase();
      const upiLower = (t.upiTag || '').toLowerCase();
      const amountStr = (t.amount || '').toString();

      const matchesSearch =
        noteLower.includes(searchLower) ||
        catName.includes(searchLower) ||
        upiLower.includes(searchLower) ||
        amountStr.includes(searchLower);

      if (!matchesSearch) return false;
    }

    // 2. Type Filter
    if (selectedType !== 'all' && t.type !== selectedType) return false;

    // 3. Category Filter
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

    // 4. Payment Method Filter
    if (selectedPayment !== 'all' && t.paymentMethod !== selectedPayment) return false;

    // 5. Date Range Filter
    if (dateRange !== 'all' && t.date) {
      const txDate = new Date(t.date);
      const now = new Date();

      if (dateRange === 'this_month') {
        if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (dateRange === 'last_month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        if (txDate.getMonth() !== lastMonth.getMonth() || txDate.getFullYear() !== lastMonth.getFullYear()) {
          return false;
        }
      } else if (dateRange === 'last_30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (txDate < thirtyDaysAgo) return false;
      }
    }

    return true;
  });

  return (
    <div id="activity" className="glass-card p-5 mb-12 scroll-mt-24">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]/40">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#4F46E5]" />
            Transaction History & Activity Feed
          </h3>
          <p className="text-xs text-[#64748B]">
            Showing {filteredTransactions.length} of {transactions.length} total records
          </p>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search notes, amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-9 text-xs py-2"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select text-xs py-2 px-3 min-w-[110px]"
          >
            <option value="all">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select text-xs py-2 px-3 min-w-[130px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="form-select text-xs py-2 px-3 min-w-[120px]"
          >
            <option value="all">All Payments</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.id.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select text-xs py-2 px-3 min-w-[120px]"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_30">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          /* Zero State - No Transactions At All */
          <div className="zero-state">
            <div className="zero-state-icon">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h4 className="zero-state-title">Welcome! Start Tracking Your Finances</h4>
            <p className="zero-state-description">
              Looks like you haven't added any transactions yet. Add your first income or expense
              to see your analytics, insights, and financial overview come to life.
            </p>
            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="btn-primary text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add Your First Transaction
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          /* Empty State - Filters Return No Results */
          <div className="zero-state">
            <div className="zero-state-icon">
              <Filter className="w-8 h-8" />
            </div>
            <h4 className="zero-state-title">No Transactions Found</h4>
            <p className="zero-state-description">
              Try clearing or adjusting your search filters above to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedPayment('all');
                setDateRange('all');
              }}
              className="btn-secondary text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Note / Description</th>
                <th>Date</th>
                <th>Payment Mode</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => {
                const catMeta = CATEGORIES.find((c) => c.id === t.category) || {
                  id: t.category,
                  name: t.category,
                  iconId: 'other',
                  color: '#E2E8F0',
                };
                const pmMeta = PAYMENT_METHODS.find((pm) => pm.id === t.paymentMethod) || {
                  id: t.paymentMethod,
                  name: t.paymentMethod,
                  iconId: 'pm_credit',
                };
                const isIncome = t.type === 'income';

                return (
                  <tr key={t.id} className="table-row">
                    {/* Category */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                          style={{
                            backgroundColor: `${catMeta.color}15`,
                            borderColor: `${catMeta.color}35`,
                            color: catMeta.color,
                          }}
                        >
                          <CategoryIcon iconId={catMeta.iconId || t.category} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-[#0F172A]">{catMeta.name}</div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${isIncome ? 'badge-income' : 'badge-expense'
                              }`}
                          >
                            {t.type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Note / Description */}
                    <td>
                      <div className="text-xs text-[#0F172A] font-medium max-w-xs truncate">
                        {t.note || 'No note'}
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="flex items-center gap-1 text-xs text-[#64748B]">
                        <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>{formatDate(t.date)}</span>
                      </div>
                    </td>

                    {/* Payment Mode & UPI Tag */}
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-[#0F172A] font-medium">
                        <CategoryIcon iconId={pmMeta.iconId || 'pm_credit'} className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="capitalize">
                          {t.paymentMethod === 'upi' && t.upiTag ? t.upiTag : t.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="text-right">
                      <span
                        className={`text-sm font-extrabold tracking-tight ${isIncome ? 'text-[#10B981]' : 'text-[#F43F5E]'
                          }`}
                      >
                        {isIncome ? '+' : '-'} {formatINR(t.amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#4F46E5] hover:bg-[#F8FAFC] transition"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-4 h-4 text-[#4F46E5]" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this transaction record?')) {
                              deleteTransaction(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F43F5E] hover:bg-[#F8FAFC] transition"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4 text-[#F43F5E]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};