import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { User, Mail, Lock, KeyRound, Save, CheckCircle, FileText, Download, LogOut, PiggyBank, Tags, Palette, Database, Bell, Smartphone, ChevronRight, Upload, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, formatINR } from '../utils/formatters';

export const SettingsPage = () => {
  const { currentUser, updateProfile, changePassword, logout } = useAuth();
  const {
    transactions,
    monthlyBudget,
    setMonthlyBudget,
    resetAllData,
    importTransactions,
  } = useExpense();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(monthlyBudget || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('rupeeflow_theme') || 'dark');
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    emailUpdates: false,
  });
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('rupeeflow_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rupeeflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rupeeflow_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  const showMessage = (msg) => {
    setMessage(msg);
    setError('');
    setTimeout(() => setMessage(''), 3000);
  };

  const showError = (err) => {
    setError(err);
    setMessage('');
    setTimeout(() => setError(''), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return showError('Name cannot be empty.');
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: name.trim(), email: email.trim() });
      setSaving(false);
      showMessage('Profile updated successfully!');
    }, 500);
  };

  // Password validation conditions
  const passwordConditions = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const passedCount = Object.values(passwordConditions).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (passedCount === 0) return { label: 'Weak', color: 'var(--accent-danger)', width: '0%' };
    if (passedCount <= 2) return { label: 'Weak', color: 'var(--accent-danger)', width: '25%' };
    if (passedCount <= 3) return { label: 'Fair', color: 'var(--accent-warning)', width: '50%' };
    if (passedCount <= 4) return { label: 'Good', color: 'var(--accent-primary)', width: '75%' };
    return { label: 'Strong', color: 'var(--accent-success)', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return showError('New password must be at least 8 characters.');
    if (!passwordConditions.uppercase) return showError('Password must contain at least one uppercase letter.');
    if (!passwordConditions.lowercase) return showError('Password must contain at least one lowercase letter.');
    if (!passwordConditions.number) return showError('Password must contain at least one number.');
    if (!passwordConditions.special) return showError('Password must contain at least one special character (!@#$%^&* etc).');
    if (newPassword !== confirmNewPassword) return showError('New passwords do not match.');
    const result = changePassword(oldPassword, newPassword);
    if (!result.success) return showError(result.error);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showMessage('Password changed successfully!');
  };

  const handleBudgetSave = (e) => {
    e.preventDefault();
    const amount = Number(budgetAmount);
    if (isNaN(amount) || amount < 0) return showError('Please enter a valid budget amount.');
    setMonthlyBudget(amount);
    showMessage('Monthly budget updated successfully!');
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showMessage('Notification settings updated.');
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const cat = {
      id: `custom-${Date.now()}`,
      name: newCategory.trim(),
      type: newCategoryType,
      icon: 'tag',
      color: '#4F46E5',
    };
    setCustomCategories(prev => [...prev, cat]);
    setNewCategory('');
    showMessage('Category added successfully!');
  };

  const removeCategory = (id) => {
    setCustomCategories(prev => prev.filter(c => c.id !== id));
    showMessage('Category removed.');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RupeeFlow - Payment History', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`User: ${currentUser.name}`, 14, 28);
    doc.text(`Email: ${currentUser.email}`, 14, 34);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 40);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

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

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction History', 14, 95);

    const tableData = transactions.map(t => {
      const catMeta = CATEGORIES.find(c => c.id === t.category) || { name: t.category };
      const pmMeta = PAYMENT_METHODS.find(pm => pm.id === t.paymentMethod) || { name: t.paymentMethod };
      return [
        new Date(t.date).toLocaleDateString('en-IN'),
        t.type === 'income' ? 'Income' : 'Expense',
        catMeta.name,
        t.note || '-',
        pmMeta.name,
        `₹${Number(t.amount).toLocaleString('en-IN')}`,
      ];
    });

    autoTable(doc, {
      startY: 100,
      head: [['Date', 'Type', 'Category', 'Note', 'Payment', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`RupeeFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportJSON = () => {
    const data = {
      transactions,
      monthlyBudget,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RupeeFlow_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Data exported successfully!');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data.transactions)) {
          importTransactions(data.transactions);
          if (data.monthlyBudget) setMonthlyBudget(Number(data.monthlyBudget));
          showMessage('Data imported successfully!');
        } else {
          showError('Invalid file format.');
        }
      } catch (err) {
        showError('Failed to parse file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) {
      resetAllData();
      showMessage('All data has been reset.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: KeyRound },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'export', label: 'Data & Export', icon: Database },
  ];

  return (
    <div className="page-container settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {message && (
        <div className="alert-message success">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}
      {error && (
        <div className="alert-message error">{error}</div>
      )}

      <div className="settings-layout">
        {/* Settings Navigation */}
        <aside className="settings-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            );
          })}
        </aside>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="settings-form">
              <h3 className="settings-section-title">Profile Information</h3>
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {(currentUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="profile-name">{currentUser?.name}</div>
                  <div className="profile-email">{currentUser?.email}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User className="w-4 h-4" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="w-4 h-4" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="account-info-grid">
                <div className="account-info-item">
                  <span>Member Since</span>
                  <strong>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</strong>
                </div>
                <div className="account-info-item">
                  <span>Transactions</span>
                  <strong>{transactions.length}</strong>
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary settings-submit">
                {saving ? <span className="spinner" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </form>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="settings-form">
              <h3 className="settings-section-title">Change Password</h3>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="input-with-icon">
                  <Lock className="w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter current password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock className="w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="form-input"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                {newPassword && (
                  <div className="password-strength-container">
                    <div className="password-strength-bar">
                      <div
                        className="password-strength-fill"
                        style={{ width: strength.width, backgroundColor: strength.color }}
                      />
                    </div>
                    <div className="password-strength-label" style={{ color: strength.color }}>
                      {strength.label} Password
                    </div>
                    <div className="password-conditions">
                      <div className={`password-condition ${passwordConditions.length ? 'met' : ''}`}>
                        {passwordConditions.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>8+ characters</span>
                      </div>
                      <div className={`password-condition ${passwordConditions.uppercase ? 'met' : ''}`}>
                        {passwordConditions.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Uppercase (A-Z)</span>
                      </div>
                      <div className={`password-condition ${passwordConditions.lowercase ? 'met' : ''}`}>
                        {passwordConditions.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Lowercase (a-z)</span>
                      </div>
                      <div className={`password-condition ${passwordConditions.number ? 'met' : ''}`}>
                        {passwordConditions.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className={`password-condition ${passwordConditions.special ? 'met' : ''}`}>
                        {passwordConditions.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock className="w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="form-input"
                    placeholder="Re-enter new password"
                  />
                  {confirmNewPassword && (
                    <span className={`password-match-indicator ${newPassword === confirmNewPassword ? 'match' : 'no-match'}`}>
                      {newPassword === confirmNewPassword ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </span>
                  )}
                </div>
              </div>
              <button type="submit" className="btn-primary settings-submit">
                <KeyRound className="w-4 h-4" />
                Change Password
              </button>
            </form>
          )}

          {/* Budget */}
          {activeTab === 'budget' && (
            <form onSubmit={handleBudgetSave} className="settings-form">
              <h3 className="settings-section-title">Monthly Budget</h3>
              <p className="settings-description">
                Set a monthly budget to track your spending and get alerts when you're close to your limit.
              </p>
              <div className="current-budget-display">
                <div className="budget-display-icon">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <span className="budget-display-label">Current Monthly Budget</span>
                  <span className="budget-display-value">
                    {monthlyBudget ? `₹${monthlyBudget.toLocaleString('en-IN')}` : 'Not set'}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Set Budget Amount</label>
                <div className="input-with-icon">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={e => setBudgetAmount(e.target.value)}
                    className="form-input"
                    placeholder="Enter monthly budget"
                    min="0"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary settings-submit">
                <Save className="w-4 h-4" />
                Save Budget
              </button>
            </form>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="settings-form">
              <h3 className="settings-section-title">Custom Categories</h3>
              <p className="settings-description">
                Add your own categories to better organize your transactions.
              </p>
              <div className="add-category-form">
                <select value={newCategoryType} onChange={e => setNewCategoryType(e.target.value)} className="form-select category-type-select">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="form-input"
                />
                <button onClick={addCategory} className="btn-primary">
                  <Tags className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="custom-categories-list">
                {customCategories.length === 0 ? (
                  <div className="empty-categories">
                    <Tags className="w-8 h-8" />
                    <p>No custom categories yet. Add your first one above!</p>
                  </div>
                ) : (
                  customCategories.map(cat => (
                    <div key={cat.id} className="custom-category-item">
                      <div className="category-icon" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                        <Tags className="w-4 h-4" />
                      </div>
                      <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-type">{cat.type}</span>
                      </div>
                      <button onClick={() => removeCategory(cat.id)} className="category-delete-btn">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="settings-form">
              <h3 className="settings-section-title">Appearance</h3>
              <p className="settings-description">Customize how RupeeFlow looks.</p>
              <div className="appearance-options">
                <div className="appearance-option">
                  <div className="appearance-option-icon">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="appearance-option-info">
                    <span className="appearance-option-label">Theme</span>
                    <span className="appearance-option-desc">Choose between dark and light mode</span>
                  </div>
                  <div className="theme-toggle">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    >
                      Light
                    </button>
                  </div>
                </div>
                <div className="appearance-option">
                  <div className="appearance-option-icon">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="appearance-option-info">
                    <span className="appearance-option-label">Currency</span>
                    <span className="appearance-option-desc">Display currency format</span>
                  </div>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="filter-select">
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-form">
              <h3 className="settings-section-title">Notifications</h3>
              <p className="settings-description">Choose what notifications you want to receive.</p>
              <div className="notification-settings">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="notification-setting-item">
                    <div className="notification-setting-info">
                      <span className="notification-setting-label">
                        {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                      <span className="notification-setting-desc">
                        {key === 'budgetAlerts' ? 'Get alerts when you approach your budget limit'
                          : key === 'weeklyReports' ? 'Receive a weekly summary of your spending'
                          : key === 'monthlyReports' ? 'Receive a monthly financial report'
                          : 'Get important updates about your account'}
                      </span>
                    </div>
                    <div
                      className={`toggle-switch ${value ? 'on' : ''}`}
                      onClick={() => toggleNotification(key)}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data & Export */}
          {activeTab === 'export' && (
            <div className="settings-form">
              <h3 className="settings-section-title">Data Management</h3>
              <p className="settings-description">
                Export your data as PDF or JSON, or import previously exported data.
              </p>
              <div className="data-action-grid">
                <div className="data-action-card">
                  <div className="data-action-icon pdf">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="data-action-label">PDF Report</span>
                    <span className="data-action-desc">Download a detailed financial report</span>
                  </div>
                  <button onClick={handleDownloadPDF} className="data-action-btn">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
                <div className="data-action-card">
                  <div className="data-action-icon json">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="data-action-label">JSON Export</span>
                    <span className="data-action-desc">Backup all your data as JSON</span>
                  </div>
                  <button onClick={handleExportJSON} className="data-action-btn">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
                <div className="data-action-card">
                  <div className="data-action-icon import">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="data-action-label">Import Data</span>
                    <span className="data-action-desc">Import data from a JSON file</span>
                  </div>
                  <label className="data-action-btn">
                    <Upload className="w-4 h-4" /> Import
                    <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div className="data-stat-summary">
                <div className="data-stat">
                  <span className="data-stat-label">Total Transactions</span>
                  <span className="data-stat-value">{transactions.length}</span>
                </div>
                <div className="data-stat">
                  <span className="data-stat-label">Total Income</span>
                  <span className="data-stat-value positive">
                    ₹{transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="data-stat">
                  <span className="data-stat-label">Total Expenses</span>
                  <span className="data-stat-value negative">
                    ₹{transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p>Delete all your transactions and start fresh. This action cannot be undone.</p>
                <button onClick={handleResetData} className="danger-btn">
                  <Trash2 className="w-4 h-4" /> Reset All Data
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="settings-logout">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) logout();
              }}
              className="logout-btn"
            >
              <LogOut className="w-4 h-4" /> Logout from Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};