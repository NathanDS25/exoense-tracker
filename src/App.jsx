import { useState, useEffect } from 'react'
import { Plus, Download, LayoutDashboard, Wallet, TrendingDown, TrendingUp } from 'lucide-react'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ExpenseChart from './components/ExpenseChart'
import SpendingBudgets from './components/SpendingBudgets'
import SavingsGoals from './components/SavingsGoals'
import Recommendations from './components/Recommendations'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import api from './api'

function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState({ 'Food': 500, 'Transport': 200, 'Shopping': 300 })
  const [savingsGoals, setSavingsGoals] = useState([])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, budgetsRes, goalsRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/budgets'),
          api.get('/goals')
        ]);
        setTransactions(txRes.data);
        setBudgets(budgetsRes.data);
        setSavingsGoals(goalsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const res = await api.post('/transactions', transaction);
      setTransactions(prev => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.message || data?.details || data?.error || (typeof data === 'string' ? data : error.message) || "Failed to add transaction";
      console.error("Error adding transaction:", data || error);
      throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  const updateTransaction = async (updated) => {
    try {
      const res = await api.put(`/transactions/${updated.id}`, updated);
      setTransactions(prev => prev.map(t => t.id === updated.id ? res.data : t));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  }

  const addSavingsGoal = async (goal) => {
    try {
      const res = await api.post('/goals', goal);
      setSavingsGoals(prev => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  }

  const updateSavingsGoal = async (id, currentAmount) => {
    try {
      const res = await api.put(`/goals/${id}`, { currentAmount });
      setSavingsGoals(prev => prev.map(g => g.id === id ? res.data : g));
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  }

  const deleteSavingsGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  }

  const handleUpdateBudgets = async (newBudgets) => {
    try {
      await api.post('/budgets/update', newBudgets);
      setBudgets(newBudgets);
    } catch (error) {
      console.error("Error updating budgets:", error);
    }
  }

  const exportCSV = () => {
    if (transactions.length === 0) return
    const headers = ['Description', 'Amount', 'Type', 'Category', 'Date'].join(',')
    const csvContent = transactions.map(t =>
      `"${t.description}",${t.amount},${t.type},${t.category},${t.date}`
    ).join('\n')
    const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'expense-data.csv'
    link.click()
  }

  const [editingId, setEditingId] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || '$')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const editingTransaction = transactions.find(t => t.id === editingId) || null

  const filteredTransactions = transactions.filter(t => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cancelEdit = () => setEditingId(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 tracking-tight">
              Expense Tracker
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-blue-500"
            >
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="₹">₹ INR</option>
            </select>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SummaryCards transactions={transactions} currency={currency} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ExpenseChart transactions={transactions} currency={currency} />
            <TransactionList
              transactions={filteredTransactions}
              onDelete={deleteTransaction}
              onEdit={setEditingId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              currency={currency}
            />
          </div>

          <div className="space-y-8">
            <TransactionForm
              onAdd={addTransaction}
              onUpdate={updateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={cancelEdit}
              currency={currency}
            />
            <SavingsGoals
              goals={savingsGoals}
              onAdd={addSavingsGoal}
              onUpdate={updateSavingsGoal}
              onDelete={deleteSavingsGoal}
              currency={currency}
            />
            <SpendingBudgets
              transactions={transactions}
              budgets={budgets}
              setBudgets={handleUpdateBudgets}
              currency={currency}
            />
            <Recommendations transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
