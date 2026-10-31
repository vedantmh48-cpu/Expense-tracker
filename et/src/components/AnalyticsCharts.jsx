import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS, formatINR } from '../utils/formatters';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CreditCard, PieChart as PieIcon, TrendingUp, Wallet } from 'lucide-react';

const chartColors = ['#59D99B', '#7AB9FF', '#EBC574', '#CB91F2', '#FF8A8A', '#59CFD2', '#F49E75', '#A5D887'];
const paymentColors = {
  upi: '#66DDA5',
  credit: '#85B8FF',
  debit: '#C3A1F2',
  netbanking: '#F0C66F',
  cash: '#F28F79',
};
const axisColor = '#83968E';
const gridColor = 'rgba(129, 153, 141, .14)';
const compactCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(amount);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="analysis-tooltip">
      {label && <p className="analysis-tooltip-label">{label}</p>}
      {payload.map((entry, index) => (
        <p key={`${entry.dataKey || entry.name}-${index}`} style={{ color: entry.color || entry.payload?.color }}>
          <span>{entry.name || entry.payload?.name}</span>
          <strong>{formatINR(entry.value)}</strong>
        </p>
      ))}
    </div>
  );
};

const EmptyChart = ({ message }) => (
  <div className="analysis-empty">
    <span><TrendingUp className="w-5 h-5" /></span>
    <p>{message}</p>
  </div>
);

const ChartLegend = ({ items }) => (
  <ul className="analysis-legend">
    {items.map((item) => (
      <li key={item.id} title={item.name}>
        <span style={{ backgroundColor: item.color }} />
        <span>{item.name}</span>
      </li>
    ))}
  </ul>
);

const AnalysisPanel = ({ number, title, subtitle, icon: Icon, children, className = '' }) => (
  <section className={`analysis-panel ${className}`}>
    <header className="analysis-panel-header">
      <span className="analysis-panel-icon"><Icon className="w-4 h-4" /></span>
      <div className="analysis-panel-copy">
        <span className="analysis-panel-kicker">{number} / ANALYSIS</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </header>
    {children}
  </section>
);

export const AnalyticsCharts = () => {
  const { transactions } = useExpense();

  const dateMap = {};
  transactions.forEach((transaction) => {
    const dateKey = (transaction.date || '').slice(0, 10);
    const parsedDate = new Date(`${dateKey}T00:00:00`);
    if (!dateKey || Number.isNaN(parsedDate.getTime())) return;
    if (!dateMap[dateKey]) dateMap[dateKey] = { dateKey, income: 0, expense: 0 };
    const amount = Number(transaction.amount) || 0;
    if (transaction.type === 'income') dateMap[dateKey].income += amount;
    else if (transaction.type === 'expense') dateMap[dateKey].expense += amount;
  });

  const trendData = Object.values(dateMap)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-14)
    .map((day) => ({
      ...day,
      date: new Date(`${day.dateKey}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

  const categoryTotals = {};
  const paymentTotals = {};
  const monthTotals = {};
  transactions.filter((transaction) => transaction.type === 'expense').forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;
    const categoryId = transaction.category || 'other';
    const paymentId = transaction.paymentMethod || 'unspecified';
    const monthKey = (transaction.date || '').slice(0, 7);
    categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + amount;
    paymentTotals[paymentId] = (paymentTotals[paymentId] || 0) + amount;
    const monthNumber = Number(monthKey.slice(5, 7));
    if (/^\d{4}-\d{2}$/.test(monthKey) && monthNumber >= 1 && monthNumber <= 12) {
      monthTotals[monthKey] = (monthTotals[monthKey] || 0) + amount;
    }
  });

  const categoryData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([id, value], index) => ({
      id,
      name: CATEGORIES.find((category) => category.id === id)?.name || id,
      value,
      color: chartColors[index % chartColors.length],
    }));

  const monthlyData = Object.entries(monthTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month: new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      amount,
    }));

  const paymentData = Object.entries(paymentTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => ({
      id,
      name: PAYMENT_METHODS.find((method) => method.id === id)?.name || (id === 'unspecified' ? 'Not specified' : id),
      value,
      color: paymentColors[id] || '#9BAAA3',
    }));

  const axisProps = { stroke: axisColor, tickLine: false, axisLine: false, tick: { fill: axisColor, fontSize: 11 } };
  const chartMargin = { top: 12, right: 10, left: 4, bottom: 2 };

  return (
    <div className="analytics-report">
      <header className="analytics-report-heading">
        <div>
          <span className="analysis-panel-kicker">YOUR MONEY, IN FOCUS</span>
          <h2>Financial overview</h2>
          <p>Four views of your recorded income and spending, kept together for an easier read.</p>
        </div>
        <div className="analytics-record-count"><Wallet className="w-4 h-4" />{transactions.length} records</div>
      </header>

      <div className="analysis-grid">
        <AnalysisPanel number="01" title="Income & expenses" subtitle="Daily totals across your 14 most recent active dates." icon={TrendingUp}>
          {trendData.length ? (
            <div className="analysis-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={chartMargin}>
                  <defs>
                    <linearGradient id="analysisIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#59D99B" stopOpacity={.3} /><stop offset="100%" stopColor="#59D99B" stopOpacity={0} /></linearGradient>
                    <linearGradient id="analysisExpense" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF858B" stopOpacity={.24} /><stop offset="100%" stopColor="#FF858B" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" {...axisProps} minTickGap={18} />
                  <YAxis {...axisProps} width={60} tickFormatter={compactCurrency} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#59D99B" strokeWidth={2.5} fill="url(#analysisIncome)" activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="expense" name="Expenses" stroke="#FF858B" strokeWidth={2.5} fill="url(#analysisExpense)" activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyChart message="Add dated transactions to see your daily cash flow." />}
        </AnalysisPanel>

        <AnalysisPanel number="02" title="Spending by category" subtitle="How your recorded expenses are distributed." icon={PieIcon}>
          {categoryData.length ? (
            <div className="analysis-chart analysis-chart-donut">
              <div className="analysis-donut-visual">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="48%" outerRadius="70%" paddingAngle={3} stroke="none">
                    {categoryData.map((entry) => <Cell key={entry.id} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ChartLegend items={categoryData} />
            </div>
          ) : <EmptyChart message="Expense categories will appear once you record an expense." />}
        </AnalysisPanel>

        <AnalysisPanel number="03" title="Monthly expenses" subtitle="Total spending by calendar month." icon={CreditCard}>
          {monthlyData.length ? (
            <div className="analysis-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={chartMargin}>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" {...axisProps} minTickGap={16} />
                  <YAxis {...axisProps} width={60} tickFormatter={compactCurrency} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="amount" name="Expenses" fill="#72B5FF" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyChart message="Monthly spending appears here after you add expenses." />}
        </AnalysisPanel>

        <AnalysisPanel number="04" title="Payment methods" subtitle="Expense totals by the payment method recorded." icon={Wallet}>
          {paymentData.length ? (
            <div className="analysis-chart analysis-chart-donut">
              <div className="analysis-donut-visual">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="48%" outerRadius="70%" paddingAngle={3} stroke="none">
                    {paymentData.map((entry) => <Cell key={entry.id} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ChartLegend items={paymentData} />
            </div>
          ) : <EmptyChart message="Payment method insights appear once expenses are recorded." />}
        </AnalysisPanel>
      </div>
    </div>
  );
};
