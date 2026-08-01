// Format Indian Currency according to Indian numbering standards (Lakhs, Crores)
export const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Format date into human readable Indian standard (e.g., 14 Oct 2024)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Categories metadata with individual category colors
export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', iconId: 'food', color: '#8D818C', type: 'expense' },
  { id: 'rent', name: 'Rent & Housing', iconId: 'rent', color: '#B4B8C5', type: 'expense' },
  { id: 'upi', name: 'UPI & Transfers', iconId: 'upi', color: '#A5A299', type: 'expense' },
  { id: 'shopping', name: 'Shopping & Apparel', iconId: 'shopping', color: '#8D818C', type: 'expense' },
  { id: 'investment', name: 'Investments & SIP', iconId: 'investment', color: '#10B981', type: 'expense' },
  { id: 'bills', name: 'Bills & Utilities', iconId: 'bills', color: '#A5A299', type: 'expense' },
  { id: 'travel', name: 'Travel & Transport', iconId: 'travel', color: '#6D626C', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment & OTT', iconId: 'entertainment', color: '#B4B8C5', type: 'expense' },
  { id: 'health', name: 'Health & Medical', iconId: 'health', color: '#EF4444', type: 'expense' },
  { id: 'salary', name: 'Salary & Income', iconId: 'salary', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance & Business', iconId: 'freelance', color: '#8D818C', type: 'income' },
  { id: 'cashback', name: 'Refund & Cashback', iconId: 'cashback', color: '#B4B8C5', type: 'income' },
  { id: 'other', name: 'Other', iconId: 'other', color: '#A5A299', type: 'expense' },
];

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', iconId: 'pm_upi' },
  { id: 'credit', name: 'Credit Card', iconId: 'pm_credit' },
  { id: 'debit', name: 'Debit Card', iconId: 'pm_debit' },
  { id: 'netbanking', name: 'Net Banking', iconId: 'pm_netbanking' },
  { id: 'cash', name: 'Cash', iconId: 'pm_cash' },
];

export const UPI_APPS = [
  { name: 'GPay', color: '#8D818C' },
  { name: 'PhonePe', color: '#6D626C' },
  { name: 'Paytm', color: '#B4B8C5' },
  { name: 'CRED UPI', color: '#8D818C' },
  { name: 'BHIM', color: '#A5A299' },
];

// CSV Export Helper
export const exportToCSV = (transactions) => {
  const headers = ['ID', 'Date', 'Type', 'Amount (INR)', 'Category', 'Payment Method', 'UPI Tag', 'Notes'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    t.amount,
    t.category,
    t.paymentMethod,
    t.upiTag || 'N/A',
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RupeeFlow_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
