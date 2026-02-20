import React, { useState } from 'react'
import { Target, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SavingsGoals({ goals, onAdd, onUpdate, onDelete, currency }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newGoal, setNewGoal] = useState({ name: '', target: '', currentAmount: '0' })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newGoal.name || !newGoal.target) return
        onAdd({
            id: crypto.randomUUID(),
            name: newGoal.name,
            target: Number(newGoal.target),
            currentAmount: Number(newGoal.currentAmount),
        })
        setNewGoal({ name: '', target: '', currentAmount: '0' })
        setIsAdding(false)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Savings Goals
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mb-6 space-y-3 overflow-hidden"
                    >
                        <input
                            type="text"
                            placeholder="Goal Name (e.g. New Laptop)"
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newGoal.name}
                            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Target Amount"
                                className="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newGoal.target}
                                onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Current Saved"
                                className="w-1/2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newGoal.currentAmount}
                                onChange={e => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Save Goal
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {goals.map(goal => {
                    const progress = Math.min((goal.currentAmount / goal.target) * 100, 100)
                    return (
                        <div key={goal.id} className="space-y-2 group">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{goal.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {currency}{goal.currentAmount} / {currency}{goal.target}
                                    </span>
                                    <button
                                        onClick={() => onDelete(goal.id)}
                                        className="text-rose-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        const amount = prompt('Add to savings:', '0')
                                        if (amount) onUpdate(goal.id, goal.currentAmount + Number(amount))
                                    }}
                                    className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                                >
                                    + Add funds
                                </button>
                            </div>
                        </div>
                    )
                })}
                {goals.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">No savings goals yet.</p>
                )}
            </div>
        </div>
    )
}
