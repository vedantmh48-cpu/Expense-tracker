import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { X, User, Mail, Lock, Save, CheckCircle, FileText, Download, LogOut, KeyRound } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CATEGORIES, PAYMENT_METHODS, formatINR, formatDate } from '../utils/formatters';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const { transactions, monthlyBudget } = useExpense();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleProfileSave = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: name.trim(), email: email.trim() });
      setSaving(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError('Password must contain at least one lowercase letter.');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('Password must contain at least one special character (!@#$%^&* etc).');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    const result = changePassword(oldPassword, newPassword);
    if (!result.success) {
      setError(result.error);
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setMessage('Password changed successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('₹upeeFlow - Payment History', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`User: ${currentUser.name}`, 14, 28);
    doc.text(`Email: ${currentUser.email}`, 14, 34);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 40);

    // Summary
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Summary', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total Income: ${formatINR(totalIncome)}`, 14, 63);
    doc.text(`Total Expenses: ${formatINR(totalExpense)}`, 14, 69);
    doc.text(`Net Balance: ${formatINR(totalIncome - totalExpense)}`, 14, 75);
    doc.text(`Monthly Budget: ${monthlyBudget ? formatINR(monthlyBudget) : 'Not Set'}`, 14, 81);
    doc.text(`Total Transactions: ${transactions.length}`, 14, 87);

    // Transactions Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction History', 14, 100);

    const tableData = transactions.map((t) => {
      const catMeta = CATEGORIES.find((c) => c.id === t.category) || { name: t.category };
      const pmMeta = PAYMENT_METHODS.find((pm) => pm.id === t.paymentMethod) || { name: t.paymentMethod };
      return [
        formatDate(t.date),
        t.type === 'income' ? 'Income' : 'Expense',
        catMeta.name,
        t.note || '-',
        pmMeta.name,
        t.upiTag || '-',
        `₹${Number(t.amount).toLocaleString('en-IN')}`,
      ];
    });

    autoTable(doc, {
      startY: 105,
      head: [['Date', 'Type', 'Category', 'Note', 'Payment', 'UPI Tag', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `₹upeeFlow - Generated on ${new Date().toLocaleString('en-IN')} - Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`RupeeFlow_Payment_History_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card p-6 border-[#E2E8F0] shadow-2xl relative max-w-2xl bg-[#FFFFFF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]/30">
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
              <User className="w-5 h-5" />
            </span>
            Account Settings
          </h3>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]/40 mb-5 text-xs">
          <button
            onClick={() => { setActiveTab('profile'); setError(''); setMessage(''); }}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${activeTab === 'profile'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/30'
              }`}
          >
            <User className="w-3.5 h-3.5" /> Profile
          </button>
          <button
            onClick={() => { setActiveTab('password'); setError(''); setMessage(''); }}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${activeTab === 'password'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/30'
              }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Password
          </button>
          <button
            onClick={() => { setActiveTab('export'); setError(''); setMessage(''); }}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${activeTab === 'export'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'text-[#0F172A] hover:bg-[#E2E8F0]/30'
              }`}
          >
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0]/40">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">Account Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#64748B]">Member Since:</span>
                  <span className="font-semibold text-[#0F172A] ml-1">
                    {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B]">Transactions:</span>
                  <span className="font-semibold text-[#0F172A] ml-1">{transactions.length}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary justify-center py-2.5 text-sm disabled:opacity-50"
            >
              {saving ? <span className="spinner" /> : <Save className="w-4 h-4 text-[#FFFFFF]" />}
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="form-label">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="form-input pl-10 text-sm"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <label className="form-label">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input pl-10 text-sm"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="form-input pl-10 text-sm"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary justify-center py-2.5 text-sm"
            >
              <KeyRound className="w-4 h-4 text-[#FFFFFF]" />
              <span>Change Password</span>
            </button>
          </form>
        )}

        {/* Export PDF Tab */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC]/60 border border-[#E2E8F0]/40">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#4F46E5]" /> Download Payment History
              </h4>
              <p className="text-xs text-[#64748B] mb-4">
                Download a complete PDF report of all your transactions including financial summary,
                income/expense breakdown, and detailed transaction history.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]/40">
                  <div className="text-lg font-extrabold text-[#10B981]">
                    {transactions.filter((t) => t.type === 'income').length}
                  </div>
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Income</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]/40">
                  <div className="text-lg font-extrabold text-[#F43F5E]">
                    {transactions.filter((t) => t.type === 'expense').length}
                  </div>
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Expenses</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]/40">
                  <div className="text-lg font-extrabold text-[#0F172A]">{transactions.length}</div>
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Total</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]/40">
                  <div className="text-lg font-extrabold text-[#F59E0B]">
                    {monthlyBudget ? formatINR(monthlyBudget) : '—'}
                  </div>
                  <div className="text-[10px] text-[#64748B] font-semibold uppercase">Budget</div>
                </div>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full btn-primary justify-center py-3 text-sm"
              >
                <Download className="w-4 h-4 text-[#FFFFFF]" />
                <span>Download PDF Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="pt-4 mt-4 border-t border-[#E2E8F0]/40">
          <button
            onClick={handleLogout}
            className="w-full text-xs text-rose-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};