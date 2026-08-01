import React, { useState } from 'react';
import { UserPlus, LogIn, PlusCircle, Wallet, PieChart, FileText, Settings, CheckCircle, ArrowRight, ArrowLeft, Keyboard } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Account',
    shortTitle: 'Register',
    description: 'Register with your name, email, and a secure password. Your data stays 100% private in your browser because everything is stored locally.',
    color: '#4F46E5',
    bg: 'rgba(79, 70, 229, 0.1)',
    tip: 'Use any valid email — no verification needed. Your data never leaves your device.',
    action: 'Register on the login page',
  },
  {
    icon: LogIn,
    title: 'Login to Dashboard',
    shortTitle: 'Login',
    description: 'Sign in with your credentials to access your personalized expense tracking dashboard with all your financial data at a glance.',
    color: '#0F172A',
    bg: 'rgba(15, 23, 42, 0.08)',
    tip: 'Your session persists via localStorage — you stay logged in across browser refreshes.',
    action: 'Click "Login to Dashboard"',
  },
  {
    icon: PlusCircle,
    title: 'Add Your Transactions',
    shortTitle: 'Add Entry',
    description: 'Click "Add Expense" to record income or expenses. Enter the amount, pick a category, choose your payment method (UPI, card, cash), and add a note.',
    color: '#F43F5E',
    bg: 'rgba(244, 63, 94, 0.1)',
    tip: 'Use quick-preset buttons (+₹100, +₹500) to rapidly log frequent small expenses.',
    action: 'Tap "Add Expense" in navbar',
  },
  {
    icon: Wallet,
    title: 'Set Your Monthly Budget',
    shortTitle: 'Budget',
    description: 'Click the budget icon to set a monthly spending limit. The progress bar turns amber at 80% and red if exceeded, keeping you aware in real-time.',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    tip: 'Start with ₹30k–₹50k for realistic monthly tracking. You can change it anytime.',
    action: 'Open Budget via navbar icon',
  },
  {
    icon: PieChart,
    title: 'Analyze Your Spending',
    shortTitle: 'Analytics',
    description: 'Explore interactive charts to understand your spending patterns — timeline trends, category donuts, monthly bars, and payment method breakdowns.',
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.1)',
    tip: 'Hover over any chart segment for exact amounts. Switch between 4 visualization modes.',
    action: 'Navigate to Analytics section',
  },
  {
    icon: FileText,
    title: 'Download PDF Reports',
    shortTitle: 'Export PDF',
    description: 'Go to Settings → Export PDF to download a complete payment history report with a financial summary, income/expense breakdown, and detailed transaction table.',
    color: '#4F46E5',
    bg: 'rgba(79, 70, 229, 0.1)',
    tip: 'Back up your data regularly using JSON export or CSV export for spreadsheet analysis.',
    action: 'Settings → Export PDF',
  },
  {
    icon: Settings,
    title: 'Manage Your Profile',
    shortTitle: 'Settings',
    description: 'Update your name, email, or password anytime from the Settings page. Your data is always under your control — no servers involved.',
    color: '#0F172A',
    bg: 'rgba(15, 23, 42, 0.08)',
    tip: 'Change your password or download your full payment history as a professional PDF report.',
    action: 'Avatar menu → Account Settings',
  },
];

