import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TransactionForm({ onAdd, onUpdate, editingTransaction, onCancelEdit, currency }) {
    const defaultForm = {
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        recurring: false
    }

    const [formData, setFormData] = useState(defaultForm)
    const [error, setError] = useState('')

    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

    React.useEffect(() => {
        if (editingTransaction) {
            setFormData(editingTransaction)
        } else {
            setFormData(defaultForm)
        }
    }, [editingTransaction])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.description || !formData.amount) {
            setError('Please fill all fields')
            return
        }
        if (Number(formData.amount) <= 0) {
            setError('Amount must be positive')
            return
        }

        const transactionData = {
            ...formData,
            amount: Number(formData.amount),
        }

        if (editingTransaction) {
            onUpdate(transactionData)
        } else {
            onAdd({
                id: crypto.randomUUID(),
                ...transactionData,
                date: new Date().toISOString()
            })
        }

        setFormData(defaultForm)
        setError('')
    }

    const handleCancel = () => {
        setFormData(defaultForm)
        onCancelEdit()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
            <h2 className="text-lg font-bold text-gray-900 mb-6">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
                        placeholder="e.g. Grocery Shopping"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                        <select
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none text-gray-900"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="recurring"
                        checked={formData.recurring || false}
                        onChange={e => setFormData({ ...formData, recurring: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                        Recurring Transaction (Monthly)
                    </label>
                </div>

                {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}

                <div className="flex gap-3">
                    {editingTransaction && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl active:scale-[0.98]"
                    >
                        <Plus className={`w-5 h-5 ${editingTransaction ? 'hidden' : ''}`} />
                        {editingTransaction ? 'Update' : 'Add Transaction'}
                    </button>
                </div>
            </form>
        </motion.div>
    )
}
