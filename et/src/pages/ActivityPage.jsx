import React, { useMemo, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { TransactionTable } from '../components/TransactionTable';
import { Search, ArrowUpDown, ListFilter } from 'lucide-react';

export const ActivityPage = () => {
  const {
    transactions,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedType,
    setSelectedType,
    selectedPayment,
    dateRange,
    setDateRange,
  } = useExpense();

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        (t.note || '').toLowerCase().includes(term) ||
        (t.category || '').toLowerCase().includes(term) ||
        (t.paymentMethod || '').toLowerCase().includes(term) ||
        (t.upiTag || '').toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter(t => t.type === selectedType);
    }

    // Payment method filter
    if (selectedPayment !== 'all') {
      result = result.filter(t => t.paymentMethod === selectedPayment);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let startDate;
      if (dateRange === 'today') {
        startDate = today;
      } else if (dateRange === 'this_week') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (dateRange === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRange === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      } else if (dateRange === 'last_30_days') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
      }
      if (startDate) {
        result = result.filter(t => new Date(t.date) >= startDate);
      }
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'amount') {
        return sortOrder === 'asc'
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
      return 0;
    });

    return result;
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedPayment, dateRange, sortBy, sortOrder]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity</h1>
          <p className="page-subtitle">Every transaction, beautifully organized</p>
        </div>
        <div className="page-header-stats">
          <div className="stat-chip">
            <ListFilter className="w-3.5 h-3.5" />
            <span>{filteredTransactions.length} results</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-search">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="filter-select">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="filter-select">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="this_week">Last 7 Days</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="last_30_days">Last 30 Days</option>
        </select>

        <button
          className="filter-sort-btn"
          onClick={() => {
            if (sortBy !== 'date') { setSortBy('date'); setSortOrder('desc'); }
            else setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
        </button>
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
};