import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'

export default function ExpenseChart({ transactions, currency = '$' }) {
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
            currency: config.code
        }).format(amount)
    }

    const categoryData = React.useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense')
        const grouped = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount
            return acc
        }, {})
        return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }))
    }, [transactions])

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    const incomeVsExpense = React.useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0)
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0)
        return [
            { name: 'Income', value: income },
            { name: 'Expense', value: expense }
        ]
    }, [transactions])

    if (transactions.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Categories</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#374151' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-6">Income vs Expense</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeVsExpense} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                                {
                                    incomeVsExpense.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#10b981' : '#f43f5e'} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    )
}
