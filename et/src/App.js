import React, { useState, useEffect } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { SmartInsights } from './components/SmartInsights';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionTable } from './components/TransactionTable';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { ExportImportModal } from './components/ExportImportModal';
import { AuthPage } from './components/AuthPage';
import { SettingsModal } from './components/SettingsModal';
import { HowToUse } from './components/HowToUse';
import { BarChart3, Activity, PieChart, MessageSquare, BookOpen, LayoutDashboard, Table, HelpCircle } from 'lucide-react';

// ScrollReveal component for fade-in animations
const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!currentUser) {
    return <AuthPage />;
  }

  const sections = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: BarChart3,
      description: 'Your financial snapshot at a glance',
      component: (
        <>
          <SummaryCards />
          <SmartInsights />
        </>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      description: 'Deep dive into your spending patterns',
      component: <AnalyticsCharts />,
    },
    {
      id: 'activity',
      label: 'Activity Feed',
      icon: Activity,
      description: 'Every transaction, beautifully organized',
      component: <TransactionTable />,
    },
    {
      id: 'how-to-use',
      label: 'How to Use',
      icon: BookOpen,
      description: 'Step-by-step guide to get started',
      component: <HowToUse />,
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: MessageSquare,
      description: 'We\'d love to hear from you',
      component: <ContactSection />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4F46E5] selection:text-[#FFFFFF]">
      {/* Dynamic Island Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Hero Section */}
      <Header />

      {/* Main Content */}
      <main>
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            {/* Section Divider */}
            {index > 0 && <div className="section-divider" />}

            <section id={section.id} className="section-container">
              <ScrollReveal>
                <div className="section-header">
                  <div className="section-label">
                    <section.icon className="w-3.5 h-3.5" />
                    <span>{section.label}</span>
                  </div>
                  <h2 className="section-title">
                    {section.label === 'Overview' ? 'Dashboard Overview' : section.label}
                  </h2>
                  <p className="section-description">{section.description}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                {section.component}
              </ScrollReveal>
            </section>
          </React.Fragment>
        ))}
      </main>

      {/* Modals */}
      <TransactionModal />
      <BudgetModal />
      <ExportImportModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav md:hidden">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'analytics', label: 'Analytics', icon: PieChart },
          { id: 'activity', label: 'Activity', icon: Table },
          { id: 'how-to-use', label: 'Guide', icon: HelpCircle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={isActive ? 'active' : ''}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;