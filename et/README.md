# 💰 RupeeFlow — Smart Personal Expense Tracker

A modern, premium personal expense and cash flow tracker built specifically for Indian users. Track UPI payments, SIP investments, house rent, and daily expenses with intelligent analytics.

## 🚀 Live Demo

**[Visit RupeeFlow](https://vedantmh48-cpu.github.io/Expense-tracker)**

## ✨ Features

### 📊 Dashboard
- Real-time financial overview with animated gradient hero banner
- Summary cards for balance, income, expenses, and budget tracking
- Budget progress bars with color warnings (green → yellow → red)
- Recent activity feed with categorized transactions

### 📈 Analytics
- Deep spending pattern analysis with interactive charts
- Income vs. expense breakdown visualization
- Category-wise spending insights

### 📋 Activity & Transactions
- Full transaction history with search functionality
- Advanced filtering (type, category, payment method, date range)
- Sort by date or amount
- Add, edit, and delete transactions

### ⚙️ Settings
- **Profile** — Update name and email
- **Password** — Change password with strength validation
- **Budget** — Set and manage monthly budget
- **Categories** — Create custom categories
- **Appearance** — Dark/light theme toggle, currency options
- **Notifications** — Toggle alerts and reports
- **Data & Export** — PDF reports, JSON import/export, data reset

### 🔐 Authentication
- Secure local registration and login
- Password strength requirements (8+ chars, uppercase, lowercase, numbers, special chars)
- Real-time password validation with visual feedback
- 100% private — data stays in your browser

## 🎨 Design

- **Premium dark theme** with glassmorphism effects
- **Animated backgrounds** with floating orbs and gradients
- **Live notifications** dropdown with smart alerts
- **Responsive design** — Works on all devices
- **Mobile bottom navigation** for app-like mobile experience

## 🛠️ Tech Stack

- **React 19** — UI framework
- **React Router** — Page navigation
- **Recharts** — Interactive charts
- **Lucide React** — Beautiful icons
- **jsPDF** — PDF report generation
- **Local Storage** — Data persistence

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/vedantmh48-cpu/Expense-tracker.git
cd Expense-tracker/et

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🗂️ Project Structure

```
et/
├── public/
│   ├── rupeeflow-logo.svg    # Custom app logo
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AuthPage.jsx      # Login/Register form
│   │   ├── TransactionTable.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── SettingsModal.jsx
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js    # Authentication state
│   │   └── ExpenseContext.js # Expense/transaction state
│   ├── layout/
│   │   └── AppLayout.jsx     # Main app shell (sidebar + header)
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── ActivityPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── HowToUsePage.jsx
│   │   └── ContactPage.jsx
│   ├── utils/
│   │   └── formatters.js     # Formatting helpers
│   ├── App.js                # Main app with routing
│   └── index.css             # Global styles
└── package.json
```

## 📱 Mobile Support

- Collapsible sidebar with hamburger menu
- Fixed bottom navigation bar
- Responsive layout for all screen sizes
- Touch-friendly UI elements

## 📄 License

This project is open source and available for personal and educational use.

---

**Made with ❤️ for India**