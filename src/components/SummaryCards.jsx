import React, { useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SummaryCards({ transactions, currency = '$' }) {
    const { balance, income, expense } = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            const amount = Number(curr.amount)
            if (curr.type === 'income') {
                acc.income += amount
                acc.balance += amount
            } else {
                acc.expense += amount
                acc.balance -= amount
            }
            return acc
        }, { balance: 0, income: 0, expense: 0 })
    }, [transactions])

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

    const cards = [
        {
            title: 'Total Balance',
            amount: balance,
            icon: Wallet,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bgLight: 'bg-blue-50',
        },
        {
            title: 'Total Income',
            amount: income,
            icon: TrendingUp,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500',
            bgLight: 'bg-emerald-50',
        },
        {
            title: 'Total Expenses',
            amount: expense,
            icon: TrendingDown,
            color: 'bg-rose-500',
            textColor: 'text-rose-500',
            bgLight: 'bg-rose-50',
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(card.amount)}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${card.bgLight} ${card.textColor}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
