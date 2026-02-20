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

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed.filter(Boolean) : []
      } catch (e) {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
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
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets')
    return saved ? JSON.parse(saved) : { 'Food': 500, 'Transport': 200, 'Shopping': 300 }
  })
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('savingsGoals')
    return saved ? JSON.parse(saved) : []
  })

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

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
  }, [savingsGoals])

  const editingTransaction = transactions.find(t => t.id === editingId) || null

  const updateTransaction = (updated) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t))
    setEditingId(null)
  }

  const addSavingsGoal = (goal) => {
    setSavingsGoals(prev => [...prev, goal])
  }

  const updateSavingsGoal = (id, currentAmount) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount } : g))
  }

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id))
  }

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
              setBudgets={setBudgets}
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
