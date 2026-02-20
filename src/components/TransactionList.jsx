import React from 'react'
import { Trash2, TrendingUp, TrendingDown, Calendar, Edit2, Search, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isValid } from 'date-fns'
import clsx from 'clsx'

export default function TransactionList({ transactions, onDelete, onEdit, searchQuery, setSearchQuery, filterCategory, setFilterCategory, currency = '$' }) {
    const categories = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

    if (transactions.length === 0 && !searchQuery && filterCategory === 'All') {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
                <p className="text-gray-500 mt-1">Add a transaction to get started</p>
            </div>
        )
    }

    const [visibleCount, setVisibleCount] = React.useState(10)

    // Reset visible count when filters change
    React.useEffect(() => {
        setVisibleCount(10)
    }, [searchQuery, filterCategory])

    const visibleTransactions = transactions.slice(0, visibleCount)
    const hasMore = visibleTransactions.length < transactions.length

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 transition-all text-gray-900"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all text-gray-900"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[600px] p-6 space-y-4">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No transactions found
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {visibleTransactions.map((t) => (
                            <motion.div
                                layout
                                key={t.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "p-3 rounded-xl",
                                        t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                                    )}>
                                        {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.description}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 text-xs font-medium uppercase tracking-wide">
                                                {t.category}
                                            </span>
                                            <span>•</span>
                                            <span>{isValid(new Date(t.date)) ? format(new Date(t.date), 'MMM d, yyyy') : 'Invalid Date'}</span>
                                            {t.recurring && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-blue-500 font-medium text-xs">Recurring</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6">
                                    <span className={clsx(
                                        "font-bold text-lg",
                                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{currency}{Math.abs(t.amount).toFixed(2)}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(t.id)}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            aria-label="Edit transaction"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t.id)}
                                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            aria-label="Delete transaction"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {hasMore && (
                    <button
                        onClick={() => setVisibleCount(prev => prev + 10)}
                        className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors mt-4"
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    )
}
