import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

export default function SpendingBudgets({ transactions, budgets, setBudgets, currency }) {
    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

    const currentSpending = categories.reduce((acc, cat) => {
        acc[cat] = transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((sum, t) => sum + Number(t.amount), 0)
        return acc
    }, {})

    const currencyMap = {
        '$': { code: 'USD', locale: 'en-US' },
        '€': { code: 'EUR', locale: 'de-DE' },
        '£': { code: 'GBP', locale: 'en-GB' },
        '₹': { code: 'INR', locale: 'en-IN' }
    }

    const formatCurrency = (amount) => {
        const config = currencyMap[currency] || currencyMap['$']
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.code,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const handleBudgetChange = (category, value) => {
        setBudgets(prev => ({
            ...prev,
            [category]: Number(value)
        }))
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Monthly Budgets
            </h3>

            <div className="space-y-6">
                {categories.map(category => {
                    const budget = budgets[category] || 0
                    const spent = currentSpending[category] || 0
                    const percentage = budget > 0 ? (spent / budget) * 100 : 0
                    const isOverBudget = spent > budget

                    return (
                        <div key={category} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{category}</span>
                                <input
                                    type="number"
                                    value={budget === 0 ? '' : budget}
                                    placeholder="Set Budget"
                                    onChange={(e) => handleBudgetChange(category, e.target.value)}
                                    className="w-24 px-2 py-1 text-right text-gray-500 dark:text-gray-400 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <span className={`text-xs font-semibold ${isOverBudget ? 'text-rose-500' : 'text-gray-400'}`}>
                                    {formatCurrency(spent)} / {formatCurrency(budget)}
                                </span>
                            </div>

                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                                    className={`h-full absolute left-0 top-0 transition-colors duration-300 ${percentage > 100 ? 'bg-rose-500' :
                                        percentage > 80 ? 'bg-amber-400' : 'bg-emerald-500'
                                        }`}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
