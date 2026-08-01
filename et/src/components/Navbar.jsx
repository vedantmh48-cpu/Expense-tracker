import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Download, LayoutDashboard, PieChart, Table, Mail, LogOut, User, ChevronDown, BookOpen, Menu, X } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    setIsTransactionModalOpen,
    setIsExportModalOpen,
  } = useExpense();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 24);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (!e.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);
    handleScroll();

    // Close menus on scroll
    window.addEventListener('scroll', () => {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    }, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'activity', label: 'Activity Feed', icon: Table },
    { id: 'how-to-use', label: 'How to Use', icon: BookOpen },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setUserMenuOpen(false);
    }
  };

  return (
    <header className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <div className={`navbar-inner ${scrolled ? 'navbar-scrolled' : 'navbar-default'}`}>
        {/* Logo */}
        <a
          className="navbar-logo flex items-center gap-2.5 cursor-pointer"
          onClick={() => handleNavClick('dashboard')}
          href="#dashboard"
        >
          <div className="navbar-logo-icon rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-[#FFFFFF] text-base font-extrabold shadow-md shadow-[#4F46E5]/20">
            ₹
          </div>
          <div className="flex items-center gap-2">
            <span className="logo-text text-lg font-extrabold tracking-tight text-[#0F172A]">
              ₹upeeFlow
            </span>
            {!scrolled && (
              <span className="hidden sm:inline-flex logo-badge text-[10px] px-1.5 py-0.5 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] font-semibold tracking-wide">
                PRO
              </span>
            )}
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link px-3.5 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-2 transition-all duration-200 ${isActive
                  ? 'bg-[#0F172A]/[0.04] text-[#0F172A] font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#0F172A]/[0.03]'
                  }`}
              >
                <Icon className="nav-link-icon w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="hidden sm:inline-flex btn-primary py-2 px-3.5 text-xs items-center gap-1.5 rounded-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="btn-text">Add Expense</span>
          </button>

          {/* Mobile Add button */}
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="sm:hidden p-2 text-[#4F46E5] hover:bg-[#4F46E5]/10 rounded-lg transition-all"
            title="Add Expense"
            aria-label="Add Expense"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            title="Export & Backup"
            aria-label="Export & Backup"
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#0F172A]/5 rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#0F172A]/5 transition-all"
              title="Account"
              aria-label="Account menu"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] text-[#FFFFFF] flex items-center justify-center text-[11px] font-bold shadow-sm shadow-[#4F46E5]/20">
                {(currentUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-[#E2E8F0] shadow-xl shadow-[#0F172A]/5 p-1.5 z-50">
                <div className="px-3 py-2.5 border-b border-[#E2E8F0] mb-1">
                  <div className="text-[13px] font-semibold text-[#0F172A] truncate">
                    {currentUser?.name}
                  </div>
                  <div className="text-xs text-[#64748B] truncate mt-0.5">
                    {currentUser?.email}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#334155] hover:bg-[#F8FAFC] transition"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-rose-500 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#0F172A]/5 rounded-lg transition-all"
            title="Menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`mobile-menu-container lg:hidden fixed left-4 right-4 top-[72px] z-50 transform transition-all duration-300 ${mobileMenuOpen
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-3 scale-95 pointer-events-none'
          }`}
      >
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl shadow-[#0F172A]/10 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};