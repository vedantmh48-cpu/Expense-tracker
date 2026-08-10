import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Download, LogOut, User, ChevronDown, Menu, LayoutDashboard, PieChart, ListTodo, Settings, HelpCircle, MessageSquare, Bell, Search, Moon, Sun, Wallet, X, AlertTriangle, TrendingUp, TrendingDown, PiggyBank, CheckCircle } from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const { setIsTransactionModalOpen, setIsExportModalOpen, transactions, monthlyBudget } = useExpense();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('rupeeflow_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rupeeflow_theme', theme);
  }, [theme]);

  // Generate notifications based on data
  const notifications = [];
  
  // Budget alert
  if (monthlyBudget) {
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const thisMonthExpenses = transactions
      .filter(t => t.type === 'expense' && (t.date || '').startsWith(currentMonthStr))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const budgetPercent = (thisMonthExpenses / monthlyBudget) * 100;
    
    if (budgetPercent >= 100) {
      notifications.push({
        id: 'budget-over',
        type: 'danger',
        icon: AlertTriangle,
        title: 'Budget Exceeded!',
        message: `You've spent ₹${thisMonthExpenses.toLocaleString('en-IN')} of your ₹${monthlyBudget.toLocaleString('en-IN')} budget.`,
        time: 'Now'
      });
    } else if (budgetPercent >= 80) {
      notifications.push({
        id: 'budget-near',
        type: 'warning',
        icon: PiggyBank,
        title: 'Budget Alert',
        message: `You've used ${Math.round(budgetPercent)}% of your monthly budget.`,
        time: 'Now'
      });
    }
  }

  // Recent large transactions
  const largeTx = transactions.find(t => Number(t.amount) > 10000);
  if (largeTx) {
    notifications.push({
      id: 'large-tx',
      type: 'info',
      icon: largeTx.type === 'income' ? TrendingUp : TrendingDown,
      title: `${largeTx.type === 'income' ? 'Large Income' : 'Large Expense'}`,
      message: `${largeTx.category || 'Transaction'} of ₹${Number(largeTx.amount).toLocaleString('en-IN')} recorded.`,
      time: 'Recent'
    });
  }

  // Welcome notification
  notifications.push({
    id: 'welcome',
    type: 'success',
    icon: CheckCircle,
    title: 'Welcome to RupeeFlow!',
    message: 'Track your expenses and grow your savings.',
    time: 'Today'
  });

  const unreadCount = notifications.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, path: '/analytics' },
    { id: 'activity', label: 'Activity', icon: ListTodo, path: '/activity' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    { id: 'how-to-use', label: 'Guide', icon: HelpCircle, path: '/how-to-use' },
    { id: 'contact', label: 'Contact', icon: MessageSquare, path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      {/* Sidebar Overlay (Mobile) */}
      {mobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="logo-text">
            <span className="logo-name">RupeeFlow</span>
            <span className="logo-badge">PRO</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setMobileSidebarOpen(false);
                }}
                className={`sidebar-nav-item ${active ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="sidebar-nav-label">{item.label}</span>
                {active && <span className="sidebar-nav-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="sidebar-actions">
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="sidebar-add-btn"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="sidebar-export-btn"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* User Section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {(currentUser?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{currentUser?.name || 'User'}</div>
            <div className="user-email">{currentUser?.email || ''}</div>
          </div>
          <div className="user-menu relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="user-menu-btn"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}>
                  <User className="w-4 h-4" /> Settings
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                    setUserMenuOpen(false);
                  }}
                  className="danger"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Header */}
        <header className="app-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="header-search">
              <Search className="w-4 h-4 search-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="search-input"
                onFocus={() => navigate('/activity')}
              />
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="header-icon-btn"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Notifications */}
            <div className="notifications-container">
              <button
                className="header-icon-btn"
                title="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              
              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button onClick={() => setNotificationsOpen(false)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div key={notif.id} className={`notification-item ${notif.type}`}>
                          <div className={`notification-icon ${notif.type}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notif.title}</div>
                            <div className="notification-message">{notif.message}</div>
                            <div className="notification-time">{notif.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsTransactionModalOpen(true)}
              className="header-add-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="header-add-text">Add</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={active ? 'active' : ''}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};