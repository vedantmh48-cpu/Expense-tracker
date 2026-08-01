import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

const STORAGE_KEY_TX = 'rupeeflow_transactions_v1';
const STORAGE_KEY_BUDGET = 'rupeeflow_budget_v1';

export const ExpenseProvider = ({ children }) => {
  // Initialize state from LocalStorage or empty array
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TX);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions:', e);
      }
    }
    return [];
  });

  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGET);
    // Start with a clean slate — user sets their own budget via the Budget modal
    return saved ? Number(saved) : null;
  });

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // all, this_month, last_month, last_30

  // Modal Visibility States
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget?.toString() || '');
  }, [monthlyBudget]);

  // CRUD Operations
  const addTransaction = (newTx) => {
    const txWithId = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      amount: Number(newTx.amount),
    };
    setTransactions((prev) => [txWithId, ...prev]);
  };

  const updateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? { ...updatedTx, amount: Number(updatedTx.amount) } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAllData = () => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY_TX);
  };

  const importTransactions = (importedTxList) => {
    if (Array.isArray(importedTxList)) {
      setTransactions(importedTxList);
    }
  };

  // Helper for opening edit modal
  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        monthlyBudget,
        setMonthlyBudget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        resetAllData,
        importTransactions,
        // Filter states
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
        // Modals
        isTransactionModalOpen,
        setIsTransactionModalOpen,
        editingTransaction,
        openEditModal,
        closeTransactionModal,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => useContext(ExpenseContext);