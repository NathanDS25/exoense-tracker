import React, { useMemo } from 'react'
import { Lightbulb, Sparkles, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Recommendations({ transactions }) {
    const recommendations = useMemo(() => {
        if (transactions.length === 0) return []

        const recs = []

        const income = transactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0)
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0)
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

        // Savings analysis
        if (savingsRate >= 20) {
            recs.push({
                id: 'save-good',
                icon: Sparkles,
                color: 'text-amber-600 bg-amber-50',
                title: 'Great Savings!',
                message: `You're saving ${savingsRate.toFixed(0)}% of your income. Keep it up!`
            })
        } else if (savingsRate < 0) {
            recs.push({
                id: 'save-bad',
                icon: AlertCircle,
                color: 'text-rose-600 bg-rose-50',
                title: 'Overspending Alert',
                message: 'Your expenses exceed your income. Time to review your budget.'
            })
        } else if (income > 0 && savingsRate < 10) {
            recs.push({
                id: 'save-low',
                icon: TrendingUp,
                color: 'text-blue-600 bg-blue-50',
                title: 'Boost Your Savings',
                message: 'Try to save at least 20% of your income for financial health.'
            })
        }

        // Category analysis
        const categoryTotals = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                acc[curr.category] = (acc[curr.category] || 0) + curr.amount
                return acc
            }, {})

        const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])

        if (sortedCategories.length > 0) {
            const topCategory = sortedCategories[0]
            const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0)
            const percent = totalExpense > 0 ? (topCategory[1] / totalExpense) * 100 : 0

            if (percent > 40) {
                recs.push({
                    id: 'cat-high',
                    icon: Lightbulb,
                    color: 'text-purple-600 bg-purple-50',
                    title: 'Spending Insight',
                    message: `You spend ${percent.toFixed(0)}% of expenses on ${topCategory[0]}. Consider simpler alternatives.`
                })
            }
        }

        return recs
    }, [transactions])

    if (recommendations.length === 0) return null

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Smart Insights</h3>
            {recommendations.map((rec, index) => (
                <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                    <div className={`p-3 rounded-xl ${rec.color} shrink-0`}>
                        <rec.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{rec.message}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