export const HowToUse = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const currentStep = steps[activeStep];
  const Icon = currentStep.icon;

  const goToStep = (index) => {
    setActiveStep(index);
  };

  const handleNext = () => {
    setCompleted((prev) => new Set(prev).add(activeStep));
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(new Set());
  };

  const handleSkipAll = () => {
    setCompleted(new Set(steps.map((_, i) => i)));
    setActiveStep(steps.length - 1);
  };

  const progress = Math.round((completed.size / steps.length) * 100);
  const isLastStep = activeStep === steps.length - 1;
  const isStepCompleted = completed.has(activeStep);

  return (
    <div id="how-to-use" className="mb-12 scroll-mt-24">
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 text-xs font-bold mb-3">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            How to Use ₹upeeFlow
          </h2>
          <p className="text-[#64748B] text-sm max-w-lg mx-auto">
            Click through the guided walkthrough to master every feature step-by-step
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <span className="font-semibold">
              Progress: {completed.size}/{steps.length} steps completed
            </span>
            <span className="font-bold text-[#4F46E5]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Interactive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Step Navigator (clickable list) */}
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === activeStep;
                const isDone = completed.has(index);

                return (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${isActive
                      ? 'bg-[#4F46E5]/5 border-[#4F46E5]/30 shadow-sm'
                      : 'bg-white border-[#E2E8F0]/60 hover:border-[#4F46E5]/20 hover:bg-[#F8FAFC]'
                      }`}
                  >
                    {/* Step number / check icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold transition-all ${isDone
                        ? 'bg-[#10B981] text-white'
                        : isActive
                          ? 'bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/30'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${isActive ? 'text-[#4F46E5]' : 'text-[#0F172A]'}`}>
                        {step.shortTitle}
                      </div>
                      <div className="text-xs text-[#64748B] truncate">{step.title}</div>
                    </div>

                    <StepIcon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#CBD5E1]'}`}
                      style={{ color: isActive ? step.color : undefined }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Step Content */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 md:p-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <div className="flex items-center gap-2">
                  {isStepCompleted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] font-bold">
                    {activeStep + 1}/{steps.length}
                  </span>
                </div>
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: currentStep.bg, color: currentStep.color }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{currentStep.title}</h3>
                  <p className="text-xs text-[#64748B] font-medium">{currentStep.action}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#334155] leading-relaxed mb-6">
                {currentStep.description}
              </p>

              {/* Tip box */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  Pro Tip
                </div>
                <p className="text-sm text-[#334155] leading-relaxed">
                  {currentStep.tip}
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="btn-secondary px-4 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={handleSkipAll}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#4F46E5] px-2 py-2 transition"
                    >
                      Skip All
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-[#64748B] hover:text-[#4F46E5] px-2 py-2 transition"
                    >
                      Restart
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className={`btn-primary px-5 py-2.5 text-sm ${isLastStep && !isStepCompleted ? 'bg-[#10B981] hover:bg-[#10B981]/90 shadow-[#10B981]/20' : ''}`}
                  >
                    {isLastStep && !isStepCompleted ? (
                      <>Mark Complete <CheckCircle className="w-4 h-4" /></>
                    ) : isLastStep ? (
                      <>Finish <CheckCircle className="w-4 h-4" /></>
                    ) : (
                      <>Next <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Dot indicators for mobile */}
            <div className="flex justify-center gap-1.5 mt-5 lg:hidden">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${index === activeStep
                    ? 'bg-[#4F46E5] w-6'
                    : completed.has(index)
                      ? 'bg-[#10B981]'
                      : 'bg-[#CBD5E1]'
                    }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips Matrix */}
        <div className="mt-8 p-5 rounded-2xl bg-[#F8FAFC]/60 border border-[#E2E8F0]/40">
          <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            Quick Reference
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#64748B]">
            <div className="flex items-start gap-2">
              <span className="text-[#4F46E5] font-bold">•</span>
              <span>Use <span className="font-semibold text-[#0F172A]">UPI tags</span> (GPay, PhonePe, Paytm) to track which payment app you use most.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#4F46E5] font-bold">•</span>
              <span>Set a <span className="font-semibold text-[#0F172A]">monthly budget</span> to get alerts when you're spending too much.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#4F46E5] font-bold">•</span>
              <span>Download <span className="font-semibold text-[#0F172A]">PDF reports</span> regularly to keep a record of your financial history.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#4F46E5] font-bold">•</span>
              <span>Use the <span className="font-semibold text-[#0F172A]">search & filters</span> to quickly find specific transactions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};